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
    var currentPage = 0;//当前页
    var firstCoid = '';//第一条数据的coid
    var popupBox = '';//生成弹框样式
    var ajaxParams ={};//下载地址
    var isSortTop = 1;//排序-->升序
    var isSortBot = 1;//排序-->降序
    var sortVersionStatus;//升序降序的状态
    $scope.isCopyStatus = false;
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
    var postLChartParam={"beginTime": 0,"endTime": 0,"queryType": ["ALL","CLOUD","ENTERPRISE"]};
    productId = !productId?12:productId;

    typeId = !typeId?-1:typeId;//问题类型
    deployType =!deployType?'all':deployType;//部署信息
    versitionText =!versitionText?'all':versitionText;//版本信息
    sortVersionStatus = !sortVersionStatus?0:sortVersionStatus;//排序状态
    ajaxParams.queryList.listParams = {//
        productId:productId,
        type:typeId,
        deployment:deployType,
        version:versitionText,
        page:1,
        pageSize:15,
        sortVersion:sortVersionStatus,
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

            li += "<li  index="+obj[key].productId+">"
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
        firstCoid = queryProData.list[0].id;
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
                                + '<strong class="allPage">'+Math.ceil(queryProData.pageInfo.sum/15)+'</strong>页'
                            +'</span>'
                            + '<span class="countPage">共'
                                + '<strong >'+queryProData.pageInfo.sum+'</strong>条'
                            +'</span>'
                            +'  <span class="page-go">跳转'
                                + '<input type="text"  >页'
                            +'</span> '
                            +'<a href="javascript:;" class="page-btn pageOk">确定'
                            +'</a> </div>';
        $('.pages').find('.searchPage').remove();
        $('.pages').append(searchHtml);
        $('.analysis-table table tbody').append(tr);
        $('.analysis-table table tr:odd').css({'background':'#f5f5f5'});
        $('.analysis-table .content-table').on('click','tr',function(){

            coid =$(this).attr('eleId');//获取详情id

            isPopupShow($('.ques-analysis-popup'));

            getAjax(ajaxParams.queryProblemDetail.detailUrl+"/"+coid,null,ajaxParams.queryProblemDetail.detailSuccess,ajaxParams.queryProblemDetail.detailsError,true);
        });
        var  totalCount = Math.ceil(queryProData.pageInfo.sum/15);
        //var prev = '<';
        //var next = ">"
        $("#Pagination").pagination(totalCount,{
                num_edge_entries: 2,
                num_display_entries: 4,
                prev_text: '<',
                next_text: '>',
                callback: callbackFun, //回调函数
                current_page:currentPage,
        });//调用分页器;
    };

    function callbackFun(index){
        if(!index ){
            index = 0;
        };
        console.info('index',index)
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
    function customTime(startTime,endTime){//获取自定义时间
        var startTimes,endTimes;
        var timesStr = {};
        startTimes=new Date(startTime);//自定义
        endTimes = new Date(endTime);
        startTimes = timesStr.beginTime =  new Date(startTimes.getFullYear(),startTimes.getMonth(),startTimes.getDate(),0,0,0,0);
        endTimes = timesStr.endTime =  new Date(endTimes.getFullYear(),endTimes.getMonth(),endTimes.getDate(),0,0,0,0);
        timesStr.beginTime =startTimes .getTime();
        timesStr.endTime = endTimes.getTime();
        return timesStr;
    }
    getEnterprise();
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
    function creatPopup(data){//生成弹窗
        $('.ques-analysis-popup').remove();
        $('.ques-maskbg').remove();
            var popupMsg = '';
            //var img = '';
            var li = '';
            var isNullData;
            var pictureArr = data.result.attachs;
        for(var i = 0;i<pictureArr.length;i++){
            console.info()
            //img += '<img src="http:'+'//'+dbPort+'/rest/feedback/problem/attach/'+pictureArr[i].fileId+'"/>';/*fileName*/
            li +=  '<li><a href="http:'+'//'+dbPort+'/rest/feedback/problem/attach/'+pictureArr[i].fileId+'"><img src="http:'+'//'+dbPort+'/rest/feedback/problem/attach/'+pictureArr[i].fileId+'" /></a></li>'

        }
        function isNull(data){
            if(data.result.type==null||data.result.type=='' ){
                data.result.type='--'
            }
            if(data.result.deployment==null||data.result.deployment=='' ){
                data.result.deployment='--'
            }
            if(data.result.version == null || data.result.version==''){
                data.result.version='--'
            }
            if(data.result.feedbackTime == null || data.result.feedbackTime==''){
                data.result.feedbackTime='--'
            }
            if(data.result.contact == null || data.result.contact==''){
                data.result.contact='--'
            }
            if(data.result.contactInfo == null || data.result.contactInfo==''){
                data.result.contactInfo='--'
            }
            if(data.result.feedbackTime == null || data.result.feedbackTime==''){
                data.result.feedbackTime='--'
            }
            return data;
        }

        isNullData = isNull(data);
        $('.ques-analysis-popup').remove();
            for( var key in isNullData.result){


                popupMsg = '<div class="ques-analysis-popup"><div class="ques-popup-con">'
                                    +'<div class="ques-title">'
                                      +'<div class="popup-tips">已复制到剪切板</div>'
                                         +'<p class="ques-title-icon">'
                                             +'<span class="bombBoxIcon bombBoxIcon-2"></span>'
                                             +'<span>问题详情</span>'
                                         +'</p>'
                                         +'<p class="ques-close">'
                                             +'<span class="close-x"></span>'
                                             +'<span class="close-y"></span>'
                                         +'</p>'
                                     +'</div>'

                                    +'<div class="ques-content">'
                                        +'<div class="desc">'
                                            +'<p><span class="font-bold">问题类型</span><b>&nbsp;:&nbsp;</b><span class="gary">'+isNullData.result.type+'</span>'
                                            +'</p>'
                                            +'<p><span class="font-bold">部署类型</span><b>&nbsp;:&nbsp;</b><span class="gary substr question-deployment">'+isNullData.result.deployment+'</span>'
                                            +'</p>'
                                        +'</div>'
                                        +'<div  class="desc">'
                                            +'<p><span class="font-bold">应用版本</span><b>&nbsp;:&nbsp;</b><span class="gary">'+isNullData.result.version+'</span>'
                                            +'</p>'
                                            +'<p><span class="font-bold">反馈时间</span><b>&nbsp;:&nbsp;</b><span class="gary">'+isNullData.result.feedbackTime+'</span>'
                                            +'</p>'
                                        +'</div>'
                                        +'<div  class="desc">'
                                            +'<p><span class="font-bold">用户名</span><b>&nbsp;:&nbsp;</b><span class="gary">'+isNullData.result.contact+'</span>'
                                            +'</p>'
                                            +'<p><span class="font-bold">联系方式</span><b>&nbsp;:&nbsp;</b><span class="gary">'+isNullData.result.contactInfo+'</span>'
                                            +'</p>'
                                        +'</div>'
                                        +'<div class="ques-content-company">'
                                            +'<p><span class="font-bold">隶属企业</span><b>&nbsp;:&nbsp;</b><span class="gary substr companyInfo" title="'+isNullData.result.enterprise+'">'+isNullData.result.enterprise+'</span>'
                                            +'</p>'
                                        +'</div>'
                                        +'<div class="ques-content-company" style="margin-bottom:30px;">'
                                            +'<p><div class="float-l desc-textarea"><span class="font-bold">问题详情</span><b>&nbsp;:&nbsp;</b></div> <span class="gary isCopy">'+data.result.content+'</span></p>'
                                        +'</div>'
                                        +'<div class="question-swiper ">'
                                           /* +'<img src="../common/images/mobile.png" alt="">'*/
                                        +'<div class="container overflow">'
                                            +'<ul class="gallery">'
                                                +li
                                            +'</ul>'
                                        +'</div>'

                                        +'</div>'
                                    +'</div>'
                                    +'<div class="ques-copy overflow" >'
                                        +'<div class="overflow btns-style clone-btn" style="">'
                                             +'<button type="button" class="copy-btns">复制问题详情</button>'
                                       +'</div>'

                                    +'</div>'

                                +'</div>'

                          + '</div>'
                      + '<div class="ques-maskbg"></div>';
            }
        $('.question-analysis').append(popupMsg);
        $(".zoom, .gallery li a").on("click", u);
        ////---------弹出框内容复制
        $('.copy-btns').zclip({
            copy: function(){
                $('.popup-tips').animate({'opacity':1})
                $timeout(function(){
                    $('.popup-tips').animate({'opacity':0},1000)
                },3500)

                    return $('.isCopy').text();
            }
        });

    }

    function u(u) {
        function c() {
            function h(e) {
                e.show();
                n.removeClass("loading")
            }
            var t = $(this),
                r = parseInt(n.css("borderLeftWidth")),
                i = s - r * 2,
                u = o - r * 2,
                a = t.width(),
                f = t.height();
            if (a == n.width() && a <= i && f == n.height() && f <= u) {
                h(t);
                return
            }
            if (a > i || f > u) {
                var l = u < f ? u : f,

                    c = i < a ? i : a;
                console.info(l);
                if (l / f <= c / a) {
                    t.width(a * l / f);
                    t.height(l)
                } else {
                    t.width(c);
                    t.height(f * c / a)
                }
            }
            n.animate({
                width: t.width(),
                height: t.height(),
                marginTop: -(t.height() / 2) - r,
                marginLeft: -(t.width() / 2) - r
            }, 10, function() {
                h(t)
            })
        }
        if (u) u.preventDefault();
        var a = $(this),
            f = a.attr("href");
        if (!f) return;
        var l = $(new Image).hide();
        $("#zoom .previous, #zoom .next").show();
        if (a.hasClass("zoom")) $("#zoom .previous, #zoom .next").hide();
        if (!r) {
            r = true;
            t.show();
            $("body").addClass("zoomed")
        }
        n.html(l).stop().addClass("loading");
        l.load(c).attr("src", f);
        i = a
    }
    function a() {
        var t = i.parent("li").prev();
        if (t.length == 0) t = $(".gallery li:last-child");
        t.find("a").trigger("click")
    }
    function f() {
        var t = i.parent("li").next();
        if (t.length == 0) t = $(".gallery li:first-child");
        t.children("a").trigger("click")
    }
    function l(s) {
        if (s) s.preventDefault();
        r = false;
        i = null;
        t.hide();
        $("body").removeClass("zoomed");
        n.empty()
    }
    function c() {
        s = $(window).width();
        o = $(window).height()
    }
    $("body").append('<div id="zoom" ><a class="close"></a><a href="#previous" class="previous"></a><a href="#next" class="next"></a><div style="width:864px;height:663px;background:#fff;margin:45px auto;position:relative"><div class="content loading" ></div></div></div>');
    var t = $("#zoom").hide(),
        n = $("#zoom .content"),
        r = false,
        i = null,
        s = $(window).width(),
        o = $(window).height();
    (function() {
        t.on("click", function(t) {
            t.preventDefault();
            if ($(t.target).attr("id") == "zoom") l()
        });
        $("#zoom .close").on("click", l);
        $("#zoom .previous").on("click", a);
        $("#zoom .next").on("click", f);
        $(document).keydown(function(e) {
            if (!i) return;
            if (e.which == 38 || e.which == 40) e.preventDefault();
            if (e.which == 27) l();
            if (e.which == 37 && !i.hasClass("zoom")) a();
            if (e.which == 39 && !i.hasClass("zoom")) f()
        });
        if ($(".gallery li a").length == 1) $(".gallery li a")[0].addClass("zoom");
        $(".zoom, .gallery li a").on("click", u)
    })();
    function isPopupShow(showObj){//点击每一条数据显示详情弹窗
        showObj.show();
    }
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
    //----------------关闭弹出框
    $('.question-analysis').on('click','.ques-close',function(){
      $('.ques-analysis-popup').hide();
        $('.ques-maskbg').hide();
    })
    //升序降序
    var  isSortFinishedTop = false;
    var  isSortFinishedBot = false;
    $('.question-analysis .fixed-table .sort-left').on('click',function(){
        isSortTop++;
        //debugger;
            if( isSortTop%2==0 ||isSortFinishedTop){//首次点击或者点击状态为真
                $(this).css({'background-position-y':'-12px'}).siblings().css({'background-position-y':'0px'});
                isSortFinishedTop =false;
                if(isSortBot%2==0){//判断降序 第一次点击不自增
                    isSortBot+=1;
                }
            //    重新排列数据
                sortVersionStatus = 1;
                ajaxParams.queryList.listParams.sortVersion = sortVersionStatus;
                proListParams = ajaxParams.queryList.listParams.productId+"/"+ajaxParams.queryList.listParams.type+"/"+ajaxParams.queryList.listParams.deployment+"/"+ajaxParams.queryList.listParams.version+'/'+ajaxParams.queryList.listParams.page+"/"+ajaxParams.queryList.listParams.pageSize+"/"+ajaxParams.queryList.listParams.sortVersion+"/"+ajaxParams.queryList.listParams.sortFeedbacktime+"/"+ajaxParams.queryList.listParams.startTime+"/"+ajaxParams.queryList.listParams.endTime;
                getAjax(ajaxParams.queryList.queryListUrl+proListParams,null,ajaxParams.queryList.listSuccess,ajaxParams.queryList.listError,true);
            }
            else if(isSortTop%2!=0 ||!isSortFinishedTop){
                $(this).css({'background-position-y':'0'});
                isSortFinishedTop = true;

                sortVersionStatus = 0;
                ajaxParams.queryList.listParams.sortVersion = sortVersionStatus;
                proListParams = ajaxParams.queryList.listParams.productId+"/"+ajaxParams.queryList.listParams.type+"/"+ajaxParams.queryList.listParams.deployment+"/"+ajaxParams.queryList.listParams.version+'/'+ajaxParams.queryList.listParams.page+"/"+ajaxParams.queryList.listParams.pageSize+"/"+ajaxParams.queryList.listParams.sortVersion+"/"+ajaxParams.queryList.listParams.sortFeedbacktime+"/"+ajaxParams.queryList.listParams.startTime+"/"+ajaxParams.queryList.listParams.endTime;
                getAjax(ajaxParams.queryList.queryListUrl+proListParams,null,ajaxParams.queryList.listSuccess,ajaxParams.queryList.listError,true);
            }
    });

    $('.question-analysis .fixed-table .sort-right').on('click',function(){
        isSortBot++;
        if( isSortBot%2==0 ||isSortFinishedBot){//首次点击或者点击状态为真
            $(this).css({'background-position-y':'-24px'}).siblings().css({'background-position-y':'0'});
            isSortFinishedBot =false;
            if(isSortTop%2==0){//判断升序 第一次点击不自增
                isSortTop+=1;
            }
            //    重新排列数据
            sortVersionStatus = 2;
            ajaxParams.queryList.listParams.sortVersion = sortVersionStatus;
            proListParams = ajaxParams.queryList.listParams.productId+"/"+ajaxParams.queryList.listParams.type+"/"+ajaxParams.queryList.listParams.deployment+"/"+ajaxParams.queryList.listParams.version+'/'+ajaxParams.queryList.listParams.page+"/"+ajaxParams.queryList.listParams.pageSize+"/"+ajaxParams.queryList.listParams.sortVersion+"/"+ajaxParams.queryList.listParams.sortFeedbacktime+"/"+ajaxParams.queryList.listParams.startTime+"/"+ajaxParams.queryList.listParams.endTime;
            getAjax(ajaxParams.queryList.queryListUrl+proListParams,null,ajaxParams.queryList.listSuccess,ajaxParams.queryList.listError,true);
        } else if(isSortBot%2!=0 ||!isSortFinishedBot){
            $(this).css({'background-position-y':'0'});
            isSortFinishedBot = true;
            //    重新排列数据
            sortVersionStatus = 0;
            ajaxParams.queryList.listParams.sortVersion = sortVersionStatus;
            proListParams = ajaxParams.queryList.listParams.productId+"/"+ajaxParams.queryList.listParams.type+"/"+ajaxParams.queryList.listParams.deployment+"/"+ajaxParams.queryList.listParams.version+'/'+ajaxParams.queryList.listParams.page+"/"+ajaxParams.queryList.listParams.pageSize+"/"+ajaxParams.queryList.listParams.sortVersion+"/"+ajaxParams.queryList.listParams.sortFeedbacktime+"/"+ajaxParams.queryList.listParams.startTime+"/"+ajaxParams.queryList.listParams.endTime;
            getAjax(ajaxParams.queryList.queryListUrl+proListParams,null,ajaxParams.queryList.listSuccess,ajaxParams.queryList.listError,true);
        }
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
        console.info('请求数据',queryProData)
       creatPopup(queryProData);

        //console.info('查询问题详情列表',queryProData)
    };

    //getAjax(ajaxParams.queryProblemDetail.detailUrl+"/"+coid,null,ajaxParams.queryProblemDetail.detailSuccess,ajaxParams.queryProblemDetail.detailsError,true);
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
