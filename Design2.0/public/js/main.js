/**
 * Created by Pershing on 2017/1/23.
 */
$(function () {
    //顶部时间
    var date=new Date();
    var month=['日','一','二','三','四','五','六'];
    $('#topTime').html(date.getFullYear()+'年'+(date.getMonth()+1)+'月'+date.getDate()+'日'+' '+'星期'+month[date.getDay()]);
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
    if(args['p']==undefined){
        args['p']=0;
    }
    $('.navList1').find('li').each(function () {
        $(this).removeClass('active');
    })
    $('.navList2').find('li').each(function () {
        $(this).removeClass('active');
    })
    $('.navList1').find('li').eq(Number(args['p'])).addClass('active');
    $('.navList2').find('li').eq(Number(args['p'])).addClass('active');
    var $search=$('.search span');
    var $searchForm=$('.search_form');
    var flag=true;
    var $menu=$('.glyphicon');
    var $navList2=$('.navList2');
    $search.click(function () {
        if(flag){
            $search.css('backgroundColor','#0099ff');
        }else {
            $search.css('backgroundColor','');
        }
        flag=!flag;
        $navList2.hide();
        $searchForm.toggle();
    });
    var $clickLogin=$('.clickLogin a');
    var $clickRegister=$('.clickRegister a');
    var $login=$('#login');
    var $register=$('#register');
    //切换注册
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
    //前端验证用户名
    var reRegExp=/^[a-zA-Z]{1}([a-zA-Z0-9]|[_]){4,15}$/;
    $register.find('input[name=username]').on('blur',function () {
        if(!reRegExp.test($(this).val())){
            $register.find('input[name=username]').addClass('outline');
            $register.find('.message').html('*用户名必须由5-16位以字母开头、可带数字、“_”的字符组成');
        }else {
            $register.find('input[name=username]').removeClass('outline');
            $register.find('.message').html('');
        }
    })
    //前端验证密码
    var loRegExp=/^(\w){6,20}$/;
    $register.find('input[name=password]').on('blur',function () {
        if(!loRegExp.test($(this).val())){
            $register.find('input[name=password]').addClass('outline');
            $register.find('.message').html('*密码必须由6-20位字母、数字、下划线组成');
        }else {
            $register.find('input[name=password]').removeClass('outline');
            $register.find('.message').html('');
        }
    })
    $('#registerBtn').on('click',function () {
        if($register.find('input[name=password]').val()!==$register.find('input[name=repassword]').val()){
            $register.find('input[name=repassword]').addClass('outline');
            $register.find('.message').html('*两次密码输入不一致');
        }else {
            $register.find('input[name=repassword]').removeClass('outline');
            $register.find('.message').html('');
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
                    $register.find('.message').html(result.message);
                    if(result.code==0){
                        setTimeout(function () {
                            $register.hide();
                            $login.find('.message').val('');
                            $login.show();
                        },1000);
                    }
                }
            })
        }
    })
    //登录ajax提交
    var $userInfo=$('#userInfo');
   $('#loginBtn').on('click',function () {
        $.ajax({
            type:'post',
            url:'/api/user/login',
            data:{
                username:$login.find('input[name=username]').val(),
                password:$login.find('input[name=password]').val()
            },
            dataType:'json',
            success:function(result) {
                $login.find('.message').html(result.message);
                if(result.code==0){
                    setTimeout(function () {
                        window.location.reload();
                    },1000);
                }
            }
        });
    });
    //退出
    $('#layout').on('click',function () {
        $.ajax({
            url:'/api/user/logout',
            success:function (result) {
                if(result.code==99){
                    window.location.reload();
                }
            }
        })
    })
    //660px内菜单键点击
    $menu.click(function () {
        $navList2.toggle();
        $searchForm.hide();
        $search.css('backgroundColor','');
        flag=true;
    });
    //重新选择图片
    $('#reChoose').click(function () {
        $('#signImgs').val('');
    })
});
