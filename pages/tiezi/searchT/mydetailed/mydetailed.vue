<template>
	<view class="container">
		<unicloud-db ref="udb" v-slot:default="{data, loading, error, options}" :options="options"
			:collection="collectionList" field="title,article,image,tag,mobile,like_count,view_count,user_id" :where="queryWhere"
			:getone="true" :manual="true">
			<view v-if="error">{{error.message}}</view>
			<view v-else-if="loading">
				<uni-load-more :contentText="loadMore" status="loading"></uni-load-more>
			</view>
			<view v-else-if="data">
				<view>
					<uni-title type="h1" title="标题:"color="#439ffc"></uni-title>
					<text>{{data.title}}</text>
				</view>
				<view class="dnms-divider"></view>
				<view>
					<uni-title type="h3" title="文章内容:" color="#439ffc"></uni-title>
					<text>{{data.article}}</text>
				</view>
				<view class="dnms-divider"></view>
				<view>
					<uni-file-picker v-if="data.image && data.image.fileType == 'image'" :value="data.image"
						:file-mediatype="data.image && data.image.fileType" return-type="object"
						readonly></uni-file-picker>
					<uni-link v-else-if="data.image" :href="data.image.url" :text="data.image.url"></uni-link>
					<text v-else></text>
				</view>
				<view class="dnms-divider"></view>
				<view>
					<uni-title type="h3" title="标签:" color="#439ffc"></uni-title>
					<text>{{options.tag_valuetotext[data.tag]}}</text>
				</view>
				<view class="dnms-divider"></view>
				<view>
					<uni-title type="h3" title="联系方式:" color="#439ffc"></uni-title>
					<text>{{data.mobile}}</text>
				</view>
				<!-- <view>
					<text>user_id</text>
					<text>{{data.user_id.nickname}}</text>
				</view> -->
			</view>
			<view>
				<uni-title type="h3" title="赞过的人数"color="#439ffc"></uni-title>
				<text>{{data.like_count}}</text>
			</view>
			<view>
				<uni-title type="h3" title="阅读量"color="#439ffc"></uni-title>
				<text>{{data.view_count}}</text>
			</view>
			<!-- <view>
				<view class="btns active">
					<button type="default" @click="clickLike">点赞</button>
				</view>
				
			</view> -->
		</unicloud-db>
		<view class="btns">
			<button type="primary" @click="handleUpdate">修改</button>
			<button type="warn" class="btn-delete" @click="handleDelete">删除</button>
		</view>
	</view>
</template>

<script>
	var res
	// 由schema2code生成，包含校验规则和enum静态数据
	import {
		enumConverter
	} from '@/js_sdk/validator/tiezi.js'
	import{
		operation
	} from'@/uniCloud-aliyun/cloudfunctions/utilsObj/index.obj.js'
	const db = uniCloud.database()
	const utilsObj=uniCloud.importObject("utilsObj")
	export default {
		data() {
			return {
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
			}
		},

		onLoad(e) {
			this._id = e.id
			this.Viewupdate();//阅读量更新
		/* 	this.likesupdate();//点赞量更新 */
		},
		onReady() {
			if (this._id) {
				this.queryWhere = '_id=="' + this._id + '"'
			}
		},
		mounted() {
			/* this.getLocation(); */
		},
		methods: {
			//提高点赞数
			likesupdateUP()
			{
				utilsObj.operation("tiezi","like_count",this._id,1).then(res=>{
					console.log(res);
				})
			},
			likesupdateDown()
			{
				utilsObj.operation("tiezi","like_count",this._id,-1).then(res=>{
					console.log(res);
				})
			},
			//用云对象来更改阅读量，参考cloudfunction中的同名文件
			Viewupdate()
			{
				utilsObj.operation("tiezi","view_count",this._id,1).then(res=>{
					console.log(res);
				})
			},
			 async clickLike(){
				let count=await db.collection("opendb-news-comments")
				.where({
					article_id:this._id,
					user_id:db.getCloudEnv('$cloudEnv_uid')	,
					}).count()
				/* var countAll=await db.collection("opendb-news-comments")
					.where({
						article_id:this._id,
						}).count() */
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
				if(count.result.total){
					this.likesupdateDown();
					db.collection("opendb-news-comments")
					.where({
						article_id:this._id,
						user_id:db.getCloudEnv('$cloudEnv_uid')	,
						}).remove()
				}else
				{
					db.collection("opendb-news-comments").add({
						article_id:this._id,
						
					})
					this.likesupdateUP();//点赞量更新
					/* db.collection("tiezi").where({
						_id:this._id
					}).update({
						like_count:countAll
					}) */
				} 
				
			},
			/* getLocation() {
				const that = this;
				uni.getLocation({
					type: "gcj02",
					success(res) {
						that.lat = res.latitude; // 更新经度
						that.lng = res.longitude; // 更新纬度
						const qqmap = require('@/pages/qqmap-wx-jssdk.min.js');
						const showmap = new qqmap({
							key: 'AC5BZ-UOZ3Q-CVW5V-4MW7Z-ZGE2J-7AB4Q'
						});
						showmap.reverseGeocoder({
							location: {
								latitude: res.latitude,
								longitude: res.longitude
							},
							success(result) {
								const adres = result.result.address;
								that.address = adres;
								console.log(adres);
							},
							fail: (error) => {
								console.error(error);
							}
						});
					},
				});
						*/
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
							url: './mylist'
						})
					}
				})
			}
	}
	
</script>

<style>
	.container {
		padding: 10px;
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
</style>