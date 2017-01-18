//主页面
app.controller('funAnalysisController', function ($scope,$compile,$location,commonService) {
    var a = '58379b9ea84ae629615b268a';
    commonService.testApi1(a).then(function(){
    	alert('5656');
    });
});