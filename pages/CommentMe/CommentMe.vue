<template>
	<view class="container">
		<unicloud-db ref="udb" v-slot:default="{data, pagination, loading, hasMore, error}"
			collection="article_comment,tiezi" field="_id,comment_content,article_id,comment_date">
			<view v-if="error">{{error.message}}</view>
			<view v-else-if="data">
				<uni-list>

					<uni-list-chat v-for="(item, index) in data" :key="index" title="LJJ" avatar="/static/user.png"
						:note="item.comment_content" :time="item.comment_date" badge-positon="left" badge-text="dot"
						:clickable="true" @click="handleItemClick(item.article_id)"> </uni-list-chat>

				</uni-list>
			</view>
		</unicloud-db>

	</view>
</template>

<script>
	const db = uniCloud.database()
	export default {
		data() {
			return {

				loadMore: {
					contentdown: '',
					contentrefresh: '',
					contentnomore: ''
				}
			}
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
</style>