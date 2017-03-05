/**
 * Created by Pershing on 2017/2/2.
 */
//退出
$('#outBtn').on('click',function () {
    $.ajax({
        url:'/api/user/logout',
        success:function (result) {
            if(result.code==99){
                window.location.href='/';
            }
        }
    })
})
$('.deltrue').on('click', function () {
    var signname=$(this).attr('name');
    $('#yesdel').attr('href','/mycenter/delsign?signid='+signname);
    $("#truedel").modal();
})