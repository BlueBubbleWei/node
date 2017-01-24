//主页面
app.controller('funAnalysisController', function ($scope,$compile,$location,commonService) {
    var a = '58379b9ea84ae629615b268a';
    var currentProduct;
    var allTimeList = []; //2010/01/01至今的时间轴
    var allTimeUnixList = []; //2010/01/01至今的unix时间轴
    var timeSpan; //2010/01/01至今的时间跨度
    var time = Date.parse(unix2normal(new Date()));
    var lastTime = Date.parse("2010/01/01");
    var functionList = []; //已补全的数据List
    var nameList = [];//图表展示所需的namelist
    var initSelect={};//设置初始隐藏
    var waveChart;
    $scope.flag={};
    var option= {
                // color:colorlist,
                legend: {
                    // selected:initSelect,
                    itemWidth:30,
                    bottom:'0',
                    icom:'roundRect',
                    data:nameList
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
                    data: allTimeList
                },
                yAxis: {
                    type: 'value',
                    scale: true,
                    // boundaryGap: [0.01, 0.01],
                    splitArea: { show: false }
                },
                dataZoom : {
                    show : true,
                    start : 0,
                    end : 100,
                    y:400
                },
                series: functionList
    };
        /**
     * [getTimeSpan 获取当前时间跨度]
     * @return {[type]} [description]
     */
    function getTimeSpan(time,lastTime){
       return parseInt(time-lastTime)/86400000; //2010-01-01至今的天数跨度
    }
    timeSpan = getTimeSpan(time,lastTime);

    //获取产品名称及productId
    commonService.producturl().then(function(data){
        $scope.productNav = data.result.resultList[1].groupList;
        currentProduct = $scope.productNav[0];
        //默认获取productNav第一个的functionList
        $scope.changeProductId(currentProduct);
    });

    //获取功能列表,默认是productNav的第一个(根据functionName及productId)
    $scope.changeProductId = function(item){
        currentProduct = item;
        var param = {};
        param.functionName = '';
        param.productId = item.productId;
        commonService.functionList(param).then(function(data){
            $scope.functionList = data.result.functionInfoList.splice(0,6);
        });
    }

     //获取每个功能详情图表
    $scope.functionDetail = function(item){
        $scope.flag.detailShow = true;
        var param = {};
        functionList=[]; //初始化functionList图表数据
        nameList = [];   //初始化namelist图表数据
        initSelect = {}; //初始化initSelect的图表数据
        param.functionName = item;
        param.productId = currentProduct.productId;
        commonService.functionDetail(param).then(function(data){
            console.log('success');
            //截取前九个版本
            var functionDetailListTemp = data.result.detailList.splice(0,9);
            //补全2010-01-01之后的数据
            completionTime(functionDetailListTemp)
         
            //获取当前图表展示所需要的namelist
            angular.forEach(functionList,function(value,key){
                var unit = {}
                unit.name = value.name;
                unit.icon = 'roundRect';
                nameList.push(unit);
                initSelect[value.name] = false;
                if(key == functionList.length-1){
                    initSelect[value.name] = true;
                }
            })
            //指定渲染eharts需要的数据
            option.legend.data = nameList;
            option.legend.selected = initSelect;
            option.xAxis.data = allTimeList;
            option.series = functionList;
           
            waveChart = echarts.init(document.getElementById('waveChart'));
            waveChart.setOption(option);
        });
    }

    /**
     * [completionTime 补全2010-01-01之后的数据]
     * @param  {[type]} functionDetailListTemp [description]
     * @return {[type]}                        [description]
     */
    function  completionTime (functionDetailListTemp){
       angular.forEach(functionDetailListTemp,function(value,key){
            var functionListTemp = {
                name:'',
                type:'line',
                symbol:'circle',
                symbolSize:8,
                sampling:'average',
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
                data:[]
            };
            functionListTemp.name = value.serverVersion;
            for(var i=0;i<allTimeUnixList.length;i++){
                var timesListUnit = {
                    times:'',
                    date:''
                };
                angular.forEach(value.timesList,function(value1,key1){
                    if(value1.date != allTimeUnixList[i]){
                        timesListUnit.times = 0;
                        timesListUnit.date=allTimeUnixList[i];
                    } else {
                        timesListUnit.times=value1.times;
                        timesListUnit.date=value1.date;
                    }
                })
                functionListTemp.data.push(timesListUnit.times);
            }
            functionList.push(functionListTemp);
        })
    }

    //将当前的unix时间戳改为当前时间eg:“2010-01-01”
    function unix2normal(date) {
        var date = new Date(date);
        Y = date.getFullYear() + '/';
        M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '/';
        D = date.getDate() + ' ';
        date=Y+M+D;
        return date;
    }
   
    //拼接总体时间轴
    for(var i=0;i<timeSpan;i++){
        var unit = unix2normal(lastTime + i*86400000);
        var unixUnit = lastTime + i*86400000;
        allTimeList.push(unit);
        allTimeUnixList.push(unixUnit);
        // console.log(allTimeList);
    }

    $scope.diffSection = function(diffSection){
        nameList = [];   //初始化namelist图表数据
        var lastTime;
        switch (diffSection) {
            case 'lastMonth':
            lastTime=changeMonth(new Date());
            break;
            case 'lastSeason':
            lastTime=changeSeason(new Date());
            break;
            case 'changeYear':
            lastTime= changeYear(new Date());
            break;
            case 'lastThreeYear':
            lastTime= change3Years(new Date());
            break;
            case 'all':
            option.xAxis.data = allTimeList;
            option.series = functionList;
            waveChart.setOption(option);
            return;
            break;
        }
        var lastTimeSpan = getTimeSpan(time,lastTime)//获取当前时间到上个月的时间跨度
        var lastTimeList = allTimeList.slice(-lastTimeSpan) //获取最近一月的时间轴
        var lastFuntionList = _.cloneDeep(functionList); //获取最近一个月的数据
        angular.forEach(lastFuntionList,function(value,key){
            value.data = value.data.slice(-lastTimeSpan) // splice返回被删除的元素，slice返回被选定的元素
        });
        //获取当前图表展示所需要的namelist
        angular.forEach(functionList,function(value,key){
            var unit = {}
            unit.name = value.name;
            unit.icon = 'roundRect';
            nameList.push(unit);
        })
        //重新设置echartoption
        option.legend.data = nameList;
        option.xAxis.data = lastTimeList;
        option.series = lastFuntionList;
        waveChart.setOption(option);
        console.log(lastMonthFuntionList,'lastMonthFuntionList')
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
    function changeMonth(day) {
        // 时间为近一个月的0:0:0的unix timestamp
        day.setMonth(day.getMonth()-1);
        day=changeDate(day);
        return day;
    }
    function changeSeason(day) {
        // 时间为近一个季的0:0:0的unix timestamp
        day.setMonth(day.getMonth()-3);
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

    //排序
    $scope.asByTimes = function(){
        var unit = _.sortBy($scope.functionList, function(item) {
            return -item.useTimes;
        });
        $scope.functionList = unit;
    }
    $scope.deByTimes = function(){
        var unit = _.sortBy($scope.functionList, function(item) {
            return item.useTimes;
        });
        $scope.functionList = unit;
    }
    //置顶置底功能 2 置顶 1无状态 0置底
    $scope.setTop = function (item) {
        commonService.functionStatus ({"functionName":item, "productId": currentProduct.productId ,"setOrCancel":"set","topOrBottom":"top"}).then(function(res) {
            $scope.changeProductId(currentProduct);
        })
    }
    $scope.setBottom = function (item) {
        commonService.functionStatus ({"functionName":item, "productId": currentProduct.productId ,"setOrCancel":"set","topOrBottom":"bottom"}).then(function(res) {
            $scope.changeProductId(currentProduct);
        })
    }
    $scope.cancelTop = function(item){
        commonService.functionStatus ({"functionName":item, "productId": currentProduct.productId ,"setOrCancel":"cancel","topOrBottom":"top"}).then(function(res) {
            $scope.changeProductId(currentProduct);
        })
    }

    $scope.cancelBottom = function(item){
        commonService.functionStatus ({"functionName":item, "productId": currentProduct.productId ,"setOrCancel":"cancel","topOrBottom":"bottom"}).then(function(res) {
            $scope.changeProductId(currentProduct);
        })
    }

    //关闭功能详情图表
    $scope.closeFunctionDetail = function(){
        $scope.flag.detailShow = false; 
    }
});