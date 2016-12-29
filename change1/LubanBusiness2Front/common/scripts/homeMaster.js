var naviLeftMargin=230;
var defaultInTop=true;
var defaultInLeft=true;
var defaultInArea=true;
//登录失效
var  loginLost=function(msg) {
    if (msg=='102'){
        new Toast({message:'登录失效,请重新登录',time:3200}).show();
        setTimeout(function () {
            location.href='./LoginPage/login.html';
        },3500);
        return true;
    }
    else if(msg=='101'){
        new Toast({message:'该账号已在其他地方登录',time:3200}).show();
        setTimeout(function () {
            location.href='./LoginPage/login.html';
        },3500);
        return true;
    }
    else if(msg=='100'){
        new Toast({message:'用户权限不够',time:3200}).show();
    }
    return false;
};
//退出功能
var linkLogin=function () {
    var loginOutSuccess=function () {
        location.href='./LoginPage/login.html';
    };
    var loginOutError=function () {
        new Toast({message:'退出异常',time:2500}).show();
    };
    var loginOutUrl='http://'+dbPort+'/logout';
    getAjax(loginOutUrl, null, loginOutSuccess, loginOutError,true);

};
//修改密码
var changePSW=function (name) {
    var nameCookie=getCookie('username');
    var changePSWSuccess=function (data) {
        var dataObj=JSON.parse(data);
        if(dataObj.rtmsg=='ok'||dataObj.rtmsg=='OK'||dataObj.rtmsg=='Ok'){
            new Toast({message:(nameCookie==name)?'修改成功，重新登录':'修改成功',time:2500}).show();
            if(nameCookie==name){
                setTimeout(function () {
                    linkLogin();
                },2000);
            }
        }
    };
    var changeConfirm=function (data) {
        if(data[0].value==''||data[0].value==null||typeof(data[0].value)=='undefined'){
            new Toast({message:'密码不能为空',time:2500}).show();
            new LBPopupInput({
                data:{
                    title:{
                        value:'修改密码',
                        align_x:'center',
                        align_y:'center'
                    },
                    content:[
                        {id:0, type:'inputKey',descript:'密码:'},
                        {id:1, type:'inputKey',descript:'重复密码:'}
                    ],
                    endButton:[
                        {value:'取消',BGC:'white',FC:'#1A1A1A',type:'close'},
                        {value:'确定',BGC:'black',FC:'white',type:'func',func:changeConfirm}
                    ],
                    size:{
                        width:400,height:300
                    }
                }
            });
        }
        else if(data[0].value!=data[1].value){
            new Toast({message:'重复密码错误',time:2500}).show();
            new LBPopupInput({
                data:{
                    title:{
                        value:'修改密码',
                        align_x:'center',
                        align_y:'center'
                    },
                    content:[
                        {id:0, type:'inputKey',descript:'密码:'},
                        {id:1, type:'inputKey',descript:'重复密码:'}
                    ],
                    endButton:[
                        {value:'取消',BGC:'white',FC:'#1A1A1A',type:'close'},
                        {value:'确定',BGC:'black',FC:'white',type:'func',func:changeConfirm}
                    ],
                    size:{
                        width:400,height:300
                    }
                }
            });
        }
        else {
            var changePSWParam={"password": "","remarks": "","role": 0,"username": ""};
            var changePSWUrl="http://"+dbPort+"/rest/lbuser/updateLBUserPassword";
            changePSWParam.password=data[0].value;
            changePSWParam.username=name;
            postAjax(changePSWUrl, JSON.stringify(changePSWParam), changePSWSuccess, function () {},true);
        }
    };
    new LBPopupInput({
        data:{
            title:{
                value:'修改密码',
                align_x:'center',
                align_y:'center'
            },
            content:[
                {id:0, type:'inputKey',descript:'密码:'},
                {id:1, type:'inputKey',descript:'重复密码:'}
            ],
            endButton:[
                {value:'取消',BGC:'white',FC:'#1A1A1A',type:'close'},
                {value:'确定',BGC:'black',FC:'white',type:'func',func:changeConfirm}
            ],
            size:{
                width:400,height:300
            }
        }
    });
};
//全局的导航状态跟踪
function globleState(fun) {
    this.fun=fun;
    var top=0;
    var left=0;
    this.firstIn=true;
    this.setState=function (temp) {
        top=temp[0];
        left=temp[1];
        if(this.firstIn) {
            this.firstIn=false;
            return;
        }
        this.changeState(top,left);
    };
}
globleState.prototype={
    changeState:function (top,left) {
        (this.fun)(top,left);
    }
};
var thisGState;
var app=angular.module("LuBanBusinessFront",['ui.router']);
//页面大小调整
(function () {
    $(document).ready(function(){
        setContentMarginL();
    });
    $(window).resize(function() {
        setContentMarginL();
        $('.navigationLeft').css('height',($('#contentPage').outerHeight()-50+$('#contentPage').position().top).toString()+"px");
    });
    $(".userOperation").css("display","block");
})();
function setContentMarginL() {
    var contentMarginLeft=($('body').width()-naviLeftMargin)/2-$('#contentPage').width()/2-40;
    contentMarginLeft=contentMarginLeft>=0?contentMarginLeft:0;
    $('#contentPage').css('marginLeft',contentMarginLeft.toString()+"px");
}
//监听状态并设置状态
function watchState(newValue,oldValue,elemName,BGCF,BGCB,FCF,FCB,total) {
    renderColor(newValue,oldValue,elemName,BGCF,BGCB,FCF,FCB,total);
}
//根据监听到的状态渲染
function renderColor(newState,oldState,elemName,BGCF,BGCB,FCF,FCB,total) {
    var JQE=document.getElementsByName(elemName);
    if(JQE.length<=0)return;
    JQE[newState].style.backgroundColor=BGCF;
    JQE[newState].style.color=FCF;
    for(var i=0;i<total;i++){
        if(i!=newState){
            JQE[i].style.backgroundColor=BGCB;
            JQE[i].style.color=FCB;
        }
    }
}
//路由配置
app.config(function ($stateProvider,$urlRouterProvider,$controllerProvider) {
    app.registerCtrl = $controllerProvider.register;
    app.resolveScriptDeps = function(dependencies){
        return function($q,$rootScope){
            var deferred = $q.defer();
            $script(dependencies, function() {
                $rootScope.$apply(function()
                {
                    deferred.resolve();
                });
            });

            return deferred.promise;
        }
    };

    $urlRouterProvider.otherwise("/enterpriseGeneral");
      $stateProvider
          .state("enterpriseGeneral", {
              url:"/enterpriseGeneral",
              templateUrl: "homePage/enterpriseGeneral/enterpriseGeneral.html",
              resolve: {
                  deps: app.resolveScriptDeps([
                      '/LubanBusiness2Front/modules/homePage/enterpriseGeneral/scripts/general.js'
                  ])
              },
              controller:'generalController'
          })
          .state("enterpriseList", {
          url:"/enterpriseList",
          templateUrl: "homePage/enterpriseList/enterpriseList.html",
              resolve: {
                  deps: app.resolveScriptDeps([
                      '/LubanBusiness2Front/modules/homePage/enterpriseList/scripts/enterpriseList.js'
                  ])
              },
             controller:'listController'
           })
          .state("memberManage", {
              url:"/memberManage",
              templateUrl: "managePage/memberManage/memberManage.html",
              resolve: {
                  deps: app.resolveScriptDeps([
                      '/LubanBusiness2Front/modules/managePage/memberManage/scripts/memberManage.js'
                  ])
              },
              controller:'memberManageController'

          })

});
//成员管理页面
app.controller('memberManageController',function ($scope,$compile) {
    $scope.loginLost=loginLost;
    $scope.changePSW=changePSW;
    //监听页面状态并刷新导航状态
    $scope.refresh=0;
    $scope.$watch('refresh',function () {
        thisGState.setState([2,0]);
    });
    var memberManageSet=MemManController();
    memberManageSet($scope,$compile);
});
//列表页面
app.controller('listController',function ($scope,$compile) {
    $scope.loginLost=loginLost;
    $scope.systemOptionsList=[
        {'id':0,'text':'全选'},
        {'id':1,'text':'BE'},
        {'id':2,'text':'MC'},
        {'id':3,'text':'BW'},
        {'id':4,'text':'iBAN'},
        {'id':5,'text':'SP'},
        {'id':6,'text':'BV'}
    ];

    $scope.tripTypeState=0;
    $scope.defaultTripTpye=true;

    //监听页面状态并刷新导航状态
    $scope.refresh=0;
    $scope.$watch('refresh',function () {
        thisGState.setState([0,1]);
    });
    var ListSet=LestController();
    ListSet($scope,$compile);
    $scope.$watch('tripTypeState',function (newValue,oldValue) {
        watchState(newValue,oldValue,'tripTypeSelect','#AA1019','transparent','white','black',4);
    });
    (function () {
        var html='<div></div>';
        var template=angular.element(html);
        var pagination=$compile(template)($scope);
        angular.element(document.getElementById('pagination')).append(pagination);
    })();
   // ListSet($scope,$compile,2,13);

});
//详情页面
app.controller('generalController',function ($scope,$compile,$interval) {
    $scope.loginLost=loginLost;
    $scope.areaState=0;
    //监听页面状态并刷新导航状态
    $scope.refresh=0;
    $scope.$watch('refresh',function () {
        thisGState.setState([0,0]);
    });
    var GeneralSet= MapController();
    GeneralSet($scope,$compile,$interval);
    $scope.$watch('areaState',function (newValue,oldValue) {
        watchState(newValue,oldValue,'genAreaSelect','#AA1019','transparent','white','black',3);
        $scope.areaState=newValue;
    });

});
//主页面
app.controller('businessController', function ($scope,$compile,$location) {


    $scope.topState=0;
    $scope.leftState=0;
    $scope.nameCookie=getCookie('username');
    var roleType=getCookie('roleType');
    $scope.userName=$scope.nameCookie?$scope.nameCookie+'('+roleType+')':'未找到用户';
    $scope.changePSW=changePSW;
    //退出功能
    $scope.linkLogin=linkLogin;
    $scope.$watch('topState',function (newValue,oldValue) {
        watchState(newValue,oldValue,'naviTopDiv','#4C4C4C','transparent','white','white',3);
        $scope.leftState=0;
        defaultInArea=true;
        defaultInLeft=true;
        setNavigationLeft(newValue);
        setRouteState($scope.topState,$scope.leftState);
    });
    $scope.$watch('leftState',function (newValue,oldValue) {
        if(newValue>=10)return;
        if(newValue==oldValue-10){$scope.leftState+=10;return;}
        defaultInArea=true;
        if(defaultInLeft){
            oldValue=0;
            defaultInLeft=false;
        }
        else oldValue-=10;
        /*-----------------------------------------------------这里有问题*/
        console.log(newValue+'newValue')
        console.log(newValue+'oldValue')
        renderNavigationLeft(newValue,oldValue);
        setRouteState($scope.topState,$scope.leftState);
        $scope.leftState+=10;
    });
    function setStateCookie(TS,LS) {
        setCookie("BusHomMasTLCookie",TS.toString()+LS.toString());
    }
    function setRouteState(TState,LState) {
        TState>9?TState-=10:null;
        setStateCookie(TState,LState);
        switch (TState){
            case 0:
                switch (LState){
                    case 0:$location.path("/enterpriseGeneral");break;
                    case 1:$location.path("/enterpriseList");break;
                    case 2:break;
                    default:break;
                }

            case 1:break;
            case 2:
                switch (LState){
                case 0:
                case 1:$location.path("/memberManage");break;
                case 2:break;
                default:break;
            }
            default:break;
        }
    }
    function renderNavigationLeft(newState,oldState) {
        var JQE=document.getElementsByClassName("naviLeftItem");
        // var JQE=document.getElementsByClassName("paraChild");
        // var chils= JQE.childNodes;  //得到s的全部子节点

        for(i=0;i<JQE.length;i++){
            // console.log(JQE[i])
            // console.log(JQE[i].childNodes)
            // console.log(typeof(JQE[i].childNodes))
            for(j=0;j<JQE[i].childNodes.length;j++){
                if(JQE[i].childNodes.length<=0)return;
                if(newState==i){
                    JQE[i].childNodes[newState+1].style.backgroundColor='#4C4C4C';
                    // console.log(JQE[i].childNodes[j])
                }else if(newState!=oldState)JQE[i].childNodes[oldState].style.backgroundColor='transparent';

            }
        }


       /* if(JQE.length<=0)return;
        JQE[newState].style.backgroundColor='#4C4C4C';
        if(newState!=oldState)JQE[oldState].style.backgroundColor='transparent';*/
    }
    //设置导航栏-左
    function setNavigationLeft(state) {
        var paramList=[];
        switch(state){
            case 0:
                paramList=[
                    {"commonImg":'../common/images/houseLogo.png'},
                    {"title":"企业客户分析","iconImage":"../common/images/left_general.png"},
                    {"title":"系统使用分析","iconImage":"../common/images/left_list.png"},
                    {"title":"管理","iconImage":"../common/images/left_list.png"}
               //     {"title":"PDS概况","iconImage":"../common/images/left_general.png"}
                ];
                paramChild=[[
                    {"title":"企业概况","iconImage":"../common/images/left_general.png"},
                    {"title":"企业列表","iconImage":"../common/images/left_list.png"}
                    ],[
                        {"title":"系统概况","iconImage":"../common/images/left_general.png"},
                        {"title":"用户分析","iconImage":"../common/images/left_list.png"},
                        {"title":"功能分析","iconImage":"../common/images/left_general.png"},
                        {"title":"问题分析","iconImage":"../common/images/left_list.png"}
                    ],[
                    {"title":"权限设置","iconImage":"../common/images/left_list.png"},
                    {"title":"成员管理","iconImage":"../common/images/left_general.png"},
                    {"title":"企业筛选","iconImage":"../common/images/left_list.png"}
                    ]
                ]
                break;
            case 1:
                // paramList=[
                //     {"commonImg":'../common/images/houseLogo.png'},
                //     {"title":"BE概览"},{"title":"实时看板"},{"title":"用户分析"},{"title":"用户参与度"},
                //     {"title":"使用分析"},{"title":"用户反馈"},{"title":"错误分析"}
                // ];
                // break;
            case 2:
                paramList=[
                    {"commonImg":'../common/images/houseLogo.png'},
                 //   {"title":"权限设置"},
                    {"title":"成员管理","iconImage":"../common/images/memberManage.png"}
                  //  {"title":"企业黑名单"}
                ];
                break;
            default:break;
        }
        var setHtml=function () {
            var tempHtml='';
            for(var i=1;i<paramList.length;i++){
                tempHtml+="<ul class='naviLeftItem'><li class='maincontent'>"+"<div class='fakeBotBor'><img src="+(paramList[i].iconImage?paramList[i].iconImage:paramList[0].commonImg)+" />"+paramList[i].title+"</div></li>";
                for(var j=0;j<paramChild.length;j++){
                    if(j==i-1){
                        for(var k=0;k<paramChild[j].length;k++){
                            tempHtml+= "<li class='paraChild' ng-click='leftState="+(k).toString()+"'>";

                            tempHtml+=paramChild[j][k].title;

                            tempHtml+= "</li>"
                        }
                    }

                }
                tempHtml+="</ul>";
               /* tempHtml+="<div class='naviLeftItem' ><span>"+paramList[i].title+"</span><img src="+(paramList[i].iconImage?paramList[i].iconImage:paramList[0].commonImg)+" />"+"" +
                    "<div style='width: 40px; height: 30px;background-color: #00CC99'>detail1</div>"+"</div>"
                    +"<div class='naviLeftItemGap'></div>";*/
            }
            return tempHtml
        };
        var html=setHtml();
        var template=angular.element(html);
        var naviLeftElem=$compile(template)($scope);
        $('.navigationLeft>div').remove();
        angular.element(document.getElementsByClassName('navigationLeft')[0]).append(naviLeftElem);
    }

    //实例化全局STATE监听
    var refreshState=function (top,left) {
         $scope.topState=top;
         $scope.leftState=left;
        //alert(top+left);
    };
    thisGState=new globleState(refreshState);
    /////////////////////////////////aboutMapStart////////////////////////////////////////////////


    /////////////////////////////////aboutMapEnd//////////////////////////////////////////////////
});
app.directive("whenHover",function () {
    return {
        restrict: 'A',
        scope: {
            hover: "="
        },
        link: function(scope, elem, attr){
            elem.bind('mouseover', function(){
                elem.css("cursor", "pointer");
                scope.$apply(function(){
                    scope.hover = true;
                });
            });
            elem.bind('mouseleave', function(){
                scope.$apply(function(){
                    scope.hover = false;
                });
            });
        }
    }
});
app.directive("selectThis",function () {
    return {
        restrict: 'E',
        template:'<div style="width: 18px;height: 18px;margin:-1px;background-color: #AA1019;border-radius: 4px;">'
        +'<div style="position: relative; width: 4px;height: 2px;left:3px;top:11px;background-color: white;transform:rotate(55deg);transform-origin:right center;"></div>'
        +'<div style="position: relative; width: 9px;height: 2px;left:7px;top:10px;background-color: white;transform:rotate(-45deg);transform-origin:left center;"></div></div>'
    }
});
app.directive("selectArrow",function () {
    return{
        restrict:'EA',
        template:'<div style="height: 100%;width: 12px;position: relative;float: left;margin-left: 10px;">' +
                     '<div style="height: 20px;width: 100%;position: absolute;top:50%;margin-top:-10px;left:0;">' +
                           '<div name="arrow" style="height: 8px;width: 4px;border-width:4px 0px;border-style: solid; border-color:#1A1A1A; margin-left:auto;margin-right: auto;margin-top: 2px;"></div>' +
                           '<div name="arrow" style="width:10px;height5px;border-width:8px 5px 0px;border-style: solid; border-color:#1A1A1A transparent;margin-left:auto;margin-right: auto;"></div>' +
                     '</div>'+
                 '</div>'
    };
});
app.directive('selectTrigger',function () {
    return{
        restrict:'EA',
        template:'<div style="width: 38px;height: 38px;border-radius: 4px;position: absolute;right: 40px;top:40px;border: 1px solid #3A3A3A">' +
                       '<div style="width: 14px;height: 16px;margin: 9px 11px 11px;">' +
                              '<selecttrigger-line></selecttrigger-line>'+
                              '<selecttrigger-line></selecttrigger-line>'+
                              '<selecttrigger-line></selecttrigger-line>'+
                              '<selecttrigger-line></selecttrigger-line>'+
                       '</div>'+
                '</div>'
    };
});
app.directive('selecttriggerLine',function () {
   return{
       restrict:'E',
       template:'<div style="width: 2px;height: 2px;background-color: #1A1A1A;float: left;margin-top: 2px;"></div>' +
       '<div style="width: 10px;height: 2px;background-color: #1A1A1A;float: left;margin-left: 2px;margin-top: 2px;"></div>'
   };
});
app.directive('selectPopup',function () {
    return{
        restrict:'EA',
        template:'<div style="width: 220px;height: 202px;overflow:auto;background-color: white;">' +
        '<selectpop-item ng-repeat="items in selectPopList" ></selectpop-item>' +
        '</div>'
    };
});
app.directive('selectpopItem',function () {
    return{
        restrict:'EA',
        template:'<div style="width:180px; ;height:40px;margin-left: 18px;">' +
        '<select-box style="height: 16px;width: 16px;margin-top: 12px;float: left;"></select-box><div style="height: 100%;width: 120px;margin-left: 10px;float: left;line-height: 40px;font-size: 14px;">{{items.des}}</div></div>'
    }
});
app.directive('selectBox',function () {
    return{
        restrict:'EA',
        template:'<div style="width: 100%;height: 100%;border-radius: 4px;border: 1px solid #1A1A1A;"ng-init="itemShowClick=listShow[items.id]" ng-click="itemShowClick=itemShowClickChange(itemShowClick,items.id);">' +
        '<select-this ng-show="itemShowClick"></select-this></div>'
    }
});
