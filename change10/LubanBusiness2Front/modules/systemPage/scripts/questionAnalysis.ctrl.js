//主页面
app.controller('questionAnalysisController', function ($rootScope,$scope,$compile,$location,$timeout) {
    /**
     * Created by sdergt on 2017/1/9.
     */
//be浏览器-->productId:12;
//iBan-->productId:13;
//进度计划->productId:23;
// bw（集成应用）-->productId:29;
// mc(驾驶舱) productId:11;
//移动应用
//BV pad-->productId:27;
//BV 手机版-->productId:28;
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

    ajaxParams.downFile.downParms ={fileId:"58379b9ea84ae629615b268a"};
    ajaxParams.queryProblemDetail.detailParams ={id:'5837985fa84ae629615b267b'};
    if(!productId){
        productId = 12;
    }else{
        productId = productId;
    }
    if(!coid){
        coid = "5837985fa84ae629615b267b";
    }else{
        coid = coid;
    }
    ajaxParams.queryList.listParams = {//
        productId:productId,
        type:-1,
        deployment:"all",
        version:"all",
        page:1,
        pageSize:15,
        sortVersion:0,
        sortFeedbacktime:0,
        startTime:0,
        endTime:0
    };
    var proListParams = ajaxParams.queryList.listParams.productId+"/"+ajaxParams.queryList.listParams.type+"/"+ajaxParams.queryList.listParams.deployment+"/"+ajaxParams.queryList.listParams.version+'/'+ajaxParams.queryList.listParams.page+"/"+ajaxParams.queryList.listParams.pageSize+"/"+ajaxParams.queryList.listParams.sortVersion+"/"+ajaxParams.queryList.listParams.sortFeedbacktime+"/"+ajaxParams.queryList.listParams.startTime+"/"+ajaxParams.queryList.listParams.endTime;

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
        //console.info(queryProData,'queryProData')
        $('.analysis-table table tbody').find('tr').remove();
        var tr = "";
        var dataList = [];
        if(!coid){
            coid = queryProData.list[0].id;
        }else{
            coid = coid;
        }
        //debugger;
        for(var i = 0;i<data.length;i++){
            dataList = queryProData.list[i];
            for(var key in dataList){
                tr +='<tr eleId = '+queryProData.list[i].id+'>'
                    +'<td>'+dataList.type+'</td>'
                    +'<td>'+dataList.content+'</td>'
                    +'<td>'+dataList.version+'</td>'
                    +'<td>'+dataList.feedbackTime+'</td>'
                    +'</tr>'
            }
        }

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
        })

    };
    function isCancel(){
        $('.analysis-filter').click(function(){
            $timeout(function(){
                $scope.cancelFilter = !$scope.cancelFilter;
            })
        })
    }
    function templateInputList(data){//生成全部为题类型
        //console.info('121313',data)
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
            console.info(typeId)
            return typeId;
        });

    }
    function getVersitionCon(){
        $('#quesAllVersition .anlaysis-inputWap').not('.input-content').find('p').click(function(){
            versitionText = $(this).text();
            versitionText = versitionText.trim();
            return versitionText;
        });

    }
    function getEnterprise(){
        $('#quesAllDeploy .anlaysis-inputWap').not('.input-content').find('p').click(function(){
            deployType = $(this).attr('type');
            return deployType;
        })
    }
    getEnterprise();
    $scope.filterStatus = function(){
        if($('#quesAllType').children('p').length){
            $('#quesAllType').children('p').attr('typeId',typeId)
        }
        console.info('版本信息',versitionText,typeId,deployType)
    }
    isCancel();
    listOperate($('#quesAllType'));
    listOperate($('#quesAllDeploy'));
    listOperate($('#quesAllVersition'));

    hideInput($('#quesAllType'),'.anlaysis-inputWap');
    hideInput($('#quesAllDeploy'),'.anlaysis-inputWap');
    hideInput($('#quesAllVersition'),'.anlaysis-inputWap');
    //日期控件(复选框)-----------------------------------------------------------------------------------//
    var TimeBucket=[{"id": "", "name": "全部时间段","desc":""},{"id": "", "name": "近一月","desc":""}, {"id": "", "name": "近一季","desc":""},{"id":'',"name":'自定义','desc':""} ];
    var postLChartParam={"beginTime": 0,"endTime": 0,"queryType": ["ALL","CLOUD","ENTERPRISE"]};
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
        TimeBucket[0].id=timeStr;
        TimeBucket[0].desc=oldTime+'-'+today;
    };
    setTimeBucket();
    var clickFun=function (flag) {
        ClickLCTimeBucket=flag;
        postLChartParam.beginTime=parseInt(ClickLCTimeBucket);
        postLChartParam.endTime=todayDateStr;
    };
    new LBSelect({container: $("#quesAllTime"), dataJson:JSON.stringify(TimeBucket),clickBack:clickFun,allowInput:false });
    //日期控件-----------------------------------------------------------------------------------//
    //分页器-------------------------------------------------------------------------------------//

    //------------------------------
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