
function MapController() {
    var scope,compile,interval;
    var enterpriseNum=[];
    var provinceValue=[];
    var dataLine= [];
    var situationNum={"cloud":[],"enterprise":[],"total":[]};
    var TimeBucket=[{"id": "", "name": "近一月","desc":""}, {"id": "", "name": "近一季","desc":""}, {"id": "", "name": "近一年","desc":""}, {"id": "", "name": "近三年","desc":""}, {"id": "", "name": "全部","desc":""}];
    var getQuantifyURL="http://"+dbPort+"/rest/enterprise/general/queryEntQuantity/";
    var postAreaParam='{"queryType": [ "PROVINCE","AREA","CITY"]}';
    var postAreaURL="http://"+dbPort+"/rest/enterprise/general/queryEntArea";
    var postLChartParam={"beginTime": 0,"endTime": 0,"queryType": ["ALL","CLOUD","ENTERPRISE"]};
    var postLChartUrl="http://"+dbPort+"/rest/enterprise/general/queryLineChart";
    var ClickLCTimeBucket=0;
    var layoutMap= echarts.init(document.getElementById('layoutMap'));
    var optionMap = {
        title: {
            text: '企业地区分布图',
            left: 'left',
            textStyle:{
                fontFamily:'Microsoft YaHei',
            }
        },
        series: [
            {
                type: 'map',
                mapLocation: {
                    x: 'left',
                    y: 34,
                    height: 400
                },
                itemStyle: {
                    normal: {
                        borderWidth: 1,
                        borderColor: 'white',
                        color: 'rgba(190,180,150,0.6)',
                        label: {
                            show: false
                        }
                    },
                    emphasis: {                 // 也是选中样式
                        color: '#E49B50',
                    }
                },
                data: enterpriseNum
            }
        ]
    };
    var optionSituation = {
        title: {
            text: '企业部署情况',
            textStyle:{
                fontFamily:'Microsoft YaHei',
            }
        },
        tooltip : {
            trigger: 'axis'
        },
        backgroundColor:'white',
        legend: {
            itemGap:20,
            right:50,
            y:93,
            textStyle:{
                fontFamily:'Microsoft YaHei',
                fontSize:12
            },

            formatter: function (name) {
                if(name.length<=3){
                    name = "   "+name;
                }
                return  name;
            },
            data:[{
                name:'总企业',
                icon:'circle'
            },{
                name:'云部署',
                icon:'circle'
            },{
                name:'企业部署',
                icon:'circle'
            }],

            orient:'vertical',
            align:'left'

        },
        xAxis: {
            type: 'category',
            data: dataLine,
            nameGap:10,
            splitLine:{
                show:true,
            },
            splitArea:{
                show:true,
            }
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name:'总企业',
                type:'line',
                symbolSize: 3.5,
                symbol:'circle',
                itemStyle:{normal:{color:'#aa1019'}},
                data:situationNum.total
            },
            {
                name:'云部署',
                type:'line',
                symbolSize: 4,
                symbol:'circle',
                itemStyle:{normal:{color:'#E09D55'}},
                data:situationNum.cloud
            },
            {
                name:'企业部署',
                type:'line',
                symbolSize: 4,
                symbol:'circle',
                itemStyle:{normal:{color:'#3EC5E9'}},
                data:situationNum.enterprise
            }

        ]

    };
    var layoutSituation= echarts.init(document.getElementById('layoutSituation'));
    var areaRankBarWidth=$('#areaRank').width();


