var naviLeftMargin=230;
var defaultInTop=true;
var defaultInLeft=true;
var defaultInArea=true;
//登录失效
var  loginLost=function(msg) {
    //return true;
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
    var changePSWConfirm=function (data) {
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
                        {value:'确定',BGC:'black',FC:'white',type:'func',func:changePSWConfirm}
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
            var changePSWParam={"password": "","username": ""};
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
                {value:'确定',BGC:'black',FC:'white',type:'func',func:changePSWConfirm}
            ],
            size:{
                width:400,height:300
            }
        }
    });
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
    var contentMarginLeft=($('body').width()-naviLeftMargin)/2-$('#contentPage').width()/2;
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
app.config(function ($stateProvider,$urlRouterProvider,$controllerProvider){
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
        .state("memberManage", {  // 成员管理
            url:"/memberManage",
            templateUrl: "managePage/memberManage/memberManage.html",
            resolve: {
                deps: app.resolveScriptDeps([
                    '/LubanBusiness2Front/modules/managePage/memberManage/scripts/memberManage.js'
                ])
            },
            controller:'memberManageController'
        })
        .state("rootSetting", {   // 角色管理
            url:"/rootSetting",
            templateUrl: "managePage/memberManage/rootSetting.html",
            resolve: {
                deps: app.resolveScriptDeps([
                    '/LubanBusiness2Front/modules/managePage/memberManage/scripts/rootSetting.js'
                ])
            },
            controller:'rootSettingController'
        })
        .state("enterpriseFilter", {   // 企业筛减
            url:"/enterpriseFilter",
            templateUrl: "managePage/memberManage/enterpriseFilter.html",
            resolve: {
                deps: app.resolveScriptDeps([
                    '/LubanBusiness2Front/modules/managePage/memberManage/scripts/enterpriseFilter.js'
                ])
            },
            controller:'enterpriseFilterController'
        })
        /* .state("enterpriseFilter", {
         url:"/enterpriseFilter",
         templateUrl: "managePage/memberManage/enterpriseFilter.html",
         controller:'enterpriseFilterController'
         })*/
        .state("systemView", {
            url:"/systemView",
            templateUrl: "systemPage/template/systemView.html",
            controller:'systemViewController'
        })
        .state("userAnalysis", {
            url:"/userAnalysis",
            templateUrl: "systemPage/template/userAnalysis.html",
            controller:'userAnalysisController'
        })
        .state("funAnalysis", {
            url:"/funAnalysis",
            templateUrl: "systemPage/template/funAnalysis.html",
            controller:'funAnalysisController'
        })
        .state("questionAnalysis", {
            url:"/questionAnalysis",
            templateUrl: "systemPage/template/questionAnalysis.html",
            resolve: {
                deps: app.resolveScriptDeps([
                    '/LubanBusiness2Front/common/scripts/model-plug.js', '/LubanBusiness2Front/common/scripts/pagination.js'
                ])
            },
            controller:'questionAnalysisController'
        })

});
//成员管理页面
app.controller('memberManageController',function ($scope,$compile) {
    $scope.loginLost=loginLost;
    $scope.changePSW=changePSW;
    var memberManageSet=MemManController();
    memberManageSet($scope,$compile);
});

//权限设置页面
app.controller('rootSettingController',function ($scope,$compile) {
    $scope.loginLost=loginLost;
    var rootSettingSet=RootSetController();
    rootSettingSet($scope,$compile);
});
//企业筛减页面
var isShow=true;   // 企业筛检页面初始提示信息
app.controller('enterpriseFilterController',function ($scope,$compile) {
    $scope.loginLost=loginLost;
    var enterpriseFilterSet=enterpriseFilterController();
    isShow = enterpriseFilterSet($scope,$compile,isShow);
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

    var ListSet=LestController();
    ListSet($scope,$compile);

    (function () {
        var html='<div></div>';
        var template=angular.element(html);
        var pagination=$compile(template)($scope);
        angular.element(document.getElementById('pagination')).append(pagination);
    })();

});
//详情页面
app.controller('generalController',function ($scope,$compile,$interval) {
    $scope.loginLost=loginLost;
    $scope.areaState=0;
    var GeneralSet= MapController();
    GeneralSet($scope,$compile,$interval);
    $scope.$watch('areaState',function (newValue,oldValue) {
        watchState(newValue,oldValue,'genAreaSelect','#AA1019','transparent','white','black',3);
        $scope.areaState=newValue;
    });

});
//主页面
app.controller('businessController', function ($scope,$compile,$location,commonService) {
    $scope.topState=0;
    $scope.leftState=0;
    $scope.nameCookie=getCookie('username');
    var roleType=getCookie('roleType');
    $scope.userName=$scope.nameCookie?$scope.nameCookie+'('+roleType+')':'未找到用户';
    $scope.changePSW=changePSW;
    //退出功能
    $scope.linkLogin=linkLogin;
    //生成左侧菜单
    setNavigationLeft();

    function setStateCookie(TS,LS) {
        setCookie("BusHomMasTLCookie",TS.toString()+LS.toString());
    }
    //设置导航栏-左
    function setNavigationLeft(state) {
        commonService.getMenu('lubanb').then(function(data){
            var data = data.result;
            //console.log(data);
            var paramList = [];
            var fatherList = [];
            var subMenu1 = [];
            var subMenu2 = [];
            var subMenu3 = [];
            angular.forEach(data, function(value) {
                //console.log(value);
                if (value.father == -1) {
                    fatherList.push(value);
                } else if(value.father == 1) {
                    subMenu1.push(value);
                } else if(value.father == 2) {
                    subMenu2.push(value);
                } else {
                    subMenu3.push(value);
                }
            });
            //console.log(fatherList);
            angular.forEach(fatherList, function(value, key) {
                var unit = {};
                if(value.menuId == 1) {
                    unit.pMenu = value;
                    unit.pMenu.img = "../common/images/left_general.png";
                    unit.subMenu = subMenu1;
                } else if(value.menuId == 2) {
                    unit.pMenu = value;
                    unit.pMenu.img = "../common/images/left_list.png";
                    unit.subMenu = subMenu2;
                } else {
                    unit.pMenu = value;
                    unit.pMenu.img = "../common/images/left_list.png";
                    unit.subMenu = subMenu3;
                }
                paramList.push(unit);
            })
            $scope.paramList = paramList;
            var setHtml=function () {
                var tempHtml='';

                tempHtml+= "<div class='naviLeftItem' ng-repeat='item in paramList track by $index'><div><img ng-src={{item.pMenu.img}} /><span>{{item.pMenu.menu}}</span></div><ul><li ng-repeat='sub in item.subMenu track by $index'><span ui-sref={{sub.uri}}>{{sub.menu}}</span></li></ul></div>"+"<div class='naviLeftItemGap'></div>"
                return tempHtml
            };
            var html=setHtml();
            var template=angular.element(html);
            var naviLeftElem=$compile(template)($scope);
            $('.navigationLeft>div').remove();
            angular.element(document.getElementsByClassName('navigationLeft')[0]).append(naviLeftElem);
        });
    }
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
app.directive('clickLeft',function ($compile, $parse) {
    return{
        restrict:'EA',
        link: function(scope, element, attr) {
            $(".count-number").click(function(){
                $(this).addClass('switch-left-down');
                $(this).siblings().removeClass('switch-left-down').addClass('switch-left-up');
            })
        }

    }
});
