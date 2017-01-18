var Toast = function (config) {
    this.context = config.context == null ? $('body') : config.context; //上下文
    this.message = config.message; //显示内容
    this.time = config.time == null ? 3000 : config.time; //持续时间
    this.left = config.left; //距容器左边的距离
    this.top = config.top; //距容器上方的距离
    this.init();
}
var msgEntity;
Toast.prototype = {
    //初始化显示的位置内容等
    init: function () {
        $("#toastMessage").remove();
        //设置消息体
        var msgDIV = new Array();
        msgDIV.push('<div id="toastMessage">');
        msgDIV.push("<div  style='background-color: black;display:inline-block;padding:10px;'>");
        msgDIV.push("<span style='color:white' >    "+this.message + "    </span>");
        msgDIV.push('</div>');
        msgDIV.push('</div>');
        msgEntity = $(msgDIV.join('')).appendTo(this.context);
        //设置消息样式
        //var left = this.left == null ? this.context.width() / 2 - msgEntity.find('span').width() / 2: this.left;
        //var top = this.top == null ? this.context.height() / 2 - msgEntity.find('span').height() / 2 : this.top;
        msgEntity.css({ position: 'absolute',top:"50%", 'z-index': '9999','width':'100%','text-align':'center', color: 'white', 'font-size': '18px','border-radius':'3px' });
        msgEntity.hide();
    },
    //显示动画
    show: function () {
        msgEntity.fadeIn(this.time / 2);
        msgEntity.fadeOut(this.time / 2);
    }

}