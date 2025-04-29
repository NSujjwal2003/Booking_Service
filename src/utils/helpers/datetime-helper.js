function compareTime(time1, time2) {
    let date1 = new Date(time1);
    let date2 = new Date(time2);
    return date1.getTime() > date2.getTime();
}   

module.exports = {
    compareTime
}