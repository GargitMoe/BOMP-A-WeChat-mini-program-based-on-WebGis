<template>
	<view>
		<page-meta>
			<navigation-bar title="详情" title-icon="heart" :title-icon-radius="titleIconRadius"
				:subtitle-text="subtitleText" :subtitle-color="nbFrontColor" :loading="nbLoading"
				:front-color="nbFrontColor" background-color="#439ffc" :color-animation-duration="2000"
				color-animation-timing-func="easeIn" />
		</page-meta>
		<view>
			<u-skeleton rows="7" avatar title :loading="loadstate"></u-skeleton>
		</view>
		<view class="container">
			<unicloud-db ref="udb" v-slot:default="{data, loading, error, options}" where="state==true"
				collection="tiezi,uni-id-users"
				field="title,article,image,tag,mobile,like_count,view_count,collection_count,user_id._id,user_id.nickname,user_id.username,user_id.avatar_file,latitude,longtitude"
				:where="queryWhere" :getone="true" :manual="true" @load="load">
				<view v-if="error">{{error.message}}</view>
				<view v-else-if="loading">
					<uni-load-more :contentText="loadMore" status="loading"></uni-load-more>
				</view>

				<view v-else-if="data">
					<view class="User_Info">
						<u-avatar :src="data.user_id[0].avatar_file.url" size="40"></u-avatar>
						<!-- <cloud-image class="avatar" :src="data.user_id[0].avatar_file.url"></cloud-image> -->
						<view class="username"><text>{{data.user_id[0].username}}</text></view>
					</view>
					<uni-title class="line" type="h3" color="#439ffc"></uni-title>

					<view class="title">
						<text style="color:#439ffc">{{data.title}}</text>
					</view>

					<!-- <view class="ItemContent"> -->
					<view>
						<uni-section title="文章内容" type="line"></uni-section>
						<text>{{data.article}}</text>

					</view>
					<!-- </view> -->

					<view class="tieziimage">
						<image v-if="data.image" :src="data.image.url" mode="aspectFit"></image>
						<text v-else></text>
					</view>
					<view class="dnms-divider"></view>
					<view>
						<uni-title type="h3" color="#1b4cfc"></uni-title>
						<view v-if="data.tag==0" class="volunteer" @click="toVolunteer"><text>#志愿活动</text></view>
						<view v-if="data.tag==1" class="sport" @click="toSport"><text>#运动</text></view>
						<view v-if="data.tag==2" class="camera" @click="toCamera"><text>#摄影</text></view>
						<view v-if="data.tag==3" class="lost" @click="toLost"><text>#寻物启示</text></view>
						<view v-if="data.tag==4" class="cat" @click="toCat"><text>#小动物</text></view>
						<view v-if="data.tag==5" class="yanchu" @click="toyanchu"><text>#户外演出</text></view>

					</view>
					<view class="dnms-divider"></view>
					<view>
						<uni-title type="h3" title="联系方式:" color="#439ffc"></uni-title>
						<text>{{data.mobile}}</text>
					</view>

					<view class="like">
						<!-- <view class="btns">
							<u-button :ripple="true" ripple-bg-color="#439ffc" color="#b6baba"shape="circle" size="medium" @click="clickLike":custom-style="customStyle">点赞</u-button>
							 -->
						<view ref="like" class="btn" :class="Havelike ? 'active' : 'inactive'" @click="clickLike">
							<u-icon name="thumb-up" color="#ffffff" size="24"></u-icon>
							<text>{{data.like_count+likecountNow}}</text>
						</view>
						<view class="example-body">
							<uni-fav :checked="checkList[0]" :content-text="contentText"
								@click="favClickCollection(0)" />
						</view>
					</view>
					<view class="map">
						<map :latitude="data.latitude" :longitude="data.longtitude" enable-3D="true"
							style="width: 400px; height: 130px;" min-scale="18" max-scale="20" :markers="markers"
							show-location="true">
						</map>
					</view>
				</view>
				<!-- <view class="btns" v-if="userNow.uid=='64ae79bcfe975f64f6f08123'" :key="1">
					<button type="warn" class="btn-delete" @click="handleDelete">删除</button>
				</view> -->
			</unicloud-db>
			<!-- 更改和删除帖子的功能移植到了searchT下的mydetai页面 -->
		</view>
		<view class="comment">
			<view style="padding-bottom:50rpx" v-if="!commentList.length && noComment">
				<u-empty mode="comment" icon="https://cdn.uviewui.com/uview/empty/comment.png">
				</u-empty>
			</view>
			<view class="content" v-if="commentList.length">
				<view class="item" v-for="item in commentList">
					<comment-item :item="item" @removeEnv="PremoveEnv"></comment-item>
				</view>
			</view>
		</view>

		<comment-frame :commentObj="commentObj" @commentEnv="PcommentEnv"></comment-frame>
	</view>
