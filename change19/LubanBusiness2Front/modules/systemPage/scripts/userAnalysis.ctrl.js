/**
 * 彭佳佳 2017年1月21日11:40:55
 */
app.controller('userAnalysisController', function ($scope,$compile,$location,$timeout,commonService) {
    $scope.groupProduct=[];//产品名称分组数据
    $scope.groupProductDailyTimes=[];//各产品每日登录次数
    $scope.groupProductNewAppendUser=[];//各产品新增用户
    $scope.groupProductWithinOnedayData=[];//24小时内各产品登录数
    $scope.groupProductNowOnlineData=[];//该时刻各产品登录数

    var itemGroupXZ=[];//整体组装数据（打平）
    var itemGroupDL=[];//整体组装数据（打平）
    var itemGroupWOD=[];//整体组装数据（打平）
    var onlineUsers=[];//当前在线人数
    var dailyMaxUsers=[];//每日最大人数
    var todayCountLogin=[];//今日累计登录
    var yesterdayCountLogin=[];//昨日累计登录
    var tableHeadDatas=[];//表头数组数据
    var onlyTableDatas=[[],[],[],[]];//在线图标展示数据
    var showFlag=true;//用户概况切换标识
    var colorlist=[];//颜色配置
    var LegendData=[];//数据项配置
    var LegendSelected={};//默认选中项
    var series=[];//在线监控数据对象
    var onlineDataGroup=[];//在线数据组装
    var onLineChart;//在线状况实时监控
    var onlineTableDataGroup=[];//在线图表数据组装



    var todayTime = changeToayFomat(new Date()).getTime();
    var dailymax='';

    /**
     * 获取公用数据
     * 分组产品名称+id
     */
    function getPublicData(){
        commonService.runAjaxJson({//获取产品名称
            type:'get',
            dataType:'json',
            async:false,
            httpUrl:"/enterprise/list/queryClientIdList",
            success:function(data){
                $scope.groupProduct = data.result.resultList;
            }
        });
        commonService.runAjaxJson({//每日登陆
            type:'get',
            dataType:'json',
            async:false,
            httpUrl:"analysis/loginlog/daily/user/logintimes",
            success:function(data){
                $scope.groupProductDailyTimes = data.dailytimes;
            }
        });
        getUserGeneralSituationDLAllDatas();
    }

    /**
     * 获取新增用户（用户概况）
     */
    function getNewAppendUser(){
        commonService.runAjaxJson({//新增用户
            type:'get',
            dataType:'json',
            async:false,
            httpUrl:"analysis/loginlog/daily/user/inclement",
            success:function(data){
                $scope.groupProductNewAppendUser=data;
            }
        });
        getUserGeneralSituationXZAllDatas();
    }

    /**
     * 获取在线用户和单日最高登录人数
     */
    function getOnlineAndDailyMaxUsers(){
        commonService.runAjaxJson({//在线用户
            type:'get',
            dataType:'json',
            async:false,
            httpUrl:"analysis/online/user_current",
            success:function(data){
                $scope.onlineUsers = data.online;
            }
        });
        commonService.runAjaxJson({//单日最高登录人数
            type:'get',
            dataType:'json',
            async:false,
            httpUrl:"analysis/loginlog/daily/user/max/"+dailymax,
            success:function(data){
                $scope.dailyMaxUsers=data.data;
            }
        });
    }

    /**
     * 当前时间前24小时内各产品每分钟登录数
     */
    function getWithinOneday(){
        commonService.runAjaxJson({//当前时间前24小时内各产品每分钟登录数
            type:'get',
            dataType:'json',
            async:false,
            httpUrl:"analysis/online/user",
            success:function(data){
                $scope.groupProductWithinOnedayData= data.online;
            }
        });
        getWithinOnedayAllDatas();
    }

    /**
     * 获取实时在线用户数
     */
    function getNowOnlineUsers(){
        commonService.runAjaxJson({//在线用户
            type:'get',
            dataType:'json',
            async:false,
            httpUrl:"analysis/online/user_current",
            success:function(data){
                $scope.groupProductNowOnlineData= data.online;
            }
        });
    }


    /**
     * 24小时现在情况整体组装数据（打平）
     */
    function getWithinOnedayAllDatas(){
        for(var i=0;i<$scope.groupProduct.length;i++) {
            var itemCountGroup = [];
            for (var j = 0; j < $scope.groupProduct[i].groupList.length; j++) {
                var productID = $scope.groupProduct[i].groupList[j].productId;
                var itemName = $scope.groupProduct[i].groupList[j].productName;
                var itemData = [];
                for (var n = 0; n < $scope.groupProductWithinOnedayData.length; n++) {
                    var item = $scope.groupProductWithinOnedayData[n];
                    if (productID == item.productId) {
                        for(var m = 0;m<item.data.length;m++){
                            itemData.push([new Date(item.data[m].time),parseInt(item.data[m].users)])
                        }
                        break;
                    }
                }
                if (itemData.length == 0) {
                    for (var q=0; q < $scope.groupProductWithinOnedayData[0].data.length; q++) {
                        itemData.push([new Date($scope.groupProductWithinOnedayData[0].data[q].time),parseInt(0)]);
                    }
                }
                itemGroupWOD.push({"name": itemName, "data": itemData})
                itemCountGroup.push({"data": itemData})
            }
            var itemGroupData = [];
            for (var a = 0; a < itemCountGroup[0].data.length; a++) {
                var itemCount = 0;
                for (var b = 0; b < itemCountGroup.length; b++) {//直接统计组数据
                    itemCount = itemCount + parseInt(itemCountGroup[b].data[a][1]);
                }
                itemGroupData.push([new Date(itemCountGroup[0].data[a][0]),itemCount]);
            }
            itemGroupWOD.push({'name': $scope.groupProduct[i].groupName, 'data': itemGroupData});
        }
    }

    /**
     * 每日登录数整体组装数据（打平）
     */
    function  getUserGeneralSituationDLAllDatas(){
        var startTime = new Date("2010/01/01 00:00:00").getTime();
        var endTime = changeToayFomat(new Date()).getTime();
        for(var i=0;i<$scope.groupProduct.length;i++) {
            var itemCountGroup = [];
            for (var j = 0; j < $scope.groupProduct[i].groupList.length; j++) {
                if(i==$scope.groupProduct.length-1 && j==$scope.groupProduct[i].groupList[j]-1){
                    dailymax+=$scope.groupProduct[i].groupList[j].productId;
                }else{
                    dailymax+=$scope.groupProduct[i].groupList[j].productId+',';
                };
                var productID = $scope.groupProduct[i].groupList[j].productId;
                var itemName = $scope.groupProduct[i].groupList[j].productName;
                var itemData = [];
                for (var n = 0; n < $scope.groupProductDailyTimes.length; n++) {
                    var item = $scope.groupProductDailyTimes[n];
                    if (productID == item.productId) {
                        if (item.data[0].timestamp != startTime) {//补全开头
                            for (var sTime = startTime; sTime < item.data[0].timestamp; sTime += 24 * 60 * 60 * 1000) {
                                itemData.push(0);
                            }
                            itemData.push(item.data[0].users);
                        } else {
                            itemData.push(item.data[0].users);
                        }
                        for (var m = 1; m < item.data.length; m++) {//补全中间（差值补全）
                            if (item.data[m].timestamp - item.data[m - 1].timestamp != 24 * 60 * 60 * 1000) {
                                for (var sTime = item.data[m - 1].timestamp; sTime < item.data[m].timestamp - 24 * 60 * 60 * 1000; sTime += 24 * 60 * 60 * 1000) {
                                    itemData.push(0);
                                }
                                itemData.push(item.data[m].users);
                            } else {
                                itemData.push(item.data[m].users);
                            }
                        }
                        if (item.data[item.data.length - 1].timestamp != endTime) {//补全最后
                            for (var sTime = item.data[item.data.length - 1].timestamp; sTime < endTime; sTime += 24 * 60 * 60 * 1000) {
                                itemData.push(0);
                            }
                        }
                        break;
                    }
                }
                if (itemData.length == 0) {
                    var sTime = new Date("2010/01/01 00:00:00").getTime();
                    for (sTime; sTime <= endTime; sTime += 24 * 60 * 60 * 1000) {
                        itemData.push(0);
                    }
                }
                itemGroupDL.push({"name": itemName, "data": itemData})
                itemCountGroup.push({"data": itemData})
                todayCountLogin.push({"productId":productID,"count":itemData.slice(itemData.length-1,itemData.length)})
                yesterdayCountLogin.push({"productId":productID,"count":itemData.slice(itemData.length-2,itemData.length-1)})
            }
            var itemGroupData = [];
            for (var a = 0; a < itemCountGroup[0].data.length; a++) {
                var itemCount = 0;
                for (var b = 0; b < itemCountGroup.length; b++) {//直接统计组数据
                    itemCount = itemCount + itemCountGroup[b].data[a];
                }
                itemGroupData.push(itemCount);
            }
            itemGroupDL.push({'name': $scope.groupProduct[i].groupName, 'data': itemGroupData});
        }
        dailymax=base64Encode(dailymax);
    }

    /**
     * 新增用户数整体组装数据（打平）
     */
    function getUserGeneralSituationXZAllDatas(){
        var startTime = new Date("2010/01/01 00:00:00").getTime();
        var endTime = changeToayFomat(new Date()).getTime();
        for(var i=0;i<$scope.groupProduct.length;i++){
            var itemCountGroup = [];
            for(var j=0;j<$scope.groupProduct[i].groupList.length;j++){
                var productID = $scope.groupProduct[i].groupList[j].productId;
                var itemName = $scope.groupProduct[i].groupList[j].productName;
                var itemData =[];
                for(var n=0;n<$scope.groupProductNewAppendUser.data.length;n++){
                    var item = $scope.groupProductNewAppendUser.data[n];
                    if(productID==item.productId){
                        if(item.data[0].date!=startTime){//补全开头
                            for(var sTime = startTime;sTime<item.data[0].date;sTime+=24*60*60*1000){
                                itemData.push(0);
                            }
                            itemData.push(item.data[0].inc);
                        }else{
                            itemData.push(item.data[0].inc);
                        }
                        for(var m=1;m<item.data.length;m++){//补全中间（差值补全）
                            if(item.data[m].date-item.data[m-1].date!=24*60*60*1000){
                                for(var sTime=item.data[m-1].date;sTime<item.data[m].date-24*60*60*1000;sTime+=24*60*60*1000){
                                    itemData.push(0);
                                }
                                itemData.push(item.data[m].inc);
                            }else{
                                itemData.push(item.data[m].inc);
                            }
                        }
                        if(item.data[item.data.length-1].date!=endTime){//补全最后
                            for(var sTime = item.data[item.data.length-1].date;sTime<endTime;sTime+=24*60*60*1000){
                                itemData.push(0);
                            }
                        }
                        break;
                    }
                }
                if(itemData.length==0){
                    var sTime = new Date("2010/01/01 00:00:00").getTime();
                    for(sTime;sTime<=endTime;sTime+=24*60*60*1000){
                        itemData.push(0);
                    }
                }
                itemGroupXZ.push({"name":itemName,"data":itemData})
                itemCountGroup.push({"data":itemData})
            }
            var itemGroupData =[];
            for(var a=0 ;a<itemCountGroup[0].data.length;a++){
                var itemCount = 0;
                for(var b=0;b<itemCountGroup.length;b++){//直接统计组数据
                    itemCount = itemCount+itemCountGroup[b].data[a];
                }
                itemGroupData.push(itemCount);
            }
            itemGroupXZ.push({'name':$scope.groupProduct[i].groupName,'data':itemGroupData})
        }
    }

    /**
     * 组装在线图表数据
     */
    function initOnlineTableDatas(){
        for(var i=0;i<$scope.groupProduct.length;i++) {
            tableHeadDatas.push($scope.groupProduct[i].groupName)
            for (var j = 0; j < $scope.groupProduct[i].groupList.length; j++) {
                tableHeadDatas.push( $scope.groupProduct[i].groupList[j].productName)
                var productID = $scope.groupProduct[i].groupList[j].productId;
                var existOnlineItemFlag = true;//判断该产品是否存在
                for (var n = 0; n < $scope.onlineUsers.length; n++) {
                    var item = $scope.onlineUsers[n];
                    if (productID == item.productId) {
                        existOnlineItemFlag = false;
                        onlineUsers.push({"productId":productID,"count":item.data[0].users})
                        break;
                    }
                }
                if(existOnlineItemFlag){
                    onlineUsers.push({"productId":productID,"count":0})
                }
                var existMaxItemFlag = true;//判断该产品是否存在
                for (var n = 0; n < $scope.dailyMaxUsers.length; n++) {
                    var item = $scope.dailyMaxUsers[n];
                    if (productID == item.productId) {
                        existMaxItemFlag = false
                        dailyMaxUsers.push({"productId":productID,"count":item.max,"date":unix2normal(item.date)})
                        break;
                    }
                }
                if(existMaxItemFlag){
                    dailyMaxUsers.push({"productId":productID,"count":0,"date":""})
                }
            }
        }
        var startIndex = 0
        var endIndex = $scope.groupProduct[0].groupList.length
        for(var i=0;i<$scope.groupProduct.length;i++) {
            if(i!=0){
                startIndex = endIndex;
                endIndex = $scope.groupProduct[i].groupList.length + endIndex
            }
            var si = startIndex;
            var todayCountLoginGroup=0;
            var yesterdayCountLoginGroup=0;
            var onlineUsersCountGroup=0;
            for(si;si<endIndex;si++) {
                todayCountLoginGroup = todayCountLoginGroup + parseInt(todayCountLogin[si].count)
                yesterdayCountLoginGroup = yesterdayCountLoginGroup +parseInt(yesterdayCountLogin[si].count)
                onlineUsersCountGroup = onlineUsersCountGroup + parseInt(onlineUsers[si].count)
            }
            onlyTableDatas[0].push(onlineUsersCountGroup);
            onlyTableDatas[1].push(todayCountLoginGroup);
            onlyTableDatas[2].push(yesterdayCountLoginGroup);
            onlyTableDatas[3].push("");
            for(startIndex;startIndex<endIndex;startIndex++) {
                onlyTableDatas[0].push(parseInt(onlineUsers[startIndex].count));
                onlyTableDatas[1].push(parseInt(todayCountLogin[startIndex].count));
                onlyTableDatas[2].push(parseInt(yesterdayCountLogin[startIndex].count));
                onlyTableDatas[3].push(parseInt(dailyMaxUsers[startIndex].count)+"$"+dailyMaxUsers[startIndex].date);
            }
        }
    }

    /**
     * 绘制在线table
     */
    function drawOnlineTable(){
        var html="<tr><th class='TabLeft'></th>";
        for(var i=0;i<tableHeadDatas.length;i++){
            html+="<th>"+tableHeadDatas[i]+"</th>";
        }
        html+="</tr>";

        for(var i=0;i<onlyTableDatas.length;i++){
            if(i==0){
                html+="<tr id=''><th class='TabLeft'>当前在线人数</th><th>";
                for(var j=0;j<onlyTableDatas[i].length;j++){
                    if(j==onlyTableDatas[i].length-1){
                        html+=onlyTableDatas[i][j]+"</th>"
                    }else{
                        html+=onlyTableDatas[i][j]+"</th><th>"
                    }
                }
                html+="</tr>";
            }else if(i==1){
                html+="<tr><th class='TabLeft'>今日累计登录</th><th>";
                for(var j=0;j<onlyTableDatas[i].length;j++){
                    if(j==onlyTableDatas[i].length-1){
                        html+=onlyTableDatas[i][j]+"</th>"
                    }else{
                        html+=onlyTableDatas[i][j]+"</th><th>"
                    }
                }
                html+="</tr>"
            }else if(i==2){
                html+="<tr><th class='TabLeft'>昨日累计登录</th><th>";
                for(var j=0;j<onlyTableDatas[i].length;j++){
                    if(j==onlyTableDatas[i].length-1){
                        html+=onlyTableDatas[i][j]+"</th>"
                    }else{
                        html+=onlyTableDatas[i][j]+"</th><th>"
                    }
                }
                html+="</tr>";
            }else if(i==onlyTableDatas.length-1){
                html+="<tr><th class='TabLeft'>单日登录最高</th><th>";
                for(var k=0;k<onlyTableDatas[i].length;k++){
                    if(onlyTableDatas[i][k].length!=0){
                        var max=onlyTableDatas[i][k].split('$')[0];
                        var date=onlyTableDatas[i][k].split('$')[1];
                        if(max.length == 0 ){
                            html+="</th><th>";
                        }else{
                            if(date.length==0){
                                date='--';
                            }else{
                                date=date;
                            }
                            if(k==onlyTableDatas[i].length-1){
                                html+=max+"<p class='enddate'>"+date+"</p></th>";
                            }else{
                                html+=max+"<p class='enddate'>"+date+"</p></th><th>";
                            }
                        }
                    }else{
                        html+="</th><th>";
                    }
                }
                html+="</tr>";
            }
        }
        var template=angular.element(html);
        var templateHtml = $compile(html)($scope);
        angular.element(document.getElementById('userGeneral')).append(templateHtml);
    }

    /**
     * 日期格式化
     * @param date
     */
    function change2Stdtime(date) {
        var date = new Date(date);
        Y = date.getFullYear() + '/';
        M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '/';
        D = date.getDate() + ' ';
        date=Y+M+D;
        return date;
    }

    /**
     * 获取展示legendData;
     * @returns {Array}
     */
    function getColorListsAndSituationLegendData(){
        for(var i=0;i<$scope.groupProduct.length;i++){
            colorlist.push($scope.groupProduct[i].groupColor);
            LegendData.push({name:$scope.groupProduct[i].groupName,icon:'roundRect'});
            for(var j=0;j<$scope.groupProduct[i].groupList.length;j++){
                colorlist.push($scope.groupProduct[i].groupList[j].productColor);
                LegendData.push({name:$scope.groupProduct[i].groupList[j].productName,icon:'roundRect'})
            }
            LegendData.push('')
        }
    }

    /**
     * 设置默认隐藏样式
     */
    function getSituationLegendSelected(){
        for(var i=0;i<$scope.groupProduct.length;i++){
            for(var j=0;j<$scope.groupProduct[i].groupList.length;j++){
                LegendSelected[$scope.groupProduct[i].groupList[j].productName]=false;
            }
        }
    }

    /**
     * 用户概况需要展示的X轴数据
     */
    function getXAxisData(timetype){
        var startTime = new Date("2010/01/01 00:00:00").getTime();
        if(timetype==0){
            startTime = todayTime - 30*24*60*60*1000+1*24*60*60*1000
        }else if(timetype==1){
            startTime = todayTime - 90*24*60*60*1000+1*24*60*60*1000
            sliceNum = 90
        }else if(timetype==2){
            startTime = todayTime - 365*24*60*60*1000+1*24*60*60*1000
        }else if(timetype==3){
            startTime = todayTime - 365*3*24*60*60*1000+1*24*60*60*1000
        }
        var xAxisData=[];
        var endTime = todayTime;
        for(startTime;startTime<=endTime;startTime+=24*60*60*1000){
            var thisDate = new Date(startTime);
            xAxisData.push(change2Stdtime(thisDate))
        }
        return xAxisData;
    }
    /**
     *
     * @param showtype true 新增 false 登录
     * @param timetype 0 近一月 1 近一季 2 近一年 3 近三年 4 全部
     * @returns {Array}
     */
    function getSituationSeries(showtype,timetype){
        var seriesDatas=[];
        var showItemGroup = itemGroupXZ;
        var sliceNum = 0;
        if(!showtype){
            showItemGroup = itemGroupDL;
        }
        if(timetype==0){
            sliceNum = 30
        }else if(timetype==1){
            sliceNum = 90
        }else if(timetype==2){
            sliceNum = 365
        }else if(timetype==3){
            sliceNum = 365*3
        }else{
            sliceNum = showItemGroup[0].data.length
        }
        for(var i=0;i<showItemGroup.length;i++){
            var sdata={//PDS
                name:showItemGroup[i].name,
                type:'line',
                smooth:true,
                symbol: 'circle',
                symbolSize:8,
                data:showItemGroup[i].data.slice(showItemGroup[i].data.length-sliceNum,showItemGroup[i].data.length)
            }
            seriesDatas.push(sdata)
        }
        return seriesDatas;
    }

    /**
     *   用户概况
     */
    function drawUserGeneralSituation(showtype,timetype){
        var legendData=LegendData;
        var legendSelected=LegendSelected;
        var xAxisData=getXAxisData(timetype);
        var seriesDatas=getSituationSeries(showtype,timetype);
        var waveChart = echarts.init(document.getElementById('checkuser'));
        var option= {
            color:colorlist,
            legend: {
                selected:legendSelected,
                borderWidth: 0,            // 图例边框线宽，单位px，默认为0（无边框）
                itemGap: 15,               // 各个item之间的间隔，单位px，默认为10，
                itemWidth: 30,             // 图例图形宽度
                itemHeight: 14,
                textStyle: {
                    width:50,
                    color: '#333'          // 图例文字颜色
                },
                bottom:'0',
                data:legendData
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
            calculable : true,
            xAxis: {
                name:'时间',
                type: 'category',
                boundaryGap: false,
                data: xAxisData
            },
            yAxis: {
                name:'数量',
                type: 'value',
                scale: true,
                splitArea: { show: false },
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

    /**
     *  获取24小时在线数据
     */
    function getSpySeries(){
        for(var i=0;i<itemGroupWOD.length;i++){
            var serie= {
                name:itemGroupWOD[i].name,
                type: 'line',
                showSymbol: false,
                hoverAnimation: false,
                data:itemGroupWOD[i].data
            }
            series.push(serie);
        }
    }

    /**
     * 处理在线数据
     */
    function getOnlieUsersDatas(){
        onlineDataGroup=[];
        for(var i=0;i<$scope.groupProduct.length;i++) {
            for (var j = 0; j < $scope.groupProduct[i].groupList.length; j++) {
                var onlineGroupCount=[];
                var productID = $scope.groupProduct[i].groupList[j].productId;
                var thisDate = $scope.groupProductNowOnlineData[0].data[0].time
                var existOnlineItemFlag = true;//判断该产品是否存在
                for (var n = 0; n < $scope.groupProductNowOnlineData.length; n++) {
                    var item = $scope.groupProductNowOnlineData[n];
                    if (productID == item.productId) {
                        existOnlineItemFlag = false;
                        onlineDataGroup.push([new Date(item.data[0].time),item.data[0].users])

                        onlineGroupCount.push(item.data[0].users);
                        break;
                    }
                }
                if(existOnlineItemFlag){
                    onlineDataGroup.push([new Date(thisDate),0])
                    onlineGroupCount.push(0);
                }
            }
            var onlineDataGroupCount=0;
            for(var a=0 ;a<onlineGroupCount.length;a++){
                onlineDataGroupCount = onlineDataGroupCount+parseInt(onlineGroupCount[a])
            }
            onlineDataGroup.push([new Date(item.data[0].time),onlineDataGroupCount]);
        }
    }

    /**
     * 追加监控数据
     */
    function appendSpySeries(){
        for(var i=0;i<onlineDataGroup.length;i++){
            series[i].data.shift();
            series[i].data.push(onlineDataGroup[i]);
        }
        onLineChart.setOption({
            series:series
        })
    }


    /**
     *  在线状况实时监控
     */
    function drawWithinOnedayCharts(){
        var legendData=LegendData;
        var legendSelected=LegendSelected;
        var spyeriesDatas=series;
        onLineChart = echarts.init(document.getElementById('userChart'));
        option = {
            color:colorlist,
            legend: {
                selected:legendSelected,
                borderWidth: 0,            // 图例边框线宽，单位px，默认为0（无边框）
                itemGap: 15,               // 各个item之间的间隔，单位px，默认为10，
                itemWidth: 30,             // 图例图形宽度
                itemHeight: 14,
                textStyle: {
                    width:50,
                    color: '#333'          // 图例文字颜色
                },
                bottom:0,
                data:legendData
            },
            grid: {
                left: '5%',
                right: '5%',
                bottom: '40%',
                containLabel: true,
                textStyle: {
                    color: '#333',
                    fontSize: '14'
                }
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
            xAxis: {
                type: 'time',
                splitLine: {
                    show: false
                },
                axisLabel:{
                    formatter: function (value, index) {
                        // 格式化成月/日，只在第一个刻度显示年份
                        var date = new Date(value);
                        return ((date.getHours()<10)?('0'+date.getHours()):date.getHours())+':'+((date.getMinutes()<10)?('0'+date.getMinutes()):date.getMinutes());//改变x轴坐标显示

                    }
                }
            },
            yAxis: {
                type: 'value',
                boundaryGap: [0, '100%'],
                splitLine: {
                    show: false
                }
            },
            series:spyeriesDatas
        };
        onLineChart.setOption(option);
    }

    /**
     * 表格箭头click事件
     */
    $('.flowIMg').click(function () {
        if($('#show-Table').css('display')=='block'){
            $('#show-Table').css('display','none');
            $('#ImgChange').attr('src','systemPage/images/close.png');
        }else{
            $('#show-Table').css('display','block');
            $('#ImgChange').attr('src','systemPage/images/open.png');
        }
    });
    /**
     * 表格箭头hover事件
     */
    $('.flowIMg').hover(function () {
        if($('#show-Table').css('display')=='block') {
            $('#ImgChange').attr('src', 'systemPage/images/hoverClose.png');
        }else{
            $('#ImgChange').attr('src','systemPage/images/hoverOpen.png');
        }
    });

    /**
     * 新增用户
     */
    $("#usercount").click(function(){
        showFlag = true;
        drawUserGeneralSituation(showFlag,0)
    })
    /**
     * 每日登录
     */
    $("#downloadingcount").click(function(){
        showFlag = false;
        drawUserGeneralSituation(showFlag,0)
    })
    /**
     * 切换日期
     * @param tiemtype
     */
    $scope.changShowTime = function(tiemtype){
        drawUserGeneralSituation(showFlag,tiemtype)
    };


    getPublicData();
    getNewAppendUser();
    getColorListsAndSituationLegendData();
    getSituationLegendSelected();
    drawUserGeneralSituation(true,0);
    getOnlineAndDailyMaxUsers();
    initOnlineTableDatas();
    drawOnlineTable();
    getWithinOneday();
    getSpySeries();
    drawWithinOnedayCharts();

    setInterval(function () {
        getNowOnlineUsers();
        getOnlieUsersDatas();
        appendSpySeries();
    }, 60*1000);

});


