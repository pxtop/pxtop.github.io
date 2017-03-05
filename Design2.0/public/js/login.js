/**
 * Created by Pershing on 2017/2/19.
 */
//切换注册
var $clickLogin=$('.lgbtn');
var $clickRegister=$('.rebtn');
$clickLogin.click(function () {
    $register.hide();
    $login.show();
});
//切换登录
$clickRegister.click(function () {
    $login.hide();
    $register.show();
});
//注册Ajax
// 前端验证用户名
var reRegExp=/^[a-zA-Z]{1}([a-zA-Z0-9]|[_]){4,15}$/;
var $login=$('#loginMain');
var $register=$('#reMain');
$register.find('input[name=username]').on('blur',function () {
    if(!reRegExp.test($(this).val())){
        $register.find('input[name=username]').addClass('outline');
        $register.find('.lghelp').html('*用户名必须由5-16位以字母开头、可带数字、“_”的字符组成');
    }else {
        $register.find('input[name=username]').removeClass('outline');
        $register.find('.lghelp').html('');
    }
})
//前端验证密码
var loRegExp=/^(\w){6,20}$/;
$register.find('input[name=password]').on('blur',function () {
    if(!loRegExp.test($(this).val())){
        $register.find('input[name=password]').addClass('outline');
        $register.find('.lghelp').html('*密码必须由6-20位字母、数字、下划线组成');
    }else {
        $register.find('input[name=password]').removeClass('outline');
        $register.find('.lghelp').html('');
    }
})
$('#reMainbtn').on('click',function () {
    if($register.find('input[name=password]').val()!==$register.find('input[name=repassword]').val()){
        $register.find('input[name=repassword]').addClass('outline');
        $register.find('.lghelp').html('*两次密码输入不一致');
    }else {
        $register.find('input[name=repassword]').removeClass('outline');
        $register.find('.lghelp').html('');
        $.ajax({
            type:'post',
            url:'/api/user/register',
            data:{
                username:$register.find('input[name=username]').val(),
                password:$register.find('input[name=password]').val(),
                repassword:$register.find('input[name=repassword]').val()
            },
            dataType:'json',
            success:function(result) {
                $register.find('.lghelp').html(result.message);
                if(result.code==0){
                    setTimeout(function () {
                        $register.hide();
                        $login.find('.lghelp').val('');
                        $login.show();
                    },1000);
                }
            }
        })
    }
})
//登录ajax提交
$('#loginMainbtn').on('click',function () {
    $.ajax({
        type:'post',
        url:'/api/user/login',
        data:{
            username:$login.find('input[name=username]').val(),
            password:$login.find('input[name=password]').val()
        },
        dataType:'json',
        success:function(result) {
            $login.find('.lghelp').html(result.message);
            if(result.code==0){
                setTimeout(function () {
                    window.location.href='/';
                },1000);
            }
        }
    });
});
