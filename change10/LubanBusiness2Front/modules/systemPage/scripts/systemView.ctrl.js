//主页面
app.controller('systemViewController', function ($scope,$compile,$location,$timeout,commonService) {
    $scope.psd=true;
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
    $scope.switchTypeUser=function () {
        angular.element('#usercount').addClass("switch-left-down");
        angular.element('#downloadingcount').removeClass("switch-left-down");
        angular.element('#downloadingcount').addClass('switch-left-up');
        // $($event.target).addClass("checked");
    };
    $scope.switchTypeloading=function () {
        angular.element('#downloadingcount').addClass("switch-left-down");
        angular.element('#usercount').removeClass("switch-left-down");
        angular.element('#usercount').addClass('switch-left-up');
    };
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
        console.log(yestoday.getFullYear());
        yestoday.setFullYear(yestoday.getFullYear()-3);
        changeDate(yestoday);
        return yestody
    }
    /*var onejiago=changeji(yestoday);
     var oneyearago=changeoneyear(yestoday);
     var threeyearago=change3years(yestoday);*/
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
    var pids= base64Encode(arry);//转换字符串

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
        return sorted
    }
    commonService.dailylonline({timestamp:timestamp,pids:pids}).then(function(res){
        //每日登陆
        var productId;
        var val;
        $scope.averageList=res.data;
        // console.log( $scope.averageList)
        $scope.averageList=sortId($scope.averageList);
        // console.log( $scope.averageList);
        for (var i=0;i<$scope.averageList.length;i++){
            $scope.catalogy.push({productId:res.data[i].productId,val:res.data[i].average});
        }
        commonService.dailyonlinemax({dailymax:dailymax}).then(function(res){
            //每日最高登陆人数
            var productId;
            var val;
            $scope.dailymaxList=res.data;
            $scope.dailymaxList=sortId($scope.dailymaxList);

            commonService.countdowning().then(function(res){
            //累计装机量
                if(res.data.length!=0){
                    $scope.downloadsnum=res.data;
                    $scope.downloadsnum=sortId($scope.downloadsnum);
                }
                commonService.countuser().then(function(res) {
                    //累计访问人数
                    if(res.data.length!=0){
                        $scope.usernum=res.data;
                        $scope.usernum=sortId($scope.usernum);
                    }
                    commonService.producturl().then(function(res){
                        var usersum,downloadsum,avergesum,maxsum;
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
                            var average;
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
                            function unix2normal(date) {
                                var date = new Date(date);
                                Y = date.getFullYear() + '.';
                                M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '.';
                                D = date.getDate() + ' ';
                                date=Y+M+D;
                                return date;
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
                                        // console.log($scope.usernum[i])
                                        for(var k=0;k<$scope.usernum[i].data.length;k++){
                                            ans+=$scope.usernum[i].data[k].inc;
                                            /*var n=($scope.usernum[i].data[k+1].date-$scope.usernum[i].data[k].date)/864000;
                                            switch (n){
                                                case 1:
                                                    sum+=$scope.usernum[i].data[k+1].inc;
                                            }*/
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
                                    var downloads=0;
                                    var ans=0;
                                    if($scope.downloadsnum[i].productId == $scope.product[j].productId){
                                        // console.log($scope.usernum[i])
                                        for(var k=0;k<$scope.downloadsnum[i].data.length;k++){
                                            ans+=$scope.downloadsnum[i].data[k].inc;
                                            /*var n=($scope.usernum[i].data[k+1].date-$scope.usernum[i].data[k].date)/864000;
                                             switch (n){
                                             case 1:
                                             sum+=$scope.usernum[i].data[k+1].inc;
                                             }*/
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
                                    var productName;
                                    var productId;
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
                        // console.log($scope.product+'product');
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
                        /*$scope.psdTotal=JSON.stringify($scope.psdTotal);
                        console.log($scope.psdTotal)*/
                        var html1=" <tr><th >总计</th><th>"+$scope.allTotal.usersum+"</th><th >"+$scope.allTotal.downloadsum+"</th><th>"+$scope.allTotal.avergesum+"</th><th>"+$scope.allTotal.maxsum+"</th></tr>"
                        angular.element(document.getElementById('addthead')).append(html1);
                        var html2= "<tr ng-init='psd=true' ng-click='psd=!psd' id='psd'><th ><img src='systemPage/images/arrow_down.png' class='arrow_down'><span>"+$scope.psdsum.groupName+
                        "</span></th><th >"+$scope.psdsum.usersum+"</th><th >"+$scope.psdsum.downloadsum+"</th><th>"+$scope.psdsum.avergesum+"</th><th >"+$scope.psdsum.maxsum+"</th></tr>";
                        // angular.element(document.getElementById('addtbody')).append(html2);

                        for(var i=0;i<$scope.psdTotal.length;i++){
                            html2+="<tr ng-show="+$scope.psd+"><td>"+$scope.psdTotal[i].productName+"</td><td>"+$scope.psdTotal[i].user+"</td><td>"+$scope.psdTotal[i].downloads+"</td><td>"
                                +$scope.psdTotal[i].average+"</td><td><span>"+$scope.psdTotal[i].max+"</span><p class='enddate'>"+$scope.psdTotal[i].date+"</p></td></tr>"
                        }
                        // angular.element(document.getElementById('addtbody')).append(html2);
                        html2+= "<tr ng-click='pdsctrl()' id='cal'><th ><img src='systemPage/images/arrow_down.png' class='arrow_down'><span>"+$scope.calsum.groupName+
                            "</span></th><th >"+$scope.calsum.usersum+"</th><th >"+$scope.calsum.downloadsum+"</th><th>"+$scope.calsum.avergesum+"</th><th >"+$scope.calsum.maxsum+"</th></tr>";
                        for(var i=0;i<$scope.calTotal.length;i++){
                            html2+="<tr ng-show='psd'><td>"+$scope.calTotal[i].productName+"</td><td>"+$scope.calTotal[i].user+"</td><td>"+$scope.calTotal[i].downloads+"</td><td>"
                                +$scope.calTotal[i].average+"</td><td><span>"+$scope.calTotal[i].max+"</span><p class='enddate'>"+$scope.calTotal[i].date+"</p></td></tr>"
                        }

                        // angular.element(document.getElementById('addtbody')).append(html2);
                        html2+= "<tr ng-click='pdsctrl()' id='other'><th ><img src='systemPage/images/arrow_down.png' class='arrow_down'><span>"+$scope.othersum.groupName+
                            "</span></th><th >"+$scope.othersum.usersum+"</th><th >"+$scope.othersum.downloadsum+"</th><th>"+$scope.othersum.avergesum+"</th><th >"+$scope.othersum.maxsum+"</th></tr>";

                        for(var i=0;i<$scope.otherTotal.length;i++){
                            html2+="<tr ng-show='psd'><td>"+$scope.otherTotal[i].productName+"</td><td>"+$scope.otherTotal[i].user+"</td><td>"+$scope.otherTotal[i].downloads+"</td><td>"
                                +$scope.otherTotal[i].average+"</td><td><span>"+$scope.otherTotal[i].max+"</span><p class='enddate'>"+$scope.otherTotal[i].date+"</p></td></tr>"
                        }
                        angular.element(document.getElementById('addtbody')).append($complie(html2)($scope));
                    })
                });


            });

        })
    })
});