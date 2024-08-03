import datetime, holidays, utils, json, argparse

DEBUG       = None
CONFI_FILE  = "config.json"
 
"""
Generates a list of dates between a start and a end date (inclusive). Returns a list of date objects.

:param date start: Starting date.
:param date end: End date.
:param bool include_weekends: Set to true if weekends should be included in the list of date objects.
"""
def dates_between(start, end, include_weekends=False):
    dates = []
    current_date = start
    while current_date <= end:
        weekday = current_date.weekday()
         # If request, do not included weekends
        if (not include_weekends and (weekday == 5 or weekday == 6)):
            current_date += datetime.timedelta(days=1)
            continue    
        dates.append(current_date)
        current_date += datetime.timedelta(days=1)
    return dates

"""
Generates the class dates for a curricular unit. Returns a list of date objects.

:param str start: Semester Starting date.
:param str end: Semester End date.
:param int weekday: Provide a number representation of the weekday (0-Monday, 1-Tuesday,...)
:param str format: The desired format, if none is provided it defaults to %d/%m/%Y.
"""
def class_dates(start, end, weekday, breaks, format="%d/%m/%Y"):
    start = utils.to_datetime(start, format).date()
    end = utils.to_datetime(end, format).date()

    # Get all dates between the 'start' and 'end' dates

    if (DEBUG): 
        print("# Dates between start date ("+utils.format_datetime(start)+") and end date ("+utils.format_datetime(end)+"):")
    dates = dates_between(start,end)
    if DEBUG: utils.output_dates(dates)

    # Get National Holidays dates between 'start' and 'end' dates
    if (DEBUG): print("# National Holidays Dates:")
    hls = holidays.get_holidays_between_dates(start, end)
    if (DEBUG):
        for hl in hls:
            print("  > "+utils.format_datetime(hl["date"])+" - "+hl["description"])

    # Remove dates that are national holidays
    if (DEBUG): print("# Dates after holidays:")
    for date in dates:
        for hl in hls:
            if date == hl["date"]:
                dates.remove(date)
    # output
    if DEBUG: utils.output_dates(dates)

    # Remove dates that fall into breaks (e.g., xmas break)
    if (DEBUG): print("# Dates after breaks:")
    to_remove = [] # Dates flagged to be removed
    for ubreak in breaks:
        break_start = utils.to_datetime(ubreak["start"], format).date()
        break_end   = utils.to_datetime(ubreak["end"], format).date()
        for date in dates:
            if break_start <= date <= break_end:
                to_remove.append(date)
    for date_to_remove in to_remove:
        dates.remove(date_to_remove)
    
    # ouput
    if (DEBUG): utils.output_dates(dates)

    # Remove dates that do not occur on the day (i.e., weekday) of the class (e.g., monday). 
    fdates=[]
    for date in dates: 
        if (date.weekday() == weekday):
            fdates.append(date)
    
    return fdates

if __name__ == "__main__":
    # Read arguments
    parser = argparse.ArgumentParser(description="Generates class dates between a start and a end date.")
    parser.add_argument("-f","--file", help="Write dates to a JSON file.", type=str)
    parser.add_argument("-v","--verbose", action="store_true", help="Display more detailed information.")
    args = parser.parse_args()
    DEBUG = args.verbose

    # Read configuration file
    with open(CONFI_FILE,"r") as config_file:
        config = json.load(config_file)

    start   = config["start"]   # Semester start date
    end     = config["end"]     # Semester end date
    breaks  = config["breaks"]  # Class/curricular units breaks (e.g., xmas break)
    weekday = config["weekday"] # Day of the week of the class/curricular unit.
    format  = config["format"]  # User defined date format

    dates = class_dates(start, end, weekday, breaks, format)

    if (args.file):
        # Write the output to a JSON file
        with open(args.file, 'w') as json_file:
            json.dump([date.strftime("%d/%m/%Y") for date in dates], json_file)
    else:
        if (DEBUG): print("# Final class dates:")
        utils.output_dates(dates, DEBUG)