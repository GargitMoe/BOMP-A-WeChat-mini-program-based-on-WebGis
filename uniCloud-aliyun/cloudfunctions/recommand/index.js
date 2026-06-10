'use strict';
const db = uniCloud.database();
exports.main = async (event, context) => {
	//event为客户端上传的参数

	var users = await db.collection("uni-id-users").get();
	var tiezi = await db.collection("tiezi").get(); //这个是帖子点赞的总数据

	var likes = await db.collection("opendb-news-comments").get();
	var currentLikesCount = 0; //记录当前帖子有多少个人点赞
	var Weightup;
	var Weightdown1;
	var Weightdown2;
	var likesCountNew=new Array(tiezi.data.length);
	
	var intersection = function(nums1, nums2) { //取交集的函数
		const m = new Map();
		nums1.forEach(n => {
			m.set(n, true);
		});
		const arr = [];
		nums2.forEach(n => {
			if (m.get(n)) {
				arr.push(n);
				m.delete(n);
			}
		});
		return arr;
	};
	console.log(likes);
	//我们需要分离出每个帖子对应的点赞人的id？
	var likesCount = new Array(tiezi.data.length);
	for (let j = 0; j < likes.data.length; j++) {
		
		let currentArticle = likes.data[j]
			.article_id;
		for (let k = 0; k < tiezi.data.length; k++) {

			if (currentArticle == tiezi.data[k]._id) {

				currentLikesCount = tiezi.data[k].like_count;

			}
		}

		likesCount[j] = new Array(currentLikesCount + 1) //一个二维数组，其中第一位储存的是帖子id，后面储存的是点过赞的用户id
		
		var ArticleFlag=1;
		for (let index1 = 0; index1 < j; index1++) {

			if (j != 0) //如果是第一次 likecounts是没有赋值的，所以先忽略这种情况
			{
				/* console.log(likesCount); */
				
				/* console.log(likesCount); */
				if (likes.data[j].article_id == likesCount[index1][0]) {   //后面有空白，会undefined，不能一直遍历到数组结尾
					//即当前的帖子与之前的帖子id已经是一样了，被遍历过，所以直接跳出本次循环
					ArticleFlag=0;
					
					
				}
				
				
			} 
		}
		if(ArticleFlag)
		{
			likesCount[j][0] = currentArticle;
		}
		else
		{
			
			
			likesCount[j][0]=0;
			continue;
		}
		//定义目前遍历到的帖子id，有可能重复遍历？因为数据有可能多个都是有相同的currentArticle的
		
		for (let index = 0,k=1; index < likes.data.length; index++) //对二维数组的Y轴赋值，对0以后下标的赋值为点过赞的用户ID
		{
		/* 	console.log(currentArticle);
			console.log(likes.data[index].article_id); */
			if (likes.data[index].article_id == currentArticle) {
				likesCount[j][k++] = likes.data[index].user_id;
				
			}
		}
		currentLikesCount = 0; //到likes的下个帖子时
	}
	//创建权重矩阵
	let m = likesCount.length;
	var weights = new Array(m);
	for (let i = 0; i < weights.length; i++) {
		weights[i] = new Array(m);
	}
	console.log(likesCount);
	
	for(let i=0;i<likesCount.length;i++)
	{
		
		if(likesCount[i][0]!=0){
			likesCountNew[i] = new Array(likesCount[i].length)
			for(let j=0;j<likesCount[i].length;j++)
			{
				if(likesCount[i][j]){
					likesCountNew[i][j]=likesCount[i][j];
				}
				
			}
			/* likesCountNew.push(likesCount[i]) */
		}
		
	}
	console.log(likesCountNew);
	console.log(likesCount.length);
	//权重计算部分，运用字典,计算wij
	for (let i = 0; i < likesCount.length; i++) {
		for (let j = 0; j < likesCount.length; j++) {
			if (i != j) {
				
				/* console.log('i',i,likesCount[i]);
				console.log('j',j,likesCount[j]); */
				if(!(likesCount[i][0]==0||likesCount[j][0]==0)){
					Weightup = intersection(likesCount[i], likesCount[j]).length; //i到j帖子的相似度的分子部分
					Weightdown1 = likesCount[i].length;
					Weightdown2 = likesCount[j].length;
					weights[i][j] = Weightup / Math.sqrt(Weightdown1 * Weightdown2); //计算权重矩阵
					/* console.log(weights[i][j]); */
				}
			} else {
				weights[i][j]=0;
			}
		}
		
	}

	//对权重矩阵进行归一化
	/* for (let i = 0; i < weights.length; i++) {
		for (let j = 0; j < weights.length; j++) {
			weights[i][j] = weights[i][j] / Math.max(weights[i]);
		}
	}
 */
	//创建推荐矩阵，大小为用户数量*帖子数量
	let tieziNum = tiezi.data.length;
	let userNum = users.data.length;
	var Recommand = new Array(userNum);
	for (let i = 1; i < Recommand.length; i++) {
		Recommand[i] = new Array(tieziNum);
	}
	//创建一个每个用户点赞过的帖子的矩阵，第一个是用户，后面是帖子，与前面那个有点像反过来的样子。
	var likesCountUser = new Array(users.data.length);
	
	//返回数据给客户端
	return weights;
}