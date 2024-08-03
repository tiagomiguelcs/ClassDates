from dateutil.parser import parse
from datetime import datetime

"""
Simply outputs a list of date objects. Returns nothing.

:param list<date> dates: A list of date objects to be shown.
"""
def output_dates(dates, debug=False):
    if (debug):
        column = 1
        mcolumns = 5
        i = 0
        print ("  > Dates ("+str(len(dates))+" days):")
        for date in dates:
            i = i + 1
            if (column > mcolumns):
                print("")
                column = 1
            else:
                if (column==1):
                    print("    ", end="")
                print(format_datetime(date)+" ", end="")
                column = column + 1
                if (i >= len(dates)): print("")
    else:
        for date in dates:
            print(format_datetime(date))
       

"""
Checks if a string can be interpreted as a date. Returns True if the 
string can be interpreted as a date or False otherwise.

:param str input: String to check for date.
:param bool fuzzy: Ignore unknown tokens in string if True.
"""
def is_date(input, fuzzy=False):
    try: 
        parse(input, fuzzy=fuzzy)
        return True

    except ValueError:
        return False

"""
Formats a date to a user provided format. Returns a formated datetime as a string.

:param datetime date: Datetime object to be formated.
:param str format: The desired format, if none is provided it defaults to %d/%m/%Y.
"""
def format_datetime(date, format="%d/%m/%Y"):
    return datetime.strftime(date, format)

"""
Converts a datetime string to a datetime Python object with a user provided format. 
Returns a datatime object.

:param str input: Datetime as a string.
:param str format: The desired format, if none is provide it defaults to %d/%m/%Y.
"""
def to_datetime(input, format="%d/%m/%Y"):
    return(datetime.strptime(input, format))


