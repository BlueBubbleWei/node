//主页面
app.controller('questionAnalysisController', function ($rootScope,$scope,$compile,$location,$timeout) {
    /**
     * Created by sdergt on 2017/1/9.
     */
//be浏览器-->productId:12;//iBan-->productId:13;//进度计划->productId:23;// bw（集成应用）-->productId:29;// mc(驾驶舱) productId:11;//移动应用//BV pad-->productId:27;//BV 手机版-->productId:28;
    var productNav = {
        '浏览器':{"productId":12},
        '驾驶舱':{"productId":11},
        '集成应用':{"productId":29},
        '移动应用':{"productId":28},
        '移动应用(Pad)':{"productId":27},
        '进度计划':{"productId":23}
        //'iBan':{"productId":13},
    };
    var productId;
    var option;
    var shapeArr = [];//legend 数组
    var  flag = '';

    var pageStart=1;
    var postQueryLBUserParam={"lineage": 150,"page": 1,"role": 0,"username": ""};
    var coid = "";//table列表第一条数据
    var versitionText,typeId,deployType;//版本号，问题类型，部署，类型
    var myChart = echarts.init(document.getElementById('analysissShape'));//创建问题分析的形状
    var proListParams;
    var currentPage = 0;
    var ajaxParams ={};//下载地址
    ajaxParams.downFile = {};//下载文件接口
    ajaxParams.queryProblemDetail ={};//查询问题详情
    ajaxParams.queryList = {};//查询问题列表
    ajaxParams.queryProblemNub = {};//查询数量
    ajaxParams.queryType = {};//查询类型
    ajaxParams.queryVersions = {}//查询版本
    $scope.clickCharacterType = false;
    $scope.cancelFilter = false;//取消筛选条件
    $scope.quesAllTime ='全部时间段';
    $scope.quesAllType ='全部问题类型';
    $scope.quesAllDeploy ='全部部署类型';
    $scope.quesAllVersition ='全部版本';
    $scope.isCancelFilter = false;
    ajaxParams.downFile.downParms ={fileId:"58379b9ea84ae629615b268a"};
    ajaxParams.queryProblemDetail.detailParams ={id:'5837985fa84ae629615b267b'};
    //if(!productId){
    //    productId = 12;
    //}else{
    //    productId = productId;
    //}
    if(!coid){
        coid = "5837985fa84ae629615b267b";
    }else{
        coid = coid;
    }
    var postLChartParam={"beginTime": 0,"endTime": 0,"queryType": ["ALL","CLOUD","ENTERPRISE"]};
    productId = !productId?12:productId;

    typeId = !typeId?-1:typeId;
    deployType =!deployType?'all':deployType;
    versitionText =!versitionText?'all':versitionText;
    ajaxParams.queryList.listParams = {//
        productId:productId,
        type:typeId,
        deployment:deployType,
        version:versitionText,
        page:1,
        pageSize:15,
        sortVersion:0,
        sortFeedbacktime:0,
        startTime:postLChartParam.beginTime,
        endTime: postLChartParam.endTime
    };
    var TimeBucket=[{"id": "", "name": "全部时间段","desc":""},{"id": "", "name": "近一月","desc":""}, {"id": "", "name": "近一季","desc":""},{"id":'',"name":'自定义','desc':""} ];

    proListParams = ajaxParams.queryList.listParams.productId+"/"+ajaxParams.queryList.listParams.type+"/"+ajaxParams.queryList.listParams.deployment+"/"+ajaxParams.queryList.listParams.version+'/'+ajaxParams.queryList.listParams.page+"/"+ajaxParams.queryList.listParams.pageSize+"/"+ajaxParams.queryList.listParams.sortVersion+"/"+ajaxParams.queryList.listParams.sortFeedbacktime+"/"+ajaxParams.queryList.listParams.startTime+"/"+ajaxParams.queryList.listParams.endTime;

    ajaxParams.queryProblemNub.nubParams = {productId:28};
    ajaxParams.queryType.typeParams = {productId:28};
    ajaxParams.queryVersions.versitionParams = {productId:28};
    ajaxParams.downFile.downDownUrl = "http://"+dbPort+"/rest/feedback/problem/attach/"+ajaxParams.downFile.downParms.fileId;
    ajaxParams.queryProblemDetail.detailUrl = "http://"+dbPort+"/rest/feedback/problem/detail"/*+ajaxParams.queryProblemDetail.detailParams.id*/;
    ajaxParams.queryList.queryListUrl = "http://"+dbPort+"/rest/feedback/problem/list/"/*+ajaxParams.queryList.listParams.productId+"/"+ajaxParams.queryList.listParams.type+"/"+ajaxParams.queryList.listParams.deployment+"/"+ajaxParams.queryList.listParams.version+'/'+ajaxParams.queryList.listParams.page+"/"+ajaxParams.queryList.listParams.pageSize+"/"+ajaxParams.queryList.listParams.sortVersion+"/"+ajaxParams.queryList.listParams.sortFeedbacktime+"/"+ajaxParams.queryList.listParams.startTime+"/"+ajaxParams.queryList.listParams.endTime*/;
    ajaxParams.queryProblemNub.nubUrl = 'http://'+dbPort+"/rest/feedback/problem/statistics/";
    ajaxParams.queryType.typeUrl = 'http://'+dbPort+"/rest/feedback/problem/type/"+ajaxParams.queryType.typeParams.productId;
    ajaxParams.queryVersions.versitonsUrl = 'http://'+dbPort+"/rest/feedback/problem/versions/"+ajaxParams.queryVersions.versitionParams.productId;
    function productTopNav(obj){//产品导航条
        var li = '';
        for(var key in obj){//产品导航

            li += "<li index="+obj[key].productId+">"
                +"<p >"+key+"</p>"
                +"<span class='line-style'></span>"
                +"</li>";
        }
        $('.analysis-Nav-list').append(li);
    }
    function startStroke(obj){
        obj.on('click','li',function(){
            productId = $(this).attr('index');
            ajaxParams.queryList.listParams.productId = productId;
            proListParams = ajaxParams.queryList.listParams.productId+"/"+ajaxParams.queryList.listParams.type+"/"+ajaxParams.queryList.listParams.deployment+"/"+ajaxParams.queryList.listParams.version+'/'+ajaxParams.queryList.listParams.page+"/"+ajaxParams.queryList.listParams.pageSize+"/"+ajaxParams.queryList.listParams.sortVersion+"/"+ajaxParams.queryList.listParams.sortFeedbacktime+"/"+ajaxParams.queryList.listParams.startTime+"/"+ajaxParams.queryList.listParams.endTime
            getAjax(ajaxParams.queryProblemNub.nubUrl+"/"+productId,null,ajaxParams.queryProblemNub.nubSuccess,ajaxParams.queryProblemNub.nubError,true);
            getAjax(ajaxParams.queryList.queryListUrl+proListParams,null,ajaxParams.queryList.listSuccess,ajaxParams.queryList.listError,true);
        });
        return ajaxParams.queryProblemNub.nubParams.productId;
    }
    startStroke($('.analysis-Nav-list'))
    function echartShape(data){
        var shapeData = [];
        var  colorArr = [];
        for(var i= 0;i<data.length;i++){
            var shapeObj = {};
            shapeArr.push(data[i].type);
            shapeObj.value = data[i].count;
            shapeObj.name = data[i].type;
            shapeData.push(shapeObj);
        }
        option = {
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b}: {c} ({d}%)",
                textStyle: {
                    fontSize: '12',
                    fontFamily:'Microsoft Yahei'
                }
            },
            legend: {
                orient: 'horizontal',
                x: 'center',
                bottom:5,

                formatter: function (name) {
                    return echarts.format.truncateText(name, 150, '14px Microsoft Yahei', '…');
                },
                data:shapeArr

            },
            series: [
                {
                    name:'访问来源',
                    type:'pie',
                    radius: ['50%', '70%'],
                    center:['50%','50%'],
                    avoidLabelOverlap: false,
                    label: {
                        normal: {
                            show: false,
                            position: 'center'
                        },
                        emphasis: {
                            show: true,
                            textStyle: {
                                fontSize: '30',
                                fontWeight: 'bold',
                                fontFamily:'Microsoft Yahei'
                            }
                        }
                    },
                    labelLine: {
                        normal: {
                            show: false
                        }
                    },
                    data:shapeData
                }
            ]
        };
        myChart.setOption(option);
    }
    //创建详情页面
    productTopNav(productNav);


