//搜索切换
	(function(){
		var arr=[
			'例如：0荷棠鱼坊烤鱼 或 樱花日本料理',
			'例如：1荷棠鱼坊烤鱼 或 樱花日本料理',
			'例如：2荷棠鱼坊烤鱼 或 樱花日本料理',
			'例如：3荷棠鱼坊烤鱼 或 樱花日本料理',
			'例如：4荷棠鱼坊烤鱼 或 樱花日本料理',]
		var iNow=0;
		$('.search_text').val(arr[iNow]);	
		$('.bar_tab li').each(function(index){
			$(this).on('click',function(){
				$(this).attr('class','active').siblings().attr('class','');//导航切换
				iNow=index;
				$('.search_text').val(arr[iNow]);				
			})
		})
		$('.search_text').on('focus',function(){
			//console.log(arr[iNow]);
			if(arr[iNow]==$(this).val()){
				$(this).val('');
			}
		})		
		$('.search_text').on('blur',function(){
			if($(this).val()==''){
				$(this).val(arr[iNow]);
			}
		})
	})();
	//update部分
	(function(){
		var str='';
		var timer=null;
		var arr=[{'name':'萱萱','time':1,'Url':'www.baidu.com','title':'那些灿烂华美的瞬间…'},
				{'name':'轩轩','time':2,'Url':'www.baidu.com','title':'那些灿烂华美的瞬间…'},
				{'name':'涵涵','time':3,'Url':'www.baidu.com','title':'那些灿烂华美的瞬间…'},
				{'name':'喵喵','time':4,'Url':'www.baidu.com','title':'那些灿烂华美的瞬间…'},
				{'name':'美美','time':5,'Url':'www.baidu.com','title':'那些灿烂华美的瞬间…'},
				{'name':'天天','time':6,'Url':'www.baidu.com','title':'那些灿烂华美的瞬间…'},
				{'name':'曲奇','time':7,'Url':'www.baidu.com','title':'那些灿烂华美的瞬间…'},
				{'name':'等等','time':8,'Url':'www.baidu.com','title':'那些灿烂华美的瞬间…'}];
		var len=arr.length;
		var iNow=0;
		var oUp=$('.update .triangle_up_red');
		var oDown=$('.update .triangle_down_red');
		for(var i=0;i<len;i++){
			str+='<li><a href="'+arr[i].Url+'"><strong>'+arr[i].name+'</strong><span>'+arr[i].time+'分钟前</span>写了一篇新文章：'+arr[i].title+'</a></li>';
		}
		$('.update ul').html(str);
		var iH=$('.update ul li').height();
		autoPlay();//初始化
		function doMove(num){
			$('.update ul').stop().animate({'top':iH*num},2000);
		}
		function autoPlay(){
			clearInterval(timer);
			timer=setInterval(function(){
				if(iNow==-len){
					iNow=0;
					$('.update ul').css('top','0');
				}
				doMove(iNow);
				iNow--;
			},2000);			
		}
		oUp.on('click',function(ev){
			ev.preventDefault();
			clearInterval(timer);
			if(iNow==0){
				iNow=-(len-1);
			}else{
				iNow++;
			}
			$('.update ul').css('top',iH*iNow);
		})
		oDown.on('click',function(ev){
			ev.preventDefault();
			clearInterval(timer);
			if(iNow==-(len-1)){
				iNow=0;
				alert(1);
			}else{
				iNow--;
			}
			$('.update ul').css('top',iH*iNow);
		})
		$('.update').hover(function(){
			clearInterval(timer);
		},function(){
			autoPlay();
		})
	})();
	//各种选项卡切换
	(function(){
		$('.con_list_1 .hot_list').eq(0).siblings().css('display','none');
		TabList($('.tab_list_1 li'),$('.con_list_1 .hot_list'),'click');
		$('.con_list_2 img').eq(0).siblings().css('display','none');
		TabList($('.tab_list_2 li'),$('.con_list_2 img'),'click');
		$('.con_list_3 ul').eq(0).siblings().css('display','none');
		TabList($('.tab_list_3 li'),$('.con_list_3 ul'),'mouseover');
		$('.con_list_4 ul').eq(0).siblings().css('display','none');
		TabList($('.tab_list_4 li'),$('.con_list_4 ul'),'mouseover');
		function TabList(oTab,oCon,oThing){
			oTab.each(function(){
				$(this).on(oThing,function(){
					$(this).removeClass('gradient').addClass('active');
					$(this).siblings().removeClass('active').addClass('gradient');
					$(this).find('a').attr('class','triangle_down_red');
					$(this).siblings().find('a').attr('class','triangle_down_gray');
					oCon.eq($(this).index()).css('display','block');
					oCon.eq($(this).index()).siblings().css('display','none');
				})
			})
		};
	})();
	//精彩推荐焦点图
	(function(){
		var oWrap=$('.recommend .pic_tab');
		var aUlLi=$('.recommend .pic_tab ul li');
		var aOlLi=$('.recommend .pic_tab ol img');
		var oP=$('.recommend .pic_tab p');
		var arr=['爸爸去哪儿~~','可爱的小美女~~','好看的美眉~~'];
		var timer=null;
		var iNow=0;			
		aUlLi.eq(0).css('zIndex',2);
		oP.text(arr[0]);
		autoPlay();
		//初始化
		aOlLi.each(function(index){
			$(this).on('click',function(){
				aOlLi.removeClass('active');
				$(this).attr('class','active');
				aUlLi.css('zIndex',1);
				iNow=index;
				aUlLi.eq(iNow).css('zIndex',2);
				oP.text(arr[iNow]);
			})
		})
		function autoPlay(){
			clearInterval(timer);
			timer=setInterval(function(){
				if(iNow==arr.length){
					iNow=0;
				}
				aOlLi.removeClass('active');
				aOlLi.eq(iNow).attr('class','active');
				aUlLi.css('zIndex',1);
				aUlLi.eq(iNow).css('zIndex',2);
				oP.text(arr[iNow]);
				iNow++;
			},2000)
		}
		oWrap.hover(function(){
			clearInterval(timer);
		},function(){
			autoPlay();
		})
	})();
	//每日活动日历
	(function(){
		var oFrame=$('.frame');
		var oP=$('.calendar .frame_text p');
		var oSpan=$('.calendar .frame_text span');
		var aImg=$('.calendar ol img');
		var arr=['MON','TUE','WED','THU','FRI','SAT','SUN']
		aImg.hover(function(){
				var iTop=$(this).parent().position().top-35;
				var iLeft=$(this).parent().position().left+55;
				oFrame.show();
				oFrame.css({'top':iTop,'left':iLeft});
				oSpan.text(arr[($(this).parent().index())%7]);
			},function(){
				oFrame.hide();
			})
	})();
	//BBS论坛
	(function(){
		var aLi=$('.bbs ol li');
		aLi.mouseover(function(){
			aLi.removeClass('active');
			$(this).addClass('active');
		})
	})();
	//HOT红人烧客
	
})
	
	

