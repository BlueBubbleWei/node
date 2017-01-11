$(function(){
	$('.login-userInfo .username input').click(function(){
		$(this).parent().css('borderColor','#aa1019');
	})
	$('.login-userInfo .username input').blur(function(){
		$(this).parent().css('borderColor','#ddd');
	})
	//生成复选框
	var checkCount = false;//复选框的选中状态
	var cutCount = 1;//切换版本
	var listIndex =1;
	function createCheckbox(obj,color){
		if(obj.attr('name')=='false')return;
		var loginCheckedBox = '<div class="login-checked" style="borderColor:'+color+'"></div>'
		obj.append(loginCheckedBox);
	}
	
	$('.check-box').click(function(){
		checkCount=!checkCount;
		if(checkCount){
			$(this).css('borderColor','#aa1019');
			$(this).attr('name','true');
			createCheckbox($('.check-box'),"#aa1019");

		}else{
			$(this).find('.login-checked').remove();
			$(this).css('borderColor','#ddd');
			$(this).attr('name','false');
		}

	});
	
	
	//登录页面
	function isEmpty(obj,event){
		$(obj).on(event,function(){
			var loginVal = $(this).val();
			if(loginVal.length==0){
				$('.loginMsg').css('display','block');
				$('.loginMsg .userAndPassMsg').html('用户名或者密码不能为空').show();
				$('.login-system-manage').css('marginTop','0px');
			}else{
				$('.loginMsg').css('display','none');
				$('.loginMsg .userAndPassMsg').hide();
				$('#passWord.username').css('marginBottom','20px');
				$('.login-system-manage').css('marginTop','20px');
			}
		})
	}
	isEmpty($('#passWord'),'blur');
	isEmpty($('#userName'),'blur');
	
	//点击登录时调用ajax请求  进行登录验证
	var myUrl = 'http://'+dbPort;
	var listSystem = [
		{name:'运营管理系统1.0'},
		{name:'运营管理系统2.0'},
	];
	var oPelement = '';
	for(var i = 0;i<listSystem.length;i++){
		oPelement+='<p name="listItem">'+listSystem[i].name+'</p>'
	}
	$('.listSystem').append(oPelement);
	//切换版本信息
	function swichBlank(obj,showElement){
		$(obj).click(function(){
			cutCount++;
			if(cutCount%2==0){
				$(showElement).show();
			}else{
				$(showElement).hide();
			}
			
		});
		$(obj).mouseleave(function(){
			$('.listSystem').hide();
		});
		
	}
	swichBlank($('.login-system-manage'),$('.listSystem'));

		$('.listSystem').on('click','[name]',function(){
				listIndex = $(this).index();
			$('.screenValue').text($(this).text());
		});


	var userName = '';
	var passWord = '';
	 //初始化页面时验证是否记住了密码
     $(document).ready(function () {
        if (getCookie("password") != null && getCookie("password") != '') {
		checkCount = true;
			$('.check-box').attr('name',checkCount.toString());
			createCheckbox($('.check-box'),"#aa1019");
        $("#userName").val(getCookie("username"));
        $("#passWord").val(getCookie("password"));
        }
    });
	//登录界面
	function loginEnter(){
		$('#passWord,#userName').trigger('blur');
		//用户名和密码框的val值
		userName = $('#userName').val();
		passWord = $('#passWord').val();

		if(userName.length !=0 && passWord.length !=0){
			//密码加密
			if(passWord.length!=32){
				passWord = $.md5(passWord);
			}
			//查询business1.0登录URL配置
			if(listIndex==0){
				getAjax(myUrl+'/login/url/getUrl',null,function(data){
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
			);
			}
			else if(listIndex==1){
				postAjax(myUrl+'/login',JSON.stringify({"username":userName,"password":passWord}),function(data){
					var dataObj=JSON.parse(data);
					if(dataObj.rtcode=='1'){
						$('.loginMsg').css('display','block');
						$('.loginMsg .userAndPassMsg').html(dataObj.rtmsg).css('display','block');
						$('.login-system-manage').css('marginTop','0px');
					}
					//判断是否记住密码
					if(dataObj.rtcode=='0'){
						if ($('.check-box').attr('name')=='true') {     //这里要使用is(":checked")判断是否勾选
							setCookie("username", userName);
							setCookie("password", passWord);
							setCookie("roleType", dataObj.roleType);
						}
						else if ($('.check-box').attr('name')=='false') {     //这里要使用is(":checked")判断是否勾选
							setCookie("username",userName);
							setCookie("password","");
							setCookie("roleType",dataObj.roleType);
						}
						location.href='../homeMaster.html';
					}

				},function(error){
				},true);

			}

		}
	}
	$('.login-enter').click(function(){
		loginEnter();
	})
	///-----------------------------------------------------
//	按enter进入主界面
	//监听keydown
	$(document).bind('keydown keyup keypress',function(ev){
		var ev = ev||ev.event;
		var keyCode = ev.keyCode|| ev.which;
		if (keyCode == 13)
			loginEnter();
	})
	///-----------------------------------------------------
})
