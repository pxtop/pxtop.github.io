//注册artical-introduction组件
Vue.component("artical-introduction",{
	props:["item",'index','length'],
	template:`<article :class='{noBottomBorder:index==length-1}' @click='seeDetail(item.id)'>
				<h2>{{item.title}}</h2>
				<div class="spanWrap clear">
					<span class="fl authorSpan">{{item.author.loginname}}</span>
					<span class="fl tabSpan">{{item.tab}}</span>
					<span class="fr timeSpan">{{item.create_at}}</span>
				</div>
				<div class="contentBox clear">
					<p class="fl">
					{{item.content}}
					</p>
					<img class="fr" :src="item.author.avatar_url">
				</div>
			</article>`,
	methods:{
		seeDetail(_id){
			window.location.href='https://cnodejs.org/api/v1/topic/'+_id;
		}
	}
})
var app=new Vue({
	el:"#app",
	data:{
		list:[],
		page:1,
		number:10,
		loading:true,
		length:0
	},
	computed:{
		arrLen(){
			return this.length=this.list.length;
		}
	},
	methods:{
		getArtical(){
			if(this.loading){
				var list=this.list;
				var xhr=new XMLHttpRequest();
				xhr.onreadystatechange=function()
				{
					if (xhr.readyState==4 && xhr.status==200)
					{	
						var res=JSON.parse(xhr.responseText);
						for(var i=0;i<res.data.length;i++){
							res.data[i].create_at=formatTime(res.data[i].create_at);
							list.push(res.data[i]);
						}
						this.loading=!this.loading;
					}
				}
				//get方式获取文章信息
				xhr.open('GET','https://cnodejs.org/api/v1/topics?page='+this.page+'&limit='+this.number,true);
				xhr.send(null);
				this.page++;
			}
		},
		loadMore(){
			var pageHeigth=document.body.offsetHeight-20; 
			var htmlHeight=document.documentElement.clientHeight;
			var scrollHeight=document.body.scrollTop;
			var flag=(htmlHeight+scrollHeight)>=pageHeigth?true:false;
			this.loading=flag;
			this.getArtical();
			setTimeout(this.getArtical,3000);

		}
	}
});
//日期格式化函数
function formatTime(time){
	var date=new Date(time);
	return (date.getMonth()+1)+' 月 '+date.getDate()+' 日'+' '+date.getHours()+':'+date.getMinutes();
};
app.getArtical();