//ajaxParams.downFile.downSuccess = function(data){
//    data = JSON.eval(data);
//    console.info(data)
//};
//ajaxParams.downFile.downError = function(error){
//    data = JSON.parse(data);
//    console.info(error)
//};
//getAjax(ajaxParams.downFile.downDownUrl,null,ajaxParams.downFile.downSuccess,ajaxParams.downFile.downError,true);


    ajaxParams.queryList.listSuccess = function(data){
        var queryProData = JSON.parse(data);
        $('.analysis-table table tbody').find('tr').remove();
        var tr = "";
        var dataList = {};
        if(!coid){
            coid = queryProData.list[0].id;
        }else{
            coid = coid;
        }
        for(var i = 0;i<queryProData.list.length;i++){
            dataList = queryProData.list[i];
                tr +='<tr eleId = '+dataList.id+'>'
                    +'<td>'+dataList.type+'</td>'
                    +'<td>'+dataList.content+'</td>'
                    +'<td>'+dataList.version+'</td>'
                    +'<td>'+dataList.feedbackTime+'</td>'
                    +'</tr>'

        }
        var  searchHtml = '<div class="searchPage">'
                            +'<span class="page-sum">第'
                                +'<strong class="everyPage">'+(currentPage+1)+'</strong>页'
                            +'</span> '
                            + '<span class="page-sum">共'
                                + '<strong class="allPage">'+Math.ceil(queryProData.count/15)+'</strong>页'
                            +'</span>'
                            + '<span class="countPage">共'
                                + '<strong >'+queryProData.count+'</strong>条'
                            +'</span>'
                            +'  <span class="page-go">跳转'
                                + '<input type="text" onchange="dumpText(event)" >页'
                            +'</span> '
                            +'<a href="javascript:;" class="page-btn pageOk">确定'
                            +'</a> </div>';
        $('.pages').find('.searchPage').remove();
        $('.pages').append(searchHtml);
        $('.analysis-table table tbody').append(tr);
        $('.analysis-table table tr:odd').css({'background':'#f5f5f5'});
        $('.analysis-table .content-table').on('click','tr',function(){
           coid =$(this).attr('eleId');
            getAjax(ajaxParams.queryProblemDetail.detailUrl+"/"+coid,null,ajaxParams.queryProblemDetail.detailSuccess,ajaxParams.queryProblemDetail.detailsError,true);
            new detailPage({
                data:{
                    title:{
                        value:'问题详情',
                        align_x:'left',
                        align_y:'left'
                    },
                    content:[
                        {id:0, type:'inputKey',descript:'密码:'},
                        {id:1, type:'inputKey',descript:'重复密码:'}
                    ],
                    //endButton:[
                    //    {value:'取消',BGC:'white',FC:'#1A1A1A',type:'close'},
                    //    {value:'确定',BGC:'black',FC:'white',type:'func'}
                    //],
                    size:{
                        width:780,height:601
                    }
                }
            });
        });
        var  totalCount = Math.ceil(queryProData.count/15);

        $("#Pagination").pagination(totalCount,{
                num_edge_entries: 2,
                num_display_entries: 4,
                current_page:0,//当前选中的第几页
                prev_text: "上一页",
                next_text: "下一页",
                callback: callbackFun, //回调函数
                current_page:currentPage
        });//调用分页器;
        function dumpText(event){//跳转的val值
            console.info( $('.page-go input').val())
        }

    };

    function callbackFun(index){
        if(!index ){
            index = 0;
        };
        currentPage = index;
        ajaxParams.queryList.listParams.page = index+1;
        console.info(index)
        proListParams = ajaxParams.queryList.listParams.productId+"/"+ajaxParams.queryList.listParams.type+"/"+ajaxParams.queryList.listParams.deployment+"/"+ajaxParams.queryList.listParams.version+'/'+ajaxParams.queryList.listParams.page+"/"+ajaxParams.queryList.listParams.pageSize+"/"+ajaxParams.queryList.listParams.sortVersion+"/"+ajaxParams.queryList.listParams.sortFeedbacktime+"/"+ajaxParams.queryList.listParams.startTime+"/"+ajaxParams.queryList.listParams.endTime;
        getAjax(ajaxParams.queryList.queryListUrl+proListParams,null,ajaxParams.queryList.listSuccess,ajaxParams.queryList.listError,true);
    }
    function isCancel(){
        $('.analysis-filter').click(function(){
            $timeout(function(){
                $scope.cancelFilter = !$scope.cancelFilter;
            })
        })
    }
    function templateInputList(data){//生成全部为题类型
        var  inputList = '';
        for(var i= 0;i<data.length;i++){
            if(typeof data[i] ==='string'){
                inputList += "<p >&nbsp;&nbsp;"+data[i]+"</p>";
            }else{
                inputList += "<p typeId = "+data[i].typeId+">&nbsp;&nbsp;"+data[i].typeName+"</p>";
            }
        }
        return inputList;
    }
    function listOperate(entrustElement){//替换复选框内容
        entrustElement.on('click','p',function(){
            entrustElement.children('p').text($(this).text());
        });
    }
    function hideInput(eventElement,hideElement){//离开、单机复选框调用的元素
        eventElement.mouseenter(function(){
            $(this).children('p').css('color','#aa1019');
            $(this).css('border-color','#aa1019');
            $(this).find(hideElement).css({'border':'1px solid #aa1019'});
            $(this).find('p').css({'color':'#aa1019'});

        });
        eventElement.click(function(){
            $(this).find(hideElement).show();
            $(this).find('.triangle').css({'transform':'rotate(-44deg)','border-color':'#aa1019','margin-right':'10px'});
        });
        eventElement.mouseleave(function(){
            $(this).find('p').css('color','');
            $(this).css('border-color','');
            $(this).find(hideElement).hide();
            $(this).find(hideElement).css({'border':'1px solid transparent'});
            $(this).find('p').css({'color':'#1a1a1a'});
            $(this).find('.triangle').css({'transform':'rotate(-224deg)','border-color':'','margin-right':'15px'});
        });
    }
    function getTypeId(){
        $('#quesAllType .anlaysis-inputWap').find('p').not('.input-content').click(function(){
            typeId = $(this).attr('typeid');
            return typeId;
        });

    }
    function getVersitionCon(){
        $('#quesAllVersition .anlaysis-inputWap').not('.input-content').find('p').click(function(){
            versitionText = $(this).text();
            versitionText = versitionText.trim();
            if(versitionText=='全部版本'){
                versitionText = 'all';
            }
            return versitionText;
        });

    }
    function getEnterprise(){
        $('#quesAllDeploy .anlaysis-inputWap').not('.input-content').find('p').click(function(){
            deployType = $(this).attr('type');
            return deployType;
        })
    }
    //生成自定义日历插件
    function initCaldar(obj){
        var dateRange = new pickerDateRange(obj, {
            isTodayValid : true,
            startDate : '2013-04-14',
            endDate : '2013-04-21',
            defaultText : ' 至 ',
            inputTrigger : 'input_trigger_demo3',
            theme : 'ta',
            success : function(obj) {
                //自定义的回调函数 callback();
                console.info(obj.startDate,obj.endData)
            }
        });
    }
    //function createCaldar(){
    //    var createcaldarHtml = '<div id="create-date">'
    //                                +'<span id="date"></span>'
    //                                +'<a id="input_trigger_date" href="#"> <i></i> </a>'
    //                           '+ </div>'
    //                            +'<div id="datePicker"></div>';
    //    if($('#create-date').length==0){
    //       $('.analysis-table').append(createcaldarHtml) ;
    //    }
    //
    //}
    function customTime(startTime,endTime){//获取自定义时间
        var startTimes,endTimes;
        var timesStr = {};
        startTimes=new Date(startTime);//自定义
        endTimes = new Date(endTime);
        startTimes = timesStr.beginTime =  new Date(startTimes.getFullYear(),startTimes.getMonth(),startTimes.getDate(),23,59,59,999);
        endTimes = timesStr.endTime =  new Date(endTimes.getFullYear(),endTimes.getMonth(),endTimes.getDate(),0,0,0,0);
        timesStr.beginTime = endTimes.getTime();
        timesStr.endTime = startTimes.getTime();
        return timesStr;
    }
    getEnterprise();
    //createCaldar($('.LBSelectList:last'));
    initCaldar('create-date');
    $scope.filterStatus = function(){
        var startTimeArr = [];
        var startandend = $("#create-date").text();
        startTimeArr = startandend.split('/');
        if(startandend.length>0){
            var times = customTime(startTimeArr[0],startTimeArr[1]);
            console.info(times)
            postLChartParam.beginTime = times.beginTime;
            postLChartParam.endTime = times.endTime;
        }
        if($('#quesAllType').children('p' ).length){
            $('#quesAllType').children('p').attr('typeId',typeId)
        }
        ajaxParams.queryList.listParams.version =  versitionText = !versitionText?'all':versitionText;
        ajaxParams.queryList.listParams.type = typeId = !typeId?'-1':typeId;
        ajaxParams.queryList.listParams.deployment = deployType =!deployType?'all':deployType;
        ajaxParams.queryList.listParams.startTime = postLChartParam.beginTime;
        ajaxParams.queryList.listParams.endTime = postLChartParam.endTime;
        proListParams = ajaxParams.queryList.listParams.productId+"/"+ajaxParams.queryList.listParams.type+"/"+ajaxParams.queryList.listParams.deployment+"/"+ajaxParams.queryList.listParams.version+'/'+ajaxParams.queryList.listParams.page+"/"+ajaxParams.queryList.listParams.pageSize+"/"+ajaxParams.queryList.listParams.sortVersion+"/"+ajaxParams.queryList.listParams.sortFeedbacktime+"/"+ajaxParams.queryList.listParams.startTime+"/"+ajaxParams.queryList.listParams.endTime;
        getAjax(ajaxParams.queryList.queryListUrl+proListParams,null,ajaxParams.queryList.listSuccess,ajaxParams.queryList.listError,true);
        //console.info('问题列表展示',versitionText,typeId,deployType,postLChartParam.beginTime,postLChartParam.endTime);
    };
    var filterArray = ['全部时间段',"全部问题类型",'全部部署类型','全部版本'];
    function cancelFileterIf (){//取消筛选  参数归零
        $scope.cancelFilter = false;
        $('.filterProject').map(function(i,val){
            $(this).find('.input-content').html("&nbsp;&nbsp"+filterArray[i]+"");
            if( $(this).find('.input-content').attr('typeid')){
                $(this).find('.input-content').attr('typeid',-1);
            }
        });
        versitionText = 'all';
        typeId = '-1';
        deployType = 'all';
        postLChartParam.beginTime = 0;
        postLChartParam.endTime = 0;
        ajaxParams.queryList.listParams.type = typeId;
        ajaxParams.queryList.listParams.version = versitionText;
        ajaxParams.queryList.listParams.deployment = deployType;
        ajaxParams.queryList.listParams.startTime =  postLChartParam.beginTime;
        ajaxParams.queryList.listParams.endTime = postLChartParam.endTime;
        proListParams = ajaxParams.queryList.listParams.productId+"/"+ajaxParams.queryList.listParams.type+"/"+ajaxParams.queryList.listParams.deployment+"/"+ajaxParams.queryList.listParams.version+'/'+ajaxParams.queryList.listParams.page+"/"+ajaxParams.queryList.listParams.pageSize+"/"+ajaxParams.queryList.listParams.sortVersion+"/"+ajaxParams.queryList.listParams.sortFeedbacktime+"/"+ajaxParams.queryList.listParams.startTime+"/"+ajaxParams.queryList.listParams.endTime;
        getAjax(ajaxParams.queryList.queryListUrl+proListParams,null,ajaxParams.queryList.listSuccess,ajaxParams.queryList.listError,true);
        console.info(ajaxParams.queryList.listParams)
    };
    isCancel();
    listOperate($('#quesAllType'));
    listOperate($('#quesAllDeploy'));
    listOperate($('#quesAllVersition'));

    hideInput($('#quesAllType'),'.anlaysis-inputWap');
    hideInput($('#quesAllDeploy'),'.anlaysis-inputWap');
    hideInput($('#quesAllVersition'),'.anlaysis-inputWap');
    $('.ques-cancel').bind('click',function(){//清除筛选
        cancelFileterIf ();
    });
    //日期控件(复选框)-----------------------------------------------------------------------------------//

    var newDate=new Date();
    var lastMonth=(new Date(newDate.getFullYear(),newDate.getMonth()-1,newDate.getDate(),0,0,0,0)).getTime();
    var todayDateStr=newDate.getTime();
    //设置时间选择控件
    var setTimeBucket=function () {
        var newDate=new Date();//当前时间
        var startTime;//起始时间凌晨
        var timeStr;
        var today=newDate.toLocaleDateString();//当前时间中文格式
        startTime=new Date(newDate.getFullYear(),newDate.getMonth()-1,newDate.getDate(),0,0,0,0);//近一月
        timeStr=startTime.getTime();//近一月时间戳
        var oldTime=startTime.toLocaleDateString();
        TimeBucket[1].id=timeStr;
        TimeBucket[1].desc=oldTime+'-'+today;

        startTime=new Date(newDate.getFullYear(),newDate.getMonth()-3,newDate.getDate(),0,0,0,0);//近一季
        timeStr=startTime.getTime();//近一季时间戳
        oldTime=startTime.toLocaleDateString();
        TimeBucket[2].id=timeStr;
        TimeBucket[2].desc=oldTime+'-'+today;

        startTime=new Date(2010,newDate.getMonth(),newDate.getDate(),0,0,0,0);//全部
        timeStr=startTime.getTime();//全部时间戳
        oldTime=startTime.toLocaleDateString();
        //console.info('开始时间',timeStr,'结束时间'+oldTime);
        TimeBucket[0].id=timeStr;
        TimeBucket[0].desc=oldTime+'-'+today;

       //startTime=new Date();//自定义
       // timeStr=startTime.getTime();//全部时间戳
       // oldTime=startTime.toLocaleDateString();
        //console.info('开始时间',timeStr,'结束时间'+oldTime);
        //TimeBucket[3].id=timeStr;
        //TimeBucket[3].desc=oldTime+'-'+today;
    };
    setTimeBucket();
    //$('.LBSelectList').on('click','span',function(){
    //    alert(1);
    //})
    var clickFun=function (flag) {
        ClickLCTimeBucket=flag;
        postLChartParam.beginTime=parseInt(ClickLCTimeBucket);
        postLChartParam.endTime=todayDateStr;
        //console.info('开始时间结束时间的时间戳',postLChartParam)
    };
    new LBSelect({container: $("#quesAllTime"), dataJson:JSON.stringify(TimeBucket),clickBack:clickFun,allowInput:false });
    //日期控件-----------------------------------------------------------------------------------//
    getAjax(ajaxParams.queryList.queryListUrl+proListParams,null,ajaxParams.queryList.listSuccess,ajaxParams.queryList.listError,true);
