/**
 * Created by sdergt on 2017/1/11.
 */
//function setNavigationLeft(modelData,styleObj) {
//    debugger;
//   var detailPage = '';
//    detailPage = "<div class='detailPage' style='width:300px;height:300px;background:#fff;'></div>"
//    $('.analysis-main').append(detailPage)
//}
(function($){
    var detailPage=function (options) {
        this.options = $.extend({}, options || {});
        this.init();
    };
    detailPage.prototype={
        init:function () {
            this.popW=(this.options.data.size.width>350?this.options.data.size.width:350)||350;
            this.popH=(this.options.data.size.height>200?this.options.data.size.height:200)||200;
            this.renderPopDiv(this.popW,this.popH);
            this.addTitle();
            this.addClose();
            //this.addEndButton();
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
            self.multiCheckboxLength=0;
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
                        case 'checkbox':
                            temp++;break;
                        case 'multiCheckbox':
                            self.multiCheckboxLength = self.contentList[item].data.length;
                            temp=temp+self.multiCheckboxLength;
                            break;
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
                    case 'checkbox':
                        titleDiv[0].innerText="";
                        titleDiv.css({'marginRight':'10px'});
                        var checkboxDiv=$('<div></div>');
                        checkboxDiv.attr('class','lbCheckBox');
                        var input=$('<input />');
                        input.attr('type','checkbox');
                        input.attr('name','content-'+item.toString());
                        input.attr('id','content-'+item.toString());
                        input.appendTo(checkboxDiv);
                        var label =$('<label />');
                        label.attr('for','content-'+item.toString());
                        label.appendTo(checkboxDiv);
                        var labelInfo =$('<label >'+self.contentList[item].descript+'</label>');
                        labelInfo.css({'marginLeft':'10px','position':'relative','top':'-4px'});
                        labelInfo.attr('for','content-'+item.toString());
                        labelInfo.appendTo(checkboxDiv);
                        checkboxDiv.appendTo(itemDiv);
                        break;
                    case 'multiCheckbox':
                        itemDiv.css({'height':(self.multiCheckboxLength*perH).toString()+'px'});
                        var multiCheckboxDiv=$('<div></div>');
                        var selectID=item;
                        multiCheckboxDiv.css({'width':'40%','height':'400px','float':'left','border':'1px solid #1A1A1A','borderRadius':'5px','margin':((self.multiCheckboxLength*perH-self.multiCheckboxLength*40)/2).toString()+'px 10px'});
                        multiCheckboxDiv.attr({'data-default-value':'','data-placeholder':''});
                        multiCheckboxDiv.attr('name','content-'+self.contentList[item].id.toString());
                        var data = self.contentList[item].data;
                        for(var i=0;i<data.length;i++) {
                            var oneCheckboxDiv=$('<div></div>');
                            oneCheckboxDiv.attr('class','lbCheckBox');
                            oneCheckboxDiv.appendTo(multiCheckboxDiv);
                            var input=$('<input />');
                            input.attr('type','checkbox');
                            input.attr('name','content-'+item+'-'+data[i].id.toString());
                            input.attr('id','content-'+item+'-'+data[i].id.toString());
                            input.appendTo(oneCheckboxDiv);
                            var label=$('<label />');
                            label.attr('for','content-'+item+'-'+data[i].id.toString());
                            label.appendTo(oneCheckboxDiv);
                            var labelInfo =$('<label >'+data[i].name+'</label>');
                            labelInfo.css({'marginLeft':'10px','position':'relative','top':'-4px'});
                            labelInfo.attr('for','content-'+item+'-'+data[i].id.toString());
                            labelInfo.appendTo(oneCheckboxDiv);
                        }
                        multiCheckboxDiv.appendTo(itemDiv);
                        /* var clickFunP=function (flag) {
                         self.selectList[selectID]=flag;
                         };*/
                        //new LBSelect({container: multiCheckboxDiv, dataJson:JSON.stringify(self.contentList[item].data),clickBack:clickFunP});
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
        //addEndButton:function () {
        //    this.popFoot=90;
        //    var self=this;
        //    this.endButList=(this.options.data.endButton)?this.options.data.endButton:[];
        //    this.endButtonTotal=$('<div></div>');
        //    this.endButtonTotal.css({'position':'absolute','width':'100%','height':this.popFoot.toString()+'px','left':'0','bottom':'0','paddingLeft':((5-this.endButList.length)*25).toString()+'px','paddingRight':((5-this.endButList.length)*25).toString()+'px'});
        //    this.endButtonTotal.appendTo(this.popDiv);
        //    this.endButListJQ=[];
        //    if(this.endButList.length>0){
        //        self.endButList.forEach(function (item , i) {
        //            self.endButListJQ[i]=$('<div><div style="width: 75%;height:40px;margin: 25px auto;border:1px solid #1A1A1A;border-radius: 5px;line-height: 40px;background-color: '
        //                +item.BGC+';color:'+item.FC+'">'+item.value+'</div></div>');
        //            self.endButListJQ[i].css({'width':Math.floor(100/self.endButList.length).toString()+'%','height':'100%','float':'left','textAlign':'center','fontSize':'16px'});
        //            self.endButListJQ[i].appendTo(self.endButtonTotal);
        //            self.endButListJQ[i].hover(function () {
        //                self.endButListJQ[i].css('cursor','pointer');
        //            });
        //            switch (item.type){
        //                case 'close':
        //                    self.endButListJQ[i].click(function () {
        //                        self.closePop();
        //                    });
        //                    break;
        //                case 'func':
        //                    self.endButListJQ[i].click(function () {
        //                        var paramList=self.getParam();
        //                        item.func(paramList);
        //                        self.closePop();
        //                    });
        //                    break;
        //                default:break;
        //            }
        //
        //        });
        //    }
        //
        //}
    };
    window.detailPage=detailPage;
})(jQuery)
