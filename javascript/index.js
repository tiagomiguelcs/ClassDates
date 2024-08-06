const moment = require("moment");
const utils = require("./utils.js");
const holidays = require("./holidays.js");

// Create config JSON (example)
let config = {
    "format": "", // Using format supported by moment.js
    "start": "", 
    "end": "",
    "weekday": 0,
    "breaks": []
};

exports.datesBetween = (format, start, end, includeWeekends=false) => {
    let dates = [];
    let currentDate = start.clone();
    while (currentDate <= end) {
        let weekday = currentDate.weekday()
        /* Moment.js' weekday mapping
           (0) Sunday (Sun)
           (1) Monday (Mon)
           (2) Tuesday (Tue)
           (3) Wednesday (Wed)
           (4) Thursday (Thu)
           (5) Friday (Fri)
           (6) Saturday (Sat)
        */
        /* If flagged, working days only */
        if (!includeWeekends && (weekday == 6 || weekday == 0)){
            currentDate = currentDate.clone().add(1, "days");
            continue;
        }
        dates.push(currentDate.clone());
        currentDate = currentDate.clone().add(1, "days");
    }

    return dates;
}

exports.classDates = (start, end, weekday, breaks, format, DEBUG=false) => {
    let dates=[];
    start = utils.toMoment(start, format);
    end = utils.toMoment(end, format);
    
    if (DEBUG) utils.log("# Dates between start date ("+start.format(format)+") and end date ("+end.format(format)+"):")

    // 1. Get all dates between the 'start' and 'end' dates
    dates = this.datesBetween(format, start, end);
    if (DEBUG){
        utils.outputDates(dates, format, true);
        utils.log("Total Number of Days:"+dates.length);
    }

    // 2. Get National Holidays dates between 'start' and 'end' dates    
    if (DEBUG) utils.log("National Holiday dates between start date ("+start.format(format)+") and end date ("+end.format(format)+"):")
    let hls=holidays.getHolidaysBetweenDates(start, end, format);
    if (DEBUG){
        console.log(hls);
        utils.log("Total Number of Holidays Between Dates: "+hls.length)
    }

    // 3. Remove dates that are national holidays;
    let toRemove = [];
    dates.forEach(date => {
        hls.forEach(hl => {
            if(date.isSame(hl["date"]))
                toRemove.push(date);
        });
    });
    dates = utils.removeItemsFromArray(toRemove, dates);
    if (DEBUG){
        utils.log("Dates after holidays:");
        utils.outputDates(dates, format, true);
        utils.log("Total Number of Days:"+dates.length);
    }
    // 4. Remove dates that fall into breaks (e.g., xmas break)
    toRemove = [];
    breaks.forEach(_break => {
        dates.forEach(date => {
            //console.log(_break["start"].format(format) + "<=" + date.format(format) + "<=" +_break["end"].format(format));
            if (date.isBetween(_break["start"], _break["end"]) ||
                date.isSame(_break["start"]) || date.isSame(_break["end"]))
                    toRemove.push(date);
        });
    });
    dates = utils.removeItemsFromArray(toRemove, dates);
    if (DEBUG){
        console.log(dates);
        utils.log("Total Number of Days:"+dates.length);
    }

    // 5. Remove dates that do not occur on the day of the classroom (defined by the user)
    toRemove = [];
    for(let i=0; i < dates.length; i++){
        let date = dates[i];
        if (date.weekday() != weekday)
            toRemove.push(date);
    }
    dates = utils.removeItemsFromArray(toRemove, dates);
    if (DEBUG){
        utils.log("Dates of the classroom:")
        utils.outputDates(dates, format);
        utils.log("Total Number of Classes:"+dates.length);
    }
    // Return dates when the class occurs
    return dates;
}

exports.validateConfig = (config) => {
    let format = config["format"];
    let breaks = config["breaks"];
    let start = utils.toMoment(config["start"], format);
    let end = utils.toMoment(config["end"], format);
    let weekday = config["weekday"]; 
    
    // Set a default format if undefined 
    if (format === undefined){
        config["format"] = "YYYY-MM-DD";
        format = config["format"];
    }

    // Sundays or Saturdays are not valid class days
    if (weekday == 0 || weekday == 6){
        utils.log("Invalid weekday - Sundays or Saturdays are not valid class days", utils.logTypes.Error);
        return false;
    }
    // Start date should be before end date
    if (start.isAfter(end)){
        utils.log("Invalid start date, the start date should be set before the end date", utils.logTypes.Error);
        return false;
    }
    let invalid=false;
    // Break start dates should all set before end dates
    breaks.forEach(_break => {
        let bstart = utils.toMoment(_break["start"], format);
        let bend = utils.toMoment(_break["end"], format);
        if (bstart.isAfter(bend)){
            utils.log("Invalid start date for a break, the start date should be set before the end date", utils.logTypes.Error);
            invalid=true;
        }
    });
    if (invalid) return false; else
    // Valid configuration file
    return true;
}

exports.generate = (config, DEBUG=false) => {
    /* 
    // ## Test Data 
    // Date format
    config["format"] = "YYYY-MM-DD";
    // Semester start date
    config["start"]     = "2023-09-18"; // 2023-09-18
    // Semester end date
    config["end"]       = "2023-12-31"; // 2023-12-01
    // Day of the week of the class/curricular unit
    config["weekday"]   = 2;
    // Class/curricular unit breaks (e.g., xmas break);
    config["breaks"].push({"start":"2023-12-20", "end":"2024-01-03"});
    */

    if (!this.validateConfig(config)) return;

    let format  = config["format"];
    let start   = config["start"];
    let end     = config["end"];
    let weekday = config["weekday"];
    let breaks  = config["breaks"];

    // convert break dates to momentjs objects
    config["breaks"].forEach(_breaks => {
        _breaks["start"] = moment(_breaks["start"]);
        _breaks["end"] = moment(_breaks["end"]);
    });

    let dates = this.classDates(start, end, weekday, breaks, format, DEBUG);
    return dates;
}

/* Usage example 
return(this.generate(config)); 
*/


