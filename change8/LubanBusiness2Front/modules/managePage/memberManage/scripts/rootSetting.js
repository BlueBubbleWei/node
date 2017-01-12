// 权限设置
function RootSetController() {
    var pageStart=1;
    var scope,compile;
    var selectPageSize='[{"id":50,"name":50},{"id":150,"name":150},{"id":200,"name":200}]';
    var postQueryLBRoleParam={"lineage": 150,"page": 1,"role": 0,"username": ""};
    // 查询权限列表
    var getLbRoleList="http://"+dbPort+"/rest/lbrole/rolePermissionGroupList";
    var getLbPermissionList="http://"+dbPort+"/rest/permissionGroup/permissionGroupList";
    //添加角色
    var postAddLBRoleParam={"password": "","remarks": "","role":1,"username": ""};
    // 删除角色
    var postDeleteLBRoleParam={"password": "","remarks": "","role":1,"username": ""};
    var roleList=[];
    var permissionList=[];
    var selectPermissionType=[];
    // 标记是否分页
    var fromPaging=false;

    var searchPermissionList=function () {
        if(selectPermissionType.length == 0) {
            getAjax(getLbPermissionList, JSON.stringify({}), queryLBPermissionListSuccess, postError('queryLBPermissionList'));
        }
    }

    // 删除角色
    var deleteRole=function (userName) {
        var deleteSure=function () {
            postDeleteLBRoleParam.username=userName;
            deleteAjax(postDeleteLBUserUrl, JSON.stringify(postDeleteLBUserParam), deleteLBUserListSuccess, postError('deleteMemberList'),true);
        };
        new LBPopupInput({
            data:{
                title:{
                    value:'是否删除该角色',
                    align_x:'center',
                    align_y:'bottom'
                },
                endButton:[
                    {value:'取消',BGC:'white',FC:'#1A1A1A',type:'close'},
                    {value:'确定',BGC:'black',FC:'white',type:'func',func:deleteSure}
                ],
                size:{
                    width:400,height:200
                }
            }
        });

    };

    // 添加角色
    var addRole=function () {
        var addConfirm=function (list) {
            postAddLBRoleParam.username=list[0].value;
            postAddLBRoleParam.password=list[1].value;
            var isSomething=function(item){
                if(item==''||typeof(item)=='undefined'||item==null||item=='null')return false;
                else return true;
            }
            if(!isSomething(postAddLBRoleParam.username)){
                new Toast({message:'角色名称不能为空',time:3200}).show();
                addRole();
                return;
            }
            if(!isSomething(postAddLBRoleParam.password)){
                new Toast({message:'权限范围不能为空',time:3200}).show();
                addRole();
                return;
            }
            if((postAddLBRoleParam.username).length>20){
                new Toast({message:'用户名长度应不大于20字符',time:3200}).show();
                addRole();
                return;
            }
            putAjax(postAddLBUserUrl, JSON.stringify(postAddLBRoleParam),addLBRoleSuccess, postError('AddLBUser'));
        };

        new LBPopupInput({
            data:{
                title:{
                    value:'添加角色',
                    align_x:'left',
                    align_y:'center'
                },
                content:[
                    {id:0, type:'input',descript:'角色名称:'},
                    {id:1, type:'multiCheckbox',descript:'权限范围:',data:selectPermissionType},
                    {id:2, type:'checkbox',descript:'设置为默认角色'}
                ],
                endButton:[
                    {value:'取消',BGC:'white',FC:'#1A1A1A',type:'close'},
                    {value:'确定',BGC:'black',FC:'white',type:'func',func:addConfirm}
                ],
                size:{
                    width:500,height:650
                }
            }
        });
    };
    var updateRole=function () {
        var addConfirm=function (list) {
            postAddLBRoleParam.username=list[0].value;
            postAddLBRoleParam.password=list[1].value;
            var isSomething=function(item){
                if(item==''||typeof(item)=='undefined'||item==null||item=='null')return false;
                else return true;
            }
            if(!isSomething(postAddLBRoleParam.username)){
                new Toast({message:'角色名称不能为空',time:3200}).show();
                addRole();
                return;
            }
            if(!isSomething(postAddLBRoleParam.password)){
                new Toast({message:'权限范围不能为空',time:3200}).show();
                addRole();
                return;
            }
            if((postAddLBRoleParam.username).length>20){
                new Toast({message:'用户名长度应不大于20字符',time:3200}).show();
                addRole();
                return;
            }
            putAjax(postUpdateLBRoleUrl, JSON.stringify(postAddLBRoleParam),addLBRoleSuccess, postError('AddLBUser'));
        };

        new LBPopupInput({
            data:{
                title:{
                    value:'编辑角色',
                    align_x:'left',
                    align_y:'center'
                },
                content:[
                    {id:0, type:'input',descript:'角色名称:'},
                    {id:1, type:'multiCheckbox',descript:'权限范围:',data:selectPermissionType},
                    {id:2, type:'checkbox',descript:'设置为默认角色'}
                ],
                endButton:[
                    {value:'取消',BGC:'white',FC:'#1A1A1A',type:'close'},
                    {value:'确定',BGC:'black',FC:'white',type:'func',func:addConfirm}
                ],
                size:{
                    width:500,height:650
                }
            }
        });
    };

    //成功查询权限分组列表
    var queryLBPermissionListSuccess=function (data) {
        var dataObj=JSON.parse(data);
        var loginLost=scope.loginLost(dataObj.rtcode);
        if(loginLost)return;
        // 权限分组详细信息
        permissionList=dataObj.result;
        if(!permissionList) return;
        permissionList.forEach(function (item,i) {
            selectPermissionType[i]={
                'id':item.groupId,
                'name':item.groupName
            };
        });
    };
    //成功添加角色返回信息
    var addLBRoleSuccess=function (data) {
        var loginLost=scope.loginLost(data.rtcode);
        if(loginLost)return;
        if(data.rtcode==0){
            new Toast({message:'添加成功',time:3200}).show();
        }
        if(data.rtcode!=0){
            new Toast({message:(data.rtmsg).length>50?'服务异常':data.rtmsg,time:3200}).show();
        }
        searchRoleList();
    };


    //查询角色列表
    var searchRoleList=function (flag) {
        if(flag==-2)fromPaging=true;
        else scope.pageStart=pageStart=1;
        //if(scope.inputUserName!=-1)postQueryLBUserParam.username=scope.inputUserName;
        //if(clickCharacterType>=0&&clickCharacterType!='')postQueryLBUserParam.role=clickCharacterType;
        //postAjax(postQueryLBUserUrl, JSON.stringify(postQueryLBUserParam), queryLBUserListSuccess, postError('searchMemberList'),true);
        getAjax(getLbRoleList, JSON.stringify({}), queryLBRoleLSuccess, postError('queryLbRoleList'));
    };
    //成功查询角色列表
    var queryLBRoleLSuccess=function (data) {
        var dataObj=JSON.parse(data);
        var loginLost=scope.loginLost(dataObj.rtcode);
        if(loginLost)return;
        // 角色详细信息
        roleList=dataObj.result;
        if(!roleList) return;
        scope.EntListCount=dataObj.result.length;  // 共多少条数据
        if(!fromPaging) {
            setPagination(pageStart, postQueryLBRoleParam.lineage, scope.EntListCount, 'paging',postQueryLBRoleParam,scope,compile,'rootSetting');
        }
        fromPaging=false;
        var setHtml=function (itemFH,itemH) {
            var tempHtml='';
            var itemStyle='line-height: '+itemFH.toString()+'px;font-size: 16px;float: left;margin-top: '+(itemH-itemFH).toString()+'px;height:  '+itemFH.toString()+'px;';
            var lineForkStyle='border:1px solid rgba(0,0,0,0.7);width:17px;height:0px;transform-origin:center center;position: absolute;left:0px;top:50%;';
            var changeStyle="width: 17px;height: 20px;background-size: 100% 100%;float: left;margin-top:"+((itemH-20)/2).toString()+"px;cursor: pointer;margin-left: 24px;";
            var changeInfoStyle=changeStyle+"background-image:url('../common/images/Edit-Icon.png');";
            var textOver='text-overflow: ellipsis;white-space: nowrap;overflow: hidden;';
            for(var i=0;i<roleList.length;i++){
                var defaultRoleStyle ='height: 30px;border-radius: 5px;float: left;font-size: 15px;line-height: 30px;text-align: center;color: white;margin-top: 11px;';
                if(!roleList[i].defaultRole) {   // 不是默认角色
                    defaultRoleStyle+="width: 0px;margin-right: 38px;";
                    var defaultRoleDiv = '<div style="'+defaultRoleStyle+'"></div>';
                } else {
                    defaultRoleStyle+="width: 30px;margin-right: 8px;background-color: #AA1019;";
                    var defaultRoleDiv = '<div style="'+defaultRoleStyle+'">默</div>';
                }
                tempHtml+='<div class="RoleSetListItems" style="height: '+itemH.toString()+'px;">' +
                    '<div  style="'+itemStyle+'width: 20%;padding-left:60px;'+textOver+'" title="'+roleList[i].roleName+'">' + defaultRoleDiv +
                    '<div >'+roleList[i].roleName+'</div></div>' +
                    '<div  style="'+itemStyle+'width: 60%;padding-left:20px;'+textOver+'" title="'+roleList[i].permissionGroupList+'">'+roleList[i].permissionGroupList+'</div>' +
                    '<div  style="'+itemStyle+'width: 20%;"><div style="width: 75%;height:100%;float: right;">' +
                    '<div style="width: 120px;height:100%;position:relative;margin-left: -10px;">' +
                    '<div ng-click=\'updateRole("'+roleList[i].roleName+'")\' style="'+changeInfoStyle+'"></div>'
                    +'<div style="float: right;width: 20px;height: 20px;margin-top:'+((itemH-20)/2).toString()+'px;position: relative;cursor: pointer;"  ng-click="deleteRole('+"'"+roleList[i].roleName+"'"+')">'
                    +'<div style="'+lineForkStyle+' transform:rotate(45deg);"></div>'
                    +'<div style="'+lineForkStyle+'transform:rotate(-45deg);"></div></div></div></div></div></div>';
            }
            return  tempHtml;
        };
        var IFH=50,IH=50;//单元的字行高；单元总行高
        var html=setHtml(IFH,IH);
        var template=angular.element(html);
        var RoleSetListElem=compile(template)(scope);
        $('#RoleSettingList>div').remove();
        angular.element(document.getElementById('RoleSettingList')).append(RoleSetListElem);
        var contentHTemp=((postQueryLBRoleParam.lineage*pageStart)> scope.EntListCount)?IH*(scope.EntListCount-postQueryLBRoleParam.lineage*(pageStart-1))+100:IH*postQueryLBRoleParam.lineage+100;
        $('.characterListForm').css('height',contentHTemp.toString()+"px");
        $('.navigationLeft').css('height',($('#contentPage').height()+30).toString()+"px");
    };
    var pageRefresh=function (lineage) {
        postQueryLBRoleParam.lineage=lineage;
        postQueryLBRoleParam.page = 1;
        searchRoleList();
    };
    // 初始化页面
    var doRootSetController=function ($scope,$compile,clickIn) {
        scope=$scope;
        compile=$compile;
        //点击进入还是浏览器返回进入执行刷新导航
        if(!clickIn)scope.refresh++;
        scope.searchRoleList=searchRoleList;
        scope.searchPermissionList=searchPermissionList;
        scope.deleteRole=deleteRole;
        scope.addRole=addRole;
        scope.updateRole=updateRole;
        new LBSelect({container: $("#pageSizeSelect"), dataJson:selectPageSize,clickBack:pageRefresh,allowInput:false });
        searchRoleList();   //查询角色类型信息
        searchPermissionList(); //查询权限列表信息
        //searchMemberList();
    };
    var postError=function (msg) {
        var returnfun=function () {
            alert(msg+'ERROR');
        };
        return returnfun;
    };

    return doRootSetController;

}
