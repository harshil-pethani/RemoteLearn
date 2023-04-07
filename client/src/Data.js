export const getDate = (curDate) => {
    let date, month, year;
    if (curDate)
        [year, month, date] = curDate?.split("-");

    if (month === '01')
        month = 'Jan';
    else if (month === '02')
        month = 'Feb';
    else if (month === '03')
        month = 'March';
    else if (month === '04')
        month = 'April';
    else if (month === '05')
        month = 'May';
    else if (month === '06')
        month = 'June';
    else if (month === '07')
        month = 'July';
    else if (month === '08')
        month = 'Aug';
    else if (month === '09')
        month = 'Sept';
    else if (month === '10')
        month = 'Oct';
    else if (month === '11')
        month = 'Nov';
    else if (month === '12')
        month = 'Dec';

    return date + " " + month + ", " + year
}

export function sortSlots(a, b) {
    if (a.startdate < b.startdate) {
        return -1;
    }
    if (a.startdate > b.startdate) {
        return 1;
    }
    return 0;
}