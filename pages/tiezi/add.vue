<template>
	<view class="uni-container">
		<div class="title">
			<h1>BOMP!</h1>
		</div>
		<uni-forms ref="form" :model="formData" validate-trigger="submit" err-show-type="toast" label-position="top">
			<uni-forms-item name="title" label="标题" required>
				<uni-easyinput placeholder="在此输入标题" v-model="formData.title"></uni-easyinput>
			</uni-forms-item>
			<uni-forms-item name="tag" label="发布类型" required="true">
				<uni-data-checkbox v-model="formData.tag" :localdata="formOptions.tag_localdata"></uni-data-checkbox>
			</uni-forms-item>
			<uni-forms-item name="article" label="内容" required>
				<uni-easyinput placeholder="在此输入内容" v-model="formData.article" class="input-article"
					type="textarea"></uni-easyinput>
			</uni-forms-item>
			<view v-if="formData.tag==3" :key="1">
				<uni-forms-item name="lost" required>
					<uni-easyinput placeholder="丢失/捡到的物品"></uni-easyinput>
				</uni-forms-item>
			</view>
			<uni-forms-item class="image" name="image" label="发布图片">
				<uni-file-picker return-type="object" v-model="formData.image" class="imgpick"></uni-file-picker>
			</uni-forms-item>
			<view v-if="formData.tag==5" :key="2">
				<uni-forms-item name="place" label="演出地点" required>
					<uni-easyinput></uni-easyinput>
				</uni-forms-item>
			</view>
			<view v-if="formData.tag==0||formData.tag==3" :key="3">
				<uni-forms-item name="mobile" label="联系方式">
					<uni-easyinput placeholder="例如QQ群,微信号等,非必填" v-model="formData.mobile"></uni-easyinput>
				</uni-forms-item>
			</view>
			<!-- 权限设置 -->
			<view v-if="usernow.role">
				<button @click="choose">选择位置</button>
			</view>
			<view class="uni-button-group">
				<button type="primary" class="uni-button" @click="submit">发布</button>
			</view>
		</uni-forms>
	</view>
</template>
<!--也许需要把地址也引入帖子内-->
<script>
	import {
		validator
	} from '../../js_sdk/validator/tiezi.js';
	var userNow=uniCloud.getCurrentUserInfo();;
	const db = uniCloud.database();
	const dbCollectionName = 'tiezi';
	var lati;
	var long;
	var selectlati = 0;
	var selectlong = 0;

	function getValidator(fields) {
		let result = {}
		for (let key in validator) {
			if (fields.indexOf(key) > -1) {
				result[key] = validator[key]
			}
		}
		return result
	}



	export default {
		data() {

			let formData = {
				"title": "",
				"article": "",
				"image": null,
				"tag": 0,
				"mobile": "",
				"user_id": "",
				"latitude": "",
				"longtitude": "",
				"like_count": 0,
				"view_count": 0,

			}
			return {
				/* 发帖的经纬度在此处 */
				lat: 0,
				lng: 0,
				formData,
				formOptions: {
					"tag_localdata": [{
							"text": "志愿活动",
							"value": 0
						},
						{
							"text": "运动",
							"value": 1
						},
						{
							"text": "随手拍",
							"value": 2
						},
						{
							"text": "寻物启事",
							"value": 3
						},
						{
							"text": "小动物",
							"value": 4
						},
						{
							"text": "户外演出",
							"value": 5
						}
					],
					userNow: 1,
				},
				rules: {
					...getValidator(Object.keys(formData))
				}
			}
		},
		mounted() {
			this.getLocation();
			userNow = uniCloud.getCurrentUserInfo();
			console.log(userNow);
		},
		onReady() {
			this.$refs.form.setRules(this.rules)
		},
		methods: {

			/**
			 * 验证表单并提交
			 */
			submit() {
				/* var lati;
				var lngi;
				this.getLocation();
				console.log(lati);
				console.log(lngi); */
				uni.showLoading({
					mask: true
				})
				this.$refs.form.validate().then((res) => {
					this.getLocation();
					if (!selectlati) {
						res.latitude = lati;
						res.longtitude = long;
						res.like_count = 0;
					} else {
						res.latitude = selectlati;
						res.longtitude = selectlong;
						res.like_count = 0;
					}
					return this.submitForm(res)
				}).catch(() => {}).finally(() => {
					uni.hideLoading()
				})
			},
			choose() {
				uni.chooseLocation({
					success: function(res) {
						selectlati = res.latitude;
						selectlong = res.longitude;
						console.log('位置名称：' + res.name);
						console.log('详细地址：' + res.address);
						console.log('纬度：' + res.latitude);
						console.log('经度：' + res.longitude);
					}
				});
			},
			getLocation() {
				const that = this;
				uni.getLocation({
					type: "gcj02",
					success(res) {
						lati = res.latitude; // 更新经度
						long = res.longitude; // 更新纬度
						console.log(lati);
						console.log(long);
						/* db.collection("tiezi").add({
							longtitude:res.longitude,
							latitude:res.latitude
						}) */
						const qqmap = require('@/pages/qqmap-wx-jssdk.min.js');
						const showmap = new qqmap({
							key: 'AC5BZ-UOZ3Q-CVW5V-4MW7Z-ZGE2J-7AB4Q'
						});

					},
				});

			},

			/**
			 * 提交表单
			 */
			submitForm(value) {
				// 使用 clientDB 提交数据
				return db.collection(dbCollectionName).add(value).then((res) => {
					uni.showToast({
						icon: 'none',
						title: '新增成功'
					})
					this.getOpenerEventChannel().emit('refreshData')
					setTimeout(() => uni.navigateBack(), 500)
				}).catch((err) => {
					uni.showModal({
						content: err.message || '请求服务失败',
						showCancel: false
					})
				})
			}
		}
	}
</script>

<style>
	.title {
		text-align: center;
		color: gray;
		font-size: 30px;
		font-weight: 700;
	}

	.imgpick {
		position: relative;
		left: 30px;
	}

	.uni-container {
		padding: 15px;
	}

	.input-article {
		height: 100px;
	}

	.image {
		position: relative;
		left: 40px;
	}

	.uni-input-border,
	.uni-textarea-border {
		width: 80%;
		font-size: 14px;
		color: #666;
		border: 1px #e5e5e5 solid;
		border-radius: 5px;
		box-sizing: border-box;
	}

	.uni-input-border {
		padding: 0 10px;
		height: 35px;

	}

	.uni-textarea-border {
		padding: 10px;
		height: 80px;
	}

	.uni-button-group {
		margin-top: 50px;
		/* #ifndef APP-NVUE */
		display: flex;
		/* #endif */
		justify-content: center;
	}

	.uni-button {
		width: 100px;
	}
</style>