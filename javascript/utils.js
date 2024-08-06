const moment = require("moment");


const logTypes = exports.logTypes = {
	Success: Symbol("success"),
	Warning: Symbol("warning"),
	Error: Symbol("error"),
    Debug: Symbol("debug"),
    Information: Symbol("information")
}


const mWeekdays = {0:"Sun", 1:"Mon", 2:"Tue",3:"Wed", 4:"Thu", 5: "Fri", 6: "Sat"}

exports.toMoment = (datetime, format) => {
    // convert to datetime moment object
    let mDatetime = moment(datetime, format);
    // show string

    //console.log("-->"+mDatetime.format(format));

    return(mDatetime);
}

// remove items from an array.
exports.removeItemsFromArray = (items, array) => {
    items.forEach(item => {
        array.splice(array.indexOf(item),1);
    });
    return array;
}

exports.outputDates = (dates, format, divideOutput=false) => {
    for(let i=0; i < dates.length; i++){
        if (dates[i].weekday() == 5 && divideOutput) console.log("\n")
        console.log(" - "+dates[i].format(format)+" ("+mWeekdays[dates[i].weekday()]+")");
    }
}



exports.log = (message, logType=logTypes.Information, DEBUG=true) => {
    if (!DEBUG) return;
    let now = moment().format('HH:MM:ss');
    var str = "[ClassDates] "+now + " - ";
    switch (logType){
        case logTypes.Success:
        case logTypes.Information:
            break;
        case logTypes.Warning:
            str += "Warning: ";
            break;
        case logTypes.Error:
            str += "Error: ";
            message = message.toString().replace('Error:', '');
            break;
        case logTypes.Debug:
            str += "Debug: ";
            break;
        // default:
    }
    console.log(str + message);
}
