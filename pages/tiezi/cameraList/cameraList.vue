<template>
	<view class="container">
		<unicloud-db ref="udb" where="'tag==2'" v-slot:default="{data, pagination, loading, hasMore, error}"
			:collection="collectionList" field="title,article,image,tag,mobile,latitude,longtitude,like_count,view_count,collection_count">
			<view v-if="error">{{error.message}}</view>
			<view v-else-if="data">
				<uni-list>
					<uni-list-item direction="column" :note="item.article"  v-for="(item, index) in data" :key="index" showArrow :clickable="true"
						@click="handleItemClick(item._id)">
						<template v-slot:header>
							<view class="uni-title">{{item.title}}</view>
							<view class="uni-thumb uni-content list-picture">
								<image style="width: 150px; height: 150px;":src="item.image.url" mode="aspectFill"></image>
							</view>
						</template>
						<template v-slot:footer>
						            <view class="uni-footer">
						                <text class="uni-footer-text">有{{item.view_count}}人看过</text>
						                <text class="uni-footer-text">有{{item.like_count}}人点赞了</text>
						                <text class="uni-footer-text">有{{item.collection_count}}人收藏了</text>
						            </view>
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
	const db = uniCloud.database()
	export default {
		data() {
			return {
				collectionList: "tiezi",
				loadMore: {
					contentdown: '',
					contentrefresh: '',
					contentnomore: ''
				}
			}
		},
		onPullDownRefresh() {
			this.$refs.udb.loadData({
				clear: true
			}, () => {
				uni.stopPullDownRefresh()
			})
		},
		onReachBottom() {
			this.$refs.udb.loadMore()
		},
		methods: {
			handleItemClick(id) {
				uni.navigateTo({
					url: '../detail?id=' + id
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