

var LBGetLength = function(str,uCode) {
    var realLength = 0;
    var multiple=1;
    switch (uCode){
        case 'gb2312':
            multiple=2;break;
        case 'utf-8':
            multiple=4;break;
        default:break;
    }
    for (var i = 0; i < str.length; i++) {
        var charCode = str.charCodeAt(i);
        if (charCode >= 0 && charCode <= 128) realLength += 1;
        else realLength += multiple;
    }
    return realLength;
};


(function($){
    var jsonParse = window.JSON && JSON.parse ? JSON.parse : eval;
    var LBSelect=function (options) {
        this.options = $.extend({}, options || {});
        this.init();
    };
    // 原型
    LBSelect.prototype = {
        constructor: LBSelect,
        keywords: '',
        init: function() {
            if (!this.options.container) return;
            this.dataList =(this.options.dataJson)? jsonParse(this.options.dataJson):{};
            this.initContainer();
            this.listenFocus();
            this.listenBlur();
            this.listenTrigger();
            this.listenSearch();
            this.listenBodyClick();
            this.listenMouseenter();
            if(this.dataList.length<=0)return;
            this.listenSelect();


        },
        initContainer: function() {
            this.$container = $(this.options.container).addClass('LBSelectVessel');
            this.allowInput=(typeof(this.options.allowInput)!='undefined')?this.options.allowInput:true;
            this.readOnly=(this.allowInput)?'':'readonly="readonly" style="cursor:pointer;"';
            this.v1=(this.$container.data('default-value'));
            var v2=(this.$container.data('placeholder'));
            this.v1=((this.v1==undefined||this.v1==''||typeof(this.v1)=='undefined'||this.v1==null))&&(this.dataList.length>0)?this.dataList[0].name:this.v1;
            v2=(v2==undefined)?"":v2;
            var tpl = '<div class="LBSelectWap"><input '+this.readOnly+' class="LBSelectInput" value="' + this.v1 +'" placeholder="' + v2 + '"><div class="LBSelectPDown"><i></i></div></div><div class="LBSelectList"></div>';
            this.clickBack=(this.options.clickBack)?this.options.clickBack:function () {};
            this.$container.html(tpl);
            this.$input = this.$container.find('.LBSelectInput');
            this.$list = this.$container.find('.LBSelectList');
            this.$filterList = $();
            this.$trigger = this.$container.find('.LBSelectPDown');
            this.$container.data({
                'customSelect': this,
                'value': ''
            });
        },
        _isRended: false,
        _isResetSize: false,
        _highlightIndex: -1,
        _seletedIndex: -1,

        highlight: function(idx) {
            idx = idx !== undefined && idx > -1 ? idx : this._highlightIndex;
            idx >= 0 && this.$filterList.children().removeClass('hover').eq(idx).addClass('hover');
        },
        renderList: function(list) {
            var listTpl = '',
                len = list.length;
            if (len > 0) {
                for (var i = 0; i < len; i++) {
                    listTpl += '<span name="' + list[i].id + '">' + list[i].name + '</span>';
                }
                this.$list.html(listTpl).slideDown('fast');
            } else {
                this.$list.html(listTpl).hide();
            }
            this.filterDataList = list;
            this._isRended = true;
            // if (!this._isResetSize) {
            //     this._isResetSize = true;
            //     this.$list.css({
            //         width: this.$list[0].scrollWidth + 25 + 'px'
            //     });
            // }
        },
        search: function() {
            if (this.keywords === '' || this.keywords === this.v1) {
                this.$input.val('');
                this.renderList(this.dataList);
                this.$filterList = this.$list;
                return;
            }
            var searchList = [];
            var len = this.dataList.length;
            var reg = new RegExp(this.keywords, 'ig');

            for (var i = 0; i < len; i++) {
                var dataItem = this.dataList[i];
                dataItem.name.match(reg) && (searchList.push(dataItem));
               // this.$filterList = this.$filterList.add(this.$list.eq(i));
            }
            this.renderList(searchList);
        },
        listenFocus: function() {
            var self = this;
            this.$input.on('focus', function() {
                if (self._isRended && self.filterDataList.length > 0) {
                    self.highlight(self._seletedIndex);
                    self.$list.slideDown('fast');
                    return;
                }
                self.search();
            });
        },
        listenBlur: function() {
            var self = this;
            this.$input.on('blur', function() {
                if (self.filterDataList.length === 0) {
                    self.$input.val(self.v1);
                    self.keywords = '';
                } else if ($.trim(self.$input.val()) === '') {
                    self.$input.val(self.v1);
                }
            });
        },
        keyboardSelect: function(code) {
            if (code === 38) {
                this._highlightIndex > 0 ?this._highlightIndex--:null;
                this.highlight();
            } else if (code === 40) {
                this._highlightIndex < this.filterDataList.length ?this._highlightIndex++:null;
                this.highlight();
            }
            this._seletedIndex = this._highlightIndex;
           // this.callbackKeyword();
        },
        listenSearch: function() {
            var self = this;
            this.$input.on('keyup', function(e) {
                var code = e.keyCode || e.which;
                self.keywords = $.trim(self.$input.val());

                if (code === 38 || code === 40) {
                    self.keyboardSelect(code);
                } else if (code === 13 && self._highlightIndex >= 0&&self.filterDataList.length>self._highlightIndex-1) {
                    var selectObj = self.filterDataList[self._highlightIndex];
                    self.$input.val(selectObj.desc?selectObj.desc:selectObj.name);
                    self.$container.data('value', selectObj.id);

                    self.$list.hide();
                    self.$input.trigger('blur');
                } else {
                    self.search();
                }
            });
        },
        listenTrigger: function() {
            var self = this;
            this.$trigger.on('click', function() {
                if (self._isRended && self.filterDataList.length > 0) {
                    self.$list.slideToggle('fast');
                } else {
                    self.$input.trigger('focus');
                }
            });
        },
        listenSelect: function() {
            var self = this;
            self.$container.on('click', '[name]', function() {
                var $this = $(this),
                    value = $this.data('value');

                self.keywords = $this.text();
                self.$list.hide();
                self.$container.data('value', value);
                self._seletedIndex=$(this).index();
                self.$input.val(self.dataList[self._seletedIndex].desc? self.dataList[self._seletedIndex].desc:  $this.text());
                self.clickBack($(this).attr('name'));
            });
        },
        listenMouseenter: function() {
            var self = this;
            this.$container.on('mouseenter', '[name]', function() {
                    var $childs = self.$filterList.children();
                    var i = self._highlightIndex = $(this).index();
                    $childs.removeClass('hover').eq(i).addClass('hover');
                });
        },
        listenBodyClick: function() {
            var self = this;
            $('body').on('click', function(e) {
                if ($(e.target).parents('.LBSelectVessel')[0] !== self.$container[0]) {
                    self.$list.hide();
                }
            });
        }

    };
     window.LBSelect = LBSelect;

}(jQuery));

