export const formatDate = (date) => {
    const d = new Date(date),
        year = d.getFullYear();
    let month = "" + (d.getMonth() + 1),
        day = "" + d.getDate(),
        hours = d.getHours(),
        minutes = d.getMinutes(),
        seconds = d.getSeconds();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;
    if (hours < 10) hours = "0" + hours;
    if (minutes < 10) minutes = "0" + minutes;
    if (seconds < 10) seconds = "0" + seconds;

    return [year, month, day].join("-") + ' ' + [hours, minutes, seconds].join(':');
};

export const getSystemDate = () => {
    return new Date().toUTCString();
};