</template>

<script>
	var res
	var userNow;
	var Havelike=0;
	// 由schema2code生成，包含校验规则和enum静态数据
	import {
		enumConverter
	} from '../../js_sdk/validator/tiezi.js'
	import {
		operation
	} from '../../uniCloud-aliyun/cloudfunctions/utilsObj/index.obj.js'
	import {
		giveName,
		giveAvatar
	} from "../../utils/tools.js"
	import {
		store
	} from '@/uni_modules/uni-id-pages/common/store.js'
	const db = uniCloud.database()
	const utilsObj = uniCloud.importObject("utilsObj", {
		customUI: true //取消“加载中”页面
	})
	export default {
		data() {
			return {
				loadstate: true,
				realLike: '',
				checkList: [false],
				contentText: {
					contentDefault: '收藏',
					contentFav: '已收藏'
				},
				queryWhere: '',
				collectionList: "tiezi",
				loadMore: {
					contentdown: '',
					contentrefresh: '',
					contentnomore: ''
				},
				options: {
					// 将scheme enum 属性静态数据中的value转成text
					...enumConverter
				},
				commentObj: {
					article_id: "",
					comment_type: 0
				},
				commentList: [],
				noComment: false,
				userNow: '0',
				Havelike: false,
				markers: [],
				thisPosition: [

				],
				tiezi: "",
				islike: "",
				likecountNow: 0
			}
		},

		onLoad(e) {
			this._id = e.id
			this.commentObj.article_id = e.id
			this.Viewupdate(); //阅读量更新
			this.ReadUpdate();
			this.getComment();
			/* 	let posi=this.onloadPosition(); */
			this.pushMarkers();
			
			/* uniCloud.callFunction({
				name: "likes",
				data: {}
			}).then(res => {
				for(let i=0;i<res.result.data.length;i++)
				{
					if(res.result.data[i].article_id==this._id&&res.result.data[i].user_id==$cloudEnv_uid)
						islike=1;
						else
						islike=0;
				}
			}) */




		},
		onReady() {
			this.onloadLikeCount();
			if (this._id) {
				this.queryWhere = '_id=="' + this._id + '"'
			}
		},
		mounted() {
			userNow = uniCloud.getCurrentUserInfo();



		},
		methods: {
			giveName,
			giveAvatar,
			load()
			{
				
					this.loadstate= false
				
			},
			/* toMyInfo() {
				uni.navigateTo({
					url: '/pages/MyInfo/MyInfo'
				})
			},
			pu */shMarkers() {
				uniCloud.callFunction({
					name: "posting",
					data: {}
				}).then(res => {
					var tiezi = res.result.data;
					var markers = [];
					console.log(res);
					for (let i = 0; i < tiezi.length; i++) {
						if (tiezi[i]._id == this._id) {
							markers.push({
								id: 1,
								/* iconPath: '/static/气泡-6.png', */
								width: 25,
								height: 35,
								latitude: tiezi[i].latitude,
								longitude: tiezi[i].longtitude,
							})

						}
					}
					this.markers = markers;
				});

			},
			async onloadPosition() {
				let posi = await db.collection("tiezi")
					.where(`_id == "${this._id}"`).get();
				return posi;

			},
			async onloadLikeCount() {
				let count = await db.collection("opendb-news-comments")
					.where({
						article_id: this._id,
						user_id: db.getCloudEnv('$cloudEnv_uid'),
					}).count();
				this.Havelike = count;
			},
			//评论后的无感显示，能否移植到聊天室？
			PcommentEnv(e) {
				console.log(e);

				this.commentList.unshift({
					...this.commentObj,
					...e,
					user_id: [store.userInfo]
				})
			},
			async getComment() {
				/* db.collection("article_comment").get().then(res=>{
					console.log(res);
				}) */
				let commentTemp = db.collection("article_comment")
					.where(`article_id == "${this._id}" && comment_type==0`).orderBy("comment_date desc")
					.limit(20).getTemp()
				let userTemp = db.collection("uni-id-users").field("_id,username,nickname,avatar_file").getTemp()

				let res = await db.collection(commentTemp, userTemp).get()
				let idArr = res.result.data.map(item => {
					return item._id
				})

				let replyArr = await db.collection("article_comment").where({
						reply_comment_id: db.command.in(idArr)
					}).groupBy('reply_comment_id')
					.groupField('count(*) as totalReply').get();


				res.result.data.forEach(item => {
					let index = replyArr.result.data.findIndex(find => {
						return find.reply_comment_id == item._id
					})
					if (index > -1) item.totalReply = replyArr.result.data[index].totalReply
				})

				if (res.result.data == 0) this.noComment = true
				this.commentList = res.result.data


			},
			//浏览记录,记录的是浏览的人的ID和对应的文章ID
			async ReadUpdate() {
				let count = await db.collection("HaveRead")
					.where({
						article_id: this._id,
						user_id: db.getCloudEnv('$cloudEnv_uid'),
					}).count()
				if (count.result.total) {

				} else {
					await db.collection("HaveRead").add({
						article_id: this._id,
					})
				}

			},
			//提高收藏数
			CollectionupdateUP() {
				utilsObj.operation("tiezi", "collection_count", this._id, 1).then(res => {
					console.log(res);
				})
			},
			CollectionupdateDown() {
				utilsObj.operation("tiezi", "collection_count", this._id, -1).then(res => {
					console.log(res);
				})
			},
			//提高点赞数
			likesupdateUP() {
				utilsObj.operation("tiezi", "like_count", this._id, 1).then(res => {
					console.log(res);
				})
			},
			likesupdateDown() {
				utilsObj.operation("tiezi", "like_count", this._id, -1).then(res => {
					console.log(res);
				})
			},
			//用云对象来更改阅读量，参考cloudfunction中的同名文件

			Viewupdate() {
				utilsObj.operation("tiezi", "view_count", this._id, 1).then(res => {
					console.log(res);
				})
			},
			async favClickCollection(index) {
				this.checkList[index] = !this.checkList[index]
				console.log(this.checkList[index]);
				this.$forceUpdate()
				let count = await db.collection("Article_Collection")
					.where({
						article_id: this._id,
						user_id: db.getCloudEnv('$cloudEnv_uid'),
					}).count()
				console.log(count);
				if (count.result.total) {
					this.CollectionupdateDown();
					db.collection("Article_Collection")
						.where({
							article_id: this._id,
							user_id: db.getCloudEnv('$cloudEnv_uid'),
						}).remove()
				} else {
					db.collection("Article_Collection").add({
						article_id: this._id,

					})
					this.CollectionupdateUP();
				}
			},
			async clickLike() {
				let count = await db.collection("opendb-news-comments")
					.where({
						article_id: this._id,
						user_id: db.getCloudEnv('$cloudEnv_uid'),
					}).count()
				console.log(count);
				/* uniCloud.callFunction({
					name:'likes',
					data:{
						article_id:this._id,
						user_id:this.user_id
					}
				})
				.then(res=>{
					console.log(res)
				}) */
				/* db.collection("opendb-news-comments").add({
					article_id:this._id
				}) */
				//逻辑:若已经有对应点赞数据，再按一次会取消点赞,但是按钮的交互还没做
				if (count.result.total) {
					this.Havelike = 0;
					this.likesupdateDown();
					db.collection("opendb-news-comments")
						.where({
							article_id: this._id,
							user_id: db.getCloudEnv('$cloudEnv_uid'),
						}).remove()

					this.likecountNow = -1;
				} else {
					this.Havelike = 1;
					db.collection("opendb-news-comments").add({
						article_id: this._id,

					})
					this.likecountNow = 0;
					this.likesupdateUP(); //点赞量更新
					/* db.collection("tiezi").where({
						_id:this._id
					}).update({
						like_count:countAll
					}) */

					/* uniCloud.callFunction({
						name: "likes",
						data: {}
					}).then(res => {
						for(let i=0;i<res.result.data.length;i++)
						{
							if(res.result.data[i].article_id==this._id&&res.result.data[i].user_id==$cloudEnv_uid)
								islike=1;
							else
								islike=0;
						}
					}) */
				}

			},
			toyanchu() {
				uni.navigateTo({
					url: "../tiezi/yanchuList/yanchuList"
				})
			},
			toVolunteer() {
				uni.navigateTo({
					url: "../tiezi/volunteerList/volunteerList"
				})
			},
			toSport() {
				uni.navigateTo({
					url: "../tiezi/sportList/sportList"
				})
			},
			toLost() {
				uni.navigateTo({
					url: "../tiezi/lostList/lostList"
				})
			},
			toCamera() {
				uni.navigateTo({
					url: "../tiezi/cameraList/cameraList"
				})
			},
			toCat() {
				uni.navigateTo({
					url: "../tiezi/catList/catList"
				})
			},
			handleUpdate() {
				// 打开修改页面
				uni.navigateTo({
					url: './edit?id=' + this._id,
					events: {
						// 监听修改页面成功修改数据后, 刷新当前页面数据
						refreshData: () => {
							this.$refs.udb.loadData({
								clear: true
							})
						}
					}
				})
			},
			handleDelete() {
				this.$refs.udb.remove(this._id, {
					success: (res) => {
						// 删除数据成功后跳转到list页面
						uni.navigateTo({
							url: './list'
						})
					}
				})
			}
		},

	}
