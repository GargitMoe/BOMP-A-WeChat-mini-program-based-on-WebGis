'use strict';
exports.main = async (event, context) => {
	//event为客户端上传的参数
	var Weightup;
	var Weightdown1;
	var Weightdown2;
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
	var likesCount = new Array(5);
	for(let i=0;i<5;i++)
	{
		likesCount[i]=new Array(5);
	}
	likesCount[0][0]='A';
	likesCount[0][1]='a';
	likesCount[0][2]='b';
	likesCount[0][3]='c';
	likesCount[0][4]='d';
	
	likesCount[1][0]='B';
	likesCount[1][1]='a';
	likesCount[1][2]='b';
	
	likesCount[2][0]='C';
	
	likesCount[2][2]='b';
	
	likesCount[2][4]='d';
	
	
	likesCount[3][0]='D';
	likesCount[3][2]='b';
	likesCount[3][3]='c';
	likesCount[3][4]='d';
	
	likesCount[4][0]='E';
	
	
	likesCount[4][4]='d';
	console.log(likesCount);
	
	let m = 5;
	var weights = new Array(m);
	for (let i = 0; i < weights.length; i++) {
		weights[i] = new Array(m);
	}
	
	console.log(likesCount);
	//权重计算部分，运用字典,计算wij
	for (let i = 0; i < likesCount.length; i++) {
		for (let j = 0; j < likesCount.length-1; j++) {
			if (i != j) {
				
				Weightup = intersection(likesCount[i], likesCount[j]).length; //i到j帖子的相似度的分子部分
				Weightdown1 = likesCount[i].length;
				Weightdown2 = likesCount[j].length;
				weights[i][j] = Weightup / Math.sqrt(Weightdown1 * Weightdown2); //计算权重矩阵
			} else {
				weights[i][j]=0;
			}
		}
	}
	return weights
};
