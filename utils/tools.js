//获取富文本内的图片url地址
export function getImgSrc(richtext,num=3) {
	let imgList = [];
	richtext.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/g, (match, capture) => {
		  imgList.push(capture);
	});
	imgList=imgList.slice(0,num)
	return imgList;
}
export function getDistances(lat1, lng1, lat2, lng2) {
	let EARTH_RADIUS = 6378.137;// 地球半径
	let radLat1 = lat1 * Math.PI / 180.0; //lat1 * Math.PI / 180.0=>弧度计算
	let radLat2 = lat2 * Math.PI / 180.0;
	let a = radLat1 - radLat2;
	let b = lng1 * Math.PI / 180.0 - lng2 * Math.PI / 180.0;
	let s = 2 * Math.asin(Math.sqrt(Math.pow(Math.sin(a / 2), 2) + Math.cos(radLat1) * Math.cos(radLat2) * Math.pow(Math.sin(b / 2), 2)));
	s = s * EARTH_RADIUS; 
	s = Math.round(s * 10000) / 10000;// 输出为公里
	return { m: s * 1000, km: Number(s.toFixed(2)) }
}
export function RecommendAlgorithm()
{//基于物品的协同过滤算法
	let posting;
	let likes;
	let users;
	const db = uniCloud.database();
	uniCloud.callFunction({
		name: "Users",
		data: {}
	}).then(res => {
		users=res.result;
		})
	uniCloud.callFunction({
		name: "likes",
		data: {}
	}).then(res => {
		likes=res.result;
		})
	uniCloud.callFunction({
		name: "posting",
		data: {}
	}).then(res => {
		posting=res.result;
		})
		return likes;
}

/* //向外导出省份
export function getProvince(){
	return new Promise((resolve,reject)=>{
		let historyProvince=uni.getStorageSync("historyProvince");
		if(historyProvince){			
			if((Date.now() - historyProvince.time) > 1000*60*60){				
				getIp().then(res=>{
					resolve(res)
				}).catch(err=>{
					reject(err)
				})	
			}else{				
				resolve(historyProvince.province);
			}
		}else{			
			getIp().then(res=>{
				resolve(res)
			}).catch(err=>{
				reject(err)
			})		
		}	
	})
}

//获取所在省市
function getIp(){
	return new Promise((resolve,reject)=>{
		uni.request({
			url:"https://restapi.amap.com/v3/ip?key=4a43fb1fc001e386a52215b6feea63f4",
			success:res=>{				
				let str=""				
				typeof(res.data.province) == "string" ? str=res.data.province :str="火星"
				resolve(str)
				let obj={
					province:str,
					time:Date.now()
				}
				uni.setStorageSync("historyProvince",obj);				
			},
			fail:err=>{
				reject(err)
			}
		})
	})	
}
 */


//获取昵称
export function giveName(item){
	return  item.user_id[0].nickname ||  item.user_id[0].username || item.user_id[0].mobile || "请设置昵称"	
}

//获取默认头像
export function giveAvatar(item){	
	return item.user_id[0]?.avatar_file?.url ?? '../../static/user-default.jpg'
}


const db=uniCloud.database();	
const utilsObj=uniCloud.importObject("utilsObj",{
	customUI: true
});

//点赞操作数据库的方法
export async function  likeFun(artid){				
	let count= await db.collection("quanzi_like")
	.where(`article_id=="${artid}" && user_id==$cloudEnv_uid`).count()				
	if(count.result.total){
		db.collection("quanzi_like").where(`article_id=="${artid}" && user_id==$cloudEnv_uid`)
		.remove();
		utilsObj.operation("quanzi_article","like_count",artid,-1)
		
	}else{
		db.collection("quanzi_like").add({
			article_id:artid
		})
		utilsObj.operation("quanzi_article","like_count",artid,1)					
	}
}



