<template>
	<view class="container">
		<unicloud-db ref="udb" v-slot:default="{data, pagination, loading, hasMore, error}" :collection="collectionList"
			field="title,article,image,tag,mobile,like_count,latitude,longtitude,like_count,view_count,collection_count">
			<view v-if="error">{{error.message}}</view>
			<view v-else-if="data">
				<uni-list>
					<uni-list-item  direction="column"  v-for="(item, index) in data" :key="index"
						showArrow :clickable="true" @click="handleItemClick(item._id)">
						<template v-slot:header>
							<view class="uni-title">{{item.title}}</view>
							<view class="uni-thumb uni-content list-picture">
								<image v-if="item.image.url" style="width: 350px; height: 150px;" :src="item.image.url"
									mode="top"></image>
							</view>
						</template>
						<template v-slot:footer>
							<view class="uni-footer">
								<uni-icons type="eye" size="15"></uni-icons>
								<text class="uni-footer-text" style="color: #797979;
          	font-size:12px;">{{item.view_count}}</text>
								<uni-icons type="heart" size="15"></uni-icons>
								<text class="uni-footer-text" style="color: #797979;
          	font-size:12px;">{{item.like_count}}</text>
								<uni-icons type="star" size="15"></uni-icons>
								<text v-if="item.collection_count" class="uni-footer-text" style="color: #797979;
          	font-size:12px;">{{item.collection_count}}</text>
								<text v-else-if="!item.collection_count" class="uni-footer-text" style="color: #797979;
			font-size:12px;">有0人收藏了</text>
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
	.uni-title {
		font-size: 20px;
	}
	.uni-footer-text{
		margin-right: 7%;
	}
	/* .article{
		display: -webkit-box;
		overflow: hidden;
		text-overflow: ellipsis;
		word-wrap: break-word;
		white-space: normal !important;
		-webkit-line-clamp: 3;
		-webkit-box-orient: vertical;
	} */
</style>