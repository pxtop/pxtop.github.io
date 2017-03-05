/**
 * Created by Pershing on 2017/1/3.
 */

    var comments=[];
    var limit=5;
    var page=1;
    var pages=0;
    var len=0;
    var $pre=$('#previous');
    var $next=$('#next');

    function renderComments(data) {
        var html = '';
        len=data.length;
        pages = Math.max(Math.ceil(len / limit), 1);
        var start = Math.max(0, (page-1) * limit);
        var end = Math.min(len, start+limit);
        if(page<=1){
            page=1;
            $pre.html('');
        }else{
            $pre.html('<a href="javascript:;">上一页</a>');
        }
        if(page>=pages){
            page=pages;
            $next.html('');
        }else{
            $next.html('<a href="javascript:;">下一页</a>');
        }
        for(var i=start;i<end;i++){
            html += '<div class="messageBox">'+
                '<p class="name clear"><span class="fl">'+data[i].username+'</span><span class="fr">'+setTime(data[i].postTime)+'</span></p><p>'+data[i].content+'</p>'+
                '</div>';
        }

        $('.pager ul li').eq(1).html(page+'/'+pages);
        $('.messageList').html(html);
    }
    //每次页面重载的时候获取一下该文章的所有评论

    $.ajax({
        type:'GET',
        url: '/api/comment',
        data: {
            contentid: $('#contentId').val()
        },
        success: function(responseData) {
            comments =responseData.data.reverse();
            renderComments(comments);
        },
        error:function (e) {
            console.log(e);
        }
    });

    $('#messageBtn').on('click', function() {
        $.ajax({
            type: 'POST',
            url:'/api/comment/post',
            data: {
                contentid: $('#contentId').val(),
                content: $('#messageContent').val()
            },
            success: function(responseData) {
                if(responseData.code==7){
                    return;
                }else{
                    $('#messageContent').val('');
                    comments = responseData.data.comments.reverse();
                    renderComments(comments);
                    $('#messageCount1').html(comments.length);
                    $('#messageCount2').html(comments.length);
                }
            }
        })
    });
$pre.eq(0).on('click',function () {
    page--;
    renderComments(comments);
})
$next.eq(0).on('click',function () {
    page++;
    console.log(page);
    renderComments(comments);
})
function setTime(data) {
    var date=new Date(data);
    var time=date.getFullYear()+'-'+date.getMonth()+1+'-'+date.getDay()+' '+date.getHours()+':'+date.getMinutes()+':'+date.getSeconds();
    return time;
}