//设置时间选择控件
    var setTimeBucket=function () {
        var newDate=new Date();//当前时间
        var startTime;//起始时间凌晨
        var timeStr;
        var today=newDate.toLocaleDateString();//当前时间中文格式

        startTime=new Date(newDate.getFullYear(),newDate.getMonth()-1,newDate.getDate(),0,0,0,0);//近一月
        timeStr=startTime.getTime();//近一月时间戳
        var oldTime=startTime.toLocaleDateString();
        TimeBucket[0].id=timeStr;
        TimeBucket[0].desc=oldTime+'-'+today;

        startTime=new Date(newDate.getFullYear(),newDate.getMonth()-3,newDate.getDate(),0,0,0,0);//近一季
        timeStr=startTime.getTime();
        oldTime=startTime.toLocaleDateString();
        TimeBucket[1].id=timeStr;
        TimeBucket[1].desc=oldTime+'-'+today;

        startTime=new Date(newDate.getFullYear()-1,newDate.getMonth(),newDate.getDate(),0,0,0,0);//近一年
        timeStr=startTime.getTime();
        oldTime=startTime.toLocaleDateString();
        TimeBucket[2].id=timeStr;
        TimeBucket[2].desc=oldTime+'-'+today;

        startTime=new Date(newDate.getFullYear()-3,newDate.getMonth(),newDate.getDate(),0,0,0,0);//近三年
        timeStr=startTime.getTime();
        oldTime=startTime.toLocaleDateString();
        TimeBucket[3].id=timeStr;
        TimeBucket[3].desc=oldTime+'-'+today;

        startTime=new Date(2010,newDate.getMonth(),newDate.getDate(),0,0,0,0);//全部
        timeStr=startTime.getTime();
        oldTime=startTime.toLocaleDateString();
        TimeBucket[4].id=timeStr;
        TimeBucket[4].desc=oldTime+'-'+today;
    };
    //设置排名条长度
    var setBarLength=function (value,max) {
        return ((100*(areaRankBarWidth-85)*value/max )/areaRankBarWidth).toString()+"%";
    };
    var renderRank=function (list) {
        var setHtml=function () {
            var tempHtml='';
            var length=list.length>10?10:list.length;
            for(var i=0;i<length;i++){
                tempHtml+='<div><div class="rankNum">'+(i+1)+'</div><div class="areaRankName">'+list[i].name+'</div><div id="areaRank'+i+'" style="width: '
                    +';height:10px;border-radius:3px;background-color:#AA1019;float: left;margin-top:13px "></div></div>';
            }
            return tempHtml
        };
        var html=setHtml();
        var template=angular.element(html);
        var areaRankElem=compile(template)(scope);
        $('#areaRank>div').remove();
        angular.element(document.getElementById('areaRank')).append(areaRankElem);
        for(var i=0;i<list.length;i++){
            $('#areaRank'+i.toString()).velocity({ width: setBarLength(parseInt(list[i].value),parseInt(list[0].value))}, 300, "swing");
        }
    };
    var setAeraRank=function (pL,aL,cL) {
        var rankList=function (list) {
            for(var i=0;i<list.length;i++){
                for(var j=i+1;j<list.length;j++){
                    if(parseInt(list[j].value) >= parseInt(list[i].value) ){
                        var temp=list[j];
                        list[j]=list[i];
                        list[i]=temp;
                    }
                }
            }
            return list;
        };
        var npl=rankList(pL);
        var nal=rankList(aL);
        var ncl=rankList(cL);
        renderRank(npl);
        scope.$watch('areaState',function (newValue) {
            switch (newValue){
                case 0:renderRank(npl);break;
                case 1:renderRank(nal);break;
                case 2:renderRank(ncl);break;
                default:break;
            }
        });
    };
    //接口数据报错
    function getAreaError() {
        Toast('getError',1000,null);
    }
    var arithmeticColor=function (x1,x2,y1,y2,x) {
        var yV=(y2-y1)*(x2-x-x1)/(x2-x1)+y1;
     var y=yV>1? Math.floor(yV):yV.toFixed(2);
        return y.toString();
    };
    //成功查询概况页面图表数据
    var postLChartSuccess=function (data) {
        var dataObj=JSON.parse(data);
        var loginLost=scope.loginLost(dataObj.rtcode);
        if(loginLost)return;
        if(dataObj.result){
            dataObj=dataObj.result.lineChartList;
            var totalL=dataObj.all;
            var cloudL=dataObj.cloud;
            var entL=dataObj.enterprise;
            if(totalL.length>0){
                if(dataLine.length>totalL.length){
                    dataLine.splice(totalL.length,dataLine.length-totalL.length);
                    situationNum.enterprise.splice(totalL.length,situationNum.enterprise.length-totalL.length);
                    situationNum.total.splice(totalL.length, situationNum.total.length-totalL.length);
                    situationNum.cloud.splice(totalL.length, situationNum.cloud.length-totalL.length);
                }
                for(var i=0;i<totalL.length;i++){
                    dataLine[i]=(totalL[i].date);
                    situationNum.enterprise[i]=(parseInt(entL[i].value));
                    situationNum.total[i]=(parseInt(totalL[i].value));
                    situationNum.cloud[i]=(parseInt(cloudL[i].value));
                }
            }
            layoutSituation= echarts.init(document.getElementById('layoutSituation'));
            layoutSituation.setOption(optionSituation);
        }

    };
    //成功获取企业概况信息
    var getQuantifySuccess=function (data) {
        var dataObj=JSON.parse(data);
        var loginLost=scope.loginLost(dataObj.rtcode);
        if(loginLost)return;
        scope.$apply(function () {
            var statisticsItemTime=[
                (function () {
                    var newDate=new Date();//上月
                    var oldTimeSStr=newDate.setMonth( newDate.getMonth()-1 ,1);
                    newDate.setTime(oldTimeSStr);
                    var oldSTime=newDate.toLocaleDateString();
                    newDate=new Date();
                    var oldTimeEStr=newDate.setDate(0);
                    newDate.setTime(oldTimeEStr);
                    var oldETime=newDate.toLocaleDateString();
                    return oldSTime+'-'+oldETime;
                })(),
                (function () {
                    var newDate=new Date();//同比
                    newDate.setMonth( newDate.getMonth()-1);
                    var monthS=newDate.getMonth()+1;
                    var yearS=newDate.getFullYear();
                    return yearS+'年'+monthS+'月/'+(yearS-1)+'年'+monthS+'月';
                })(),
                (function () {
                    var newDate=new Date();//同比
                    newDate.setMonth( newDate.getMonth()-1);
                    var monthS0=newDate.getMonth()+1;
                    var yearS0=newDate.getFullYear();
                    newDate.setMonth( newDate.getMonth()-1);
                    var monthS1=newDate.getMonth()+1;
                    var yearS1=newDate.getFullYear();
                    return yearS0+'年'+monthS0+'月/'+yearS1+'年'+monthS1+'月';
                })()
            ];
            scope.statisticsItem=[
                {'title':'企业总数','time':'','value':(dataObj.result)?dataObj.result.enterpriseAmount:''},
                {'title':'上月新增：','time':'('+statisticsItemTime[0]+')','value':dataObj.result?parseInt(dataObj.result.lastMonthRaise):''},
                {'title':'同比增长：','time':'('+statisticsItemTime[1]+')','value':dataObj.result?(parseFloat(dataObj.result.oyoy)).toFixed(2)+"%":''},
                {'title':'环比增长：','time':'('+statisticsItemTime[2]+')','value':dataObj.result?(parseFloat(dataObj.result.linkRelative)).toFixed(2)+"%":''}
            ];
        });

    };
    //获取区域信息成功
    var getAreaSuccess=function (data) {
        var dataObj=JSON.parse(data);
        var loginLost=scope.loginLost(dataObj.rtcode);
        if(loginLost)return;
        $('.navigationLeft').css('height',($('#contentPage').outerHeight()-50+$('#contentPage').position().top).toString()+"px");


        var provinceList=dataObj.result?dataObj.result.areaList.province:'';
        for(var i=0;i<provinceList.length;i++){
            provinceValue.push(provinceList[i].value);
        }
        var xMax=Math.max.apply(null, provinceValue);
        var xMin=Math.min.apply(null, provinceValue);
        for(var i=0;i<provinceList.length;i++){
            var r=arithmeticColor(xMin,xMax,228,240,provinceList[i].value);
            var g=arithmeticColor(xMin,xMax,155,209,provinceList[i].value);
            var b=arithmeticColor(xMin,xMax,80,130,provinceList[i].value);
            var a=arithmeticColor(xMin,xMax,1,0.6,provinceList[i].value);
            enterpriseNum.push({name:provinceList[i].name,value:provinceList[i].value,itemStyle: {normal: {color: "rgba("+r+","+g+","+b+","+a+")"} }});
        }

        layoutMap.setOption(optionMap);
        layoutSituation.setOption(optionSituation);

        setAeraRank(dataObj.result.areaList.province,dataObj.result.areaList.area,dataObj.result.areaList.city);
        (function () {
            var getStateTL;
            window.onresize=function () {
                getStateTL=getCookie('BusHomMasTLCookie');
                if(getStateTL!="00")return;
                layoutSituation= echarts.init(document.getElementById('layoutSituation'));
                layoutSituation.setOption(optionSituation);
            };
        })();

    };
     var doController=function($scope,$compile,$interval,clickIn) {
         scope=$scope;
         compile=$compile;
         interval=$interval;
         //点击进入还是浏览器返回进入执行刷新导航
         if(!clickIn)scope.refresh++;
         var newDate=new Date();
         var lastMonth=(new Date(newDate.getFullYear(),newDate.getMonth()-1,newDate.getDate(),0,0,0,0)).getTime();
         var todayDateStr=newDate.getTime();
         setTimeBucket();
         //企业概况选择时间控件
         var clickFun=function (flag) {
             ClickLCTimeBucket=flag;
             postLChartParam.beginTime=parseInt(ClickLCTimeBucket);
             postLChartParam.endTime=todayDateStr;
             postAjax(postLChartUrl,JSON.stringify(postLChartParam) , postLChartSuccess, getAreaError,true);
         };
         new LBSelect({container: $("#LCTimeBucket"), dataJson:JSON.stringify(TimeBucket),clickBack:clickFun,allowInput:false });
         getAjax(getQuantifyURL+todayDateStr, null, getQuantifySuccess, getAreaError,true);
         postAjax(postAreaURL, postAreaParam, getAreaSuccess, getAreaError,true);
         postLChartParam.beginTime=lastMonth;
         postLChartParam.endTime=todayDateStr;
         postAjax(postLChartUrl,JSON.stringify(postLChartParam) , postLChartSuccess, getAreaError,true);
    }
    return doController;
}
