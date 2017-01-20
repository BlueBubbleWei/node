/**
 * Created by Administrator on 2017/1/19.
 */
var yestoday= new Date();
yestoday=changeDate(yestoday);
var timestamp = Date.parse(yestoday);
var arry=[2,11,29,23,27,13,33,28,3,2,5,30];
//所需产品ID
var dailymax='2,11,29,23,27,13,33,28,3,2,5,30';
var pids= base64Encode(arry);
dailymax= base64Encode(dailymax);
function changeMonth(day) {
    // 时间为近一个月的0:0:0的unix timestamp
    day.setMonth(day.getMonth()-1);
    day=changeDate(day);
    return day;
}
function changeSeason(day) {
    // 时间为近一个季的0:0:0的unix timestamp
    day.setMonth(yestoday.getMonth()-3);
    day=changeDate(day);
    return day;
}
function changeYear(day) {
    // 时间为近一年的0:0:0的unix timestamp
    day.setFullYear(day.getFullYear()-1);
    day=changeDate(day);
    return day;
}
function change3Years(day) {
    // 时间为近一年的0:0:0的unix timestamp
    day.setFullYear(day.getFullYear()-3);
    day=changeDate(day);
    return day;
}
function base64Encode(input) {
    //productID是数组的形式，并且经过base64编码
    var rv;
    rv = encodeURIComponent(input);
    rv = unescape(rv);
    rv = window.btoa(rv);
    return rv;
}
function changeDate(day) {
    // 时间为前一天的0:0:0的unix timestamp
    day.setDate(day.getDate()-1);
    day.setHours(0);
    day.setMinutes(0);
    day.setSeconds(0);
    day.setMilliseconds(0);
    return day
}
//排序
function sortId(unsorted) {
    var idList = [[12, 11, 29, 23, 27, 13, 33, 28], [3, 2, 5], [30]];
    var sorted = [];
    for (var i = 0; i < idList.length; i++) {
        for (var j = 0; j < idList[i].length; j++) {
            for (var k = 0; k < unsorted.length; k++) {
                if (idList[i][j] == unsorted[k].productId) {
                    sorted.push(unsorted[k]);
                }
            }
        }
    }
    return sorted;
}
function unix2normal(date) {
    var date = new Date(date);
    Y = date.getFullYear() + '.';
    M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '.';
    D = date.getDate() + ' ';
    date = Y + M + D;
    return date;
}
function countotal(catatgory) {
    var sum1=0;
    var sum2=0;
    var sum3=0;
    var sum4=0;
    var arr;
    var groupName;
    for(var i=0;i< catatgory.length;i++){
        sum1 += catatgory[i].user;
        sum2 += catatgory[i].todayLogin;
        sum3 += catatgory[i].yestodayLogin;
        sum4 += catatgory[i].max;
        groupName=catatgory[i].groupName;
    }
    arr={usersum:sum1,todayLoginsum:sum2,yestodayLoginsum:sum3,maxsum:sum4,groupName:groupName};
    return arr;
}