var LBLineChart = function( options ) {
    var self=this;
    self.data = options.data;
    self.cav = document.getElementById(options.canvasID);
    self.cavIndex=((self.cav.style.zIndex!='')&&(self.cav.style.zIndex))?self.cav.style.zIndex:999;
    self.cavRect = self.cav.getBoundingClientRect();
    self.father=options.canvasFather?options.canvasFather:null;
    self.interaction;self.textLineHeight="80px";
    self.mouseMoving=false;
    if(!self.cav)return;
    var ctx = this.cav.getContext( '2d' );
    (options.unit)?self.unit=options.unit:null;
    ctx.mozImageSmoothingEnabled = false;ctx.webkitImageSmoothingEnabled = false;ctx.msImageSmoothingEnabled = false;ctx.imageSmoothingEnabled = false;
    var lineColor=options.themeColor.lineColor ,fillColor=options.themeColor.fillColor ,BGColor=options.themeColor.canvasBGColor ,yC=options.themeColor.yColor;//颜色主题设置
    self.paddingL=150;self.paddingY=40;self.paddingR=150;
      var  width = options.width || window.innerWidth, height = options.height || window.innerHeight;
    self.cav.width = width;
    self.cav.height = height;
        var maxValue, minValue;
    var y1 = self.paddingY + ( 0 * ( height-200 - ( self.paddingY * 2 ) ) ), y2 = self.paddingY + ( 0.2 * ( height-200 - ( self.paddingY * 2 ) ) ),
        y3 = self.paddingY + ( 0.4 * ( height-200 - ( self.paddingY * 2 ) ) ), y4 = self.paddingY + ( 0.6 * ( height-200 - ( self.paddingY * 2 ) ) ),
        y5 = self.paddingY + ( 0.8 * ( height-200 - ( self.paddingY * 2 ) ) ), y6 = self.paddingY + ( 1 * ( height-200 - ( self.paddingY * 2 ) ) );
    var yAxisList=[Math.ceil(y1) ,Math.ceil(y2) ,Math.ceil(y3) ,Math.ceil(y4) ,Math.ceil(y5) ,Math.ceil(y6)];
    self.addEventListener=function () {
        var revealI=0;
        var revealTipVertical=false;
        var doMousemove=function (evt) {
            if(self.mouseMoving)return;
            self.mouseMoving=true;
            function getMousePos(ele, evt) {
                var newRect=ele.getBoundingClientRect();
                return {
                    x: parseFloat((evt.clientX - newRect.left) * (ele.width / newRect.width)).toFixed(2),
                    y: parseFloat((evt.clientY - newRect.top) * (ele.height / newRect.height)).toFixed(2)
                }
            }
            var mousePos = getMousePos(self.interaction, evt);
            var whileGetPoint=function (x,y) {

              self.data.forEach(function (point,i) {
                  // alert(width+'--'+y);
                  if(Math.abs(x-point.x)<(( width - ( self.paddingL+self.paddingR ) ) / (2*( self.data.length - 1 )))&&Math.abs(height-y)>250&&Math.abs(height-y)<940){
                      //添加竖线
                      if(!self.tipVertical)self.tipVertical=document.createElement('div');
                       //self.tipVertical.id     = "tipVerticalID";
                       self.tipVertical.style.zIndex   =self.interaction.style.zIndex+1;
                       self.tipVertical.style.position = "absolute";
                       self.tipVertical.style.left   = (100*(point.x-0.5*(width/self.cavRect.width))/width)+"%";
                       self.tipVertical.style.top   = 100*self.paddingY/height+'%';
                       self.tipVertical.style.width   = '1px';
                       self.tipVertical.style.height   =100*(height- self.paddingY*2-200)/height+'%';
                       self.tipVertical.style.backgroundColor   ='rgba(0,0,0,0.3)';
                       self.interaction.appendChild(self.tipVertical);
                      revealTipVertical=true;
                      revealI=i;
                      //添加tip框
                      self.tipsBox.style.display='block';
                      var tipsTopText=self.data[i].label+(self.unit?self.unit.unit.XAxis:'');
                      var tipsBottomText=self.data[i].value+(self.unit?self.unit.unit.YAxis:'');
                      var len1=LBGetLength(tipsTopText,'utf-8'),len2=LBGetLength(tipsBottomText,'utf-8');
                      var maxLength=len1>len2?len1:len2;
                      var desLen1=LBGetLength(self.unit.unitDes.XAxis,'utf-8'),desLen2=LBGetLength(self.unit.unitDes.YAxis,'utf-8');
                      var maxDesLength=desLen1>desLen2?desLen1:desLen2;
                      var complemented=function (str,maxLen) {
                          var temp=maxLen-LBGetLength(str,'utf-8');
                          var returnStr='';
                          for(var i=0;i<temp+1;i++){
                              returnStr+='&nbsp;'
                          }
                          return returnStr;
                      };
                      self.tipsBox.style.width=(maxLength+maxDesLength)*6+'px';
                      self.tipsBox.style.left=(100*x/width+2)>50?((100*x/width+2)-((maxLength+maxDesLength)*600/self.cavRect.width)-2)+"%":(100*x/width+2)+"%";
                      self.tipsBox.style.top = (100*y/height+4)+"%";
                      //tips内部text
                      (function () {
                          if(!self.topText)self.topText=document.createElement('div');
                          self.topText.style.width   = '100%';
                          self.topText.style.height   =parseInt(self.textLineHeight)/2+'px';
                          self.topText.style.color   ='white';
                          self.topText.style.fontSize='15px';
                          self.topText.style.paddingLeft='15px';
                          self.topText.style.fontFamily='Microsoft YaHei';
                          self.topText.style.lineHeight=parseInt(self.textLineHeight)/2+'px';
                          self.topText.innerHTML=self.unit.unitDes.XAxis+complemented(self.unit.unitDes.XAxis,maxDesLength)+' :'+self.data[i].label+(self.unit?self.unit.unit.XAxis:'');
                          self.tipsBox.appendChild(self.topText);

                          if(!self.bottomText)self.bottomText=document.createElement('div');
                          self.bottomText.style.width   = '100%';
                          self.bottomText.style.height   =parseInt(self.textLineHeight)/2+'px';
                          self.bottomText.style.lineHeight=parseInt(self.textLineHeight)/2+'px';
                          self.bottomText.style.color   ='white';
                          self.bottomText.style.fontSize='15px';
                          self.bottomText.style.paddingLeft='15px';
                          self.bottomText.style.fontFamily='Microsoft YaHei';
                          self.bottomText.innerHTML=self.unit.unitDes.YAxis+complemented(self.unit.unitDes.YAxis,maxDesLength)+':'+self.data[i].value+(self.unit?self.unit.unit.YAxis:'');
                          self.tipsBox.appendChild(self.bottomText);
                      })();
                  }
                  else {
                      if(revealTipVertical && revealI==i){
                          self.tipVertical.parentNode.removeChild(self.tipVertical);
                          self.topText.parentNode.removeChild(self.topText);
                          self.bottomText.parentNode.removeChild(self.bottomText);
                          self.tipsBox.style.display='none';
                          revealTipVertical=false;
                      }
                  }
              });
            };
            whileGetPoint(mousePos.x,mousePos.y);
            self.mouseMoving=false;
        };
        self.interaction.addEventListener('mousemove',doMousemove,false);
    };
    self.drawInteraction=function () {
        self.interaction=document.createElement('div');
        self.interaction.width  = self.cav.width;
        self.interaction.height = self.cav.height;
        self.interaction.style.zIndex   =self.cavIndex+1;
        self.interaction.style.position = "absolute";
        self.interaction.style.left   = '0px';
        self.interaction.style.top   = '0px';
        self.interaction.style.width   = '100%';
        self.interaction.style.height   = '100%';
        self.interaction.style.backgroundColor   ='rgba(0,0,0,0)';
        if(self.father)document.getElementById(this.father).appendChild(self.interaction);
    };
    self.drawTip=function () {
        self.tipsBox=document.createElement('div');
        self.tipsBox.id     = "cavInteraction";
        self.tipsBox.style.zIndex   =self.interaction+1;
        self.tipsBox.style.position = "absolute";
        self.tipsBox.style.borderRadius='4px';
        self.tipsBox.style.height=self.textLineHeight;
        self.tipsBox.style.backgroundColor   ='rgba(0,0,0,0.8)';
        self.tipsBox.style.display='none';
        self.interaction.appendChild(self.tipsBox);
    };
    format();
    render();
    this.drawInteraction();
    this.drawTip();
    this.addEventListener();
    function format(  ) {
            maxValue = 0;
            minValue = Number.MAX_VALUE;
            self.data.forEach( function( point) {
                maxValue = Math.max( maxValue, parseInt(point.value) );
                minValue = Math.min( minValue, parseInt(point.value) );
                minValue=minValue>0?0:minValue;
            } );
            maxValue=maxValue<=50?50:maxValue;
            maxValue=Math.ceil(maxValue*1.2/100)*100;
            self.data.forEach( function( point, i ) {
                point.x = self.paddingL + ( ( width - ( self.paddingL+self.paddingR ) ) / ( self.data.length - 1 ) ) * i;
                point.y = self.paddingY + ( ( point.value - minValue ) / ( maxValue - minValue ) * ( height-200 - ( self.paddingY * 2 ) ) );
                point.y = height - point.y-200;
            } );
    }
    function render() {
            ctx.clearRect( 0, 0, width, height );
            ctx.beginPath();
            ctx.strokeStyle = yC;
            ctx.lineWidth = 3;
            ctx.moveTo( self.paddingL, y1 );
            ctx.lineTo( width -  self.paddingR , y1 );
            ctx.moveTo( self.paddingL, y2 );
            ctx.lineTo( width -  self.paddingR , y2 );
            ctx.moveTo( self.paddingL, y3 );
            ctx.lineTo( width -  self.paddingR , y3 );
            ctx.moveTo( self.paddingL, y4 );
            ctx.lineTo( width -  self.paddingR , y4 );
            ctx.moveTo( self.paddingL, y5 );
            ctx.lineTo( width -  self.paddingR , y5 );
            ctx.moveTo( self.paddingL, y6 );
            ctx.lineTo( width -  self.paddingR , y6 );
            ctx.fillStyle=BGColor;
            ctx.fillRect(self.paddingL,y1,width-self.paddingR-self.paddingL,y6);
            ctx.fillStyle="rgba(0,0,0,0.8)";
            ctx.stroke();
            for(var i=0;i<6;i++){
                ctx.save();
                ctx.font="35px Microsoft YaHei";
                var theLabel=Math.ceil(0.2*i*maxValue).toString()+((self.unit.unit.YAxis&&i==5)?self.unit.unit.YAxis:'');
                var wordWidth = ctx.measureText(theLabel).width;
                ctx.fillText(theLabel, self.paddingL-10-wordWidth, yAxisList[5-i]+20 );
                ctx.restore();
            }
            self.data.forEach( function( point,i) {
                ctx.save();
                ctx.font="35px Microsoft YaHei";
                var wordWidth = ctx.measureText( point.label ).width;

                ctx.fillText( point.label+((self.unit.unit.XAxis&&i==(self.data.length-1))?self.unit.unit.XAxis:''), point.x - ( wordWidth / 2 ), height-150 );
                ctx.beginPath();
                ctx.arc( point.x, point.y, 10, 0, Math.PI * 2 );
                ctx.fillStyle = lineColor;
                ctx.fill();
                ctx.restore();
            } );
            ctx.save();
            ctx.beginPath();
            ctx.strokeStyle = lineColor;
            ctx.lineWidth = 6;
            var lastPoint=[self.paddingL,height-200];
            self.data.forEach( function( point, i ) {
                    var x = point.x,
                        y = point.y;
                    if( i === 0 ) {
                        ctx.moveTo( x, y );
                    }
                    else {
                        ctx.beginPath();
                        ctx.strokeStyle = lineColor;
                        ctx.moveTo( lastPoint[0],lastPoint[1] );
                        ctx.lineTo( x, y );
                        ctx.stroke();
                        ctx.beginPath();
                        ctx.strokeStyle='rgba(0,0,0,0)';
                        ctx.moveTo( lastPoint[0],lastPoint[1] );
                        ctx.lineTo( x, y );
                        ctx.lineTo( x, height-200 );
                        ctx.lineTo(  lastPoint[0], height-200 );
                        ctx.stroke();
                        ctx.fillStyle=fillColor;
                        ctx.fill();
                    }
                lastPoint[0]=x;lastPoint[1]=y;
            } );
            ctx.stroke();
            ctx.restore();
        }
    };

