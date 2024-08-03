import datetime

"""
Calculates the date of Easter for a given year.

:param date.year y: Current year.
"""
def easter_day(y):
    c = y // 100
    n = y - 19 * (y // 19)
    k = (c - 17) // 25
    i = c - c // 4 - (c - k) // 3 + 19 * n + 15
    i = i - 30 * (i // 30)
    i = i - (i // 28) * (1 - (i // 28) * (29 // (i + 1)) * ((21 - n) // 11))
    j = y + y // 4 + i + 2 - c + c // 4
    j = j - 7 * (j // 7)
    l = i - j
    m = 3 + (l + 40) // 44
    d = l + 28 - 31 * (m // 4)
    return datetime.date(y, m, d)

"""
Defines a list of national Portuguese holidays for a given year. Returns a list of 
objects that are comprised of a date and a description.

:param date.year y: Current year.
:param str format: The desired format, if none is provided it defaults to %d/%m/%Y.
"""
def get_holidays_pt(y, format="%d/%m/%Y"):
    natal = datetime.date(y, 12, 25)
    ano_novo = datetime.date(y, 1, 1)
    sexta_feira_santa = datetime.date(y, 3, 29)
    pascoa = easter_day(y)
    dia_liberdade = datetime.date(y, 4, 25)
    dia_trabalhador = datetime.date(y, 5, 1)
    corpo_deus = datetime.date(y, 5, 30)
    dia_portugal = datetime.date(y, 6, 10)
    nossa_senhora = datetime.date(y, 8, 15)
    dia_republica = datetime.date(y, 10, 5)
    dia_todos_santos = datetime.date(y, 11, 1)
    dia_ind = datetime.date(y, 12, 1)
    im_conceicao = datetime.date(y, 12, 8)
    c_municipal = datetime.date(y, 10, 20)

    holidays = [
        {"date": ano_novo, "description": "Ano Novo"},
        {"date": natal, "description": "Natal"},
        {"date": sexta_feira_santa, "description": "Sexta Feira Santa"},
        {"date": pascoa, "description": "Páscoa"},
        {"date": dia_liberdade, "description": "Dia da Liberdade"},
        {"date": dia_trabalhador, "description": "Dia do Trabalhador"},
        {"date": corpo_deus, "description": "Corpo de Deus"},
        {"date": dia_portugal, "description": "Dia de Portugal"},
        {"date": nossa_senhora, "description": "Assunção de Nossa Senhora"},
        {"date": dia_republica, "description": "Implantação da República"},
        {"date": dia_todos_santos, "description": "Dia de Todos os Santos"},
        {"date": dia_ind, "description": "Restauração da Independência"},
        {"date": im_conceicao, "description": "Imaculada Conceição"},
        {"date": c_municipal, "description": "Feriado Municipal"}
    ]

    return holidays


"""
Gets a list of national holidays between a start and end date. Returns a list 
of objects that are comprised of a date and a description.

:param date date: Start date.
:param date date_to: end date.
"""
def get_holidays_between_dates(date, date_to):
    date_start = date
    date_end = date_to
    dates_holiday = []

    while date_end >= date_start or date_start.year == date_end.year:
        tmp = get_holidays_pt(date_start.year)
        dates = []

        for element in tmp:
            if date <= element["date"] <= date_to:
                dates.append(element)

        dates_holiday.extend(dates)
        date_start = date_start.replace(year=date_start.year + 1)

    return dates_holiday
