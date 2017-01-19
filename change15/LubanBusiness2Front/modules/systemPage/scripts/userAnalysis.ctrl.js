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
    var yestoday=changeDate(current);
    var timestamp = Date.parse(yestoday);
    var arry=[2,11,29,23,27,13,33,28,3,2,5,30];
    var pids= base64Encode(arry);
    var dailymax='2,11,29,23,27,13,33,28,3,2,5,30';
    var max,date,user,productId,val,usersum, downloadsum, avergesum, maxsum,temp,average;
    dailymax= base64Encode(dailymax);
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
        $scope.averageList=res.data;
        $scope.averageList=sortId($scope.averageList);
        for (var i=0;i<$scope.averageList.length;i++){
            $scope.catalogy.push({productId:res.data[i].productId,val:res.data[i].average});
        }
        commonService.onlineuser().then(function(res,$complie){
            //在线用户
            $scope.onlineUser=res.online;
            $scope.onlineUser=sortId($scope.onlineUser);
            commonService.todayTotal().then(function(res){
                //今日累计登录
                $scope.todayList=res.dailytimes;
                $scope.todayList=sortId($scope.todayList);
                commonService.dailyonlinemax({dailymax:dailymax}).then(function(res){
                    //每日最高登陆人数
                    $scope.dailymaxList=res.data;
                    $scope.dailymaxList=sortId($scope.dailymaxList);
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
                        console.log(oneDayago+'oneDayago')
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
                        console.log(JSON.stringify($scope.otherTotal)+'$scope.otherTotal')

                        console.log(JSON.stringify($scope.otherTotal)+'otherTotal')
                        $scope.psdsum=countotal( $scope.psdTotal);
                        $scope.calsum=countotal( $scope.calTotal);
                        console.log(JSON.stringify($scope.psdsum)+'psdsum')
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
                    });
                })

            });



            /*画图1*/
            var myChart = echarts.init(document.getElementById('userChart'));
            option = {
                /* title: {
                 text: '折线图堆叠'
                 },*/
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
                    data: ['14年09月','14年10月','14年11月','14年12月','15年01月','15年02月','15年03月','15年04月','15年05月','15年06月','15年07月','15年08月']
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
    });
    /*画图2*/
    var checkuser = echarts.init(document.getElementById('checkuser'));
    var base1 = +new Date(2011, 9, 3);
    var oneDay1 = 24 * 3600 * 1000;
    var date1 = [];
    var data7 = [Math.random() * 1000];
    var data8 = [Math.random() * 1500];
    var data9 = [Math.random() * 1400];
    var data10 = [Math.random() * 1200];
    var data11= [Math.random() * 1000];
    for (var i = 1; i < 1800; i++) {
        var now = new Date(base1 += oneDay1);
        date1.push([now.getFullYear(), now.getMonth() + 1, now.getDate()].join('/'));
        data7.push(Math.round((Math.random() - 0.5) * 20 + data7[i - 1]));
        data8.push(Math.round((Math.random() - 0.5) * 20 + data8[i - 1]));
        data9.push(Math.round((Math.random() - 0.5) * 20 + data9[i - 1]));
        data10.push(Math.round((Math.random() - 0.5) * 20 + data10[i - 1]));
        data11.push(Math.round((Math.random() - 0.5) * 20 + data11[i - 1]));
    }
    /* console.log(date)
     console.log(data)*/
    option2= {
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
            bottom: '20%',
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
            data: date1
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
            end: 16
        }, {
            start: 0,
            end: 16,
            handleIcon: 'M10.7,11.9v-1.3H9.3v1.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4v1.3h1.3v-1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7V23h6.6V24.4z M13.3,19.6H6.7v-1.4h6.6V19.6z',
            handleSize: '80%',
            handleStyle: {
                color: '#fff',
                shadowBlur: 1,
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
                symbol: 'circle',
                symbolSize:10,
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
                data: data7
            },
            {
                name:'模拟数据',
                type:'line',
                symbol: 'circle',
                symbolSize:10,
                smooth:true,
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
                data: data8
            },
            {
                name:'模拟数据',
                type:'line',
                smooth:true,
                symbol: 'circle',
                symbolSize:10,
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
                data: data9
            },
            {
                name:'模拟数据',
                type:'line',
                smooth:true,
                symbol: 'circle',
                symbolSize:10,
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
                data: data10
            },
            {
                name:'模拟数据',
                type:'line',
                smooth:true,
                symbol: 'circle',
                symbolSize:10,
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
                data: data11
            },
        ],
    };
    checkuser.setOption(option2);
});