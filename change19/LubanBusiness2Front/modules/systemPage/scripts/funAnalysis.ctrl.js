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

    //获取功能列表,默认是productNav的第一个(根据functionName及productId)
    $scope.changeProductId = function(item){
        currentProduct = item;
        var param = {};
        param.functionName = '';
        param.productId = item.productId;
        commonService.functionList(param).then(function(data){
            $scope.functionList = data.result.functionInfoList.splice(0,6);
        });
    }

    //排序
    $scope.asByTimes = function(){
        var unit = _.sortBy($scope.functionList, 'useTimes');
        $scope.functionList = unit;
    }
    $scope.beByTimes = function(){
        var unit = _.sortBy($scope.functionList, '-useTimes');
        $scope.functionList = unit;
    }
    //2 置顶 1无状态 0置底
    //置顶置底功能
    //$scope.setTop = "置顶";
    //$scope.setBottom = "置底";
    $scope.setTop = function (item) {
        commonService.functionStatus ({"functionName":item, "productId": currentProduct.productId ,"setOrCancel":"set","topOrBottom":"top"}).then(function(res) {
            //var itemTemp = {
            //    productId:currentProduct.productId
            //};
            $scope.changeProductId(currentProduct);
        })
    }
    $scope.setBottom = function (item) {
        commonService.functionStatus ({"functionName":item, "productId": currentProduct.productId ,"setOrCancel":"set","topOrBottom":"bottom"}).then(function(res) {
            //var itemTemp = {
            //    productId:currentProduct.productId
            //};
            $scope.changeProductId(currentProduct);
        })
    }
    $scope.cancelTop = function(item){
        commonService.functionStatus ({"functionName":item, "productId": currentProduct.productId ,"setOrCancel":"cancel","topOrBottom":"top"}).then(function(res) {
            //var itemTemp = {
            //    productId:currentProduct.productId
            //};
            $scope.changeProductId(currentProduct);
        })
    }

    $scope.cancelBottom = function(item){
        commonService.functionStatus ({"functionName":item, "productId": currentProduct.productId ,"setOrCancel":"cancel","topOrBottom":"bottom"}).then(function(res) {
            //var itemTemp = {
            //    productId:currentProduct.productId
            //};
            $scope.changeProductId(currentProduct);
        })
    }

    //获取每个功能详情图表
    $scope.functionDetail = function(item){
        var param = {};
        param.functionName = item;
        param.productId = currentProduct.productId;
        commonService.functionDetail(param).then(function(){
            console.log('success');
        });

        $('#alert').remove();
        var template = '<div id="alert">' +
            '<div class="container">' +
            '<div class="alertTop"> ' +
            '<p>沙盘使用情况</p> ' +
            '<div class="closeIcon"> ' +
            '<span class="close-x"></span>' +
            '<span class="close-y"></span> ' +
            '</div> ' +
            '</div> ' +
            '</div>' +

            '</div>'
        $('.function-analysis').append(template);
        $('.closeIcon').click(function(){
            $('#alert').hide();
        })


    }


});