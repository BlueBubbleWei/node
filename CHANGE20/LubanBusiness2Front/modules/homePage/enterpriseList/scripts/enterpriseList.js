

(function () {
    var getStateTL;
    if(getStateTL!="01")return;
    window.onresize=function () {
        getStateTL=getCookie('BusHomMasTLCookie');
        if(getStateTL!="01")return;
    getStateTL=getStateTL?"":"";
    };
})();

function LestController() {
    var pageStart=1;
    var pageSize=15;
    var EntListCount=0;
    var firstWatch=true,refreshTrip=false, firstChoseBox=true,applyListShow=false;
    var scope,compile;
    var ClickLCTimeBucket=0;
    var enterpriseID=0;
    var clickProvince=-1,clickCity=0,clickStatisticsScope=-1;
    var deployType='[{"id": "ENTERPRISE", "name": "企业部署"}, {"id": "CLOUD", "name": "云部署"}, {"id": "ALL", "name": "全部"}]';
    var selectCity=[];
    var selectProvince=[];
    var itemWL=[24,12,32,32,380,380,230,230];//itemWL[0]永远显示，对应listShow[]时，index需要+-1
    var itemName=['enterpriseName','zoneName','avgTime','avgHour','allHours','allTimes','serverVersion','renewTime'];
    var selectStatistics=[{"id": "0", "name": "全部时长","desc":"","BT":"","ET":""},{"id": "1", "name": "本年","desc":"","BT":"","ET":""}, {"id": "2", "name": "上年","desc":"","BT":"","ET":""}, {"id": "3", "name": "最近一年","desc":"","BT":"","ET":""},
        {"id": "4", "name": "本季","desc":"","BT":"","ET":""}, {"id": "5", "name": "上季","desc":"","BT":"","ET":""}, {"id": "6", "name": "最近一季","desc":"","BT":"","ET":""},
        {"id": "7", "name": "本月","desc":"","BT":"","ET":""}, {"id": "8", "name": "上月","desc":"","BT":"","ET":""}, {"id": "9", "name": "最近一月","desc":"","BT":"","ET":""}];
    var selectPageSize='[{"id":15,"name":15},{"id":50,"name":50},{"id":150,"name":150},{"id":200,"name":200}]';
    var selectDISTimeBucket=[{"id": "", "name": "近一月","desc":""}, {"id": "", "name": "近一季","desc":""}, {"id": "", "name": "近一年","desc":""}, {"id": "", "name": "近三年","desc":""}, {"id": "", "name": "全部","desc":""}];
    //缓存企业信息
    var cacheListUrl="http://"+dbPort+"/rest/enterprise/list/calculateAndCacheOrderedList";
    var cacheListParam={"beginTime": 0,"cityId": 0,"deployType": "","endTime": 0,"enterpriseName": "","productList": [11,12,13,23,27,29],"provinceId": 0};
    //获取周人均登录次数/时长
    var postEntAvgParam={"beginTime": 0,"endTime": 0,"productList": [11,12,13,23,27,29]};
    var postEntAvgUrl="http://"+dbPort+"/rest/enterprise/list/queryEnterpriseAvgUseInfoList";
    //获取企业信息列表
    var queryListParam={"desc": true,"orderField": "avgTime","page": 1,"pageSize": 10};
    var queryListUrl="http://"+dbPort+"/rest/enterprise/list/queryOrderedList";
    //查询企业详情页面表格数据
    var queryUseDetailParam={ "beginTime": 0, "endTime": 0, "enterpriseId": 1};
    var queryUseDetailUrl="http://"+dbPort+"/rest/enterprise/detail/queryUseDetails";
    //企业详情中周人均登录时长总时长人均次数总次数
    var queryUseFrequencyParam={"beginTime": 0,"endTime": 0,"enterpriseId": -1,"queryType": ["SUM_TIMES","SUM_DURATION","WEEK_AVG_DURATION","WEEK_AVG_TIMES"]};
    var queryUseFrequencyUrl="http://"+dbPort+"/rest/enterprise/detail/queryUseFrequency";

    //隐藏图表
    var hideCountChart=function (flag) {
        if(flag){
            $("#loginCountChart").css({ height: "0px" ,opacity:0});
            $("#loginCountChart").css('display','block');
            $('.hideIcon').velocity({ top: "729px"}, 500, "swing");
            $('.hideIcon').css({'transform':'rotate(180deg)','transformOrigin':'center'});
            $("#loginCountChart").velocity({ height: "400px",opacity:1 }, 500, "swing");
            setTimeout(function () {
                $('.navigationLeft').css('height',($('#contentPage').height()+30).toString()+"px");
            },600);
        }
        else{
            $("#loginCountChart").velocity({ height: "0px" ,opacity:0}, 500, "swing");
            $('.hideIcon').velocity({ top: "331px"}, 500, "swing");
            $('.hideIcon').css({'transform':'rotate(0deg)','transformOrigin':'center'});
            setTimeout(function () {
                $("#loginCountChart").css('display','none');
                $('.navigationLeft').css('height',($('#contentPage').height()+30).toString()+"px");
            },600);
        }
    };
    //设置企业列表中缓存时间的描述信息和ID（时间戳）
    var setSelectStatistics=function () {
        var newDate=new Date();//当前时间
        var startTime;//起始时间凌晨
        var timeStr;
        var TS=newDate.getTime();
        var today=newDate.toLocaleDateString();//当前时间中文格式

        startTime=new Date(2010,newDate.getMonth(),newDate.getDate(),0,0,0,0);//全部时长
        timeStr=startTime.getTime();
        var oldTime=startTime.toLocaleDateString();
        selectStatistics[0].BT=timeStr;
        selectStatistics[0].ET=TS;
        selectStatistics[0].desc=oldTime+'-'+today;

        startTime=new Date(newDate.getFullYear(),0,1,0,0,0,0);//本年
        timeStr=startTime.getTime();
        oldTime=startTime.toLocaleDateString();
        selectStatistics[1].BT=timeStr;
        selectStatistics[1].ET=TS;
        selectStatistics[1].desc=oldTime+'-'+today;

        startTime=new Date(newDate.getFullYear()-1,0,1,0,0,0,0);//去年
        timeStr=startTime.getTime();
        oldTime=startTime.toLocaleDateString();
        var startTimeEnd=new Date(newDate.getFullYear()-1,11,31,23,59,59,999);//去年年底
        var timeStrEnd=startTimeEnd.getTime();
        var oldTimeEnd=startTimeEnd.toLocaleDateString();
        selectStatistics[2].BT=timeStr;
        selectStatistics[2].ET=timeStrEnd;
        selectStatistics[2].desc=oldTime+'-'+oldTimeEnd;

        startTime=new Date(newDate.getFullYear()-1,newDate.getMonth(),newDate.getDate(),0,0,0,0);//近一年
        timeStr=startTime.getTime();
        oldTime=startTime.toLocaleDateString();
        selectStatistics[3].BT=timeStr;
        selectStatistics[3].ET=TS;
        selectStatistics[3].desc=oldTime+'-'+today;

        startTime=new Date(newDate.getFullYear()-1,(Math.floor(newDate.getMonth()/3))*3,1,0,0,0,0);//本季度
        timeStr=startTime.getTime();
        oldTime=startTime.toLocaleDateString();
        selectStatistics[4].BT=timeStr;
        selectStatistics[4].ET=TS;
        selectStatistics[4].desc=oldTime+'-'+today;

        startTime=new Date(newDate.getFullYear(),(Math.floor(newDate.getMonth()/3))*3-3,1,0,0,0,0);//上季度
        timeStr=startTime.getTime();
        oldTime=startTime.toLocaleDateString();
        startTimeEnd=new Date(newDate.getFullYear(),(Math.floor(newDate.getMonth()/3))*3,0,23,59,59,999);//上季度末
        timeStrEnd=startTimeEnd.getTime();
        oldTimeEnd=startTimeEnd.toLocaleDateString();
        selectStatistics[5].BT=timeStr;
        selectStatistics[5].ET=timeStrEnd;
        selectStatistics[5].desc=oldTime+'-'+oldTimeEnd;

        startTime=new Date(newDate.getFullYear(),newDate.getMonth()-3,newDate.getDate(),0,0,0,0);//近一季
        timeStr=startTime.getTime();
        oldTime=startTime.toLocaleDateString();
        selectStatistics[6].BT=timeStr;
        selectStatistics[6].ET=TS;
        selectStatistics[6].desc=oldTime+'-'+today;

        startTime=new Date(newDate.getFullYear(),newDate.getMonth(),1,0,0,0,0);//本月
        timeStr=startTime.getTime();
        oldTime=startTime.toLocaleDateString();
        selectStatistics[7].BT=timeStr;
        selectStatistics[7].ET=TS;
        selectStatistics[7].desc=oldTime+'-'+today;

        startTime=new Date(newDate.getFullYear(),newDate.getMonth()-1,1,0,0,0,0);//上月初
        timeStr=startTime.getTime();
        oldTime=startTime.toLocaleDateString();
        startTimeEnd=new Date(newDate.getFullYear(),newDate.getMonth(),0,23,59,59,999);//上月末
        timeStrEnd=startTimeEnd.getTime();
        oldTimeEnd=startTimeEnd.toLocaleDateString();
        selectStatistics[8].BT=timeStr;
        selectStatistics[8].ET=timeStrEnd;
        selectStatistics[8].desc=oldTime+'-'+oldTimeEnd;

        startTime=new Date(newDate.getFullYear(),newDate.getMonth()-1,newDate.getDate(),0,0,0,0);//近一月
        timeStr=startTime.getTime();
        oldTime=startTime.toLocaleDateString();
        selectStatistics[9].BT=timeStr;
        selectStatistics[9].ET=TS;
        selectStatistics[9].desc=oldTime+'-'+today;


    };
    //设置条形图信息查询时间的描述信息和ID（时间戳）
    var setSelectDISTimeBucket=function () {
        var newDate=new Date();//当前时间
        var startTime;//起始时间凌晨
        var timeStr;
        var today=newDate.toLocaleDateString();//当前时间中文格式

        startTime=new Date(newDate.getFullYear(),newDate.getMonth()-1,newDate.getDate(),0,0,0,0);//近一月
        timeStr=startTime.getTime();//近一月时间戳
        var oldTime=startTime.toLocaleDateString();
        selectDISTimeBucket[0].id=timeStr;
        selectDISTimeBucket[0].desc=oldTime+'-'+today;

        startTime=new Date(newDate.getFullYear(),newDate.getMonth()-3,newDate.getDate(),0,0,0,0);//近一季
        timeStr=startTime.getTime();
        oldTime=startTime.toLocaleDateString();
        selectDISTimeBucket[1].id=timeStr;
        selectDISTimeBucket[1].desc=oldTime+'-'+today;

        startTime=new Date(newDate.getFullYear()-1,newDate.getMonth(),newDate.getDate(),0,0,0,0);//近一年
        timeStr=startTime.getTime();
        oldTime=startTime.toLocaleDateString();
        selectDISTimeBucket[2].id=timeStr;
        selectDISTimeBucket[2].desc=oldTime+'-'+today;

        startTime=new Date(newDate.getFullYear()-3,newDate.getMonth(),newDate.getDate(),0,0,0,0);//近三年
        timeStr=startTime.getTime();
        oldTime=startTime.toLocaleDateString();
        selectDISTimeBucket[3].id=timeStr;
        selectDISTimeBucket[3].desc=oldTime+'-'+today;

        startTime=new Date(2010,newDate.getMonth(),newDate.getDate(),0,0,0,0);//全部
        timeStr=startTime.getTime();
        oldTime=startTime.toLocaleDateString();
        selectDISTimeBucket[4].id=timeStr;
        selectDISTimeBucket[4].desc=oldTime+'-'+today;

    };
    //设置页码
    //设置页码控件 参数：开始页；单页条数；总条数；当前控件所在DIV
    var setPagination=function (start,size,count,DOM) {
        scope.$apply(function () {
            scope.pageStart=start;
            scope.EntListCount=count;
            scope.pageSize=size;
        });

        var pageTotal=Math.ceil(count/scope.pageSize);
        //拼接页面
        var setHtml=function () {
            var tempHtml='<span style="float: right;line-height: 50px;font-size: 14px;" id="5t4h58y58j5u44i78k8jn9g6">&nbsp;&nbsp;确定</span>'
                +'<div style="float: right;line-height: 50px;font-size: 14px;width: 45px;height: 30px;border:1px solid #1A1A1A;border-radius: 4px;margin-top: 10px;">'
                +'<input style="width: 100%;height: 20px;text-align: center;display: block;margin-top: 5px;font-size: 12px;line-height: 20px;" id="5t4y5hj9kj6k3l21i4l0"/></div>'
                +'<span style="float: right;line-height: 50px;font-size: 14px;" id="y5f9y5j2kl2y2r4">&nbsp;&nbsp;尾页&nbsp;&nbsp;</span>'
                +'<div id="48t5h6k9p8q5a3z1" style="float: right;border-right:2px solid black;border-bottom:2px solid black;width:12px;height:12px;margin-top: 20px;margin-right: 5px;transform:rotate(-45deg);background:transparent;"></div>'
                +'<div style="position: relative;height: 30px;min-width: 50px;margin: 10px;max-width: 205px;overflow: hidden;float: right;"><div id="ujiojyguj7uhjy" style="width: '+34*pageTotal+'px;position: relative;height: 100%;font-size: 12px;">';
            for(var i=0;i<pageTotal;i++){
                tempHtml+='<div class="paginationItem" style="border:0px solid #1A1A1A;border-radius: 4px;width: 30px;height:100%;float: left;margin: 0 2px;'
                    +'text-align: center;line-height: 30px;font-size: 12px;">'+(i+1)+'</div>';
            }
            return tempHtml+'</div></div><div id="5t2h5j1i51o1p2nj2d25w" style="float: right;border-right:2px solid black;border-bottom:2px solid black;width:12px;height:12px;margin-top: 20px;margin-left: 5px;transform:rotate(135deg);background:transparent;"></div>'
                +'<span id="ujioppkh25r2gr5" style="float: right;line-height: 50px;font-size: 14px;">首页&nbsp;&nbsp;</span>';
        };
        var html=setHtml();
        var template=angular.element(html);
        var paginationElem=compile(template)(scope);
        $('#'+DOM+'>div').remove();
        $('#'+DOM+'>span').remove();
        angular.element(document.getElementById(DOM)).append(paginationElem);
        var clicked=pageStart;
        //调用回调事件
        var refreshPageStart=function (start) {
            pageStart=start;
            scope.$apply(function () {
                scope.pageStart=start;
            });
            queryEntInfoList(-1);
        };
        //聚焦页码
        $(".paginationItem").eq(clicked-1).css({'borderWidth':'1px','lineHeight':'28px'});
        //点击页码
        $(".paginationItem").on('click',function () {
            $(".paginationItem").css({'borderWidth':'0px','lineHeight':'30px'});
            var $this = $(this);
            $this.css({'borderWidth':'1px','lineHeight':'28px'});
            clicked=$(this).index()+1;
            if(clicked>3&&clicked<pageTotal-2)$("#ujiojyguj7uhjy").velocity({ marginLeft: '-'+(34*(clicked-3)).toString()+'px' }, 500, "swing");
            refreshPageStart(clicked);
        });
        //首页
        $('#ujioppkh25r2gr5').on('click',function () {
            clicked=1;
            $(".paginationItem").css({'borderWidth':'0px','lineHeight':'30px'});
            $(".paginationItem").eq(clicked-1).css({'borderWidth':'1px','lineHeight':'28px'});
            $("#ujiojyguj7uhjy").velocity({ marginLeft:'0px' }, 500, "swing");
            refreshPageStart(clicked);
        });
        //尾页
        $('#y5f9y5j2kl2y2r4').on('click',function () {
            clicked=pageTotal;
            $(".paginationItem").css({'borderWidth':'0px','lineHeight':'30px'});
            $(".paginationItem").eq(clicked-1).css({'borderWidth':'1px','lineHeight':'28px'});
            if(clicked>6)$("#ujiojyguj7uhjy").velocity({ marginLeft: '-'+(34*(clicked-6)).toString()+'px'  }, 500, "swing");
            refreshPageStart(clicked);
        });
        //左箭头
        $('#5t2h5j1i51o1p2nj2d25w').on('click',function () {
            if(clicked>1)clicked-=1;
            $(".paginationItem").css({'borderWidth':'0px','lineHeight':'30px'});
            $(".paginationItem").eq(clicked-1).css({'borderWidth':'1px','lineHeight':'28px'});
            if(clicked>3&&clicked<pageTotal-2)$("#ujiojyguj7uhjy").velocity({ marginLeft: '-'+(34*(clicked-4)).toString()+'px' }, 200, "swing");
            refreshPageStart(clicked);
        });
        //右箭头
        $('#48t5h6k9p8q5a3z1').on('click',function () {
            if(clicked<pageTotal)clicked+=1;
            $(".paginationItem").css({'borderWidth':'0px','lineHeight':'30px'});
            $(".paginationItem").eq(clicked-1).css({'borderWidth':'1px','lineHeight':'28px'});
            if(clicked>3&&clicked<pageTotal-2)$("#ujiojyguj7uhjy").velocity({ marginLeft: '-'+(34*(clicked-3)).toString()+'px' }, 200, "swing");
            refreshPageStart(clicked);
        });
        //确定
        $('#5t4h58y58j5u44i78k8jn9g6').on('click',function () {
            clicked=($('#5t4y5hj9kj6k3l21i4l0').val()&&$('#5t4y5hj9kj6k3l21i4l0').val()!='')?$('#5t4y5hj9kj6k3l21i4l0').val():clicked;
            clicked=clicked>pageTotal?pageTotal:clicked;
            $(".paginationItem").css({'borderWidth':'0px','lineHeight':'30px'});
            $(".paginationItem").eq(clicked-1).css({'borderWidth':'1px','lineHeight':'28px'});
            if(clicked>3&&clicked<pageTotal-2)$("#ujiojyguj7uhjy").velocity({ marginLeft: '-'+(34*(clicked-3)).toString()+'px' }, 500, "swing");
            if(clicked>=pageTotal-2)$("#ujiojyguj7uhjy").velocity({ marginLeft: '-'+(34*(pageTotal-6)).toString()+'px' }, 500, "swing");
            if(clicked<=3)$("#ujiojyguj7uhjy").velocity({ marginLeft: '0px' }, 500, "swing");
            refreshPageStart(clicked);
        });
        $('#'+DOM).hover(function () {
            $('#'+DOM).css('cursor','pointer');
        });
    };
    //设置缓存参数productList
    var checkedProduct=function () {
        if(scope.itemShow){
            var proList=[];
            var switchProduct=function (index) {
              //var  productId=0;
                switch (index){
                    case 1:return 12;break;
                    case 2:return 11;break;
                    case 3:return 29;break;
                    case 4:return 13;break;
                    case 5:return 23;break;
                    case 6:return 27;break;
                    default:return 0;break;
                }
            };
            scope.itemShow.forEach(function (flag,i) {
                if(flag&&i!=0)proList.push(switchProduct(i));
            });
            return proList;
        }
        return [11,12,13,23,27,29];
    };
    //设置城市对应已选省份
    var setSelectCity=function (CID) {
        var proCity=(proCityJson())[CID].state;
        if(selectCity.length>proCity.length){
            selectCity.splice(proCity.length,selectCity.length-proCity.length);
        }
        proCity.forEach(function (city,i) {
            selectCity[i]={
                'id':city.code,'name':  city.name
            };
        });
    };
    var setSelectProvince=function () {
      var proCity=proCityJson();
        proCity.forEach(function (prov,i) {
            selectProvince[i]={
              'id':i,'name':  prov.name,'code':prov.code
            };
        });
    };

    //成功查询企业详情中频率数据
    var queryUseFrequencySuccess=function (data) {
        var dataObj=JSON.parse(data);
        var loginLost=scope.loginLost(dataObj.rtcode);
        if(loginLost)return;
        if(!dataObj.result.resultList)return;
        var dataListJson=dataObj.result.resultList;
        var setTripWidth=function (WeekT,SumC,SumT,WeekC) {
            var funMax=function (list) {
                var temp=0;
                for(var i=0;i<list.length;i++){
                    temp=(temp >= list[i].value)?temp:list[i].value;
                }
                return temp;
            };
            var jsonToList=function (thisJ) {
                var i=0;
                var list=[];
                for(var item in thisJ){
                    list[i++]={
                        name:item,
                        value:parseInt(thisJ[item])
                        //value:8000000
                    };
                }
                return list;
            };
            var tripBarWidth=$('.tripContent').width();
            var setBarLength=function (value,max) {
                return (((tripBarWidth*90*value/max)/tripBarWidth)>0.5?((tripBarWidth*90*value/max)/tripBarWidth):0.5).toString()+"%";
            };
            var renderRank=function (list,max,toFix) {
                for(var i=0;i<list.length;i++){
                    $('.tripItemBar[name='+list[i].name+']').velocity({ width: '0px'}, 80, "swing");
                    $('.tripItemBar[name='+list[i].name+']').velocity({ width: setBarLength(list[i].value,max)}, 300, "swing");
                    scope.tripContent[list[i].name]=parseFloat(list[i].value).toFixed(toFix) ;
                }
            };
            scope.weekTL=jsonToList(WeekT);
            scope.SumCL=jsonToList(SumC);
            scope.SumTL=jsonToList(SumT);
            scope.WeekCL=jsonToList(WeekC);
            scope.weekTLM=funMax(scope.weekTL);
            scope.SumCLM=funMax(scope.SumCL);
            scope.SumTLM=funMax(scope.SumTL);
            scope.WeekCLM=funMax(scope.WeekCL);
            var setTripAndRank=function (list,max,flag,unit,toFix) {
                max=max>50?max:50;
                renderRank(list,max,toFix);
                scope.tripScaleList=[parseInt(max/10)+unit,parseInt(max/5)+unit,parseInt(max*3/10)+unit,parseInt(max*4/10)+unit,parseInt(max*5/10)+unit,parseInt(max*6/10)+unit,parseInt(max*7/10)+unit,parseInt(max*8/10)+unit,parseInt(max*9/10)+unit];
                scope.tripScaleListLast=max.toString()+unit;
                if(flag){
                    scope.$apply(function () {
                        scope.tripScaleList;
                        scope.tripScaleListLast;
                    });
                }
            };

            if(refreshTrip){
                refreshTrip=false;
                scope.$apply(function () {
                    scope.tripTypeState=0;
                });

            }
            else setTripAndRank(scope.WeekCL,scope.WeekCLM,true,'次',0);
            if(firstWatch){
                firstWatch=false;
                scope.$watch('tripTypeState',function (newValue) {
                switch (newValue){
                    case 0:setTripAndRank(scope.WeekCL,scope.WeekCLM,false,'次',0);break;
                    case 1:setTripAndRank(scope.weekTL,scope.weekTLM,false,'小时',1);break;
                    case 2:setTripAndRank(scope.SumTL,scope.SumTLM,false,'小时',1);break;
                    case 3:setTripAndRank(scope.SumCL,scope.SumCLM,false,'次',0);break;
                    default:break;
                }
            });
            }

        };
        setTripWidth(dataListJson.WEEK_AVG_DURATION,dataListJson.SUM_TIMES,dataListJson.SUM_DURATION,dataListJson.WEEK_AVG_TIMES);
    };
    //成功查询到详情页面中表格数据
    var queryUseDetailSuccess=function (data) {
        var dataObj=JSON.parse(data);
        var loginLost=scope.loginLost(dataObj.rtcode);
        if(loginLost)return;
        var dataObj=dataObj.result.resultList;
        var detailFormold={"总计":{
            'totalAmount':0,
            'allotAmount':0,
            'allotAmountPersent':0,
            'loginTimeAmount':0,
            'loginFrequency':0,
            'loginTime':0,
            'weekTime':0,
            'weekFrequency':0
        }};
        var subData=function () {
            for(var type in dataObj){
                detailFormold.总计.totalAmount+=parseFloat(dataObj[type].totalAmount);
                detailFormold.总计.allotAmount+=parseFloat(dataObj[type].allotAmount);
                detailFormold.总计.loginTimeAmount+=parseFloat(dataObj[type].loginTimeAmount);
                detailFormold.总计.loginFrequency+=parseFloat(dataObj[type].loginFrequency);
                detailFormold.总计.weekTime+=parseFloat(dataObj[type].weekTime);
                detailFormold.总计.weekFrequency+=parseFloat(dataObj[type].weekFrequency);
            }
            detailFormold.总计.allotAmountPersent=(detailFormold.总计.totalAmount)>0?parseFloat(100*(detailFormold.总计.allotAmount)/(detailFormold.总计.totalAmount)).toFixed(1):(100*(detailFormold.总计.allotAmount)/(detailFormold.总计.totalAmount))>0?'0.0':"--";
            detailFormold.总计.loginTime=(detailFormold.总计.loginTimeAmount)>0?parseFloat((detailFormold.总计.loginTimeAmount)/(detailFormold.总计.loginFrequency)).toFixed(1):"--";
        };
        var setDetailFormHtml=function (json1,json2) {
            var weekFrequency=json1.weekFrequency/Object.keys(json2).length;
            var setHtml=function () {
                var tempHtml='<div><div>总计</div><div>'+(json1.totalAmount==0?'--':json1.totalAmount)+'</div><div>'+(json1.allotAmount==0?'--':json1.allotAmount)+'</div><div>'
                    +json1.allotAmountPersent+'</div><div>'+((json1.loginTimeAmount).toFixed(1)==0?'--':(json1.loginTimeAmount).toFixed(1))+'</div>'
                    +'<div>'+(json1.loginFrequency==0?'--':json1.loginFrequency)+'</div><div>'+(json1.loginTime==0?'--':json1.loginTime)+'</div><div>'
                    +((json1.weekTime).toFixed(1)==0?'--':parseFloat(json1.weekTime).toFixed(1)/Object.keys(json2).length).toFixed(1)+'</div><div>'+(weekFrequency==0?'--':parseFloat(weekFrequency).toFixed(0))+'</div></div></div>';
                for(var type in json2){
                    tempHtml+='<div><div>'+type+'</div><div>'+(json2[type].totalAmount==0?'--':json2[type].totalAmount)+'</div><div>'+(json2[type].allotAmount==0?'--':json2[type].allotAmount)
                        +'</div><div>'+(json2[type].allotAmountPersent==0?'--':json2[type].allotAmountPersent)+'</div><div>'+(json2[type].loginTimeAmount==0?'--':json2[type].loginTimeAmount)+'</div>'
                        +'<div>'+(json2[type].loginFrequency==0?'--':json2[type].loginFrequency)+'</div><div>'+(json2[type].loginTime==0?'--':json2[type].loginTime)+'</div><div>'
                        +(json2[type].weekTime==0?'--':json2[type].weekTime)+'</div><div>'+(json2[type].weekFrequency==0?'--':parseFloat(json2[type].weekFrequency).toFixed(0))+'</div></div>';
                }
                return tempHtml;
            };
            var html=setHtml();
            var template=angular.element(html);
            var detailFormElem=compile(template)(scope);
            $('#detailFormC>div').remove();
            angular.element(document.getElementById('detailFormC')).append(detailFormElem);
        };
        subData();
        setDetailFormHtml(detailFormold.总计,dataObj);

    };

    //成功查询企业详情信息成功
    var queryInfoSuccess=function (data) {
        var dataObj=JSON.parse(data);
        var loginLost=scope.loginLost(dataObj.rtcode);
        if(loginLost)return;
        var enterpriseInfoObj=dataObj.result.resultObject;
        scope.$apply(function () {
            scope.enterpriseName=enterpriseInfoObj.enterprise;
            scope.deployType=enterpriseInfoObj.type;
            scope.region=enterpriseInfoObj.province+"-"+enterpriseInfoObj.city;
            scope.enterpriseId=enterpriseInfoObj.enterpriseId;
            scope.serverVersion=enterpriseInfoObj.serverVersion;
            scope.authorizationTime=enterpriseInfoObj.authorizationTime;
            scope.renewTime=enterpriseInfoObj.renewTime;
            scope.address=enterpriseInfoObj.address;

            scope.rowNameList=['客户端','授权总数','已分配','分配率%','登录时长','登陆次数','单次登录时长','周人均登录时长','周人均登录次数'];
        });

        var newDate=new Date();
        var lastMonth=(new Date(newDate.getFullYear(),newDate.getMonth()-1,newDate.getDate(),0,0,0,0)).getTime();
        var TS=newDate.getTime();
        enterpriseID=enterpriseInfoObj.enterpriseId;
        queryUseDetailParam.enterpriseId=enterpriseID;
        queryUseFrequencyParam.enterpriseId=enterpriseID;
        queryUseFrequencyParam.endTime=queryUseDetailParam.endTime=queryUseDetailParam.endTime==0?TS:queryUseDetailParam.endTime;
        queryUseFrequencyParam.beginTime=queryUseDetailParam.beginTime=queryUseDetailParam.beginTime==0?lastMonth:queryUseDetailParam.beginTime;

        //查询企业详情页面表格数据
        postAjax(queryUseDetailUrl,JSON.stringify(queryUseDetailParam) , queryUseDetailSuccess, postError,true);
        //企业详情页面图表数据
        postAjax(queryUseFrequencyUrl,JSON.stringify(queryUseFrequencyParam) , queryUseFrequencySuccess, postError,true);

    };
    var queryInfoError=function (msg) {
    };
    //成功获取企业列表中的列表
    var querySuccess=function (data) {
        var dataObj=JSON.parse(data);
        var loginLost=scope.loginLost(dataObj.rtcode);
        if(loginLost)return;
        if(dataObj.rtcode!=0)return;

        var paramList=dataObj.result.resultList;
        if(paramList.length>pageSize){
            var newlist=[];
            for(var i=paramList.length-pageSize;i<paramList.length;i++){
                newlist[i+pageSize-paramList.length]=paramList[i];
            }
            paramList=newlist;
        }
        function maxValue(paramName) {

                var list=[];
                for(var i=0;i<paramList.length;i++){
                    list[i]=paramList[i][paramName];
                }
            var maxvalue=0;
            list.forEach( function( theValue) {
                maxvalue = Math.max( maxvalue, theValue );
            } );
            return maxvalue;
        }
        var maxAvgTime=maxValue('avgTime');
        var maxAvgHour=maxValue('avgHour');
        var maxAllHours=maxValue('allHours');
        var maxAllTimes=maxValue('allTimes');
        //点击企业列表数据
        scope.showDetail=function(enterpriseId){
            $("#listPage").velocity({ opacity: "0" }, 800, "swing");
            $("#detailPage").velocity({ opacity: "1" }, 900, "swing");
            setTimeout(function () {
                $("#listPage").css( "display",'none');
                $("#detailPage").css( "display",'block');
                $('.navigationLeft').css('height',($('#detailPage').height()+50).toString()+"px");
            },600);
            var queryInfoParam=enterpriseId;
            var queryInfoUrl="http://"+dbPort+"/rest/enterprise/detail/queryEnterpriseInfo/"+queryInfoParam.toString();
            //查询企业详情信息
            getAjax(queryInfoUrl, null, queryInfoSuccess, queryInfoError,true);
        };

        var setBarLength=function (value,max,DOM) {
            if(DOM){
                var wid=$(DOM).width();
                wid=wid>($('.avgTime_Num').width()+30)?(wid-$('.avgTime_Num').width()-30):0;
                var minW=0;
                var thisW=(wid/max)*value;
                return (thisW<minW?minW:thisW).toString()+"px";
            }
        };
        //设置企业列表中列表信息
        var setHtml=function () {
            var tempHtml='';
            for(var i=0;i<paramList.length;i++){
                var iconClass=(paramList[i].deployType=='1')?'cloud_icon':'enterprise_icon';
                var newDate= (new Date(paramList[i].renewTime)).toLocaleString().replace(/\//g,".");
                var avgTime=paramList[i].avgTime?parseFloat(paramList[i].avgTime).toFixed(0):'--';
                var avgHour=paramList[i].avgHour?parseFloat(paramList[i].avgHour).toFixed(1):'--';
                var allHours=paramList[i].allHours?parseFloat(paramList[i].allHours).toFixed(1):'--';
                var allTimes=paramList[i].allTimes?paramList[i].allTimes:'--';
                tempHtml+='<div class="listPageListItem" ng-click="showDetail('+paramList[i].enterpriseId+')"><div name="enterpriseName" title="'+paramList[i].enterpriseName+'"><div class='+iconClass+'></div>'+paramList[i].enterpriseName+'</div>' +
                    '<div name="zoneName" ng-show="listShow[0]" title="'+paramList[i].zoneName+'" >'+paramList[i].zoneName+'</div>'
                    +'<div name="avgTime" ng-show="listShow[1]"  ><div class="avgTime_Num" title="'+avgTime+'">'+avgTime+'</div><div class="avgTime_bar" id="7t4tg6h96k5l1a4x4w'+i.toString()+'" style="background-color:#AA1019; width: "></div></div>'
                    +'<div name="avgHour" ng-show="listShow[2]" ><div class="avgHour_Num" title="'+avgHour+'">'+avgHour+'</div><div class="avgTime_bar" id="4ed8f5r5t21sd2w0r2y8g9'+i.toString()+'" style="background-color:#2DC0E8; width: "></div></div>'
                    +'<div name="allTimes" ng-show="listShow[4]" ><div class="avgTime_Num" title="'+allTimes+'">'+allTimes+'</div><div class="avgTime_bar" id="1y1ju5u2i323i52fr2'+i.toString()+'" style="background-color:#2DC0E8; width: "></div></div>'
                    +'<div name="allHours" ng-show="listShow[3]" ><div class="avgTime_Num" title="'+allHours+'">'+allHours+'</div><div class="avgTime_bar" id="7qe8e8dcc4v4g8y9ui4k4'+i.toString()+'" style="background-color:#AA1019; width: "></div></div>'
                    +'<div name="serverVersion" ng-show="listShow[5]" >'+paramList[i].serverVersion+'</div>' +
                    '<div name="renewTime" ng-show="listShow[6]" >'+newDate.substring(0,newDate.length-10)+'</div></div>';
            }
            return tempHtml
        };
        var html=setHtml();
        var template=angular.element(html);
        var listPageListElem=compile(template)(scope);
        $('#listPageList>div').remove();
        angular.element(document.getElementById('listPageList')).append(listPageListElem);

            scope.$apply(function () {
                scope.listShow;
            });

        for(var i=0;i<paramList.length;i++){
            $('#7t4tg6h96k5l1a4x4w'+i.toString()).velocity({ width: setBarLength((paramList[i].avgTime&&paramList[i].avgTime>0)?paramList[i].avgTime:0,maxAvgTime,'#avgTimeTitle')}, 800, "swing");
            $('#4ed8f5r5t21sd2w0r2y8g9'+i.toString()).velocity({ width: setBarLength((paramList[i].avgHour&&paramList[i].avgHour>0)?paramList[i].avgHour:0,maxAvgHour,'#avgHourTitle')}, 800, "swing");
            $('#7qe8e8dcc4v4g8y9ui4k4'+i.toString()).velocity({ width: setBarLength((paramList[i].allHours&&paramList[i].allHours>0)?paramList[i].allHours:0,maxAllHours,'#allHoursTitle')}, 800, "swing");
            $('#1y1ju5u2i323i52fr2'+i.toString()).velocity({ width: setBarLength((paramList[i].allTimes&&paramList[i].allTimes>0)?paramList[i].allTimes:0,maxAllTimes,'#allTimesTitle')}, 800, "swing");
        }

        $('.navigationLeft').css('height',($('#contentPage').height()+30).toString()+"px");
    }
    var postError=function () {

    };
    //获取企业信息列表
    var queryEntInfoList=function (flag) {
        if(EntListCount>=0&&flag!=-1&&flag!=-2)setPagination(pageStart, pageSize,EntListCount,'paging');

        queryListParam.page=pageStart;
        queryListParam.pageSize=pageSize;
        postAjax(queryListUrl, JSON.stringify(queryListParam), querySuccess, postError,true);
    };
    //缓存成功
    var cacheSuccess=function (data) {
        var dataObj=JSON.parse(data);
        var loginLost=scope.loginLost(dataObj.rtcode);
        if(loginLost)return;
        $('.navigationLeft').css('height',($('#contentPage').height()+30).toString()+"px");

        if(firstChoseBox){
            firstChoseBox=false;
            var choseBox= setInterval(function () {
                if($('.SysOptItemBox')){
                    $('.SysOptItemBox').on('click', function() {
                        var i  = $(this).attr('name');
                        if(i=='0')scope.itemShow[0]=(scope.itemShow[0])?false:true;
                        scope.$apply(function(){
                            for(var item in scope.itemShow){
                                if(item!='0'&&i=='0')scope.itemShow[item]=(scope.itemShow[0])?true:false;
                                else if(item==i&&item!='0'){
                                    scope.itemShow[item]=(scope.itemShow[item])?false:true;
                                    scope.itemShow[0]=false;
                                }
                            }
                        });
                    });
                    clearInterval(choseBox);
                }
            },200);
        }
        if(dataObj.result) EntListCount=dataObj.result.count;
        //获取企业信息列表
        queryEntInfoList();
    };
    //成功获取企业列表周人均时长和次数
    var postEntAvgSuccess=function (data) {
        var dataObj=JSON.parse(data);
        var loginLost=scope.loginLost(dataObj.rtcode);
        if(loginLost)return;
        dataObj=JSON.parse(data).result;
        if(!dataObj)return;
            var dataObjList=dataObj.resultMap.avgHour;
            new LBLineChart({
                data: dataObjList,
                unit:{'unit':{'XAxis':'小时','YAxis':'个'},'unitDes':{'XAxis':'周人均时长','YAxis':'企业数'}},
                canvasID: 'perTimeCanvas',
                canvasFather:'perCapitaTime',
                themeColor:{'lineColor':'#2DC0E8','fillColor':'rgba(45,192,232,0.23)','canvasBGColor':'#F5F5F5','yColor':'#e5e5e5'},
                width:2000,
                height:1000
            });


            dataObjList=dataObj.resultMap.avgTime;
            new LBLineChart({
                data:dataObjList,
                unit:{'unit':{'XAxis':'次','YAxis':'个'},'unitDes':{'XAxis':'周人均次数','YAxis':'企业数'}},
                canvasID: 'perCountCanvas',
                canvasFather:'perCapitaCount',
                themeColor:{'lineColor':'#AA1019','fillColor':'rgba(170,16,25,0.23)','canvasBGColor':'#F5F5F5','yColor':'#e5e5e5'},
                width:2000,
                height:1000
            });


    };
    //缓存 //点击筛选
    var catchEntInfo=function () {
        scope.pageStart=pageStart=1;
        postEntAvgParam.productList=cacheListParam.productList=checkedProduct();
        //点击筛选但没有选择客户端
        if(!firstChoseBox && !cacheListParam.productList[0]){
            new LBPopupInput({
                data:{
                    title:{
                        value:'请先选择客户端',
                        align:'center'
                    },
                    endButton:[
                        {value:'确定',BGC:'black',FC:'white',type:'close'}
                    ],
                    size:{
                        width:350,height:200
                    }
                }
            });
            return;
        }
        cacheListParam.enterpriseName=(scope.inputEntName)?scope.inputEntName:'';
        cacheListParam.provinceId=clickProvince==-1?0:clickProvince;
        cacheListParam.cityId=clickCity;

        var newDate=new Date();
        var todayDateStr=newDate.getTime();
        newDate=new Date(newDate.getFullYear(),newDate.getMonth()-1,newDate.getDate(),0,0,0,0);
        var lastMonthStr=newDate.getTime();
        //设定统计时长范围
        postEntAvgParam.beginTime=cacheListParam.beginTime=(clickStatisticsScope==-1)?lastMonthStr:selectStatistics[clickStatisticsScope].BT;
        postEntAvgParam.endTime=cacheListParam.endTime=(clickStatisticsScope==-1)?todayDateStr:selectStatistics[clickStatisticsScope].ET;
        cacheListParam.deployType+=cacheListParam.deployType==''?'ALL':'';

        //请求缓存
        postAjax(cacheListUrl, JSON.stringify(cacheListParam), cacheSuccess, postError,true);

        //查询图表
        postAjax(postEntAvgUrl, JSON.stringify(postEntAvgParam), postEntAvgSuccess, postError,true);
    };
    var setSelectCityDiv=function () {
        var html='<div class="citySelectDiv" data-default-value=""></div>';
        var template=angular.element(html);
        var selectCityElement=compile(template)(scope);
        $('.areaSelectCity>div').remove();
        angular.element(document.getElementsByClassName('areaSelectCity')[0]).append(selectCityElement);
    }
    //设置省份选择器和城市选择器
    var buildAreaSelectProvince=function () {
        var clickFunC=function (flag) {
            clickCity=flag;
        };
        var clickFunP=function (flag) {
        clickProvince=selectProvince[flag].code;
            //设置城市对应已选省份
        setSelectCity(flag);
        clickCity=0;
        setSelectCityDiv();
        new LBSelect({container: $(".citySelectDiv")[0], dataJson:JSON.stringify(selectCity),clickBack:clickFunC,allowInput:false });
        };

        setSelectProvince();
        setSelectCityDiv();
        //初始化时间选择
        new LBSelect({container: $(".citySelectDiv")[0], dataJson:JSON.stringify(selectCity),clickBack:clickFunC,allowInput:false });
        new LBSelect({container: $(".areaSelectProvince")[0], dataJson:JSON.stringify(selectProvince),clickBack:clickFunP,allowInput:false });
};
    var buildDeployType=function () {
        var clickFun=function (flag) {
            cacheListParam.deployType=flag;
        };
        new LBSelect({container: $("#deployType"), dataJson:deployType,clickBack:clickFun,allowInput:false });
};
    var buildStatisticsScope=function () {
        var clickFun=function (flag) {
            clickStatisticsScope=parseInt(flag);
        };
        setSelectStatistics();
        new LBSelect({container: $("#statisticsScope"), dataJson:JSON.stringify(selectStatistics),clickBack:clickFun,allowInput:false });
    };
    //改变企业列表显示条数
    var pageRefresh=function (flag) {
        pageSize=parseInt(flag);
        pageStart=1;
        scope.pageStart=1;
        queryEntInfoList();
    };
    var doLestController=function ($scope,$compile,clickIn) {
        scope=$scope;
        compile=$compile;
        //初始化多选控件
        if(!scope.itemShow)scope.itemShow=[true,true,true,true,true,true,true];
        //点击进入还是浏览器返回进入执行刷新导航
        if(!clickIn)scope.refresh++;
        scope.selectPopList=[
            {'id':0,'des':'地区'},{'id':1,'des':'周人均登录次数'},{'id':2,'des':'周人均登录时长'},
            {'id':4,'des':'总次数'},{'id':3,'des':'总时长'},{'id':5,'des':'版本号'},{'id':6,'des':'维护时间'},
        ];
        scope.tripContent={};
        scope.listShow=[true,true,true,true,true,true,true];
        //排序
        scope.rankList=function (des,nameStr) {
            $('.listTitle>[name="'+nameStr+'"]>select-arrow [name="arrow"]').css({'borderColor':'#AA1019 transparent'});
            $('.listTitle>:not([name="'+nameStr+'"])>select-arrow [name="arrow"]').css({'borderColor':'#1A1A1A transparent'});
            queryListParam.orderField=nameStr;
            queryListParam.desc=des;
            //重新获取企业信息列表
          //  applyListShow=true;
            queryEntInfoList(-1);
        };
        //选择显示内容
        var thisWin=$('.listPageListOut').outerWidth();
        scope.itemShowClickChange=function (flag,id) {
            var newWin=thisWin*itemWL[0]/100;
            scope.listShow[id]=!scope.listShow[id];
            // switch (id){
            //     case 3:
            //         if(!flag){
            //             for(var i=0;i<scope.listShow.length;i++){
            //                 newWin+=i>2?((scope.listShow[i])?itemWL[i+1]:0):((scope.listShow[i])?thisWin*itemWL[i+1]/100:0);
            //                 $('.listTitle[name="'+itemName[i+1]+'"]').css('width',i>2?((scope.listShow[i])?itemWL[i+1]:0)+'px':((scope.listShow[i])?thisWin*itemWL[i+1]/100:0)+'px');
            //             }
            //             $('.listTitle').css('width',newWin+'px');
            //
            //         }
            //         break;
            //     default:break;
            // }

            return !flag;
        };
        scope.hOrSPopup=function (flag,id) {
            if(!flag){
                $('#'+id).css({'width':'0px','height':'0px'});
                $('#'+id).velocity({ width: '220px',height:'202px',borderRadius:'5px',borderWidth:'1px' }, 300, "swing");
                return !flag;
            }
            else{
                $('#'+id).velocity({ width: '0px',height:'0px',borderRadius:'0px',borderWidth:'0px' }, 300, "swing");
                return !flag;
            }
        };
        buildAreaSelectProvince();
        buildDeployType();
        buildStatisticsScope();
        scope.hideCountChart=hideCountChart;
        scope.hideIconFlag=false;
        scope.hideCountChart(scope.hideIconFlag);
        new LBSelect({container: $("#pageSizeSelect"), dataJson:selectPageSize,clickBack:pageRefresh,allowInput:false });
        //选择企业详情页面中的时间选择器
        var clickFun=function (flag) {
            ClickLCTimeBucket=flag;
            refreshTrip=true;
            var todayDate=new Date();
            var todayDateStr=todayDate.getTime();
            queryUseDetailParam.beginTime= queryUseFrequencyParam.beginTime=parseInt(ClickLCTimeBucket);
            queryUseDetailParam.endTime= queryUseFrequencyParam.endTime=todayDateStr;
            queryUseFrequencyParam.enterpriseId=enterpriseID;
            //查询企业详情页面表格数据
            postAjax(queryUseDetailUrl,JSON.stringify(queryUseDetailParam) , queryUseDetailSuccess, postError,true);
            //企业详情页面图标数据
            postAjax(queryUseFrequencyUrl,JSON.stringify(queryUseFrequencyParam) , queryUseFrequencySuccess, postError,true);
        };
        setSelectDISTimeBucket();
        new LBSelect({container: $("#DISTimeBucket"), dataJson:JSON.stringify(selectDISTimeBucket),clickBack:clickFun,allowInput:false  });
        //////////////////////缓存企业数据
        scope.catchEntInfo=catchEntInfo;
        scope.catchEntInfo();
        scope.backListPage=function () {
            $("#listPage").css( "display",'block');
            setTimeout(function () {
                $("#detailPage").css( "display",'none');
            },600);
            $('.navigationLeft').css('height',($('#contentPage').height()+30).toString()+"px");
            $("#listPage").velocity({ opacity: "1" }, 900, "swing");
            $("#detailPage").velocity({ opacity: "0" }, 600, "swing");
        };
    };


    return doLestController;
}