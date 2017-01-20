var onSuccess, onError;
//由form 提交
function postAjax(myUrl, formData, onSuccess, onError,async) {
    //formData = decodeURIComponent(formData, true);
    //myUrl = myUrl + "?ran=" + Math.random().toString();
    //formData = encodeURI(encodeURI(formData));
    async=async?async:false;
    $.ajax({
        type: "POST",
        url: myUrl,
        async: async, //true:异步请求
        cache: false,  // 设置为false将不会从浏览器缓存中加载请求信息。
        dataType: "text",
        data: formData,
        contentType : 'application/json;',
        //xhrFields: {withCredentials: true},
        success: onSuccess,
        error: onError,
        xhrFields: {withCredentials: true},
        crossDomain: true
    });
}

function getAjax(myUrl, formData, onSuccess, onError) {
    $.ajax({
        type: "GET",
        url: myUrl,
        //async: true, //异步请求
       // cache: false,  // 设置为false将不会从浏览器缓存中加载请求信息。
       // xhrFields: {withCredentials: true},
        dataType: "text",    // 服务端返回的数据
        data: formData,
        success: onSuccess,
        error: onError,
        xhrFields: {withCredentials: true},
        crossDomain: true
    });
}

function putAjax(myUrl, formData, onSuccess, onError) {
    $.ajax({
        type: "PUT",
        url: myUrl,
        //async: true, //异步请求
        // cache: false,  // 设置为false将不会从浏览器缓存中加载请求信息。
        // xhrFields: {withCredentials: true},
        contentType : 'application/json;',  // 页面发送数据
        data: formData,
        success: onSuccess,
        error: onError,
        xhrFields: {withCredentials: true},
        crossDomain: true
    });
}

function deleteAjax(myUrl, formData, onSuccess, onError) {
    $.ajax({
        type: "DELETE",
        url: myUrl,
        //async: true, //异步请求
        // cache: false,  // 设置为false将不会从浏览器缓存中加载请求信息。
        // xhrFields: {withCredentials: true},
        contentType: 'application/json;',
        data: formData,
        success: onSuccess,
        error: onError,
        xhrFields: {withCredentials: true},
        crossDomain: true
    });
}





