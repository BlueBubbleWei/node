//主页面
app.controller('systemViewController', function ($scope,$compile,$location,$timeout) {
    $scope.psd=true;
    $scope.cal=true;
    $scope.other=true;
    /*显示隐藏*/
    $scope.pdsctrl = function(){
        $scope.psd = !$scope.psd;
    }
    $scope.calctrl=function () {
        $scope.cal = !$scope.cal;
    }
    $scope.otherctrl=function () {
        $scope.other = !$scope.other;
    }
    $scope.switchTypeUser=function () {
        angular.element('#usercount').addClass("switch-left-down");
        angular.element('#downloadingcount').removeClass("switch-left-down");
        angular.element('#downloadingcount').addClass('switch-left-up');
    }

    $scope.switchTypeloading=function () {
        angular.element('#downloadingcount').addClass("switch-left-down");
        angular.element('#usercount').removeClass("switch-left-down");
        angular.element('#usercount').addClass('switch-left-up');
    }
    /*画图2*/
    var waveChart = echarts.init(document.getElementById('waveChart'));
    var base = +new Date(2011, 9, 3);
    var oneDay = 24 * 3600 * 1000;
    var date = [];

    var data = [Math.random() * 1000];
    var data1 = [Math.random() * 1500];
    var data2 = [Math.random() * 1400];
    var data3 = [Math.random() * 1200];
    var data4 = [Math.random() * 1000];

    for (var i = 1; i < 1800; i++) {
        var now = new Date(base += oneDay);
        date.push([now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'));
        data.push(Math.round((Math.random() - 0.5) * 20 + data[i - 1]));
        data1.push(Math.round((Math.random() - 0.5) * 20 + data1[i - 1]));
        data2.push(Math.round((Math.random() - 0.5) * 20 + data2[i - 1]));
        data3.push(Math.round((Math.random() - 0.5) * 20 + data3[i - 1]));
        data4.push(Math.round((Math.random() - 0.5) * 20 + data4[i - 1]));
    }
    option= {
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
            left: '0%',
            right: '4%',
            bottom: '15%',
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
            data: date
        },
        yAxis: {
            type: 'value',
            scale: true,
            // boundaryGap: [0.01, 0.01],
            splitArea: { show: false },
            min:450,
            max:1600
        },
        dataZoom: [{
            type: 'inside',
            start: 0,
            end: 10
        }, {
            start: 0,
            end: 10,
            handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
            handleSize: '80%',
            handleStyle: {
                color: '#fff',
                shadowBlur: 3,
                shadowColor: 'rgba(0, 0, 0, 0.6)',
                shadowOffsetX: 2,
                shadowOffsetY: 2
            }
        }],
        series: [
            {//PDS
                name:'模拟数据',
                type:'line',
                smooth:true,
                symbol: 'none',
                symbolSize:8,
                sampling: 'average',
                itemStyle: {
                    normal: {
                        color: 'rgb(255, 70, 131)'
                    }
                },
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
                data: data
            },
            {
                name:'模拟数据',
                type:'line',
                smooth:true,
                symbol: 'none',
                sampling: 'average',
                itemStyle: {
                    normal: {
                        color: 'rgb(0, 0, 0)'
                    }
                },
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
                data: data1
            },
            {
                name:'模拟数据',
                type:'line',
                smooth:true,
                symbol: 'none',
                sampling: 'average',
                itemStyle: {
                    normal: {
                        color: '#989898'
                    }
                },
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
                data: data2
            },
            {
                name:'模拟数据',
                type:'line',
                smooth:true,
                symbol: 'none',
                sampling: 'average',
                itemStyle: {
                    normal: {
                        color: '#c03f18'
                    }
                },
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
                data: data3
            },
            {
                name:'模拟数据',
                type:'line',
                smooth:true,
                symbol: 'none',
                sampling: 'average',
                itemStyle: {
                    normal: {
                        color: '#88929a'
                    }
                },
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
                data: data4
            },
        ],
    };
    waveChart.setOption(option);

    function getError() {
        // Toast('getError',1000,null);
    }
    function changeDate(yestody) {
        // 时间为前一天的0:0:0的unix timestamp
        yestoday.setDate(yestoday.getDate()-1);
        yestoday.setHours(0);
        yestoday.setMinutes(0);
        yestoday.setSeconds(0);
        yestoday.setMilliseconds(0);
        return yestody
    }
    function changeMonth(yestody) {
        // 时间为近一个月的0:0:0的unix timestamp
        yestoday.setMonth(yestoday.getMonth()-1);
        changeDate(yestoday);
        return yestody
    }
    function changeji(yestody) {
        // 时间为近一个季的0:0:0的unix timestamp
        yestoday.setMonth(yestoday.getMonth()-3);
        changeDate(yestoday);
        return yestody
    }
    function changeoneyear(yestody) {
        // 时间为近一年的0:0:0的unix timestamp
        yestoday.setFullYear(yestoday.getFullYear()-1);
        changeDate(yestoday);
        return yestody
    }
    function change3years(yestody) {
        // 时间为近一年的0:0:0的unix timestamp
        console.log(yestoday.getFullYear())
        yestoday.setFullYear(yestoday.getFullYear()-3);
        changeDate(yestoday);
        return yestody
    }
    function base64Encode(input) {
    //productID是数组的形式，并且经过base64编码
        var rv;
        rv = encodeURIComponent(input);
        rv = unescape(rv);
        rv = window.btoa(rv);
        return rv;
    }
    /*产品列表*/
    var producturl="http://"+dbPort+"/rest/enterprise/list/queryClientIdList";
   $scope.productList=[];
    getAjax(producturl,null,getproduct, getError,true);
    function getproduct(res) {
        res=JSON.parse(res);
        if(res.result.length!=0){
            var temp;
            $scope.productList=res.result.resultList;
            temp= $scope.productList[0];
            $scope.productList[0]=$scope.productList[1];
            $scope.productList[1]=temp;
            for(var i=0;i<$scope.productList.length;i++){
                if(i==0){
                    $scope.productList[i].groupName="PDS总体";
                    if($scope.productList[i].groupList.length!=0){
                        for(var j=0;j< $scope.productList[i].groupList.length;j++){
                            if($scope.productList[i].groupList[j].productId==12){
                                $scope.productList[i].groupList[j].productName="浏览器";
                            }else if($scope.productList[i].groupList[j].productId==11){
                                $scope.productList[i].groupList[j].productName="驾驶舱";
                            }else if($scope.productList[i].groupList[j].productId==29){
                                $scope.productList[i].groupList[j].productName="集成应用";
                            }else if($scope.productList[i].groupList[j].productId==23){
                                $scope.productList[i].groupList[j].productName="进度计划";
                            }else if($scope.productList[i].groupList[j].productId==27){
                                $scope.productList[i].groupList[j].productName="移动应用";
                            }else if($scope.productList[i].groupList[j].productId==13){
                                $scope.productList[i].groupList[j].productName="iBan";
                            }else if($scope.productList[i].groupList[j].productId==33){
                                $scope.productList[i].groupList[j].productName="协作"
                            }else if($scope.productList[i].groupList[j].productId==28){
                                $scope.productList[i].groupList[j].productName="移动应用pad"
                            }
                        }
                    }
                }else if(i==1){
                    $scope.productList[i].groupName="算量总体";
                    if($scope.productList[i].groupList.length!=0){
                        for(var j=0;j< $scope.productList[i].groupList.length;j++){
                            if($scope.productList[i].groupList[j].productId==3){
                                $scope.productList[i].groupList[j].productName="土建";
                            }else if($scope.productList[i].groupList[j].productId==2){
                                $scope.productList[i].groupList[j].productName="钢筋";
                            }else if($scope.productList[i].groupList[j].productId==5){
                                $scope.productList[i].groupList[j].productName="安装";
                            }
                        }
                    }
                }else if(i==2){
                    $scope.productList[i].groupName="其他";
                    if($scope.productList[i].groupList.length!=0){
                        for(var j=0;j< $scope.productList[i].groupList.length;j++){
                            if($scope.productList[i].groupList[j].productId==30){
                                $scope.productList[i].groupList[j].productName="班筑";
                            }
                        }
                    }
                }
            }

        }
       bindMsg($scope.productList);
    }
   function bindMsg(string) {
       $timeout(function(){
           $scope.list = string;
       });
       console.log( $scope.productList)
    };
    bindMsg();
    $scope.name = [1,2,3,4,4,5];
    /*日均登陆人数*/
    /*var onejiago=changeji(yestoday);
     var oneyearago=changeoneyear(yestoday);
     var threeyearago=change3years(yestoday);*/
    var yestoday= new Date();
    yestoday=changeDate(yestoday);
    var timestamp = Date.parse(yestoday);
    var arry=[2,11,29,23,27,13,33,28,3,2,5,30];//所需产品ID
    var pids= base64Encode(arry);//转换字符串
    var dailylog="http://"+dbPort+"/rest/analysis/loginlog/daily/user/average/"+timestamp+"/"+pids;
    getAjax(dailylog,null,getSuccess, getError,true);
    $scope.catalogy=[];
   function  getSuccess(res) {
       res=JSON.parse(res);
    }
    /*单日在线最高人数*/
    var dailymax='2,11,29,23,27,13,33,28,3,2,5,30';
    dailymax= base64Encode(dailymax);
    var dailyonlinemax="http://"+dbPort+"/rest/analysis/loginlog/daily/user/max/"+"/"+dailymax;
    getAjax(dailyonlinemax,null,getmax, getError,true);
    function getmax(res) {
        res=JSON.parse(res);
        for(i=0;i<$scope.productList.length;i++){

        }
    }
    /*累计装机量*/
    var countdowning="http://"+dbPort+"/rest/analysis/loginlog/daily/client/inclement";
    getAjax(countdowning,null,getdowning, getError,true);
    function getdowning(res) {
        res=JSON.parse(res);
       // console.log(res.data)
    }
    /*累计用户*/
    var countuser="http://"+dbPort+"/rest/analysis/loginlog/daily/user/inclement";
    getAjax(countuser,null,getuser, getError,true);
    function getuser(res) {
        res=JSON.parse(res);
        // console.log(res.data)
    }});