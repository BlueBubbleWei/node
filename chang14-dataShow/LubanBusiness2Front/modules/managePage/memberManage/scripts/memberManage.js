


function MemManController() {
    var scope,compile;
    var pageStart=1;
    //var pageSize=2;
    var selectCharacterType=[];
    var selectCharacterTypePop=[];
    var clickCharacterType='';
    var selectPageSize='[{"id":50,"name":50},{"id":150,"name":150},{"id":200,"name":200}]';
    //查询角色种类
    var  getQueryLbRoleListUrl="http://"+dbPort+"/rest/lbrole/roleList";
    //请求用户列表
    var postQueryLBUserParam={"lineage": 150,"page": 1,"role": 0,"username": ""};

    var postQueryLBUserUrl="http://"+dbPort+"/rest/lbuser/queryLBUsers";
    //删除用户
    var postDeleteLBUserParam={"username": ""};
    var postDeleteLBUserUrl="http://"+dbPort+"/rest/lbuser/delLBUser";
    //添加用户
    var postAddLBUserParam={  "password": "","remarks": "","role":1,"username": ""};
    var postAddLBUserUrl="http://"+dbPort+"/rest/lbuser/addLBUser";
    var fromPaging=false;
    var roleList=[];

    var postError=function (msg) {
      var returnfun=function () {
          alert(msg+'ERROR');
      };
      return returnfun;
    };

    //成功查询所有角色数据
    var queryLBUserListSuccess=function (data) {
        var dataObj=JSON.parse(data);
        var loginLost=scope.loginLost(dataObj.rtcode);
        if(loginLost)return;
        //var dataObj=dataObj.lbUsers;
        var userList=dataObj.result.userList;    // 用户详细信息
        if(!userList)return;
        //scope.EntListCount=(dataObj.length)?dataObj.length:0;
        scope.EntListCount=dataObj.result.sum;  // 共多少条数据
        if(!fromPaging) {
            setPagination(pageStart, postQueryLBUserParam.lineage, scope.EntListCount, 'paging',postQueryLBUserParam,scope,compile,'memberManage');
        }
        fromPaging=false;
        var setHtml=function (itemFH,itemH) {
            var tempHtml='';
            var itemStyle='line-height: '+itemFH.toString()+'px;font-size: 16px;float: left;margin-top: '+(itemH-itemFH).toString()+'px;height:  '+itemFH.toString()+'px;';
            var lineForkStyle='border:1px solid rgba(0,0,0,0.7);width:17px;height:0px;transform-origin:center center;position: absolute;left:0px;top:50%;';
            var changeStyle="width: 17px;height: 20px;background-size: 100% 100%;float: left;margin-top:"+((itemH-20)/2).toString()+"px;cursor: pointer;margin-left: 24px;";
            var changeInfoStyle=changeStyle+"background-image:url('../common/images/Edit-Icon.png');";
            var changePWDStyle=changeStyle+"background-image:url('../common/images/Lock-Icon.png');";

            var textOver='text-overflow: ellipsis;white-space: nowrap;overflow: hidden;';
            for(var i=0;i<userList.length;i++){
                tempHtml+='<div class="MemManageListItems" style="height: '+itemH.toString()+'px;">' +
                    '<div  style="'+itemStyle+'width: 25%;padding-left:60px;'+textOver+'" title="'+userList[i].username+'">'+userList[i].username+'</div>' +
                    '<div  style="'+itemStyle+'width: 15%;padding-left:20px;'+textOver+'" title="'+userList[i].roleName+'">' +userList[i].roleName+'</div>' +
                    '<div  style="'+itemStyle+'width: 40%;padding-left:20px;'+textOver+'" title="'+userList[i].remarks+'">'+userList[i].remarks+'</div>' +
                    '<div  style="'+itemStyle+'width: 20%;"><div style="width: 75%;height:100%;float: right;">' +
                    '<div style="width: 120px;height:100%;position:relative;margin-left: -73px;">' +
                    '<div ng-click=\'changeInfo("'+userList[i].username+'")\' style="'+changeInfoStyle+'"></div>'+
                    '<div ng-click=\'changePSW("'+userList[i].username+'")\' style="'+changePWDStyle+'"></div>'
                    +'<div style="float: right;width: 20px;height: 20px;margin-top:'+((itemH-20)/2).toString()+'px;position: relative;cursor: pointer;"  ng-click="deleteMember('+"'"+userList[i].username+"'"+')">'
                    +'<div style="'+lineForkStyle+' transform:rotate(45deg);"></div>'
                    +'<div style="'+lineForkStyle+'transform:rotate(-45deg);"></div></div></div></div></div></div>';
            }
            return  tempHtml;
        };
        var IFH=50,IH=50;//单元的字行高；单元总行高
        var html=setHtml(IFH,IH);
        var template=angular.element(html);
        var MemManageListElem=compile(template)(scope);
        $('#MemManageList>div').remove();
        angular.element(document.getElementById('MemManageList')).append(MemManageListElem);
        var contentHTemp=((postQueryLBUserParam.lineage*pageStart)> scope.EntListCount)?IH*(scope.EntListCount-postQueryLBUserParam.lineage*(pageStart-1))+100:IH*postQueryLBUserParam.lineage+100;
        $('.characterListForm').css('height',contentHTemp.toString()+"px");
        $('.navigationLeft').css('height',($('#contentPage').height()+30).toString()+"px");
    };
    //点击搜索//搜索列表数据
    var searchMemberList=function (flag) {
        if(flag==-2)fromPaging=true;
        else scope.pageStart=pageStart=1;
        if(scope.inputUserName!=-1)postQueryLBUserParam.username=scope.inputUserName;
        if(clickCharacterType>=0&&clickCharacterType!='')postQueryLBUserParam.role=clickCharacterType;
        postAjax(postQueryLBUserUrl, JSON.stringify(postQueryLBUserParam), queryLBUserListSuccess, postError('searchMemberList'),true);
    };
    //select筛选角色类型
    var setSelectCharacterType=function () {
        var clickFun=function (flag) {
            clickCharacterType=flag;
            searchMemberList();
        };
        new LBSelect({container: $(".selectType"), dataJson:JSON.stringify(selectCharacterType),clickBack:clickFun,allowInput:false });
    };
    //成功添加角色返回信息
    var addLBUserSuccess=function (data) {
        var loginLost=scope.loginLost(data.rtcode);
        if(loginLost)return;
        if(data.rtcode==0){
            new Toast({message:'添加成功',time:3200}).show();
        }
        if(data.rtcode!=0){
            new Toast({message:(data.rtmsg).length>50?'服务异常':data.rtmsg,time:3200}).show();
        }
        searchMemberList();
    };
    //添加人员
    var addMember=function () {
        var addConfirm=function (list) {
            postAddLBUserParam.username=list[0].value;
            postAddLBUserParam.password=list[1].value;
            postAddLBUserParam.role=list[2].value==0?1:list[2].value;
            postAddLBUserParam.remarks=list[3].value;
            var isSomething=function(item){
                if(item==''||typeof(item)=='undefined'||item==null||item=='null')return false;
                else return true;
            }
            if(!isSomething(postAddLBUserParam.username)|| !isSomething(postAddLBUserParam.password)){
                new Toast({message:'用户名或密码不能为空',time:3200}).show();
                addMember();
                return;
            }
            if((postAddLBUserParam.username).length>20){
                new Toast({message:'用户名长度应不大于20字符',time:3200}).show();
                addMember();
                return;
            }
            if((postAddLBUserParam.remarks).length>250){
                new Toast({message:'备注长度应不大于250字符',time:3200}).show();
                addMember();
                return;
            }
            putAjax(postAddLBUserUrl, JSON.stringify(postAddLBUserParam),addLBUserSuccess, postError('AddLBUser'));
        };

        new LBPopupInput({
            data:{
                title:{
                    value:'添加成员',
                    align_x:'left',
                    align_y:'center'
                },
                content:[
                    {id:0, type:'input',descript:'名称:'},
                    {id:1, type:'inputKey',descript:'密码:'},
                    { id:2,type:'select',descript:'角色:',data:selectCharacterTypePop},
                    { id:3,type:'textArea',descript:'备注:'}
                ],
                endButton:[
                    {value:'取消',BGC:'white',FC:'#1A1A1A',type:'close'},
                    {value:'确定',BGC:'black',FC:'white',type:'func',func:addConfirm}
                ],
                size:{
                    width:500,height:400
                }
            }
        });
    };
    var deleteLBUserListSuccess=function (data) {
        //var dataObj=JSON.parse(data);
        var loginLost=scope.loginLost(data.rtcode);
        if(loginLost)return;
        searchMemberList();
    };
    var deleteMember=function (userName) {
        var deleteSure=function () {
            postDeleteLBUserParam.username=userName;
            deleteAjax(postDeleteLBUserUrl, JSON.stringify(postDeleteLBUserParam), deleteLBUserListSuccess, postError('deleteMemberList'));
        };
        new LBPopupInput({
            data:{
                title:{
                    value:'是否删除该成员',
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
    var pageRefresh=function (lineage) {
        postQueryLBUserParam.lineage=lineage;
        postQueryLBUserParam.page = 1;
        searchMemberList();
    };
    //成功查询角色种类
    var queryLBRoleLSuccess=function (data) {
        var dataObj=JSON.parse(data);
        var loginLost=scope.loginLost(dataObj.rtcode);
        if(loginLost)return;
        roleList=dataObj.result;
        selectCharacterType[0]={
            'id':0,
            'name':'全部角色'
        };
        roleList.forEach(function (item,i) {
            selectCharacterType[i+1]={
                'id':item.roleId,
                'name':item.roleName
            };
        });
        //select筛选角色类型
        for(var i=selectCharacterType.length;i>1;i--){
            selectCharacterTypePop[selectCharacterType.length-i]=selectCharacterType[i-1];
        }
        setSelectCharacterType();
    };
    //查询角色种类
    var queryRoleList=function () {
        getAjax(getQueryLbRoleListUrl, JSON.stringify({}), queryLBRoleLSuccess, postError('queryLBRoleList'),true);
    };
    // 初始化页面
    var doMemManController=function ($scope,$compile,clickIn) {
        scope=$scope;
        compile=$compile;
        //点击进入还是浏览器返回进入执行刷新导航
        if(!clickIn)scope.refresh++;
        scope.searchMemberList=searchMemberList;
        scope.deleteMember=deleteMember;
        scope.addMember=addMember;
        scope.changeInfo=changeInfo;
        //查询角色类型列表
        queryRoleList();
        new LBSelect({container: $("#pageSizeSelect"), dataJson:selectPageSize,clickBack:pageRefresh,allowInput:false });
        searchMemberList();
    };

    //修改用户信息
    var changeInfo=function (name) {
        var nameCookie=getCookie('username');
        var selectType=[];
        roleList.forEach(function (item,i) {
            selectType[i]={
                'id':item.roleId,
                'name':item.roleName
            };
        });
        var changeInfoSuccess=function (data) {
            var dataObj=JSON.parse(data);
            if(dataObj.rtcode == 0){
                new Toast({message:'修改成功',time:2500}).show();
            } else {
                new Toast({message:'服务异常',time:2500}).show();
            }
            searchMemberList();
        };
        var changeInfoConfirm=function (data) {
            if(data[0].value==''||data[0].value==null||typeof(data[0].value)=='undefined'){
                new Toast({message:'角色不能为空',time:2500}).show();

                new LBPopupInput({
                    data:{
                        title:{
                            value:'编辑——'+name,
                            align_x:'center',
                            align_y:'center'
                        },
                        content:[
                            {id:0, type:'select',descript:'角色:',data:selectType},
                            {id:1, type:'textArea',descript:'备注:'}
                        ],
                        endButton:[
                            {value:'取消',BGC:'white',FC:'#1A1A1A',type:'close'},
                            {value:'确定',BGC:'black',FC:'white',type:'func',func:changeInfoConfirm}
                        ],
                        size:{
                            width:400,height:300
                        }
                    }
                });
            }
            else {
                var changeInfoParam={"remarks": "","role": 0,"username": ""};
                var changeInfoUrl="http://"+dbPort+"/rest/lbuser/updateLBUserRole";
                changeInfoParam.role=data[0].value;
                changeInfoParam.remarks=data[1].value;
                changeInfoParam.username=name;
                postAjax(changeInfoUrl, JSON.stringify(changeInfoParam), changeInfoSuccess, function () {},true);
            }
        };
        new LBPopupInput({
            data:{
                title:{
                    value:'编辑——'+name,
                    align_x:'center',
                    align_y:'center'
                },
                content:[
                    {id:0, type:'select',descript:'角色:',data:selectType},
                    {id:1, type:'textArea',descript:'备注:'}
                ],
                endButton:[
                    {value:'取消',BGC:'white',FC:'#1A1A1A',type:'close'},
                    {value:'确定',BGC:'black',FC:'white',type:'func',func:changeInfoConfirm}
                ],
                size:{
                    width:400,height:300
                }
            }
        });
    };


    return doMemManController;
}