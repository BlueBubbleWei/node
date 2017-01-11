//设置页码控件
// 参数：start-开始页；size-单页条数；count-总条数；DOM-当前控件所在DIV；postParam-请求参数
// scope-$scope；compile-$compile；type-memberManage/rootSetting/epFilter调用对应页面的数据显示
function setPagination (start,size,count,DOM,postParam,scope,compile,type) {
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
    var clicked=start;
    //调用回调事件
    var refreshPageStart=function (start) {
        postParam.page = start;
        scope.$apply(function () {
            scope.pageStart=start;
        });
        switch (type){
            case 'memberManage':    // 成员管理页面数据刷新
                scope.searchMemberList(-2);
                break;
            case 'rootSetting': // 权限设置页面
                scope.searchRoleList(-2);
                break;
            case 'epFilter':    // 企业筛检页面

                break;
            default:break;
        }

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
