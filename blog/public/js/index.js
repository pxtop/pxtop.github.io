/**
 * Created by Pershing on 2016/12/30.
 */
$(function () {
    var $loginBox=$('#loginBox');
    var $registerBox=$('#registerBox');
    var $userInfo=$('#userInfo');
    //切换到注册面板
    $loginBox.find('a').on('click',function () {
        $registerBox.show();
        $loginBox.hide();
    });
    //切换到登录面板
    $registerBox.find('a').on('click',function () {
        $registerBox.hide();
        $loginBox.show();
    });
    //点击注册按钮提提交数据
    $registerBox.find('button').on('click',function () {
        //ajax提交
        $.ajax({
            type:'post',
            url:'/api/user/register',
            data:{
                username:$registerBox.find('input[name=username]').val(),
                password:$registerBox.find('input[name=password]').val(),
                repassword:$registerBox.find('input[name=repassword]').val()
            },
            dataType:'json',
            success:function(result) {
                $registerBox.find('.textCenter').html(result.message);
                if(result.code==0){
                    setTimeout(function () {
                        $registerBox.hide();
                        $loginBox.find('.textCenter').val('');
                        $loginBox.show();
                    },1000);
                }
            }
        });
    });
    //登录
    $loginBox.find('button').on('click',function () {
        //ajax提交
        $.ajax({
            type:'post',
            url:'/api/user/login',
            data:{
                username:$loginBox.find('input[name=username]').val(),
                password:$loginBox.find('input[name=password]').val(),
            },
            dataType:'json',
            success:function(result) {
                $loginBox.find('.textCenter').html(result.message);
                if(result.code==0){
                    setTimeout(function () {
                        window.location.reload();
                    },1000);
                }else{
                    setTimeout(function () {
                        $userInfo.hide();
                    },1000);
                }
            }
        });
    });
    //退出
    $userInfo.find('#logout').on('click',function () {
        $.ajax({
            url:'/api/user/logout',
            success:function (result) {
                if(result.code==99){
                    window.location.reload();
                }
            }
        })
    })
});