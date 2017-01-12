

//管理系统版本切换ajax
function ajaxLink(basicUrl,func){
	$.ajax({
		type:"POST",
		url:basicUrl,
		dataType:'JSONP',
		success: func
	});
}




