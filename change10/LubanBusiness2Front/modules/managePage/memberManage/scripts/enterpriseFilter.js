/*//主页面
app.controller('enterpriseFilterController', function ($scope,$compile,$location) {
    alert('enterpriseFilterController')
});*/

function enterpriseFilterController() {
    //var pageStart=1;
    var scope,compile;
    var postError=function (msg) {
        var returnfun=function () {
            alert(msg+'ERROR');
        };
        return returnfun;
    };

    // 初始化页面
    var doRootSetController=function ($scope,$compile,clickIn) {
        alert("enterprise test");
        scope=$scope;
        compile=$compile;
        //点击进入还是浏览器返回进入执行刷新导航
        if(!clickIn)scope.refresh++;
        //scope.searchRoleList=searchRoleList;
        //scope.searchPermissionList=searchPermissionList;
        //scope.deleteRole=deleteRole;
        //scope.addRole=addRole;
        //scope.updateRole=updateRole;
        // 此页面暂时不需要分页 后端也没有提供分页参数
        // new LBSelect({container: $("#pageSizeSelect"), dataJson:selectPageSize,clickBack:pageRefresh,allowInput:false });
        //searchRoleList();   //查询角色类型信息
        //searchPermissionList(); //查询权限列表信息
        //searchMemberList();
    };


    return doRootSetController;
}