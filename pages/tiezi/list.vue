<template>
	<view class="container">
		<view class="uni-search-box">
			<uni-search-bar v-model="keyword" ref="searchBar" radius="100" cancelButton="none" disabled
				:placeholder="inputPlaceholder" />
			<view class="cover-search-bar" @click="searchClick"></view>
		</view>
		<unicloud-db ref="udb" v-slot:default="{data, pagination, loading, hasMore, error}" :collection="collectionList"
			field="title,article,image,tag,mobile,user_id">
			<view v-if="error">{{error.message}}</view>
			<view v-else-if="data">
				<uni-list>
					<uni-list-item :to="'/pages/tiezi/detail?id='+item._id+'&title='+item.title"
						v-for="(item, index) in data" :key="index" showArrow :clickable="true"
						@click="handleItemClick(item._id)">
						<!-- 通过header插槽定义列表左侧图片 -->
						<!-- 通过body插槽定义布局 -->
						<template v-slot:body>
							<view class="main">
								<text class="title">{{item.title}}</text>
								<view class="info">
									<text class="author">{{item.user_id[0]?item.user_id[0].nickname:''}}</text>
								</view>
							</view>
						</template>
						<template v-slot:footer>
        </template>
					</uni-list-item>
				</uni-list>
			</view>
			<uni-load-more :status="loading?'loading':(hasMore ? 'more' : 'noMore')"></uni-load-more>
		</unicloud-db>
		<uni-fab ref="fab" horizontal="right" vertical="bottom" :pop-menu="false" @fabClick="fabClick" />
	</view>
</template>

<script>
	let cdbRef;
	import statusBar from "@/uni_modules/uni-nav-bar/components/uni-nav-bar/uni-status-bar";

	import Gps from '@/uni_modules/json-gps/js_sdk/gps.js';
	const gps = new Gps();
	const db = uniCloud.database()
	export default {
		computed: {
			inputPlaceholder(e) {
				if (uni.getStorageSync('CURRENT_LANG') == "en") {
					return 'Please enter the search content'
				} else {
					return '请输入搜索内容'
				}
			},
			colList() {
				return [
					db.collection('tiezi').where(this.where).field('avatar,title,,user_id').getTemp(),
					db.collection('uni-id-users').field('_id,nickname').getTemp()
				]
			}
		},
		watch: {
			keyword(keyword, oldValue) {
				let where = '"article_status" == 1 '
				if (keyword) {
					this.where = where + `&& /${keyword}/.test(title)`;
				} else {
					this.where = where;
				}
			}
		},
		async onShow() {
			this.keyword = getApp().globalData.searchText
			getApp().globalData.searchText = ''
			//这里仅演示如何，在onShow生命周期获取设备位置，并在设备或者应用没有权限时自动引导。设置完毕自动重新获取。
			//你可以基于他做自己的业务，比如：根据距离由近到远排序列表数据等
			 //uni.showLoading({
			 //	title:"获取定位中"
			// });
			//默认h5端不获取定位
			// #ifndef H5
			let location = await gps.getLocation({
				geocode: true
			})
			// console.log(location);
			// #endif
			// if(location){
			// 	uni.showToast({
			// 		title: JSON.stringify(location),
			// 		icon: 'none'
			// 	});
			// }
			// uni.hideLoading()
		},
		async onReady() {
			// #ifdef APP-NVUE
			/* 可用窗口高度 - 搜索框高 - 状态栏高 */
			this.listHight = uni.getSystemInfoSync().windowHeight - uni.getSystemInfoSync().statusBarHeight - 50 +
			'px';
			// #endif
			// #ifndef APP-NVUE
			this.listHight = 'auto'
			// #endif
			cdbRef = this.$refs.udb
		},
		data() {
			return {
				where: '"article_status" == 1',
				keyword: "",
				showRefresh: false,
				listHight: 0,
				collectionList: "tiezi",
				loadMore: {
					contentdown: '',
					contentrefresh: '',
					contentnomore: ''
				}
			}
		},
		methods: {
			retry() {
				this.refresh()
			},
			refresh() {
				cdbRef.loadData({
					clear: true
				}, () => {
					uni.stopPullDownRefresh()
					// #ifdef APP-NVUE
					this.showRefresh = false
					// #endif
					console.log('end');
				})
				console.log('refresh');
			},
			onqueryerror(e) {
				console.error(e);
			},
			onpullingdown(e) {
				console.log(e);
				this.showRefresh = true
				if(e.pullingDistance>100){
					this.refresh()
				}
			},
			searchClick(e) { //点击搜索框
				uni.hideKeyboard();
				uni.navigateTo({
					url: '/pages/tiezi/searchT/searchT',
					animationType: 'fade-in'
				});
			},
			handleItemClick(id) {
				uni.navigateTo({
					url: './detail?id=' + id
				})
			},
			fabClick() {
				// 打开新增页面
				uni.navigateTo({
					url: './add',
					events: {
						// 监听新增数据成功后, 刷新当前页面数据
						refreshData: () => {
							this.$refs.udb.loadData({
								clear: true
							})
						}
					}
				})
			}
		}
	}
</script>

<style>
</style>