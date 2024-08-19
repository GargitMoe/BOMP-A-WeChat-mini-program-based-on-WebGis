<template>
	<view class="center">
		<view class="box">
			
			<view class="minibox1">
			<uni-icons class="star" type="heart-filled" size="55" color="#fa5f5a" @click="tocomment"></uni-icons>
			<text style="position: relative; top:10%;left:16%;color:black;font-weight: 400;">收藏</text>
			</view>
			<view class="minibox2">
			<uni-icons class="chat" type="chat-filled" size="55" color="#35d99a" @click="totiezi"></uni-icons>	
			<text style="position: relative; top:10%;left:18%;color:black;font-weight: 400;">帖子</text>
			</view>
			<view class="minibox3">
			<uni-icons class="chatbox" type="chatboxes-filled" size="55" color="#3586fc" @click="tochat"></uni-icons>	
			<text style="position: relative; top:10%;left:3%;color:black;font-weight: 400;">聊天室</text>
			</view>
		</view>
		
		
		<uni-list class="center-list" v-for="(sublist , index) in ucenterList" :key="index">
			<uni-list-item class="Mylist" v-for="(item,i) in sublist" :title="item.title" link :note="item.rightText" :key="i":thumb="item.thumb"
				:clickable="true" :to="item.to" @click="ucenterListClick(item)" :show-extra-icon="true" 
				:extraIcon="{type:item.icon,color:'#999'}">
				
				<template v-slot:footer>
					<view v-if="item.showBadge" class="item-footer">
						<text class="item-footer-text">{{item.rightText}}</text>
						<view class="item-footer-badge"></view>
					</view>
				</template>
			</uni-list-item>
		</uni-list>
		
		<uni-list-chat v-if="Interest1"title="运动" avatar="/static/通知.png" note="你感兴趣的运动的新帖子" time="刚刚" badge-positon="left" :badge-text="dot1" clickable="true" :border="false" @click="toMain(1)"></uni-list-chat>
		<uni-list-chat v-if="Interest0"title="志愿活动" avatar="/static/通知.png" note="你感兴趣的志愿活动有新帖子" time="刚刚" badge-positon="left" :badge-text="dot0" clickable="true" border='false' @click="toMain(0)"></uni-list-chat>
		<uni-list-chat v-if="Interest2"title="拍照" avatar="/static/通知.png" note="你感兴趣的拍照有新帖子" time="刚刚" badge-positon="left" :badge-text="dot2" clickable="true" border='false' @click="toMain(2)"></uni-list-chat>
		<uni-list-chat v-if="Interest4"title="小动物" avatar="/static/通知.png" note="你感兴趣的小动物有新帖子" time="刚刚" badge-positon="left" :badge-text="dot4" clickable="true" border='false' @click="toMain(4)"></uni-list-chat>
		<uni-list-chat v-if="Interest5"title="演出" avatar="/static/通知.png" note="你感兴趣的演出有新帖子" time="刚刚" badge-positon="left" :badge-text="dot5" clickable="true" border='false' @click="toMain(5)"></uni-list-chat>
		<uni-list-chat v-if="Interest3"title="寻物" avatar="/static/通知.png" note="你感兴趣的寻物有新帖子" time="刚刚" badge-positon="left" :badge-text="dot3" clickable="true" border='false' @click="toMain(3)"></uni-list-chat>
	</view>
</template>

