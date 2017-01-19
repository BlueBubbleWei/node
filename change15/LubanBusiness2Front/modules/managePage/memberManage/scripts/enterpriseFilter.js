function enterpriseFilterController() {
    var pageStart=1;    // 起始页
    var fromPaging=false;
    var scope,compile;
    //请求企业信息列表
    var postQueryLBEnterpriseParam={"deployment": "all","enterpriseName": "","linage": 150,"page": 1};
    var postQueryLBEnterpriseUrl="http://"+dbPort+"/rest/enterprise/filter";
    var getEnterpriseInfoUrl="http://"+dbPort+"/rest/enterprise/detail/queryEnterpriseInfo/";
    var postAddEnterpriseUrl="http://"+dbPort+"/rest/enterprise/filter";
    var postDeleteEnterpriseUrl="http://"+dbPort+"/rest/enterprise/filter";
    //添加筛减
    var postAddEnterpriseParam={"deployment": "","enterpriseNames": []};
    // 移除筛减
    var postDeleteEnterpriseParam={"enterpriseIds":[]};
    var selectDeployTypePop=[];
    var selectPageSize='[{"id":50,"name":50},{"id":150,"name":150},{"id":200,"name":200}]';
    var clickEnterpriseType='';

    var postError=function (msg) {
        var returnfun=function () {
            alert(msg+'ERROR');
        };
        return returnfun;
    };

    //点击搜索//搜索列表数据
    var searchEnterpriseList=function (flag) {
        if(flag==-2)fromPaging=true;
        else scope.pageStart=pageStart=1;
        // 搜索条件数据
        if(scope.inputEnterpriseName!=-1)postQueryLBEnterpriseParam.enterpriseName=scope.inputEnterpriseName;
        if(clickEnterpriseType!='')postQueryLBEnterpriseParam.deployment=clickEnterpriseType;
        postAjax(postQueryLBEnterpriseUrl, JSON.stringify(postQueryLBEnterpriseParam), queryLBEnterpriseListSuccess, postError('searchEnterpriseList'),true);
    };
    //select筛选部署类型
    var setSelectEnterpriseType=function () {
        selectDeployTypePop[0]={'id':"all",'name':'全部部署类型'};
        selectDeployTypePop[1]={'id':"enterprise",'name':'企业部署'};
        selectDeployTypePop[2]={'id':"cloud",'name':'云部署'};
        var clickFun=function (flag) {
            clickEnterpriseType=flag;
            searchEnterpriseList();
        };
        new LBSelect({container: $(".selectType"), dataJson:JSON.stringify(selectDeployTypePop),clickBack:clickFun,allowInput:false });
    };
    // 成功查询所有企业数据
    var queryLBEnterpriseListSuccess=function (data) {
        var dataObj=JSON.parse(data);
        var loginLost=scope.loginLost(dataObj.rtcode);
        if(loginLost)return;
        var enterpriseList=dataObj.result.enterpriseInfo;    // 企业详细信息
        if(!enterpriseList)return;
        scope.EntListCount=dataObj.result.pageInfo.sum;  // 共多少条数据
        if(!fromPaging) {
            setPagination(pageStart, postQueryLBEnterpriseParam.linage, scope.EntListCount, 'paging',postQueryLBEnterpriseParam,scope,compile,'enterpriseFilter');
        }
        fromPaging=false;
        var setHtml=function (itemFH,itemH) {
            var tempHtml='';
            var itemStyle='line-height: '+itemFH.toString()+'px;font-size: 16px;float: left;margin-top: '+(itemH-itemFH).toString()+'px;height:  '+itemFH.toString()+'px;';
            var deleteStyle="width: 18px;height: 18px;float: left;margin-top:15px;cursor: pointer;margin-left: 24px;background-image:url('../common/images/Remove-Icon.png');";

            var textOver='text-overflow: ellipsis;white-space: nowrap;overflow: hidden;';

            for(var i=0;i<enterpriseList.length;i++){
                var listItemStyle='height: '+itemH.toString()+'px;';
                if(i%2!=0){
                    listItemStyle+='background-color: #f5f5f5;';
                }
                tempHtml+='<div class="EnterpriseListItems" style="'+listItemStyle+'">' +
                    '<div ng-click=\'enterpriseInfo("'+enterpriseList[i].enterpriseId+'")\' style="'+itemStyle+'width: 40%;padding-left:60px;'+textOver+'" title="'+enterpriseList[i].enterpriseName+'">'+enterpriseList[i].enterpriseName+'</div>' +
                    '<div ng-click=\'enterpriseInfo("'+enterpriseList[i].enterpriseId+'")\' style="'+itemStyle+'width: 20%;padding-left:20px;'+textOver+'" title="'+enterpriseList[i].zoneName+'">' +enterpriseList[i].zoneName+'</div>' +
                    '<div ng-click=\'enterpriseInfo("'+enterpriseList[i].enterpriseId+'")\' style="'+itemStyle+'width: 20%;padding-left:20px;'+textOver+'" title="'+enterpriseList[i].addTime+'">'+enterpriseList[i].addTime+'</div>' +
                    '<div style="'+itemStyle+'width: 20%;"><div style="width: 63%;height:100%;float: right;">' +
                    '<div ng-click=\'deleteEnterprise("'+enterpriseList[i].enterpriseId+'")\' style="width: 120px;height:100%;position:relative;margin-left: 0px;">' +
                    '<div class="changeBGPosition-18" style="'+deleteStyle+'"></div>'
                    +'</div></div></div></div>';
            }
            return  tempHtml;
        };
        var IFH=50,IH=50;//单元的字行高；单元总行高
        var html=setHtml(IFH,IH);
        var template=angular.element(html);
        var EnterpriseListElem=compile(template)(scope);
        $('#EnterpriseList>div').remove();
        angular.element(document.getElementById('EnterpriseList')).append(EnterpriseListElem);
        var contentHTemp=((postQueryLBEnterpriseParam.lineage*pageStart)> scope.EntListCount)?IH*(scope.EntListCount-postQueryLBEnterpriseParam.lineage*(pageStart-1))+100:IH*postQueryLBEnterpriseParam.lineage+100;
        $('.characterListForm').css('height',contentHTemp.toString()+"px");
        $('.navigationLeft').css('height',($('#contentPage').height()+30).toString()+"px");
    };

    // 企业详情
    var enterpriseInfo = function(enterpriseId) {
        getAjax(getEnterpriseInfoUrl+enterpriseId, JSON.stringify({}), queryEnterpriseInfoSuccess, postError('queryEnterpriseInfo'),true);
    }
    // 成功查询企业详情信息
    var queryEnterpriseInfoSuccess=function(data){
        var dataObj=JSON.parse(data);
        var loginLost=scope.loginLost(dataObj.rtcode);
        if(loginLost)return;
        var enterpriseInfo=dataObj.result.resultObject;
        new LBPopupInput({
            data:{
                title:{
                    value:'企业详情',
                    align_x:'left',
                    align_y:'bottom',
                    titleIcon:1,
                    iconIndex:'7'
                },
                content:[
                    { id:0,type:'enterpriseInfo',descript:'',data:enterpriseInfo}
                ],
                size:{
                    width:650,height:280
                }
            }
        });
    }

    //成功添加筛减信息
    var addEnterpriseSuccess=function (data) {
        var loginLost=scope.loginLost(data.rtcode);
        if(loginLost)return;
        if(data.rtcode==0){
            new LBPopupInput({
                data:{
                    title:{
                        value:'提示',
                        align_x:'left',
                        align_y:'bottom'
                    },
                    content:[
                        { id:0,type:'icon',descript:''},
                        { id:1,type:'messages',descript:'',data:data.result,leftWidth:'55%',rightWidth:'23%'}
                    ],
                    endButton:[
                        {value:'继续添加',BGC:'white',FC:'#1A1A1A',type:'func',func:addEnterprise},
                        {value:'完成',BGC:'black',FC:'white',type:'close'}
                    ],
                    size:{
                        width:500,height:400
                    }
                }
            });
        }
        if(data.rtcode!=0){
            new Toast({message:(data.rtmsg).length>50?'服务异常':data.rtmsg,time:3200}).show();
        }
        searchEnterpriseList();
    };
    var addEnterprise=function () {
        var addConfirm=function (list) {
            postAddEnterpriseParam.enterpriseNames=list[0].value.split("\n");
            postAddEnterpriseParam.deployment=list[1].value;
            var isSomething=function(item){
                if(item==''||typeof(item)=='undefined'||item==null||item=='null')return false;
                else return true;
            }
            if(!isSomething(postAddEnterpriseParam.enterpriseNames)){
                new Toast({message:'企业名称不能为空',time:3200}).show();
                addEnterprise();
                return;
            }
            putAjax(postAddEnterpriseUrl, JSON.stringify(postAddEnterpriseParam),addEnterpriseSuccess, postError('AddEnterprise'));
        };

        new LBPopupInput({
            data:{
                title:{
                    value:'添加筛减',
                    align_x:'left',
                    align_y:'center'
                },
                content:[
                    { id:0,type:'textArea',descript:'企业名称:'},
                    { id:1,type:'select',descript:'企业类型:',data:selectDeployTypePop},
                    { id:2,type:'tips',descript:'提示:',data:"每行请输入一个企业名，重复将被忽略！",leftWidth:'25%',rightWidth:'64%'}

                ],
                endButton:[
                    {value:'取消',BGC:'white',FC:'#1A1A1A',type:'close'},
                    {value:'确定',BGC:'black',FC:'white',type:'func',func:addConfirm}
                ],
                size:{
                    width:500,height:360
                }
            }
        });
    };

    // 移除筛减
    var deleteEnterprise=function (enterpriseId) {
        var deleteSure=function () {
            postDeleteEnterpriseParam.enterpriseIds[0]=enterpriseId;
            deleteAjax(postDeleteEnterpriseUrl, JSON.stringify(postDeleteEnterpriseParam), deleteEnterpriseSuccess, postError('deleteEnterprise'));
        };
        new LBPopupInput({
            data:{
                title:{
                    value:'提示',
                    align_x:'left',
                    align_y:'bottom',
                    titleIcon:1,
                    iconIndex:10
                },
                content:[
                    {   id:0,type:'tips',
                        descript:'',
                        data:"被筛减的企业将不参与所有指标的统计",
                        leftWidth:'9%',
                        rightWidth:'85%',
                        icon:1,
                        iconIndex:'note'
                    }

                ],
                endButton:[
                    {value:'取消',BGC:'white',FC:'#1A1A1A',type:'close'},
                    {value:'确定',BGC:'black',FC:'white',type:'func',func:deleteSure}
                ],
                size:{
                    width:400,height:180
                }
            }
        });

    };
    var deleteEnterpriseSuccess=function (data) {
        var loginLost=scope.loginLost(data.rtcode);
        if(loginLost)return;
        searchEnterpriseList();
    };

    var pageRefresh=function (lineage) {
        postQueryLBEnterpriseParam.linage=lineage;
        postQueryLBEnterpriseParam.page = 1;
        searchEnterpriseList();
    };

    // 初始化页面
    var doRootSetController=function ($scope,$compile) {
        scope=$scope;
        compile=$compile;
        scope.searchEnterpriseList=searchEnterpriseList;
        scope.enterpriseInfo=enterpriseInfo;
        scope.deleteEnterprise=deleteEnterprise;
        scope.addEnterprise=addEnterprise;
        new LBSelect({container: $("#pageSizeSelect"), dataJson:selectPageSize,clickBack:pageRefresh,allowInput:false });
        searchEnterpriseList();   //查询企业筛检信息
        setSelectEnterpriseType();

        var sureShow=function (list) {
            scope.isShow = scope.sureShow(list);
        }

        // 是否显示筛选页面提示框
        if(scope.isShow){
            new LBPopupInput({
                data:{
                    title:{
                        value:'被筛减的企业将不参与所有指标的统计',
                        align_x:'center',
                        align_y:'bottom',
                        onlyTitle:'1',
                        titleIcon:'1',
                        iconIndex:'note'
                    },
                    content:[
                        {id:0, type:'checkbox',descript:''}
                    ],
                    endButton:[
                        {id:0,value:'不再提醒',type:'checkbox'},
                        {value:'确定',BGC:'black',FC:'white',type:'func',func:sureShow}
                    ],
                    size:{
                        width:410,height:200
                    }
                }
            });
        }
        return isShow;
    };


    return doRootSetController;
}