/**
 * Created by Pershing on 2017/2/7.
 */
$(function () {
    $("#sendCom").click(function () {
        if($('#comContent').val()==''){
            $('#comTip').html('*评论为空');
        }
    })
})