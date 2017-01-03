


function MemManController() {
    var scope,compile;
    var pageStart=1;
    var pageSize=150;
    var selectCharacterType=[];
    var selectCharacterTypePop=[];
    var clickCharacterType='';
    var selectPageSize='[{"id":50,"name":50},{"id":150,"name":150},{"id":200,"name":200}]';
    //查询角色种类
    var  postQueryLbRoleList="http://"+dbPort+"/rest/lbrole/queryRoleList";
    //请求用户列表
    var postQueryLBUserParam={"password": "","remarks": "","role":0 ,"username": -1};
    var postQueryLBUserUrl="http://"+dbPort+"/rest/lbuser/querLBUsers";
    //删除用户
    var postDeleteLBUserParam={"password": "","remarks": "","role":0 ,"username": ""};
    var postDeleteLBUserUrl="http://"+dbPort+"/rest/lbuser/delLBUser";
    //添加用户
    var postAddLBUserParam={  "password": "","remarks": "","role":1,"username": ""};
    var postAddLBUserUrl="http://"+dbPort+"/rest/lbuser/addLBUser";
    var fromPaging=false;

    var postError=function (msg) {
      var returnfun=function () {
          alert(msg+'ERROR');
      };
      return returnfun;
    };
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
            searchMemberList(-2);
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
   //成功查询所有角色数据
    var queryLBUserListSuccess=function (data) {
        var dataObj=JSON.parse(data);
        var loginLost=scope.loginLost(dataObj.rtcode);
        if(loginLost)return;
        var dataObj=dataObj.lbUsers;
        if(!dataObj)return;
        scope.EntListCount=(dataObj.length)?dataObj.length:0;
        if(!fromPaging) {
            setPagination(pageStart, pageSize, dataObj.length, 'paging');
        }
        fromPaging=false;
        var setHtml=function (itemFH,itemH) {
            var tempHtml='';
            var itemStyle='line-height: '+itemFH.toString()+'px;font-size: 16px;float: left;margin-top: '+(itemH-itemFH).toString()+'px;height:  '+itemFH.toString()+'px;';
            var lineForkStyle='border:1px solid rgba(0,0,0,0.7);width:17px;height:0px;transform-origin:center center;position: absolute;left:0px;top:50%;';
            var changePWDStyle="width: 17px;height: 20px;margin-top:"+((itemH-20)/2).toString()+"px;background-image:url('../common/images/Lock-Icon.png') ;background-size: 100% 100%;float: left;cursor: pointer;";
            var textOver='text-overflow: ellipsis;white-space: nowrap;overflow: hidden;';
            for(var i=(pageStart-1)*pageSize;i<((dataObj.length>pageStart*pageSize)?pageStart*pageSize:dataObj.length);i++){

                tempHtml+='<div class="MemManageListItems" style="height: '+itemH.toString()+'px;">' +
                    '<div  style="'+itemStyle+'width: 25%;padding-left:60px;'+textOver+'" title="'+dataObj[i].username+'">'+dataObj[i].username+'</div>' +
                    '<div  style="'+itemStyle+'width: 15%;padding-left:20px;'+textOver+'" title="'+dataObj[i].roleName+'">' +dataObj[i].roleName+'</div>' +
                    '<div  style="'+itemStyle+'width: 40%;padding-left:20px;'+textOver+'" title="'+dataObj[i].remarks+'">'+dataObj[i].remarks+'</div>' +
                    '<div  style="'+itemStyle+'width: 20%;"><div style="width: 75%;height:100%;float: right;"><div style="width: 70px;height:100%;position:relative;margin-left: -35px;"><div ng-click=\'changePSW("'+dataObj[i].username+'")\' style="'+changePWDStyle+'"></div>'
                    +'<div style="float: right;width: 20px;height: 20px;margin-top:'+((itemH-20)/2).toString()+'px;position: relative;cursor: pointer;"  ng-click="deleteMember('+"'"+dataObj[i].username+"'"+')">'
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
        var contentHTemp=((pageSize*pageStart)> scope.EntListCount)?IH*(scope.EntListCount-pageSize*(pageStart-1))+100:IH*pageSize+100;
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
        new LBSelect({container: $("#characterType"), dataJson:JSON.stringify(selectCharacterType),clickBack:clickFun,allowInput:false });
    };
    //成功添加角色返回信息
    var addLBUserSuccess=function (data) {
        var dataObj=JSON.parse(data);
        var loginLost=scope.loginLost(dataObj.rtcode);
        if(loginLost)return;
        if(dataObj.rtcode==0){
            new Toast({message:'添加成功',time:3200}).show();
        }
        if(dataObj.rtcode!=0){
            new Toast({message:(dataObj.rtmsg).length>50?'服务异常':dataObj.rtmsg,time:3200}).show();
        }
        searchMemberList();
    };
    //添加角色
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
                new Toast({message:'用户名长度应不大于250字符',time:3200}).show();
                addMember();
                return;
            }
            postAjax(postAddLBUserUrl, JSON.stringify(postAddLBUserParam),addLBUserSuccess, postError('AddLBUser'),true);
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
        var dataObj=JSON.parse(data);
        var loginLost=scope.loginLost(dataObj.rtcode);
        if(loginLost)return;
        searchMemberList();
    };
    var deleteMember=function (userName) {
        var deleteSure=function () {
            postDeleteLBUserParam.username=userName;
            postAjax(postDeleteLBUserUrl, JSON.stringify(postDeleteLBUserParam), deleteLBUserListSuccess, postError('deleteMemberList'),true);
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
    var pageRefresh=function (flag) {
        pageSize=flag;
        searchMemberList();
    };
    //成功查询角色种类
    var queryLBRoleLSuccess=function (data) {
        var dataObj=JSON.parse(data);
        var loginLost=scope.loginLost(dataObj.rtcode);
        if(loginLost)return;
        var roleList=dataObj.roleAndPermissionResults;
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
        postAjax(postQueryLbRoleList, JSON.stringify({}), queryLBRoleLSuccess, postError('queryLBRoleList'),true);
    };
    var doMemManController=function ($scope,$compile,clickIn) {
        scope=$scope;
        compile=$compile;
        //点击进入还是浏览器返回进入执行刷新导航
        if(!clickIn)scope.refresh++;
        scope.searchMemberList=searchMemberList;
        scope.deleteMember=deleteMember;
        scope.addMember=addMember;
        //查询角色类型列表
        queryRoleList();
        new LBSelect({container: $("#pageSizeSelect"), dataJson:selectPageSize,clickBack:pageRefresh,allowInput:false });
        searchMemberList();
    };


    return doMemManController;
}