(function ($) {
    var LBPopupInput=function (options) {
        this.options = $.extend({}, options || {});
        this.init();
    };
    LBPopupInput.prototype={
        init:function () {
            this.popW=(this.options.data.size.width>350?this.options.data.size.width:350)||350;
            this.popH=(this.options.data.size.height>200?this.options.data.size.height:200)||200;
            this.renderPopDiv(this.popW,this.popH);
            this.addTitle();
            this.addClose();
            this.addEndButton();
            this.addContent();
            this.listening();
        },
        //jqObj:popShadow/popDiv/popTitle/endButtonTotal
        //titleH;popFoot
        listening:function () {
            var self=this;
            this.closeDiv.on('click',function () {
               self.closePop();
            });
        },
        closePop:function () {
            this.popShadow.remove();
            this.popDiv.remove();
        },
        addClose:function () {
            var self=this;
            self.closeDiv=$('<div></div>');
            self.closeDiv.css({'position':'absolute','width':'28px','height':'28px','right':'11px','top':'11px'});
            self.closeDiv.appendTo(this.popDiv);
            var lineO=$('<div></div>');
            lineO.css({'width':'25px','height':'3px','backgroundColor':'rgba(0,0,0,0.5)','borderRadius':'1px','transform':'rotate(45deg)','transformOrigin':'center center','position':'absolute','left':'0px','top':'50%'});
            lineO.appendTo(self.closeDiv);
            var lineT=$('<div></div>');
            lineT.css({'width':'25px','height':'3px','backgroundColor':'rgba(0,0,0,0.5)','borderRadius':'1px','transform':'rotate(-45deg)','transformOrigin':'center center','position':'absolute','left':'0px','top':'50%'});
            lineT.appendTo(self.closeDiv);
        },
        addContent:function () {
            var self=this;
            self.contentDiv=$('<div></div>');
            self.contentH=this.popH-this.titleH-this.popFoot;
            self.contentDiv.css({'position':'absolute','width':'100%','height':this.contentH.toString()+'px','left':'0','top':this.titleH.toString()+'px'});
            self.contentDiv.appendTo(this.popDiv);
            self.contentList=self.options.data.content;
            self.selectList=[];
            var grid=(function () {
                var temp=0;
                for(var item in self.contentList){
                    switch (self.contentList[item].type){
                        case 'input':
                            temp++;break;
                        case 'inputKey':
                            temp++;break;
                        case 'select':
                            temp++;break;
                        case 'textArea':
                            temp+=2;break;
                        default:break;
                    }
                }
                return temp;
            })();
            var perH=this.contentH/grid;
            perH=perH>30?perH:30;
            for(var item in self.contentList){
                var itemDiv=$('<div></div>');
                itemDiv.css({'width':'100%','height':perH.toString()+'px'});
                itemDiv.appendTo(self.contentDiv);
                var titleDiv=$('<div>'+self.contentList[item].descript+'</div>');
                titleDiv.css({'width':'35%','height':'100%','paddingRight':'3%','fontSize':'16px','lineHeight':perH.toString()+'px','textAlign':'right','float':'left'});
                titleDiv.appendTo(itemDiv);
                switch (self.contentList[item].type){
                    case 'input':
                        var inputDiv=$('<div></div>');
                        inputDiv.css({'width':'40%','height':'40px','float':'left','border':'1px solid #1A1A1A','borderRadius':'5px','margin':((perH-40)/2).toString()+'px 10px'});
                        inputDiv.appendTo(itemDiv);
                        var input=$('<input />');
                        input.css({'border':'none','backgroundColor':'transparent','width':'100%','height':'40px','lineHeight':'40px','fontSize':'16px','padding':'0  10px'});
                        input.attr('name','content-'+self.contentList[item].id.toString());
                        input.appendTo(inputDiv);
                        break;
                    case 'inputKey':
                        var inputDiv=$('<div></div>');
                        inputDiv.css({'width':'40%','height':'40px','float':'left','border':'1px solid #1A1A1A','borderRadius':'5px','margin':((perH-40)/2).toString()+'px 10px'});
                        inputDiv.appendTo(itemDiv);
                        var input=$('<input />');
                        input.css({'border':'none','backgroundColor':'transparent','width':'100%','height':'40px','lineHeight':'40px','fontSize':'16px','padding':'0  10px'});
                        input.attr('type','password');
                        input.attr('name','content-'+self.contentList[item].id.toString());
                        input.appendTo(inputDiv);
                        break;
                    case 'select':
                        var selectDiv=$('<div></div>');
                        var selectID=item;
                        selectDiv.css({'width':'40%','height':'40px','float':'left','border':'1px solid #1A1A1A','borderRadius':'5px','margin':((perH-40)/2).toString()+'px 10px'});
                        selectDiv.appendTo(itemDiv);
                        selectDiv.attr({'data-default-value':'','data-placeholder':''});
                        selectDiv.attr('name','content-'+self.contentList[item].id.toString());
                        var clickFunP=function (flag) {
                            self.selectList[selectID]=flag;
                        };
                        new LBSelect({container: selectDiv, dataJson:JSON.stringify(self.contentList[item].data),clickBack:clickFunP});
                        break;
                    case 'textArea':
                        itemDiv.css({'width':'100%','height':(2*perH).toString()+'px'});
                        var textAreaDiv=$('<div></div>');
                        textAreaDiv.css({'width':'40%','height':'80px','float':'left','border':'1px solid #1A1A1A','borderRadius':'5px','margin':((2*perH-80)/2).toString()+'px 10px'});
                        textAreaDiv.appendTo(itemDiv);
                        var textArea=$('<textarea></textarea>');
                        textArea.css({'border':'none','backgroundColor':'transparent','width':'100%','height':'100%','lineHeight':'30px','fontSize':'16px','padding':'0  10px'});
                        textArea.attr('name','content-'+self.contentList[item].id.toString());
                        textArea.appendTo(textAreaDiv);
                        break;
                    default:break;
                }
            }
        },
        getParam:function () {
            var self=this;
            self.contentList=self.options.data.content;
            var retJsonL=[];
            var getThisValue=function (item) {
                var retV='';
                switch (item.type){
                    case 'input':
                        retV+=$('input[name^="content-'+item.id.toString()+'"]').val();
                        break;
                    case 'inputKey':
                        retV+=$('input[name^="content-'+item.id.toString()+'"]').val();
                        break;
                    case 'select':
                        retV+=self.selectList[item.id]?self.selectList[item.id]:self.contentList[item.id].data[0].id;
                        break;
                    case 'textArea':
                        retV+=$('textarea[name^="content-'+item.id.toString()+'"]').val();
                        break;
                    default:break;
                }
                return retV;
            };
            for(var item in self.contentList){
                retJsonL[item]={
                    'id':self.contentList[item].id,
                    'value':getThisValue(self.contentList[item])
                };
            }
            return retJsonL;
        },
        //jqObj:popShadow/popDiv/popTitle/endButtonTotal
        //titleH;popFoot
        renderPopDiv:function (W,H) {
            this.popShadow=$('<div></div>');
            this.popShadow.css({'position':'fixed','width':'100%','height':'100%','left':'0','top':'0','backgroundColor':'rgba(0,0,0,0.65)','zIndex':'499','opacity':'0'});
            this.popDiv=$('<div></div>');
            this.popDiv.css({'position':'fixed','border':'1px solid #1A1A1A','left':'50%','top':'50%','width':W.toString()+'px','height':H.toString()+'px','opacity':'0',
                'marginLeft':'-'+(W/2).toString()+'px','marginTop':'-'+(H/2).toString()+'px','backgroundColor':'white','borderRadius':'8px','zIndex':'500'});
            this.popShadow.appendTo('body');
            this.popDiv.appendTo('body');
            this.popShadow.animate({'opacity':'1'},3000,'swing');
            this.popDiv.animate({'opacity':'1'},800,'swing');
        },
        addTitle:function () {
            var self=this;
            self.titleH=50;
            if(!self.options.data.content)self.titleH=self.popH*0.4;
            self.title=(self.options.data.title)?self.options.data.title.value:'';
            var align_x=(self.options.data.title.align_x)?self.options.data.title.align_x:'center';
            var align_y=(self.options.data.title.align_y)?self.options.data.title.align_y:'center';
            var lineHeight='0px',marginTop='0px';
            var fontSize=20;
            switch (align_y){
                case 'center':
                    lineHeight=self.titleH.toString()+'px';
                    break;
                case 'top':
                    lineHeight=fontSize.toString()+'px';
                    break;
                case 'bottom':
                    lineHeight=fontSize.toString()+'px';
                    marginTop=(self.titleH-fontSize).toString()+'px';
                    break;
                default:
                    lineHeight=self.titleH.toString()+'px';
                    break;
            }
            self.popTitle=$('<div>'+self.title+'</div>');
            self.popTitle.css({'position':'relatives','fontSize':fontSize.toString()+'px','fontFamily':'Microsoft YaHei','fontWeight':'bold','width':'100%','height':this.titleH.toString()
            +'px','left':'0','top':'0','lineHeight':lineHeight,'padding':'0  5%','textAlign':align_x,'marginTop':marginTop});
            self.popTitle.appendTo(self.popDiv);
        },
        addEndButton:function () {
            this.popFoot=90;
            var self=this;
            this.endButList=(this.options.data.endButton)?this.options.data.endButton:[];
            this.endButtonTotal=$('<div></div>');
            this.endButtonTotal.css({'position':'absolute','width':'100%','height':this.popFoot.toString()+'px','left':'0','bottom':'0','paddingLeft':((5-this.endButList.length)*25).toString()+'px','paddingRight':((5-this.endButList.length)*25).toString()+'px'});
            this.endButtonTotal.appendTo(this.popDiv);
            this.endButListJQ=[];
            if(this.endButList.length>0){
                self.endButList.forEach(function (item , i) {
                    self.endButListJQ[i]=$('<div><div style="width: 75%;height:40px;margin: 25px auto;border:1px solid #1A1A1A;border-radius: 5px;line-height: 40px;background-color: '
                        +item.BGC+';color:'+item.FC+'">'+item.value+'</div></div>');
                    self.endButListJQ[i].css({'width':Math.floor(100/self.endButList.length).toString()+'%','height':'100%','float':'left','textAlign':'center','fontSize':'16px'});
                    self.endButListJQ[i].appendTo(self.endButtonTotal);
                    self.endButListJQ[i].hover(function () {
                        self.endButListJQ[i].css('cursor','pointer');
                    });
                    switch (item.type){
                        case 'close':
                            self.endButListJQ[i].click(function () {
                                self.closePop();
                            });
                            break;
                        case 'func':
                            self.endButListJQ[i].click(function () {
                                var paramList=self.getParam();
                                item.func(paramList);
                                self.closePop();
                            });
                            break;
                        default:break;
                    }

                });
            }

        }
    };
    window.LBPopupInput=LBPopupInput;
})(jQuery);