</script>

<style lang="scss">
	.line{
		right:6%;
	}
	.tieziimage {
		left: 50%;
	}

	.ItemContent {
		background-color: #dfdfdf;
		border-radius: 20px;
	}

	.title {
		font-size: 40px;
		font-weight: 700;
	}

	.User_Info {
		.username {
			position: absolute;
			left: 15%;
			top: 2%;
			font-size: 20px;
		}
	}

	.example-body {
		display: flex;
		padding: 10px 15px;
	}

	/* #ifdef MP-ALIPAY */
	.uni-fav {
		margin-left: 20rpx;
	}

	/* #endif */


	.favBtn {
		margin: 0 20rpx 20rpx 0;
	}


	.example-body-fullWidth {
		padding: 32rpx 0;
	}

	.example-body-first {
		/* #ifndef APP-PLUS-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
		justify-content: flex-start;
	}

	.favBtn-nav {
		// left:-50rpx;
	}

	.container {
		padding: 10px;
	}

	.username {
		font-size: 26rpx;
		color: #666;
		padding: 10rpx 0;
		display: flex;
		align-items: center;
		justify-content: space-between;

		.iconfont {
			font-size: 20rpx;
			padding: 10rpx;
			color: #999;
		}
	}
	
	.comment {
		
		padding: 30rpx;
		padding-bottom: 120rpx;

		.item {
			padding: 10rpx 0;
		}
	}

	.yanchu {
		color: aqua;
		font-style: oblique;
	}

	.volunteer {
		color: aqua;
	}

	.sport {
		color: aqua;
	}

	.cat {
		color: aqua;
	}

	.camera {
		color: aqua;
	}

	.lost {
		color: aqua;
	}

	.btns {
		margin-top: 10px;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		flex-direction: row;
	}

	.btns button {
		flex: 1;
	}

	.btn-delete {
		margin-left: 10px;
	}

	.map {
		height: 100%;
		width: 100%;
		position: absolute;
	}

	.like {
		position: relative;

		display: flex;
		flex-direction: column;
		align-items: center;
		padding: 80rpx 50rpx 50rpx;

		.btn {
			width: 200rpx;
			height: 100rpx;
			background: #e4e4e4;
			border-radius: 100rpx;
			color: #fff;
			display: flex;
			justify-content: center;
			align-items: center;
			flex-direction: column;
			font-size: 28rpx;

			.iconfont {
				font-size: 50rpx;
			}

			&.active {
				background: #0199FE;
			}

			&.inactive {
				background: #e4e4e4;
			}


		}

		.text {
			font-size: 26rpx;
			color: #666;

			.num {
				color: #0199FE
			}

			.spot {
				padding: 0 10rpx;
			}
		}

	}
</style>