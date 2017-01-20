//主页面
app.controller('funAnalysisController', function ($scope,$compile,$location,commonService) {
    var a = '58379b9ea84ae629615b268a';
    var currentProduct;
    //获取产品名称及productId
    commonService.producturl().then(function(data){
        $scope.productNav = data.result.resultList[1].groupList;
        currentProduct = $scope.productNav[0];
        //默认获取productNav第一个的functionList
        $scope.changeProductId(currentProduct);
    });

    var name = '毛丽';
    commonService.getMenu(name).then(function(data){
    	alert('getMenu');
    	console.log(data);
    });

    //functionStatus 传参
    //    {
	//   "functionName": "沙盘",
	//   "productId": 0,
	//   "setOrCancel": "set",
	//   "topOrBottom": "bottom"
	// }

    //获取功能列表,默认是productNav的第一个(根据functionName及productId)
    $scope.changeProductId = function(item){
        currentProduct = item;
        var param = {};
        param.functionName = '';
        param.productId = item.productId;
        commonService.functionList(param).then(function(data){
            $scope.functionList = data.result.functionInfoList.splice(0,6);
            console.log(data);
        });
    }

    //获取每个功能详情图表
    $scope.functionDetail = function(item){
        var param = {};
        param.functionName = item;
        param.productId = currentProduct.productId;
        commonService.functionDetail(param).then(function(){
            console.log('success');
        });
    }

});