<script>
	import checkUpdate from '@/uni_modules/uni-upgrade-center-app/utils/check-update';
	import callCheckVersion from '@/uni_modules/uni-upgrade-center-app/utils/call-check-version';
	// #ifdef APP
	import UniShare from '@/uni_modules/uni-share/js_sdk/uni-share.js';
	const uniShare = new UniShare()
	// #endif
	const db = uniCloud.database();
	var InterestArray = new Array(); //返回的兴趣列表，是一个数组
	var Interest0 = 0; //记录用户筛选的帖子
	var Interest1 = 0;
	var Interest2 = 0;
	var Interest3 = 0;
	var Interest4 = 0;
	var Interest5 = 0;
	import {
		store,
		mutations
	} from '@/uni_modules/uni-id-pages/common/store.js'
	export default {
		// #ifdef APP
		onBackPress({from}) {
			if(from=='backbutton'){
				this.$nextTick(function(){
					uniShare.hide()
				})
				return uniShare.isShow;
			}
		},
		// #endif
		data() {
			return {
				
				dot0:'dot',
				dot1:'dot',
				dot2:'dot',
				dot3:'dot',
				dot4:'dot',
				dot5:'dot',
				 Interest0 : 0, //记录用户筛选的帖子
				 Interest1 : 0,
				 Interest2 : 0,
				 Interest3 : 0,
				 Interest4 : 0,
				 Interest5 : 0,
				ucenterList: [
					
					[/* {
						"title":"评论我的",
						"to": '/pages/CommentMe/CommentMe',
						"thumb":"/static/评论.png",
						"thumb-size":"lg",
						"rightText":"评论不嫌多"
					}, */
					
						/* {
						"title":"地区聊天室1",
						"to": '/pages/Chat/Chat',
						"thumb":"/static/评论组,说话,讨论,留言.png",
						"thumb-size":"lg",
						"rightText":"西教"
					},
					{
						"title":"地区聊天室2",
						"to": '/pages/Chat-2/Chat-2',
						
						"thumb":"/static/评论组,说话,讨论,留言.png",
						"thumb-size":"lg",
						"rightText":"东园宿舍"
					},
					{
						"title":"地区聊天室3",
						"to": '/pages/Chat-3/Chat-3',
						
						"thumb":"/static/评论组,说话,讨论,留言.png",
						"thumb-size":"lg",
						"rightText":"东教"
					}, */
					/* {
						"title":"帖子",
						"to": '/pages/tiezi/list',
						"thumb":"/static/帖子.png",
						"thumb-size":"lg",
						"rightText":"看看大家都在哪"
					} */],
					// #ifdef APP-PLUS
					[{
						"title": this.$t('mine.about'),
						"to": '/pages/ucenter/about/about',
						"icon": "info"
					}]
					// #endif
				],
				listStyles: {
					"height": "150rpx", // 边框高度
					"width": "150rpx", // 边框宽度
					"border": { // 如果为 Boolean 值，可以控制边框显示与否
						"color": "#eee", // 边框颜色
						"width": "1px", // 边框宽度
						"style": "solid", // 边框样式
						"radius": "100%" // 边框圆角，支持百分比
					}
				}
			}
		},
		onLoad() {
			//#ifdef APP-PLUS
			this.ucenterList[this.ucenterList.length - 2].unshift({
				title:this.$t('mine.checkUpdate'),// this.this.$t('mine.checkUpdate')"检查更新"
				rightText: this.appVersion.version + '-' + this.appVersion.versionCode,
				event: 'checkVersion',
				icon: 'loop',
				showBadge: this.appVersion.hasNew
			})
			//#endif
			
		},
		onShow() {
			uni.removeTabBarBadge({
				 index: 1
			})
			var userNow=uniCloud.getCurrentUserInfo();
			uniCloud.callFunction({
				name: "InterestArray",
				data: {},
			
			}).then(res => {
				var Interest = res.result.data
			
				for (let i = 0; i < Interest.length; i++) {
					if (Interest[i].user_id == userNow.uid)
						InterestArray = Interest[i].Interest;
				}
				for (let i = 0; i < InterestArray.length; i++) {
					if (InterestArray.indexOf(0) == -1)
						this.Interest0 = 0;
					if (InterestArray.indexOf(1) == -1)
						this.Interest1 = 0;
					if (InterestArray.indexOf(2) == -1)
						this.Interest2 = 0;
					if (InterestArray.indexOf(3) == -1)
						this.Interest3 = 0;
					if (InterestArray.indexOf(4) == -1)
						this.Interest4 = 0;
					if (InterestArray.indexOf(5) == -1)
						this.Interest5 = 0;
					if (InterestArray[i] == 0)
						this.Interest0 = 1;
					if (InterestArray[i] == 1)
						this.Interest1 = 1;
					if (InterestArray[i] == 2)
						this.Interest2 = 1;
					if (InterestArray[i] == 3)
						this.Interest3 = 1;
					if (InterestArray[i] == 4)
						this.Interest4 = 1;
					if (InterestArray[i] == 5)
						this.Interest5 = 1;
				}})
		},
		computed: {
			userInfo() {
				return store.userInfo
			},
			hasLogin(){
				return store.hasLogin
			},
			// #ifdef APP-PLUS
			appVersion() {
				return getApp().appVersion
			},
			// #endif
			appConfig() {
				return getApp().globalData.config
			}
		},
		methods: {
			toMain(num)
			{
				if(num==0)
				this.dot0='';
				else if(num==1)
				this.dot1='';
				else if(num==2)
				this.dot2='';
				else if(num==3)
				this.dot3='';
				else if(num==4)
				this.dot4='';
				else if(num==5)
				this.dot5='';
				uni.switchTab({
					url:'/pages/list/list',
					success: function (e) {
												var page = getCurrentPages()[0]//相当于被跳转页面的选择器
												if (page == undefined || page == null) {//判断页面是否存在
													return;
												} else{
					                                console.log(page)//打印选择器中内容   
													page.$vm.changeLocation(num)
												}
											}
					
				})
			},
			
			tochat()
			{
				uni.navigateTo({
					url:'/pages/Chat-3/Chat-3'
				})
			},
			tocomment()
			{
				uni.navigateTo({
					url:'/pages/tiezi/mycollection/mycollection'
				})
			},
			totiezi()
			{
				uni.navigateTo({
					url:'/pages/tiezi/list'
				})
			},
			search(e)
			{
				console.log(e);
			},
			toSettings() {
				uni.navigateTo({
					url: "/pages/ucenter/settings/settings"
				})
			},
			signIn() { //普通签到
				this.$refs.signIn.open()
			},
			signInByAd(){ //看激励视频广告签到
				this.$refs.signIn.showRewardedVideoAd()
			},
			/**
			 * 个人中心项目列表点击事件
			 */
			ucenterListClick(item) {
				if (!item.to && item.event) {
					this[item.event]();
				}
			},
			async checkVersion() {
				let res = await callCheckVersion()
				console.log(res);
				if (res.result.code > 0) {
					checkUpdate()
				} else {
					uni.showToast({
						title: res.result.message,
						icon: 'none'
					});
				}
			},
			toUserInfo() {
				uni.navigateTo({
					url: '/uni_modules/uni-id-pages/pages/userinfo/userinfo'
				})
			},
			tapGrid(index) {
				uni.showToast({
					// title: '你点击了，第' + (index + 1) + '个',
					title: this.$t('mine.clicked') + " " + (index + 1) ,
					icon: 'none'
				});
			},
			/**
			 * 去应用市场评分
			 */
			gotoMarket() {
				// #ifdef APP-PLUS
				if (uni.getSystemInfoSync().platform == "ios") {
					// 这里填写appstore应用id
					let appstoreid = this.appConfig.marketId.ios; // 'id1417078253';
					console.log({appstoreid});
					plus.runtime.openURL("itms-apps://" + 'itunes.apple.com/cn/app/wechat/' + appstoreid + '?mt=8',err=>{
						console.log('plus.runtime.openURL err:' + JSON.stringify(err));
					});
				}
				if (uni.getSystemInfoSync().platform == "android") {
					var Uri = plus.android.importClass("android.net.Uri");
					var uri = Uri.parse("market://details?id=" + this.appConfig.marketId.android);
					var Intent = plus.android.importClass('android.content.Intent');
					var intent = new Intent(Intent.ACTION_VIEW, uri);
					var main = plus.android.runtimeMainActivity();
					main.startActivity(intent);
				}
				// #endif
			},
			/**
			 * 获取积分信息
			 */
			getScore() {
				if (!this.userInfo) return uni.showToast({
					title: this.$t('mine.checkScore'),
					icon: 'none'
				});
				uni.showLoading({
					mask: true
				})
				db.collection("uni-id-scores")
					.where('"user_id" == $env.uid')
					.field('score,balance')
					.orderBy("create_date", "desc")
					.limit(1)
					.get()
					.then((res) => {
						console.log(res);
						const data = res.result.data[0];
						let msg = '';
						msg = data ? (this.$t('mine.currentScore')+ data.balance) : this.$t('mine.noScore');
						uni.showToast({
							title: msg,
							icon: 'none'
						});
					}).finally(()=>{
						uni.hideLoading()
					})
			},
			async share() {
				let {result} = await db.collection('uni-id-users').where("'_id' == $cloudEnv_uid").field('my_invite_code').get()
				let myInviteCode = result.data[0].my_invite_code
				if(!myInviteCode){
					return uni.showToast({
						title: '请检查uni-config-center中uni-id配置，是否已启用 autoSetInviteCode',
						icon: 'none'
					});
				}
				console.log({myInviteCode});
				let {
					appName,
					logo,
					company,
					slogan
				} = this.appConfig.about
				// #ifdef APP-PLUS
				uniShare.show({
					content: { //公共的分享类型（type）、链接（herf）、标题（title）、summary（描述）、imageUrl（缩略图）
						type: 0,
						href: this.appConfig.h5.url +
							`/#/pages/ucenter/invite/invite?code=uniInvitationCode:${myInviteCode}`,
						title: appName,
						summary: slogan,
						imageUrl: logo +
							'?x-oss-process=image/resize,m_fill,h_100,w_100' //压缩图片解决，在ios端分享图过大导致的图片失效问题
					},
					menus: [{
							"img": "/static/app-plus/sharemenu/wechatfriend.png",
							"text": this.$t('common.wechatFriends'),
							"share": {
								"provider": "weixin",
								"scene": "WXSceneSession"
							}
						},
						{
							"img": "/static/app-plus/sharemenu/wechatmoments.png",
							"text": this.$t('common.wechatBbs'),
							"share": {
								"provider": "weixin",
								"scene": "WXSceneTimeline"
							}
						},
						{
							"img": "/static/app-plus/sharemenu/weibo.png",
							"text": this.$t('common.weibo'),
							"share": {
								"provider": "sinaweibo"
							}
						},
						{
							"img": "/static/app-plus/sharemenu/qq.png",
							"text": "QQ",
							"share": {
								"provider": "qq"
							}
						},
						{
							"img": "/static/app-plus/sharemenu/copyurl.png",
							"text": this.$t('common.copy'),
							"share": "copyurl"
						},
						{
							"img": "/static/app-plus/sharemenu/more.png",
							"text": this.$t('common.more'),
							"share": "shareSystem"
						}
					],
					cancelText: this.$t('common.cancelShare'),
				}, e => { //callback
					console.log(e);
				})
				// #endif
			}
		}
	}
