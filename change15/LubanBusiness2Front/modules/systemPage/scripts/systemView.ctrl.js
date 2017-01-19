//主页面
app.controller('systemViewController', function ($scope,$compile,$location,$timeout,commonService) {
    $scope.psd=true;//
    $scope.cal=true;
    $scope.other=true;
    $scope.totalList=[];
    $scope.product=[];
    $scope.usernum=[];
    $scope.downloadsnum=[];
    $scope.psdTotal=[];
    $scope.calTotal=[];
    $scope.otherTotal=[];
    $scope.psdUser=[];
    $scope.psdsum=[];
    $scope.calsum=[];
    $scope.othersum=[];
    $scope.allTotal=[];
    $scope.productList=[];
    $scope.psdList=[];
    $scope.calList=[];
    $scope.otherList=[];
    $scope.dailymaxList=[];
    $scope.catalogy=[];
    $scope.averageList=[];
    $scope.countInstalled=[];
    // $scope.countcustomers=[];
    var userlist,downloadslist,flag=1,downloads=0,ans=0;//1是用户
    var productId,val,usersum,downloadsum,avergesum,maxsum,average;;
    /*显示隐藏*/
    $scope.pdsctrl = function(){
        $scope.psd = !$scope.psd;
    };
    $scope.calctrl=function () {
        $scope.cal = !$scope.cal;
    };
    $scope.otherctrl=function () {
        $scope.other = !$scope.other;
    };
    function changeDate(day) {
        // 时间为前一天的0:0:0的unix timestamp
        day.setDate(day.getDate()-1);
        day.setHours(0);
        day.setMinutes(0);
        day.setSeconds(0);
        day.setMilliseconds(0);
        return day
    }
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
    var yestoday= new Date();
    yestoday=changeDate(yestoday);
    var timestamp = Date.parse(yestoday);
    var arry=[2,11,29,23,27,13,33,28,3,2,5,30];
    //所需产品ID
    var dailymax='2,11,29,23,27,13,33,28,3,2,5,30';
    var pids= base64Encode(arry);
    dailymax= base64Encode(dailymax);
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
        M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '.';
        D = date.getDate() + ' ';
        date=Y+M+D;
        return date;
    }
    commonService.dailylonline({timestamp:timestamp,pids:pids}).then(function(res,$complie){
        //每日登陆
        $scope.averageList=res.data;
        $scope.averageList=sortId($scope.averageList);
        for (var i=0;i<$scope.averageList.length;i++){
            $scope.catalogy.push({productId:res.data[i].productId,val:res.data[i].average});
        }
        commonService.dailyonlinemax({dailymax:dailymax}).then(function(res){
            //每日最高登陆人数
            $scope.dailymaxList=res.data;
            $scope.dailymaxList=sortId($scope.dailymaxList);

            commonService.countdowning().then(function(res,$ccompile){
                //累计装机量
                if(res.data.length!=0){
                    $scope.downloadsnum=res.data;
                    $scope.countInstalled=res.data;
                    $scope.downloadsnum=sortId($scope.downloadsnum);
                }
                commonService.countuser().then(function(res) {
                    //累计访问人数
                    if(res.data.length!=0){
                        $scope.usernum=res.data;
                        $scope.usernum=sortId($scope.usernum);
                    }
                    commonService.producturl().then(function(res){
                        //获取产品名称
                        if(res.result.length!=0){
                            //交换psd和算量
                            var temp;
                            $scope.productList=res.result.resultList;
                            temp= $scope.productList[0];
                            $scope.productList[0]=$scope.productList[1];
                            $scope.productList[1]=temp;
                            //二维数据整合一维
                            for(var i=0;i<$scope.productList.length;i++){
                                for(var j=0;j< $scope.productList[i].groupList.length;j++){
                                    $scope.product.push($scope.productList[i].groupList[j]);
                                }
                            }
                            //产品名称列表
                            $scope.product=sortId($scope.product);
                            //日均访问量拼接
                            for(var i=0;i<$scope.averageList.length;i++){
                                for(var j=0;j<$scope.product.length;j++){
                                    if($scope.averageList[i].productId == $scope.product[j].productId){
                                        average=$scope.averageList[i].average;
                                        $scope.product[j].average=average;
                                    }else{
                                        if(!$scope.product[j].average) {
                                            $scope.product[j].average = 0;
                                        }
                                    }
                                }
                            }

                            //最高访问量拼接
                            var max;
                            var date;
                            for(var i=0;i<$scope.dailymaxList.length;i++){
                                for(var j=0;j<$scope.product.length;j++){
                                    if($scope.dailymaxList[i].productId == $scope.product[j].productId){
                                        max=$scope.dailymaxList[i].max;
                                        date=$scope.dailymaxList[i].date;
                                        date=unix2normal(date);
                                        $scope.product[j].max=max;
                                        $scope.product[j].date=date;
                                    }else{
                                        if(!$scope.product[j].max) {
                                            $scope.product[j].max = 0;
                                        }
                                        if(!$scope.product[j].date) {
                                            $scope.product[j].date = '--';
                                        }
                                    }
                                }
                            }
                            //累计用户量拼接
                            for(var i=0;i<$scope.usernum.length;i++){
                                for(var j=0;j<$scope.product.length;j++){
                                    var user=0;
                                    var ans=0;
                                    if($scope.usernum[i].productId == $scope.product[j].productId){
                                        for(var k=0;k<$scope.usernum[i].data.length;k++){
                                            ans+=$scope.usernum[i].data[k].inc;
                                        }
                                        $scope.product[j].user=ans;
                                    }else{
                                        if(!$scope.product[j].user) {
                                            $scope.product[j].user = 0;
                                        }
                                    }
                                }
                            }
                            //累计装机量拼接
                            for(var i=0;i<$scope.downloadsnum.length;i++){
                                for(var j=0;j<$scope.product.length;j++){
                                    if($scope.downloadsnum[i].productId == $scope.product[j].productId){
                                        for(var k=0;k<$scope.downloadsnum[i].data.length;k++){
                                            ans+=$scope.downloadsnum[i].data[k].inc;
                                        }
                                        $scope.product[j].downloads=ans;
                                    }else{
                                        if(!$scope.product[j].downloads) {
                                            $scope.product[j].downloads = 0;
                                        }
                                    }
                                }
                            }
                            //产品名   英文转中文
                            for(var i=0;i<$scope.productList.length;i++){
                                if(i==0){
                                    $scope.productList[i].groupName="PDS总体";
                                    //根据产品id过滤出所要的数据
                                    $scope.productList[i].groupList=sortId( $scope.productList[i].groupList);
                                    if($scope.productList[i].groupList.length!=0){
                                        for(var j=0;j< $scope.productList[i].groupList.length;j++){
                                            $scope.psdList.push({productName:$scope.productList[i].groupList[j].productName,productId:$scope.productList[i].groupList[j].productId,groupName:$scope.productList[i].groupName});
                                        }
                                    }
                                }else if(i==1){
                                    $scope.productList[i].groupName="算量总体";
                                    $scope.productList[i].groupList=sortId( $scope.productList[i].groupList);
                                    if($scope.productList[i].groupList.length!=0){
                                        for(var j=0;j< $scope.productList[i].groupList.length;j++){
                                            $scope.calList.push({productName:$scope.productList[i].groupList[j].productName,productId:$scope.productList[i].groupList[j].productId,groupName:$scope.productList[i].groupName});
                                        }
                                    }
                                }else if(i==2){
                                    $scope.productList[i].groupName="其他";
                                    $scope.productList[i].groupList=sortId( $scope.productList[i].groupList);
                                    if($scope.productList[i].groupList.length!=0){
                                        for(var j=0;j< $scope.productList[i].groupList.length;j++){
                                            $scope.otherList.push({productName:$scope.productList[i].groupList[j].productName,productId:$scope.productList[i].groupList[j].productId,groupName:$scope.productList[i].groupName});
                                        }
                                    }
                                }
                            }
                        }
                        //将数据划分为psd一组
                        for (var i=0;i<$scope.product.length;i++){
                            for(var j=0;j<$scope.psdList.length;j++){
                                if($scope.psdList[j].productId == $scope.product[i].productId){
                                    $scope.product[i].groupName=$scope.psdList[j].groupName;
                                    $scope.psdTotal.push($scope.product[i]);
                                }
                            }
                        }
                        //将数据划分为算量总体一组
                        for (var i=0;i<$scope.product.length;i++){
                            for(var j=0;j<$scope.calList.length;j++){
                                if($scope.calList[j].productId == $scope.product[i].productId){
                                    $scope.product[i].groupName=$scope.calList[j].groupName;
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
                        function countotal(catatgory) {
                            var sum1=0;
                            var sum2=0;
                            var sum3=0;
                            var sum4=0;
                            var arr;
                            var groupName;
                            for(var i=0;i< catatgory.length;i++){
                                sum1 += catatgory[i].user;
                                sum2 += catatgory[i].downloads;
                                sum3 += catatgory[i].average;
                                sum4 += catatgory[i].max;
                                groupName=catatgory[i].groupName;
                            }
                            arr={usersum:sum1,downloadsum:sum2,avergesum:sum3,maxsum:sum4,groupName:groupName};
                            return arr;
                        }
                        //总计
                        function addtotal(str1,str2,str3) {
                            var arrTotal;
                            usersum=str1.usersum+ str2.usersum+str3.usersum;
                            downloadsum=str1.downloadsum+ str2.downloadsum+str3.downloadsum;
                            avergesum=str1.avergesum+ str2.avergesum+str3.avergesum;
                            maxsum=str1.maxsum+ str2.maxsum+str3.maxsum;
                            arrTotal={usersum:usersum,downloadsum:downloadsum,avergesum:avergesum,maxsum:maxsum};
                            return arrTotal;
                        }
                        $scope.psdsum=countotal( $scope.psdTotal);
                        $scope.calsum=countotal( $scope.calTotal);
                        $scope.othersum=countotal( $scope.otherTotal);
                        $scope.allTotal=addtotal($scope.psdsum,$scope.calsum, $scope.othersum);
                        var html1=" <tr><th >总计</th><th>"+$scope.allTotal.usersum+"</th><th >"+$scope.allTotal.downloadsum+"</th><th></th><th></th></tr>";
                        angular.element(document.getElementById('swictchtype')).append(html1);
                        var html2= "<tr ng-init='psd=true' ng-click='psd=!psd' id='psd'><th ><img src='systemPage/images/arrow_down.png' class='arrow_down'><span>"+$scope.psdsum.groupName+
                            "</span></th><th >"+$scope.psdsum.usersum+"</th><th >"+$scope.psdsum.downloadsum+"</th><th>"+$scope.psdsum.avergesum+"</th><th ></th></tr>";
                        // angular.element(document.getElementById('addtbody')).append(html2);

                        for(var i=0;i<$scope.psdTotal.length;i++){
                            html2+="<tr ng-show='psd'><td>"+$scope.psdTotal[i].productName+"</td><td>"+$scope.psdTotal[i].user+"</td><td>"+$scope.psdTotal[i].downloads+"</td><td>"
                                +$scope.psdTotal[i].average+"</td><td><span>"+$scope.psdTotal[i].max+"</span><p class='enddate'>"+$scope.psdTotal[i].date+"</p></td></tr>"
                        }
                        // angular.element(document.getElementById('addtbody')).append(html2);
                        html2+= "<tr ng-init='cal=true' ng-click='cal=!cal'><th ><img src='systemPage/images/arrow_down.png' class='arrow_down'><span>"+$scope.calsum.groupName+
                            "</span></th><th >"+$scope.calsum.usersum+"</th><th >"+$scope.calsum.downloadsum+"</th><th>"+$scope.calsum.avergesum+"</th><th ></th></tr>";
                        for(var i=0;i<$scope.calTotal.length;i++){
                            html2+="<tr ng-show='cal'><td>"+$scope.calTotal[i].productName+"</td><td>"+$scope.calTotal[i].user+"</td><td>"+$scope.calTotal[i].downloads+"</td><td>"
                                +$scope.calTotal[i].average+"</td><td><span>"+$scope.calTotal[i].max+"</span><p class='enddate'>"+$scope.calTotal[i].date+"</p></td></tr>"
                        }

                        // angular.element(document.getElementById('addtbody')).append(html2);
                        html2+= "<tr ng-init='other=true' ng-click='other=!other'><th ><img src='systemPage/images/arrow_down.png' class='arrow_down'><span>"+$scope.othersum.groupName+
                            "</span></th><th >"+$scope.othersum.usersum+"</th><th >"+$scope.othersum.downloadsum+"</th><th>"+$scope.othersum.avergesum+"</th><th ></th></tr>";

                        for(var i=0;i<$scope.otherTotal.length;i++){
                            html2+="<tr ng-show='other'><td>"+$scope.otherTotal[i].productName+"</td><td>"+$scope.otherTotal[i].user+"</td><td>"+$scope.otherTotal[i].downloads+"</td><td>"
                                +$scope.otherTotal[i].average+"</td><td><span>"+$scope.otherTotal[i].max+"</span><p class='enddate'>"+$scope.otherTotal[i].date+"</p></td></tr>"
                        }
                        var template=angular.element(html2);
                        var templateHtml = $compile(template)($scope);

                        angular.element(document.getElementById('addtbody')).append(templateHtml);

                        function getGroupIDByProductId(pid) {
                            for(var i=0;i<$scope.productList.length;i++) {
                                for(var j=0;j< $scope.productList[i].groupList.length;j++){
                                    if($scope.productList[i].groupList[j].productId == pid){
                                        return i;
                                    }
                                }
                            }
                        }
                        /*  var template=angular.element(html3);
                         var templateHtml = $compile(template)($scope);
                         angular.element(document.getElementById('addtbody')).append(templateHtml);
                         */
                        function change2Stdtime(date) {
                            var date = new Date(date);
                            Y = date.getFullYear() + '/';
                            M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '/';
                            D = date.getDate() + ' ';
                            date=Y+M+D;
                            return date;
                        }
                        function completeDate(str) {
                            var currentDay=new Date();
                            // var goalday=change3years();
                            currentDay=changeDate(currentDay);
                            currentDay=Date.parse(currentDay);
                            var joinDate=[];
                            var countGroup=[];   //总体数据

                            for(var i=0;i<str.length;i++){
                                var origin=1262275200000;//2010/01/01
                                var countlist=[];
                                var Bedate,date,countDownloads,sumInstall=0;
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
                                    // date = change2Stdtime(finalDay);
                                    productData.push({date: finalDay, inc: 0});
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
                                        formattedGroupData.push({date:groupDay,countDownloads:groupData[groupDay]});
                                    };
                                }
                                formattedGroupData.push({productId:(-100-i)});
                                console.log(JSON.stringify(formattedGroupData));
                                joinDate.push(formattedGroupData);
                            }

                            return joinDate;
                        }

                        downloadslist= completeDate($scope.downloadsnum);
                        userlist=completeDate($scope.usernum);
                        function chang2Ctime(str) {//默认显示标准的时间
                            for(var i=0;i<str.length;i++){
                                for(var j=0;j<str[i].length-1;j++){
                                    str[i][j].date=change2Stdtime(str[i][j].date);
                                }
                            }
                        }
                        //加载图表
                        chang2Ctime(userlist);
                        loadChart(userlist);
                        //随着时间改变数据
                        function changData(date,arr) {
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
                        //近一月

                        var result;
                        $scope.month=function() {
                            var today=new Date();
                            date=changeMonth(today);
                            date=Date.parse(date);
                            if(flag==1){
                                result=changData(date,userlist);
                            }else{
                                result=changData(date,downloadslist);
                            }
                            loadChart(result);
                        };
                        //近一季
                        $scope.season=function() {
                            var today=new Date();
                            date=changeSeason(today);
                            date=Date.parse(date);
                            if(flag==1){
                                result=changData(date,userlist);
                            }else{
                                result=changData(date,downloadslist);
                            }
                            loadChart(result);
                        };
                        //近一年
                        $scope.year=function() {
                            var today=new Date();
                            date=changeYear(today);
                            date=Date.parse(date);
                            if(flag==1){
                                result=changData(date,userlist);
                            }else{
                                result=changData(date,downloadslist);
                            }
                            loadChart(result);
                        };
                        //近三年
                        $scope.Th3Years=function() {
                            var today=new Date();
                            date=change3Years(today);
                            date=Date.parse(date);
                            if(flag==1){
                                result=changData(date,userlist);
                            }else{
                                result=changData(date,downloadslist);
                            }
                            loadChart(result);
                        };
                        //全部
                        $scope.all=function() {
                            date=1262275200000;//2010/01/01
                            if(flag==1){
                                result=changData(date,userlist);
                            }else{
                                result=changData(date,downloadslist);
                            }
                            loadChart(result);
                        };
                        $("#usercount").click(function(){
                            flag=1;
                            $(this).addClass('switch-left-down').removeClass('switch-left-up');
                            $(this).siblings().removeClass('switch-left-down').addClass('switch-left-up');
                            loadChart(userlist);
                        });
                        $("#downloadingcount").click(function(){//切换用户和装机量
                            flag=0;
                            $(this).addClass('switch-left-down').removeClass('switch-left-up');
                            $(this).siblings().removeClass('switch-left-down').addClass('switch-left-up');
                            chang2Ctime(downloadslist);
                            loadChart(downloadslist);
                        });
                        //另一种方式给所有的Icon添加属性，然后匹配productId
                        function loadChart(data) {
                            var endDate = [];
                            var unitData=[];
                            var Color=[];
                            var SingleData=[];
                            var name=[];
                            var GroupList=[];
                            for(var m=0;m<data[0].length-1;m++){//时间坐标轴
                                endDate.push(data[0][m].date);
                                GroupList.push({data:data[0][m].date});
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
                            var colorlist=[];
                            //设置颜色配置项
                            for(var n=0;n<name.length;n++){
                                if(name[n].productId==12){
                                    colorlist.push("'#5995ed'");
                                }else  if(name[n].productId==11){
                                    colorlist.push("#88929a");
                                }else if(name[n].productId==29){
                                    colorlist.push("#8c9cff");
                                }else if(name[n].productId==23){
                                    colorlist.push("#8d59ed");
                                }else if(name[n].productId==27){
                                    colorlist.push("#d05c5b");
                                }else if(name[n].productId==13){
                                    colorlist.push("#65d4fe");
                                }else if(name[n].productId==33){
                                    colorlist.push("#80d3b7");
                                }else if(name[n].productId==28){
                                    colorlist.push("#7159ED");
                                }else if(name[n].productId==3){
                                    colorlist.push("#a18110");
                                }else if(name[n].productId==2){
                                    colorlist.push("#c03f18");
                                }else if(name[n].productId==5){
                                    colorlist.push("#9bd1e7");
                                }else if(name[n].productId==30){
                                    colorlist.push("#013fa4");
                                }else if(name[n].productId==30){
                                    colorlist.push("#f3cd67");
                                }else if(name[n].productId==-100){
                                    colorlist.push("#1a1a1a");
                                }else if(name[n].productId==-101){
                                    colorlist.push("#0dbd37");
                                }else if(name[n].productId==-102){
                                    colorlist.push("#8b0707");
                                }
                            }
                            var nameIconlist=[];
                            var namelist=[];
                            var seriesDatas=[];

                            // var initSelect="initSelect={";

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
                            }
                            var slindex=pdsindex + $scope.psdList.length + 1;
                            nameIconlist.push('');
                            namelist.push("算量总体");
                            nameIconlist.push({name:'算量总体',icon:'roundRect'});
                            for(var i=0;i< $scope.calList.length;i++){
                                initLegend(i,$scope.calList[i].productName);
                            }
                            var othreindex= slindex + $scope.calList.length + 1;
                            nameIconlist.push('');
                            namelist.push("其它");
                            nameIconlist.push({name:'其它',icon:'roundRect'});
                            for(var i=0;i< $scope.otherList.length;i++){
                                initLegend(i,$scope.otherList[i].productName);
                            }
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
                                    sampling: 'average',
                                    areaStyle: {
                                        normal: {
                                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                                offset: 0,
                                                color: 'rgb(255,255,255)'
                                            }, {
                                                offset: 1,
                                                color: 'rgb(255, 255, 255)'
                                            }])
                                        }
                                    },
                                    data:thisdata
                                }
                                seriesDatas.push(sdata)
                            }

                            /*画图2*/
                            var waveChart = echarts.init(document.getElementById('waveChart'));
                            var option= {
                                color:colorlist,
                                legend: {
                                    // selected:initSelect,
                                    itemWidth:30,
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
                                    type: 'category',
                                    boundaryGap: false,
                                    data: endDate
                                },
                                yAxis: {
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
                                    y:400
                                },
                                series:seriesDatas
                            };
                            waveChart.setOption(option);
                            waveChart.on('legendselectchanged', function (params) {
                                debugger;
                                var trueCount=0;
                                for(var i=0 ;i<name.length;i++){
                                    if(params.selected[name[i].productName]){
                                        trueCount++;
                                    }
                                    if(trueCount==6){
                                        debugger;
                                        var thisname = params.name;
                                        option.legend={'iBan':false};
                                        waveChart.setOption(option);
                                        alert("数量超过5条");
                                        return;
                                        break;
                                    }
                                }
                            });
                        }
                    })
                });
            });
        })
    })
});