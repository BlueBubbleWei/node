//主页面
app.controller('userAnalysisController', function ($scope,$compile,$location,$timeout,commonService) {
    $scope.dailymaxList=[];
    $scope.catalogy=[];
    $scope.averageList=[];
    $scope.onlineUser=[];
    $scope.product=[];
    $scope.psdList=[];
    $scope.calList=[];
    $scope.otherList=[];
    $scope.psdTotal=[];
    $scope.calTotal=[];
    $scope.otherTotal=[];
    $scope.todayList=[];
    $scope.onlineHour=[];
    var result,registerlist,loginlist,flag=1;
    $('.flowIMg').click(function () {
        if($('#show-Table').css('display')=='block'){
            $('#show-Table').css('display','none');
            $('#ImgChange').attr('src','systemPage/images/close.png');
        }else{
            $('#show-Table').css('display','block');
            $('#ImgChange').attr('src','systemPage/images/open.png');
        }
    })
    var current= new Date();
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
    function base64Encode(input) {
        //productID是数组的形式，并且经过base64编码
        var rv;
        rv = encodeURIComponent(input);
        rv = unescape(rv);
        rv = window.btoa(rv);
        return rv;
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
    var currentDay=current.getFullYear()+ '.'+(current.getMonth() + 1 < 10 ? '0' + (current.getMonth() + 1) : current.getMonth() + 1) + '.'+ current.getDate();
    var oneDayago=yestoday.getFullYear()+ '.'+(yestoday.getMonth() + 1 < 10 ? '0' + (yestoday.getMonth() + 1) : yestoday.getMonth() + 1) + '.'+ yestoday.getDate();
    commonService.dailylonline({timestamp:timestamp,pids:pids}).then(function(res,$complie){
        ///每日登陆
        if(res.data.length!=0) {
            $scope.averageList = res.data;
            $scope.averageList = sortId($scope.averageList);
            for (var i = 0; i < $scope.averageList.length; i++) {
                $scope.catalogy.push({productId: res.data[i].productId, val: res.data[i].average});
            }
        }
        commonService.onlineuser().then(function(res,$complie){
            //在线用户
            if(res.online.length!=0) {
                $scope.onlineUser = res.online;
                $scope.onlineUser = sortId($scope.onlineUser);
            }
            commonService.todayTotal().then(function(res){
                //今日累计登录&
                if(res.dailytimes.length!=0){
                    $scope.todayList=res.dailytimes;
                    $scope.todayList=sortId($scope.todayList);
                }
                commonService.dailyonlinemax({dailymax:dailymax}).then(function(res){
                    //每日最高登陆人数
                    if(res.data.length!=0){
                        $scope.dailymaxList=res.data;
                        $scope.dailymaxList=sortId($scope.dailymaxList);
                    }
                    commonService.countuser().then(function(res) {
                        //新增用户
                        if(res.data.length!=0) {
                            $scope.usernum = res.data;
                            $scope.usernum = sortId($scope.usernum);
                        }
                        commonService.WithinOneday().then(function(res) {
                            //24小时内在线用户
                            if(res.online.length!=0) {
                                $scope.onlineHour= res.online;
                                $scope.onlineHour = sortId($scope.onlineHour);
                                /*for(var i=0;i<$scope.onlineHour.length;i++){
                                    var timeLen=$scope.onlineHour[i].data.length;
                                    for(var j=0;j<timeLen;j++){
                                       var temp=$scope.onlineHour[i].data[j].time;
                                        temp=temp.split(' ')[1];
                                        var hour=parseInt(temp.split(':')[0]);
                                        var minutes= parseInt(temp.split(':')[0]) *60+parseInt(temp.split(':')[1]);
                                        $scope.onlineHour[i].data[j].time=minutes;
                                        //全都转化成了分
                                    }
                                }*/
                            }

                            commonService.producturl().then(function(res) {//获取产品名称
                                if (res.result.length != 0) { //交换psd和算量
                                    $scope.productList = res.result.resultList;
                                    temp = $scope.productList[0];
                                    $scope.productList[0] = $scope.productList[1];
                                    $scope.productList[1] = temp;
                                }
                                //二维数据整合一维
                                for (var i = 0; i < $scope.productList.length; i++) {
                                    for (var j = 0; j < $scope.productList[i].groupList.length; j++) {
                                        $scope.product.push($scope.productList[i].groupList[j]);
                                    }
                                }
                                //产品名称列表
                                $scope.product = sortId($scope.product);
                                //今日累计登录人数拼接  &&  昨日累计登录人数拼接
                                var todayLogin,yestodayLogin;
                                for (var i = 0; i < $scope.todayList.length; i++) {
                                    for (var j = 0; j < $scope.product.length; j++) {
                                        if ($scope.todayList[i].productId == $scope.product[j].productId) {
                                            var userloginData=$scope.todayList[i].data;
                                            for(var k=0;k<userloginData.length;k++){
                                                if( currentDay  == userloginData[k].date) {
                                                    todayLogin = userloginData[k].users;
                                                    $scope.product[j].todayLogin = todayLogin;
                                                }
                                                if(oneDayago  == userloginData[k].date){
                                                    yestodayLogin = userloginData[k].users;
                                                    $scope.product[j].yestodayLogin = yestodayLogin;
                                                }
                                            }
                                        }else{
                                            if (!$scope.product[j].todayLogin) {
                                                $scope.product[j].todayLogin = 0;
                                            }
                                            if (!$scope.product[j].yestodayLogin) {
                                                $scope.product[j].yestodayLogin = 0;
                                            }
                                        }
                                    }
                                }
                                //日均访问量拼接
                                for (var i = 0; i < $scope.averageList.length; i++) {
                                    for (var j = 0; j < $scope.product.length; j++) {
                                        if ($scope.averageList[i].productId == $scope.product[j].productId) {
                                            average = $scope.averageList[i].average;
                                            $scope.product[j].average = average;
                                        } else {
                                            if (!$scope.product[j].average) {
                                                $scope.product[j].average = 0;
                                            }
                                        }
                                    }
                                }
                                //单日最高访问量拼接
                                for (var i = 0; i < $scope.dailymaxList.length; i++) {
                                    for (var j = 0; j < $scope.product.length; j++) {
                                        if ($scope.dailymaxList[i].productId == $scope.product[j].productId) {
                                            max = $scope.dailymaxList[i].max;
                                            date = $scope.dailymaxList[i].date;
                                            date = unix2normal(date);
                                            $scope.product[j].max = max;
                                            $scope.product[j].date = date;
                                        } else {
                                            if (!$scope.product[j].max) {
                                                $scope.product[j].max = 0;
                                            }
                                            if (!$scope.product[j].date) {
                                                $scope.product[j].date = '--';
                                            }
                                        }
                                    }
                                }
                                //当前在线人数拼接
                                for (var i = 0; i < $scope.onlineUser.length; i++) {
                                    for (var j = 0; j < $scope.product.length; j++) {
                                        if ($scope.onlineUser[i].productId == $scope.product[j].productId) {
                                            var dataLens=$scope.onlineUser[i].data.length;
                                            for(var k=0; k<dataLens; k++){
                                                $scope.product[j].user =$scope.onlineUser[i].data[k].users ;
                                            }
                                        } else {
                                            if (!$scope.product[j].user) {
                                                $scope.product[j].user = 0;
                                            }
                                        }
                                    }
                                }
                                //产品名   英文转中文
                                for (var i = 0; i < $scope.productList.length; i++) {
                                    if (i == 0) {
                                        $scope.productList[i].groupName = "PDS总体";
                                        var productName;
                                        var productId;
                                        //根据产品id过滤出所要的数据
                                        $scope.productList[i].groupList = sortId($scope.productList[i].groupList);
                                        if ($scope.productList[i].groupList.length != 0) {
                                            for (var j = 0; j < $scope.productList[i].groupList.length; j++) {
                                                $scope.psdList.push({
                                                    productName: $scope.productList[i].groupList[j].productName,
                                                    productId: $scope.productList[i].groupList[j].productId,
                                                    groupName: $scope.productList[i].groupName
                                                });
                                            }
                                        }
                                    } else if (i == 1) {
                                        $scope.productList[i].groupName = "算量总体";
                                        $scope.productList[i].groupList = sortId($scope.productList[i].groupList);
                                        if ($scope.productList[i].groupList.length != 0) {
                                            for (var j = 0; j < $scope.productList[i].groupList.length; j++) {
                                                $scope.calList.push({
                                                    productName: $scope.productList[i].groupList[j].productName,
                                                    productId: $scope.productList[i].groupList[j].productId,
                                                    groupName: $scope.productList[i].groupName
                                                });
                                            }
                                        }
                                    } else if (i == 2) {
                                        $scope.productList[i].groupName = "其他";
                                        $scope.productList[i].groupList = sortId($scope.productList[i].groupList);
                                        if ($scope.productList[i].groupList.length != 0) {
                                            for (var j = 0; j < $scope.productList[i].groupList.length; j++) {
                                                $scope.otherList.push({
                                                    productName: $scope.productList[i].groupList[j].productName,
                                                    productId: $scope.productList[i].groupList[j].productId,
                                                    groupName: $scope.productList[i].groupName
                                                });
                                            }
                                        }
                                    }
                                }

                                //将数据划分为psd一组
                                for (var i = 0; i < $scope.product.length; i++) {
                                    for (var j = 0; j < $scope.psdList.length; j++) {
                                        if ($scope.psdList[j].productId == $scope.product[i].productId) {
                                            $scope.product[i].groupName = $scope.psdList[j].groupName;
                                            $scope.psdTotal.push($scope.product[i]);
                                        }
                                    }
                                }
                                //将数据划分为算量总体一组
                                for (var i = 0; i < $scope.product.length; i++) {
                                    for (var j = 0; j < $scope.calList.length; j++) {
                                        if ($scope.calList[j].productId == $scope.product[i].productId) {
                                            $scope.product[i].groupName = $scope.calList[j].groupName;
                                            $scope.calTotal.push($scope.product[i]);
                                        }
                                    }
                                }
                                //将数据划分为other一组
                                for (var i=0;i<$scope.product.length;i++){
                                    for(var j=0;j<$scope.otherList.length;j++){
                                        if($scope.otherList[j].productId == $scope.product[i].productId){
                                            $scope.product[i].groupName=$scope.otherList[j].groupName;
                                            $scope.otherTotal.push($scope.product[i]);
                                        }
                                    }
                                }
                                $scope.psdsum=countotal( $scope.psdTotal);
                                $scope.calsum=countotal( $scope.calTotal);
                                $scope.othersum=countotal( $scope.otherTotal);
                                var html1="<tr> <th class='TabLeft'></th><th>PDS总体</th><th>算量总体</th>";
                                var html2='',html3='',html4='',html5='';
                                for(var i=0;i<$scope.psdTotal.length;i++){
                                    html1+="<th>"+$scope.psdTotal[i].productName+"</th>";
                                    html2+="<th>"+$scope.psdTotal[i].user+"</th>";
                                    html3+="<th>"+$scope.psdTotal[i].todayLogin+"</th>";
                                    html4+="<th>"+$scope.psdTotal[i].yestodayLogin+"</th>";
                                    html5+="<th>"+$scope.psdTotal[i].max+"<p class='enddate'>"+$scope.psdTotal[i].date+"</p></th>";
                                }
                                for(var i=0;i<$scope.calTotal.length;i++){
                                    html1+="<th>"+$scope.calTotal[i].productName+"</th>";
                                    html2+="<th>"+$scope.calTotal[i].user+"</th>";
                                    html3+="<th>"+$scope.calTotal[i].todayLogin+"</th>";
                                    html4+="<th>"+$scope.calTotal[i].yestodayLogin+"</th>";
                                    html5+="<th>"+$scope.calTotal[i].max+"<p class='enddate'>"+$scope.calTotal[i].date+"</p></th>";
                                }
                                for(var i=0;i<$scope.otherTotal.length;i++){
                                    html1+="<th class='TabRight'>"+$scope.otherTotal[i].productName+"</th>";
                                    html2+="<th class='TabRight'>"+$scope.otherTotal[i].user+"</th>";
                                    html3+="<th class='TabRight'>"+$scope.otherTotal[i].todayLogin+"</th>";
                                    html4+="<th class='TabRight'>"+$scope.otherTotal[i].yestodayLogin+"</th>";
                                    html5+="<th class='TabRight'>"+$scope.otherTotal[i].max+"<p class='enddate'>"+$scope.otherTotal[i].date+"</p></th>";
                                }
                                html1+="</tr>";
                                html2+="</tr>";
                                html3+="</tr>";
                                html4+="</tr>";
                                html5+="</tr>";
                                html1+="<tr><th class='TabLeft'>当前在线人数</th><th>"+  $scope.psdsum.usersum+"</th><th>"+ $scope.calsum.usersum+"</th>";
                                html1+=html2;
                                html1+="<tr><th class='TabLeft'>今日累计登录</th><th>"+  $scope.psdsum.todayLoginsum+"</th><th>"+ $scope.calsum.todayLoginsum+"</th>";
                                html1+=html3;
                                html1+="<tr><th class='TabLeft'>昨日累计登录</th><th>"+  $scope.psdsum.yestodayLoginsum+"</th><th>"+ $scope.calsum.yestodayLoginsum+"</th>";
                                html1+=html4;
                                html1+="<tr><th class='TabLeft'>单日登录最高</th><th></th><th></th>";
                                html1+=html5;
                                var template=angular.element(html1);
                                var templateHtml = $compile(template)($scope);
                                angular.element(document.getElementById('userGeneral')).append(html1);
                                //补全新增用户数日期
                                function completeDateUser(str) {
                                    var currentDay=new Date();
                                    currentDay=changeDate(currentDay);
                                    currentDay=Date.parse(currentDay);
                                    var joinDate=[];
                                    var countGroup=[];   //总体数据
                                    for(var i=0;i<str.length;i++){
                                        var origin=1262275200000;//2010/01/01
                                        var countlist=[];
                                        var Bedate,date,sumInstall=0;
                                        var productData = str[i].data;
                                        var compare=productData[0].date;
                                        var groupId = getGroupIDByProductId(str[i].productId);
                                        var groupData = countGroup[groupId];
                                        if(groupData == null){
                                            groupData = new Object();
                                            countGroup[groupId] = groupData;
                                        }
                                        while( origin < compare){//补全以前日期
                                            if(groupData[origin] == null){
                                                groupData[origin] = 0;
                                            }
                                            countlist.push({date: origin, countDownloads: 0});
                                            origin+=86400000;
                                        }
                                        for(var j = 1;j < productData.length ; j++) {
                                            var n = (productData[j].date - productData[j - 1].date) / 86400000;
                                            sumInstall += productData[j - 1].inc;
                                            if (n == 1) {
                                                if(groupData[productData[j - 1].date] == null){
                                                    groupData[productData[j - 1].date] = sumInstall;
                                                }else{
                                                    groupData[productData[j - 1].date] += sumInstall;
                                                }
                                                countlist.push({date: productData[j - 1].date, countDownloads: sumInstall});
                                            } else {//补全中间日期
                                                //从 n>=2开始
                                                for (var k = 0; k< n; k++) {//多次累加
                                                    date = productData[j - 1].date + k * 86400000;
                                                    if(groupData[date] == null){
                                                        groupData[date] = sumInstall;
                                                    }else{
                                                        groupData[date] += sumInstall;
                                                    }
                                                    countlist.push({date: date, countDownloads: sumInstall});
                                                }
                                            }
                                        }
                                        var finalDay = productData[productData.length-1].date;
                                        while(finalDay <= currentDay){//补全末尾日期
                                            productData.push({date: finalDay, inc: 0});
                                            if(groupData[finalDay] == null){
                                                groupData[finalDay] = sumInstall;
                                            }else{
                                                groupData[finalDay] += sumInstall;
                                            }
                                            countlist.push({date: parseInt(finalDay), countDownloads: sumInstall});
                                            finalDay += 86400000;
                                        }
                                        countlist.push({productId:str[i].productId});
                                        joinDate.push(countlist);
                                    }
                                    for (var i = 0;i< countGroup.length; i++){
                                        var formattedGroupData = [];
                                        groupData = countGroup[i];
                                        for(var groupDay in groupData){
                                            if (groupData.hasOwnProperty(groupDay)) { //filter,只输出私有属性
                                                formattedGroupData.push({date:parseInt(groupDay),countDownloads:groupData[groupDay]});
                                            };
                                        }
                                        formattedGroupData.push({productId:(-100-i)});
                                        joinDate.push(formattedGroupData);
                                    }
                                    return joinDate;
                                }
                                //补全每日登录数日期
                                function completeDateLogins(str) {
                                    var currentDay=new Date();
                                    currentDay=changeDate(currentDay);
                                    currentDay=Date.parse(currentDay);
                                    var joinDate=[];
                                    var countGroup=[];   //总体数据
                                    for(var i=0;i<str.length;i++){
                                        var origin=1262275200000;//2010/01/01
                                        var countlist=[];
                                        var Bedate,date,sumInstall=0;
                                        var productData = str[i].data;
                                        var compare=productData[0].timestamp;
                                        if(compare>Date.parse(new Date())){//初始数据的当前日期大于今天
                                            compare=Date.parse(new Date());
                                        }
                                        var groupId = getGroupIDByProductId(str[i].productId);
                                        var groupData = countGroup[groupId];
                                        if(groupData == null){
                                            groupData = new Object();
                                            countGroup[groupId] = groupData;
                                        }
                                        while( origin < compare){//补全以前日期
                                            if(groupData[origin] == null){
                                                groupData[origin] = 0;
                                            }
                                            countlist.push({date: origin, countDownloads: 0});
                                            origin+=86400000;
                                        }
                                        for(var j = 1;j < productData.length ; j++) {
                                            var n = (productData[j].timestamp - productData[j - 1].timestamp) / 86400000;
                                            sumInstall += productData[j - 1].users;
                                            if (n == 1) {
                                                if(groupData[productData[j - 1].timestamp] == null){
                                                    groupData[productData[j - 1].timestamp] = sumInstall;
                                                }else{
                                                    groupData[productData[j - 1].timestamp] += sumInstall;
                                                }
                                                countlist.push({date: productData[j - 1].timestamp, countDownloads: sumInstall});
                                            } else {//补全中间日期
                                                //从 n>=2开始
                                                for (var k = 0; k< n; k++) {//多次累加
                                                    date = productData[j - 1].timestamp + k * 86400000;
                                                    if(groupData[date] == null){
                                                        groupData[date] = sumInstall;
                                                    }else{
                                                        groupData[date] += sumInstall;
                                                    }
                                                    countlist.push({date: date, countDownloads: sumInstall});
                                                }
                                            }
                                        }
                                        var finalDay = productData[productData.length-1].timestamp;
                                        while(finalDay <= currentDay){//补全末尾日期
                                            productData.push({date: finalDay, countDownloads: 0});
                                            if(groupData[finalDay] == null){
                                                groupData[finalDay] = sumInstall;
                                            }else{
                                                groupData[finalDay] += sumInstall;
                                            }
                                            countlist.push({date: finalDay, countDownloads: sumInstall});
                                            finalDay += 86400000;
                                        }
                                        countlist.push({productId:str[i].productId});
                                        joinDate.push(countlist);
                                    }
                                    for (var i = 0;i< countGroup.length; i++){
                                        var formattedGroupData = [];
                                        groupData = countGroup[i];
                                        for(var groupDay in groupData){
                                            if (groupData.hasOwnProperty(groupDay)) { //filter,只输出私有属性
                                                formattedGroupData.push({date:parseInt(groupDay),countDownloads:groupData[groupDay]});
                                            };
                                        }
                                        formattedGroupData.push({productId:(-100-i)});
                                        joinDate.push(formattedGroupData);
                                    }
                                    return joinDate;
                                }
                                function getGroupIDByProductId(pid) {
                                    for(var i=0;i<$scope.productList.length;i++) {
                                        for(var j=0;j< $scope.productList[i].groupList.length;j++){
                                            if($scope.productList[i].groupList[j].productId == pid){
                                                return i;
                                            }
                                        }
                                    }
                                }
                                function change2Stdtime(date) {
                                    var date = new Date(date);
                                    Y = date.getFullYear() + '/';
                                    M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '/';
                                    D = date.getDate() + ' ';
                                    date=Y+M+D;
                                    return date;
                                }
                                function chang2Ctime(str) {//默认显示标准的时间
                                    for(var i=0;i<str.length;i++){
                                        for(var j=0;j<str[i].length-1;j++){
                                            str[i][j].date=change2Stdtime(str[i][j].date);
                                        }
                                    }
                                }
                                //随着时间改变数据
                                function changUserData(date,arr) {
                                    var newData=[];
                                    for(var i=0;i< arr.length;i++){
                                        var collectData=[];
                                        for(var j=0;j<arr[i].length-1;j++){
                                            var Comdate=arr[i][j].date;
                                            if(Number != typeof (Comdate)){
                                                Comdate=Date.parse(arr[i][j].date);
                                            }
                                            if(Comdate>=date){
                                                var gogalTime=change2Stdtime(arr[i][j].date);
                                                collectData.push({date: gogalTime,countDownloads:arr[i][j].countDownloads});
                                            }
                                        }
                                        collectData.push({productId:arr[i][arr[i].length-1].productId});
                                        newData.push(collectData);
                                    }


                                    return newData;
                                }
                                function changLoginData(date,arr) {
                                    var newData=[];
                                    for(var i=0;i< arr.length;i++){
                                        var collectData=[];
                                        for(var j=0;j<arr[i].length-1;j++){
                                            var Comdate=arr[i][j].date;
                                            if(Number != typeof (Comdate)){
                                                Comdate=Date.parse(arr[i][j].date);
                                            }
                                            if(Comdate>=date){
                                                var gogalTime=change2Stdtime(arr[i][j].date);
                                                collectData.push({date: gogalTime,countDownloads:arr[i][j].countDownloads});
                                            }
                                        }
                                        collectData.push({productId:arr[i][arr[i].length-1].productId});
                                        newData.push(collectData);
                                    }
                                    return newData;
                                }
                                //补全24小时的时间
                                function completeHour(arr) {
                                    var joinDate=[];
                                    var countGroup=[];   //总体数据
                                    for(var i=0;i<str.length;i++){
                                        var countlist=[];
                                        var Bedate,date,sumInstall=0;
                                        var productData = str[i].data;
                                        var compare=productData[0].timestamp;
                                        for(var j=0;j<str.length;j++){
                                            var temp=$scope.onlineHour[i].data[j].time;
                                            temp=temp.split(' ')[1];
                                            var hour=parseInt(temp.split(':')[0]);
                                            var minutes= parseInt(temp.split(':')[0]) *60+parseInt(temp.split(':')[1]);
                                            $scope.onlineHour[i].data[j].time=minutes;

                                        }
                                    }
                                }
                                registerlist=completeDateUser( $scope.usernum);
                                loginlist=completeDateLogins( $scope.todayList);
                                chang2Ctime(registerlist);
                                chang2Ctime(loginlist);
                                //第一次加载一月前的数据
                                // console.log(JSON.stringify(loginlist)+'loginlist')
                                loadChart(registerlist);
                                /*(function () {
                                 var today=new Date();
                                 date=changeMonth(today);
                                 date=Date.parse(date);
                                 if(flag==1){
                                 result=changUserData(date,registerlist);
                                 }else{
                                 result=changLoginData(date,loginlist);
                                 }
                                 loadChart(result);
                                 })();*/
                                //近一月
                                $scope.month=function() {
                                    var today=new Date();
                                    date=changeMonth(today);
                                    date=Date.parse(date);
                                    if(flag==1){
                                        result=changUserData(date,registerlist);
                                    }else{
                                        result=changLoginData(date,loginlist);
                                    }
                                    loadChart(result);
                                };
                                //近一季
                                $scope.season=function() {
                                    var today=new Date();
                                    date=changeSeason(today);
                                    date=Date.parse(date);
                                    if(flag==1){
                                        result=changUserData(date,registerlist);
                                    }else{
                                        result=changLoginData(date,loginlist);
                                    }
                                    loadChart(result);
                                };
                                //近一年
                                $scope.year=function() {
                                    var today=new Date();
                                    date=changeYear(today);
                                    date=Date.parse(date);
                                    if(flag==1){
                                        result=changUserData(date,registerlist);
                                    }else{
                                        result=changLoginData(date,loginlist);
                                    }
                                    loadChart(result);
                                };
                                //近三年
                                $scope.Th3Years=function() {
                                    var today=new Date();
                                    date=change3Years(today);
                                    date=Date.parse(date);
                                    if(flag==1){
                                        result=changUserData(date,registerlist);
                                    }else{
                                        result=changLoginData(date,loginlist);
                                    }
                                    loadChart(result);
                                };
                                //全部
                                $scope.all=function() {
                                    date=1262275200000;//2010/01/01
                                    if(flag==1){
                                        result=changUserData(date,registerlist);
                                    }else{
                                        result=changLoginData(date,loginlist);
                                    }
                                    loadChart(result);
                                };
                                /*画图2*/
                                $("#usercount").click(function(){//每日新增用户
                                    flag=1;
                                    $(this).addClass('switch-left-down').removeClass('switch-left-up');
                                    $(this).siblings().removeClass('switch-left-down').addClass('switch-left-up');
                                    /*(function () {*/
                                    var today=new Date();
                                    date=changeMonth(today);
                                    date=Date.parse(date);
                                    if(flag==1){
                                        result=changUserData(date,registerlist);
                                    }else{
                                        result=changLoginData(date,loginlist);
                                    }
                                    loadChart(result);
                                    // })();
                                });
                                $("#downloadingcount").click(function() {//每日登录人数
                                    flag = 0;
                                    $(this).addClass('switch-left-down').removeClass('switch-left-up');
                                    $(this).siblings().removeClass('switch-left-down').addClass('switch-left-up');
                                    /* (function () {*/
                                    var today=new Date();
                                    date=changeMonth(today);
                                    date=Date.parse(date);
                                    if(flag==1){
                                        result=changUserData(date,registerlist);
                                    }else{
                                        result=changLoginData(date,loginlist);
                                    }
                                    loadChart(result);
                                    // })();
                                });

                                function loadChart(data) {
                                    // console.log(JSON.stringify(data)+'data')
                                    var endDate = [];
                                    var unitData=[];
                                    var Color=[];
                                    var SingleData=[];
                                    var name=[];
                                    var GroupList=[];
                                    for(var m=0;m<data[0].length-1;m++){//时间坐标轴
                                        endDate.push(data[0][m].date);
                                    }
                                    for(var i=0;i<data.length;i++){
                                        SingleData=[];
                                        for(var j=0;j<data[i].length;j++){
                                            //因为最后一条加的productId,只过滤需要的数据
                                            if(j<data[i].length-1){
                                                SingleData.push(data[i][j].countDownloads);
                                            }else{
                                                name.push(data[i][j]);
                                            }
                                        }
                                        unitData.push(SingleData);
                                    }

                                    var colorlist=["#000000","#5995ed","#88929a","#8c9cff","#8d59ed","#d05c5b","#65d4fe","#80d3b7","#7159ED","#0dbd37","#a18110","#c03f18","#9bd1e7","#8b0707","#013fa4","#f3cd67"];
                                    //设置颜色配置项
                                    var nameIconlist=[];
                                    var namelist=[];
                                    var seriesDatas=[];
                                    var initSelect={};//设置初始隐藏

                                    var initLegend = function(i,productName){
                                        if(i%9!=0){
                                            nameIconlist.push({name:productName,icon:'roundRect'});
                                            namelist.push(productName)
                                        }else{
                                            if(i!=0){
                                                nameIconlist.push('');
                                            }
                                            namelist.push(productName)
                                            nameIconlist.push({name:productName,icon:'roundRect'});
                                        }
                                    }

                                    var pdsindex=0;
                                    namelist.push("PDS总体");
                                    nameIconlist.push({name:'PDS总体',icon:'roundRect'});
                                    for(var i=0;i< $scope.psdList.length;i++){
                                        initLegend(i,$scope.psdList[i].productName);
                                        initSelect[$scope.psdList[i].productName]=false;
                                    }
                                    var slindex=pdsindex + $scope.psdList.length + 1;
                                    nameIconlist.push('');
                                    namelist.push("算量总体");
                                    nameIconlist.push({name:'算量总体',icon:'roundRect'});
                                    for(var i=0;i< $scope.calList.length;i++){
                                        initLegend(i,$scope.calList[i].productName);
                                        initSelect[$scope.calList[i].productName]=false;
                                    }
                                    var othreindex= slindex + $scope.calList.length + 1;
                                    nameIconlist.push('');
                                    namelist.push("其它");
                                    nameIconlist.push({name:'其它',icon:'roundRect'});
                                    for(var i=0;i< $scope.otherList.length;i++){
                                        initLegend(i,$scope.otherList[i].productName);
                                        initSelect[$scope.otherList[i].productName]=false;
                                    }
                                    //设置数据
                                    var n = 0;
                                    for(var i=0;i<unitData.length;i++){
                                        var thisdata;
                                        if(i==pdsindex){
                                            thisdata = unitData[unitData.length-3];
                                            n++
                                        }else if(i==slindex){
                                            thisdata = unitData[unitData.length-2];
                                            n++;
                                        }else if(i==othreindex){
                                            thisdata = unitData[unitData.length-1];
                                            n++
                                        }else{
                                            thisdata = unitData[i-n]
                                        }
                                        var sdata={//PDS
                                            name:namelist[i],
                                            type:'line',
                                            smooth:true,
                                            symbol: 'circle',
                                            symbolSize:8,
                                            data:thisdata
                                        }
                                        seriesDatas.push(sdata)
                                    }
                                    var waveChart = echarts.init(document.getElementById('checkuser'));
                                    var option= {
                                        color:colorlist,
                                        legend: {
                                            selected:initSelect,
                                            borderWidth: 0,            // 图例边框线宽，单位px，默认为0（无边框）
                                            itemGap: 15,               // 各个item之间的间隔，单位px，默认为10，
                                            itemWidth: 30,             // 图例图形宽度
                                            itemHeight: 14,
                                            textStyle: {
                                                width:50,
                                                color: '#333'          // 图例文字颜色
                                            },
                                            bottom:'0',
                                            data:nameIconlist
                                        },
                                        tooltip: {
                                            trigger: 'axis',
                                            axisPointer:{
                                                type: 'line',
                                                lineStyle: {
                                                    color: '#aa1019',
                                                    width: 2,
                                                    type: 'solid'
                                                }
                                            },
                                            position: function (pt) {
                                                return [pt[0], '5%'];
                                            }
                                        },
                                        grid: {
                                            left: '5%',
                                            right: '5%',
                                            bottom: '30%',
                                            containLabel: true,
                                            textStyle: {
                                                color: '#333',
                                                fontSize: '14'
                                            }
                                        },
                                        toolbox: {
                                            feature: {
                                                dataZoom : {
                                                    databackgroundColor:'rgba(0,0,0,0)',
                                                    backgroundColor:'rgba(0,0,0,0)',
                                                    yAxisIndex: 'none',
                                                    // show: false,
                                                    title: {
                                                        dataZoom: '区域缩放',
                                                        dataZoomReset: '区域缩放后退'
                                                    }
                                                },
                                                restore : {
                                                    // show : false,
                                                    title : '还原'
                                                },
                                                saveAsImage : {
                                                    // show : false,
                                                    title : '保存为图片',
                                                    type : 'png',
                                                    lang : ['点击保存']
                                                },
                                                dataView : {
                                                    // show : false
                                                },
                                            }
                                        },
                                        calculable : true,
                                        xAxis: {
                                            name:'时间',
                                            type: 'category',
                                            boundaryGap: false,
                                            data: endDate
                                        },
                                        yAxis: {
                                            name:'数量',
                                            type: 'value',
                                            scale: true,
                                            // boundaryGap: [0.01, 0.01],
                                            splitArea: { show: false },
                                            min:0,
                                            max:200
                                        },
                                        dataZoom : {
                                            show : true,
                                            start : 0,
                                            end : 50,
                                            y:380
                                        },
                                        series:seriesDatas
                                    };
                                    waveChart.setOption(option);
                                }
                                /*画图1*/

                                var myChart = echarts.init(document.getElementById('userChart'));
                                option = {

                                    tooltip: {
                                        trigger: 'axis',
                                        axisPointer:{
                                            type: 'line',
                                            lineStyle: {
                                                color: '#aa1019',
                                                width: 2,
                                                type: 'solid'
                                            }
                                        }
                                    },
                                    /* timeline:{
                                     padding:10,
                                     },*/
                                    color: ['orange', 'red','#90ff0a' ], //颜色由下至上
                                    grid: {
                                        left: '5%',
                                        right: '4%',
                                        bottom: '3%',
                                        containLabel: true,
                                        textStyle: {
                                            color: '#333',
                                            fontSize: '14'
                                        }
                                    },
                                    toolbox: {
                                        show : true,
                                        feature : {
                                        }
                                    },
                                    calculable : true,
                                    xAxis: {
                                        type: 'category',
                                        boundaryGap: false,
                                        data: ['00','01','02','03','04','05','06','07','08','09','10','11','12','13','14','15','16','17','18','19','20','21','22','23','24']
                                    },
                                    yAxis: [{
                                        type: 'value',
                                        scale: true,
                                        boundaryGap: [0.01, 0.01],
                                        splitArea: { show: false },
                                        min:0,
                                        max:1000
                                    }],

                                    series: [
                                        {
                                            symbol:'circle',
                                            symbolSize:6,
                                            name:'PSD总体',
                                            type:'line',
                                            itemStyle: {
                                                normal: {
                                                    color: '#e09d55'
                                                }
                                            },
                                            data:[600, 670, 700,670,700,800,820,870,790,860,900,1050]
                                        },
                                        {
                                            symbol:'circle',
                                            symbolSize:6,
                                            name:'算量总体',
                                            type:'line',
                                            itemStyle: {
                                                normal: {
                                                    color: '#aa1019'
                                                }
                                            },
                                            data:[750, 800, 850, 830, 850,870, 1040,1040,1010,1030,1200,1300]
                                        },
                                        {
                                            symbol:'circle',
                                            symbolSize:6,
                                            name:'浏览器',
                                            type:'line',
                                            itemStyle: {
                                                normal: {
                                                    color: '#2dc0e8'
                                                }
                                            },
                                            data:[800, 900, 950, 800, 850, 890,890,1000,870,1020,1050,1150]
                                        },
                                    ]
                                };
                                myChart.setOption(option);
                            });
                        })
                    });
                });
            });
        });
    });
});


        //累计访问人数