</script>

<style lang="scss" scoped>
	/* #ifndef APP-NVUE */
	view {
		display: flex;
		box-sizing: border-box;
		flex-direction: column;
	}
	    .rounded {
	        border-radius: 30px; /*设置边框半径*/
	        width: 374px;
	        height: 40px;
	        background-color: #000000;
	        color: white;
	        text-align: center;
	        line-height: 50px;
	    }
	page {
		background-color: #f8f8f8;
	}
	/* #endif*/
	.box {
		position: relative;
		right:3%;
		top: 5%;
		width: 450px;
		height: 150px;
		background: #ffffff;
	
		border-radius: 12px;
		padding: 10px;
		display: grid;
		align-items: center;
		justify-content: center;
		color: #FFFFFF;
		/* margin-bottom: 40px; */
		.minibox1{
			position: absolute;
			left:12%;
			width: 70px;
			height: 70px;
			background: #fee8eb;
				
			border-radius: 18px;
			padding: 10px;
			display: grid;
			align-items: center;
			justify-content: center;
			color: #FFFFFF;
			.star {
				position: relative;
				bottom:5%;
			}
		}
		.minibox2{
			position: absolute;
			left:70%;
			width: 70px;
			height: 70px;
			background: #e3f8ef;
				
			border-radius: 18px;
			padding: 10px;
			display: grid;
			align-items: center;
			justify-content: center;
			color: #FFFFFF;
			.chat {
				position: relative;
				bottom:5%;
			}
		}
		.minibox3{
			position: absolute;
			left:41%;
			width: 70px;
			height: 70px;
			background: #e4f0ff;
				
			border-radius: 18px;
			padding: 10px;
			display: grid;
			align-items: center;
			justify-content: center;
			color: #FFFFFF;
			.chatboxes {
				position: relative;
				bottom:5%;
			}
		}
	
		
	
		
	}
	.center {
		flex: 1;
		flex-direction: column;
		background-color: #f8f8f8;
	}
	/* .Mylist{
		width: 350px;
		height: 50px;
		border-radius: 20px;
		overflow: hidden;
		background-color: #007AFF;
	} */
	.userInfo {
		// padding: 20rpx;
		padding-top: 60px;
		background-image: url(../../static/uni-center/headers.png);
		flex-direction: column;
		align-items: center;
	}
	.defaultAvatarUrl{
		width: 150rpx;
		height: 150rpx;
		background-color: #007aff;
		border-radius: 100%;
		justify-content: center;
		align-items: center;
	}

	.logo-title {
		flex: 1;
		align-items: center;
		justify-content: space-between;
		flex-direction: row;
	}

	.uer-name {
		height: 100rpx;
		line-height: 100rpx;
		font-size: 38rpx;
		color: #FFFFFF;
	}

	.center-list {
		
		background-color: #f9f9f9;
	}

	.center-list-cell {
		width: 750rpx;
		background-color: #007AFF;
		height: 40rpx;
	}

	.grid {
		background-color: #FFFFFF;
		margin-bottom: 6px;
	}

	.uni-grid .text {
		font-size: 16px;
		height: 25px;
		line-height: 25px;
		color: #817f82;
	}

	.uni-grid .item ::v-deep .uni-grid-item__box {
		justify-content: center;
		align-items: center;
	}


	/*修改边线粗细示例*/
	/* #ifndef APP-NVUE */
	.center-list ::v-deep .uni-list--border:after {
		-webkit-transform: scaleY(0.2);
		transform: scaleY(0.2);
		margin-left: 80rpx;
	}

	.center-list ::v-deep .uni-list--border-top,
	.center-list ::v-deep .uni-list--border-bottom {
		display: none;
	}

	/* #endif */
	.item-footer {
		flex-direction: row;
		align-items: center;
	}

	.item-footer-text {
		color: #999;
		font-size: 24rpx;
		padding-right: 10rpx;
	}

	.item-footer-badge {
		width: 20rpx;
		height: 20rpx;
		/* #ifndef APP-NVUE */
		border-radius: 50%;
		/* #endif */
		/* #ifdef APP-NVUE */
		border-radius: 10rpx;
		/* #endif */
		background-color: #DD524D;
	}
</style>