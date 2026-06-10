<template>
	<view class="center">
		<uni-sign-in ref="signIn"></uni-sign-in>
		<view class="userInfo" @click.capture="toUserInfo">
			<u-avatar v-if="hasLogin&&userInfo.avatar_file&&userInfo.avatar_file.url" :src="userInfo.avatar_file.url"
				size="100"></u-avatar>


			<view v-else class="defaultAvatarUrl">
				<uni-icons color="#ffffff" size="50" type="person-filled" />
			</view>

			<view class="logo-title">
				<text class="uer-name" v-if="hasLogin">{{userInfo.nickname||userInfo.username||userInfo.mobile}}</text>
				<text class="uer-name" v-else>{{$t('mine.notLogged')}}</text>
			</view>
		</view>
		<!-- <uni-section title="我想看的" subTitle="最多选择6个,对想看的内容进行筛选" type="line">
			<view class="uni-px-5 uni-pb-5">
				
				<uni-data-checkbox min="0" max="6" multiple v-model="checkbox6" :localdata="hobby" mode="tag" selectedColor="#467897"
					@change="InterestUpdate"></uni-data-checkbox>
			</view>
		</uni-section> -->
		<!-- <view class="box">
			<text style="font-size: 25px;font-weight: 600;position: absolute;top:0%;left: 3%;color:white;">我的BOMP</text>
			<uni-icons class="star" type="star-filled" size="70" color="#ffffff" @click="tocollection"></uni-icons>
			<uni-icons class="chat" type="chat-filled" size="70" color="#ffffff" @click="tomylist"></uni-icons>
			<uni-icons class="flag" type="settings-filled" size="70" color="#ffffff" @click="tosetting"></uni-icons>


		</view> -->

		<uni-list class="center-list" v-for="(sublist , index) in ucenterList" :key="index">
			<uni-list-item v-for="(item,i) in sublist" :title="item.title" link :rightText="item.rightText" :key="i"
				:clickable="true" :to="item.to" @click="ucenterListClick(item)" :show-extra-icon="true"
				:extraIcon="{type:item.icon,color:item.color}">
				<template v-slot:footer>
					<view v-if="item.showBadge" class="item-footer">
						<text class="item-footer-text">{{item.rightText}}</text>
						<view class="item-footer-badge"></view>
					</view>
				</template>
			</uni-list-item>
		</uni-list>
		<uni-list class="center-list1" v-for="(sublist , index) in ucenterList1" :key="index">
			<uni-list-item v-for="(item,i) in sublist" :title="item.title" link :rightText="item.rightText" :key="i"
				:clickable="true" :to="item.to" @click="ucenterListClick(item)" :show-extra-icon="true"
				:extraIcon="{type:item.icon,color:item.color}">
				<template v-slot:footer>
					<view v-if="item.showBadge" class="item-footer">
						<text class="item-footer-text">{{item.rightText}}</text>
						<view class="item-footer-badge"></view>
					</view>
				</template>
			</uni-list-item>
		</uni-list>


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
	import {
		store,
		mutations
	} from '@/uni_modules/uni-id-pages/common/store.js'

	export default {
		// #ifdef APP
		onBackPress({
			from
		}) {
			if (from == 'backbutton') {
				this.$nextTick(function() {
					uniShare.hide()
				})
				return uniShare.isShow;
			}
		},
		// #endif
		data() {
			return {
				checkbox6: [0],
				hobby: [{
						text: '志愿活动',
						value: 0
					}, {
						text: '运动',
						value: 1
					}, {
						text: '摄影',
						value: 2
					},
					{
						text: '寻物启事',
						value: 3
					},
					{
						text: '小动物们',
						value: 4
					},
					{
						text: '演出',
						value: 5
					}
				],

				ucenterList: [
					[
						{
							"title": "收藏",
							"to": '/pages/tiezi/mycollection/mycollection',
							"icon": "heart-filled",
							"color": '#fa5f5a'
						},
						{
							"title": "我发布的",
							"to": '/pages/tiezi/mylist',
							"icon": "checkbox-filled",
							"color": '#35d99a'
						},
						{
							"title": "设置",
							"to": '/pages/ucenter/settings/settings',
							"icon": "gear-filled",
							"color": '#55aaff'
						},

					],
					[{
						"title": "联系我们",
						"to": '/uni_modules/uni-feedback/pages/opendb-feedback/opendb-feedback',
						"icon": "help",
						"color": '#55aaff'
					}, ],

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
		onLoad(e) {
			//#ifdef APP-PLUS
			this.ucenterList[this.ucenterList.length - 2].unshift({
				title: this.$t('mine.checkUpdate'), // this.this.$t('mine.checkUpdate')"检查更新"
				rightText: this.appVersion.version + '-' + this.appVersion.versionCode,
				event: 'checkVersion',
				icon: 'loop',
				showBadge: this.appVersion.hasNew
			})
			//#endif
		},

		onShow() {},
		computed: {
			userInfo() {
				return store.userInfo
			},
			hasLogin() {
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
			tosetting() {
				uni.navigateTo({
					url: '/pages/ucenter/settings/settings'
				})
			},
			tocollection() {
				uni.navigateTo({
					url: '/pages/tiezi/mylist'
				})
			},
			tomylist() {
				uni.navigateTo({
					url: '/pages/tiezi/mylist'
				})
			},
			toSettings() {
				uni.navigateTo({
					url: "/pages/ucenter/settings/settings"
				})
			},
			async InterestUpdate(e) {
				console.log(e.detail.value);
				let count = await db.collection("MyInterest")
					.where({
						user_id: db.getCloudEnv('$cloudEnv_uid'),
					}).count()
				if (count.result.total) {
					await db.collection("MyInterest").where({
						user_id: db.getCloudEnv('$cloudEnv_uid'),
					}).update({
						Interest: e.detail.value
					})
				} else {
					console.log(e.detail.value);
					await db.collection("MyInterest").add({
						user_id: db.getCloudEnv('$cloudEnv_uid'),
						Interest: e.detail.value
					})
				}

			},
			/* async ChangeInterest(e)	
			{
				let Interest_Array=e.data
				mutations.updateUserInfo({
					Interest_Array
				})
				await db.collection("uni-id-users").doc({_id:db.getCloudEnv('$cloudEnv_uid')}).update({
					Interest_Array:e.data
				})
				console.log('e',e);
				
			}, */
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
			/**
			 * 去应用市场评分
			 */
			/**
			 * 获取积分信息
			 */

			async share() {
				let {
					result
				} = await db.collection('uni-id-users').where("'_id' == $cloudEnv_uid").field('my_invite_code').get()
				let myInviteCode = result.data[0].my_invite_code
				if (!myInviteCode) {
					return uni.showToast({
						title: '请检查uni-config-center中uni-id配置，是否已启用 autoSetInviteCode',
						icon: 'none'
					});
				}
				console.log({
					myInviteCode
				});
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

	.box {
		position: relative;
		left: 3%;
		top: 5%;
		width: 350px;
		height: 200px;
		background: #73daff;

		border-radius: 12px;
		padding: 10px;
		display: grid;
		align-items: center;
		justify-content: center;
		color: #FFFFFF;
		/* margin-bottom: 40px; */

		.star {
			position: absolute
		}

		.flag {
			position: absolute;
			left: 76%;
		}

		.chat {
			position: absolute;
			left: 39%;
		}
	}

	page {
		background-color: #ffffff;
	}

	/* #endif*/
	.text {
		font-size: 12px;
		color: #666;
		margin-top: 5px;
	}

	.center {
		flex: 1;
		flex-direction: column;
		background-color: #f8f8f8;
	}

	.userInfo {
		// padding: 20rpx;
		padding-top: 60px;
		background:
			linear-gradient(to bottom, transparent, #ffffff),
			linear-gradient(to right, #467897, #73daff);


		flex-direction: column;
		align-items: center;
	}

	.defaultAvatarUrl {
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
		font-weight: 500;
		color: #73daff;
		font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

	}

	.center-list {
		position: relative;
		bottom: 15%;
		/* margin-bottom: 30rpx; */
		background-color: #ffffff;
		
	}

	.center-list-cell {
		width: 750rpx;
		background-color: #007AFF;
		height: 60rpx;
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

	.uni-px-5 {
		padding-left: 10px;
		padding-right: 10px;
	}

	.uni-pb-5 {
		padding-bottom: 10px;
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