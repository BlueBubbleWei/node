/**
 * 彭佳佳 2017年1月21日11:40:55
 */
app.controller('userAnalysisController', function ($scope,$compile,$location,$timeout,commonService) {
    $scope.groupProduct=[];//产品名称分组数据
    $scope.groupProductDailyTimes=[];//各产品每日登录次数
    $scope.groupProductNewAppendUser=[];//各产品新增用户

    var colorlist=["#000000","#5995ed","#88929a","#8c9cff","#8d59ed","#d05c5b","#65d4fe","#80d3b7","#7159ED","#0dbd37","#a18110","#c03f18","#9bd1e7","#8b0707","#013fa4","#f3cd67"];
    var itemGroupXZ=[];//整体组装数据（打平）
    var itemGroupDL=[];//整体组装数据（打平）
    var showFlag=true;
    var todayTime = changeToayFomat(new Date()).getTime();

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
                console.log($scope.groupProductDailyTimes)
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
    function getOnlyAndDailyMaxUsers(){
        commonService.runAjaxJson({//在线用户
            type:'get',
            dataType:'json',
            async:false,
            httpUrl:"analysis/loginlog/daily/user/inclement",
            success:function(data){
                console.log(data);
            }
        });
        commonService.runAjaxJson({//单日最高登录人数
            type:'get',
            dataType:'json',
            async:false,
            httpUrl:"analysis/loginlog/daily/user/max/"+dailymax,
            success:function(data){
                console.log(data);
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
                console.log(data);
            }
        });
    }


    /**
     * 每日登录数整体组装数据（打平）
     */
    function getUserGeneralSituationDLAllDatas(){
        var startTime = new Date("2010/01/01 00:00:00").getTime();
        var endTime = changeToayFomat(new Date()).getTime();
        for(var i=0;i<$scope.groupProduct.length;i++) {
            var itemCountGroup = [];
            for (var j = 0; j < $scope.groupProduct[i].groupList.length; j++) {
                var productID = $scope.groupProduct[i].groupList[j].productId;
                var itemName = $scope.groupProduct[i].groupList[j].productName;
                var itemData = [];
                debugger;
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
            }
            var itemGroupData = [];
            for (var a = 0; a < itemCountGroup[0].data.length; a++) {
                var itemCount = 0;
                for (var b = 0; b < itemCountGroup.length; b++) {//直接统计组数据
                    itemCount = itemCount + itemCountGroup[b].data[a];
                }
                itemGroupData.push(itemCount);
            }
            itemGroupDL.push({'name': $scope.groupProduct[i].groupName, 'data': itemGroupData})
        }
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
    function getSituationLegendData(){
        var legendData=[];
        for(var i=0;i<$scope.groupProduct.length;i++){
            legendData.push({name:$scope.groupProduct[i].groupName,icon:'roundRect'});
            for(var j=0;j<$scope.groupProduct[i].groupList.length;j++){
                legendData.push({name:$scope.groupProduct[i].groupList[j].productName,icon:'roundRect'})
            }
            legendData.push('')
        }
        return legendData;
    }

    /**
     * 设置默认隐藏样式
     */
    function getSituationLegendSelected(){
        var LegendSelected={};
        for(var i=0;i<$scope.groupProduct.length;i++){
            for(var j=0;j<$scope.groupProduct[i].groupList.length;j++){
                LegendSelected[$scope.groupProduct[i].groupList[j].productName]=false;
            }
        }
        return LegendSelected;
    }

    /**
     * 用户概况需要展示的数据
     */
    function getXAxisData(timetype){
        var startTime = new Date("2010/01/01 00:00:00").getTime();
        if(timetype==0){
            startTime = todayTime - 30*24*60*60*1000
        }else if(timetype==1){
            startTime = todayTime - 90*24*60*60*1000
            sliceNum = 90
        }else if(timetype==2){
            startTime = todayTime - 365*24*60*60*1000
        }else if(timetype==3){
            startTime = todayTime - 365*3*24*60*60*1000
        }
        var xAxisData=[];
        var endTime = todayTime;
        for(startTime;startTime<endTime;startTime+=24*60*60*1000){
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
        var sliceNum = 0
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
     * 新增用户
     */
    $("#usercount").click(function(){
        showFlag = true;
        drowUserGeneralSituation(showFlag,0)
    })
    /**
     * 每日登录
     */
    $("#downloadingcount").click(function(){
        showFlag = false;
        drowUserGeneralSituation(showFlag,0)
    })

    $scope.changShowTime = function(tiemtype){
        drowUserGeneralSituation(showFlag,tiemtype)
    };

    /**
     *   用户概况
     */
    function drowUserGeneralSituation(showtype,timetype){
        var legendData=getSituationLegendData();
        var legendSelected=getSituationLegendSelected();
        var xAxisData=getXAxisData(timetype);
        var seriesDatas=getSituationSeries(showtype,timetype);
        debugger;
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

    getPublicData();
    getNewAppendUser();
    drowUserGeneralSituation(true,0);

});


