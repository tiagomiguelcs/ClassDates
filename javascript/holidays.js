const moment = require("moment")

exports.easterDay = (y) => {
    let c = Math.floor(y / 100);
    let n = y - 19 * Math.floor(y / 19);
    let k = Math.floor((c - 17) / 25);
    let i = c - Math.floor(c / 4) - Math.floor((c - k) / 3) + 19 * n + 15;
    i = i - 30 * Math.floor(i / 30);
    i = i - Math.floor(i / 28) * (1 - Math.floor(i / 28) * Math.floor(29 / (i + 1)) * Math.floor((21 - n) / 11));
    let j = y + Math.floor(y / 4) + i + 2 - c + Math.floor(c / 4);
    j = j - 7 * Math.floor(j / 7);
    let l = i - j;
    let m = 3 + Math.floor((l + 40) / 44);
    let d = l + 28 - 31 * Math.floor(m / 4);

    return moment(new Date(y, m - 1, d));
}


exports.getHolidaysPT = (y) => {
    const natal = moment(new Date(y, 11, 25)); // December 25
    const ano_novo = moment(new Date(y, 0, 1)); // January 1
    const sexta_feira_santa = moment(new Date(y, 2, 29)); // March 29
    const pascoa = this.easterDay(y); // Easter Day
    const dia_liberdade = moment(new Date(y, 3, 25)); // April 25
    const dia_trabalhador = moment(new Date(y, 4, 1)); // May 1
    const corpo_deus = moment(new Date(y, 4, 30)); // May 30
    const dia_portugal = moment(new Date(y, 5, 10)); // June 10
    const nossa_senhora = moment(new Date(y, 7, 15)); // August 15
    const dia_republica = moment(new Date(y, 9, 5)); // October 5
    const dia_todos_santos = moment(new Date(y, 10, 1)); // November 1
    const dia_ind = moment(new Date(y, 11, 1)); // December 1
    const im_conceicao = moment(new Date(y, 11, 8)); // December 8
    const c_municipal = moment(new Date(y, 9, 20)); // October 20

    let holidays = [
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

    return holidays;
}


exports.getHolidaysBetweenDates = (start, end, format) => {
    let test = new Date();
    let holidays = this.getHolidaysPT(start.year());
    let dates = [];

    holidays.forEach(holiday => {
        if (holiday["date"].isBetween(start, end))
            dates.push(holiday);
    });

    return dates;
}