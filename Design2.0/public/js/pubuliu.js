/**
 * Created by Pershing on 2017/2/4.
 */
function footerPosition(){
    var contentHeight = document.body.scrollHeight,//网页正文全文高度
        winHeight = window.innerHeight;//可视窗口高度，不包括浏览器顶部工具栏
    if(!(contentHeight > winHeight)){
        //当网页正文高度小于可视窗口高度时，为footer添加类fixed-bottom
        $("footer").addClass("fixed-bottom");
    } else {
        $("footer").removeClass("fixed-bottom");
    }
}
//获取？后内容
function getQueryStringArgs() {
    //取得查询字符串并去掉开头的问号
    var qs=location.search.length>0?location.search.substring(1):'';
    //保存数据的对象
    var args={};
    //取得第一项
    var items=qs.length?qs.split("&"):[];
    var item=null;
    var name=null;
    var value=null;
    //逐个将每一项添加到args对象中
    for(var i=0;i<items.length;i++){
        item=items[i].split("=");
        name=decodeURIComponent(item[0]);
        value=decodeURIComponent(item[1]);
        if(name.length){
            args[name]=value;
        }
    }
    return args;
}
var args=getQueryStringArgs();
$.ajax({
    url:'/signs?cate='+args['cate'],
    success:pubuliu
})
//section瀑布流效果
function pubuliu(result) {
    var $sectionWidth=$('section').innerWidth();//初始section宽度
    var iRow=0;
    var iPage=4;
    var imgWidth=290;
    var iWidth=310;
    var aWidth=[310,335,326];
    var iOutWidth=326;
    var arrT=[];
    var arrL=[];
    function getMinRow() {
        var v = arrT[0];
        var _index = 0;
        for (var i=1; i<arrT.length; i++) {
            if (arrT[i] < v) {
                v = arrT[i];
                _index = i;
            }
        }
        return _index;
    }
    function getRow() {
        iRow=Math.floor($sectionWidth/iWidth);
        iOutWidth=aWidth[iRow-1];
    }
    function render() {
        getRow();
        for(var i=0;i<iRow;i++){
            arrT[i] = 0;
            arrL[i] = iOutWidth * i;
        }
        var aMessageBox=$('section .messageBox');
        $.each(result,function(index,obj) {
            //console.log((new Date(obj.signTime)).toLocaleDateString());
            var oMessageBox=$('<div class="messageBox"><div class="imgWrap"></div><span class="messageTitle">'+obj.signTitle+'</span><p class="introduction">'+obj.signContent+'</p><a href="/details?p=0&signid='+obj._id+'" class="look">查 看 详 情</a><hr/><div class="messageBoxBottom"><span class="messageTime fl">'+(new Date(obj.signTime)).toLocaleDateString()+'</span><span class="messageAuthor fr">'+obj.author.username+'</span></div></div>');
            var imgWrap=oMessageBox.find('.imgWrap');
            var imgHeight=0;
            var iHeight=0;
            var oPreviewImg = new Image();
            imgWrap.append(oPreviewImg);
            imgWrap.find('img').attr({
                'src':obj.signImgs[0].src
            });
            oPreviewImg.onload=function(){
                var cWidth=oPreviewImg.clientWidth || 0;
                var cHeight=oPreviewImg.clientHeight || 0;
                imgHeight = (cHeight) * (imgWidth / cWidth);
                iHeight=imgHeight+193;
                imgWrap.find('img').css({
                    'width':imgWidth,
                    'height':imgHeight
                })
                var _index = getMinRow();
                oMessageBox.css({
                    'left':arrL[_index],
                    'top':arrT[_index]
                });
                arrT[_index] += iHeight +15;
            }
            $('section').append(oMessageBox);
        })

        setTimeout(function () {
            for(var i=0;i<iRow;i++){
                arrT[i] = 0;
                arrL[i] = iOutWidth * i;
            }
            $('section').find('.messageBox').each(function() {
                var _index = getMinRow();
                $(this).animate({
                    left:arrL[_index],
                    top	:arrT[_index]
                }, 1000);
                arrT[_index] += $(this).outerHeight() + 15;
            });
        },1000);
    }
    render();
    $(window).on('resize', function() {
        var $sectionW=$('section').innerWidth();
        if($sectionW==$sectionWidth){
            return;
        }else {
            $sectionWidth=$sectionW;
            getRow();
            arrL=[];
            arrT=[];
            for(var i=0;i<iRow;i++){
                arrT[i] = 0;
                arrL[i] = iOutWidth * i;
            }
            $('section').find('.messageBox').each(function() {
                var _index = getMinRow();
                $(this).animate({
                    left:arrL[_index],
                    top	:arrT[_index]
                }, 1000);
                arrT[_index] += $(this).outerHeight() + 15;
            });
        }
    })
}