//queryProblemDeatail

    ajaxParams.queryProblemDetail.detailSuccess = function(data){
        var queryProData = JSON.parse(data);
        console.info('查询问题详情列表',queryProData)
    };
    getAjax(ajaxParams.queryProblemDetail.detailUrl+"/"+coid,null,ajaxParams.queryProblemDetail.detailSuccess,ajaxParams.queryProblemDetail.detailsError,true);
//------------------------------------查询问题数量-----------------------------------------
    ajaxParams.queryProblemNub.nubSuccess = function(data){
        data = JSON.parse(data);
        option = echartShape(data.result);
        //console.info('查询数量接口数据',data)
    };
    ajaxParams.queryProblemNub.nubError = function(data){
        data = JSON.parse(data);
        //console.info('查询数量错误提示',data)
    };
    getAjax(ajaxParams.queryProblemNub.nubUrl+"/"+productId,null,ajaxParams.queryProblemNub.nubSuccess,ajaxParams.queryProblemNub.nubError,true);
//--------------------------------查询问题类型--------------------------------------------
    ajaxParams.queryType.typeSuccess = function(data){
        data = JSON.parse(data);
        templateInputList(data.result);
        $('.analysis-inputs #quesAllType').append('<div class="anlaysis-inputWap">'+templateInputList(data.result)+'</div>');
        typeId = getTypeId();


    };
    ajaxParams.queryType.typeError = function(data){
        data = JSON.parse(data);
    };
    getAjax(ajaxParams.queryType.typeUrl,null,ajaxParams.queryType.typeSuccess,ajaxParams.queryType.typeError,true);
//------------------------------------版本查询
    ajaxParams.queryVersions.versionsSuccess = function(data){
        data = JSON.parse(data);
        //console.info('查询版本',data)
        templateInputList(data.result);
        $('.analysis-inputs #quesAllVersition').append('<div class="anlaysis-inputWap">'+templateInputList(data.result)+'</div>');
        versitionText = getVersitionCon();

    };
    ajaxParams.queryVersions.versionsError = function(data){
        data = JSON.parse(data);
    };
    getAjax(ajaxParams.queryVersions.versitonsUrl,null,ajaxParams.queryVersions.versionsSuccess,ajaxParams.queryVersions.versionsError,true);
    window.onresize = function(){
        myChart.resize();
    }

});