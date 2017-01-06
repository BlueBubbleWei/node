$(function() {
   /* getAjax(myUrl+'/login/url/getUrl',null,function(data){
            var dataObj;
            dataObj=(typeof (data)=='string')?JSON.parse(data):data;
            var basicUrl = dataObj.loginUrl+'?'+'adminName='+userName+'&&password='+passWord;
            ajaxLink(basicUrl,function (data) {
                var dataObj0=(JSON.parse(data))[0];
                if(dataObj0.result && dataObj0.result.result=="success"){
                    document.location =''+dataObj.redirectUrl+'';
                }
                else if(dataObj0.result && dataObj0.result.info){
                    $('.loginMsg').css('display','block');
                    $('.loginMsg .userAndPassMsg').html(dataObj0.result.info).css('display','block');
                    $('.login-system-manage').css('marginTop','0px');
                }
            });
        },function(err){
        }
    );*/
    // alert(0)
     $(".count-number").click(function () {
         alert(1);
         // $(this).addClass("switch-left-down").siblings().removeClass('switch-left-up');
     })
});
