<!--聊天界面 -->
<template>
	<unicloud-db ref="udb" where="state==true" v-slot:default="{data, loading, error, options}"
		collection="guestbook-2,uni-id-users" field="_id,text,state,user_id._id,user_id.nickname,user_id.avatar_file">
		<view class="chat">
			<scroll-view :style="{height: `${windowHeight-inputHeight}rpx`}" id="scrollview" scroll-y="true"
				:scroll-top="scrollTop" class="scroll-view">
				<!-- 聊天主体 -->
				<view id="msglistview" class="chat-body" v-if="file_is_show">
					<!-- 聊天记录 -->
					<view v-for="(item,index) in data" :key="index">
						<!-- 自己发的消息 -->
						<view class="item self" v-if="item.userContent != ''">
							<!-- 文字内容 -->
							<view class="content right" v-if="item.user_id[0]._id==userNow">
								{{item.text}}
							</view>
							<view class="avatar" v-if="item.user_id[0]._id==userNow">
								<cloud-image mode="aspectFit" v-if="item.user_id[0].avatar_file.url" @click="clickAvatar":src="item.user_id[0].avatar_file.url"></cloud-image>
								<image style="width:40px;height:40px;"mode="aspectFill" v-else @click="clickAvatar"src="@/static/user.png"></image>
							</view>
						
						</view>
						<!-- 左方信息 -->
						<view class="item Ai" v-if="item.botContent != ''">
							<!-- 头像 -->     
							<view class="avatar" v-if="item.user_id[0]._id!=userNow">
								<cloud-image mode="aspectFit" v-if="item.user_id[0].avatar_file.url" @click="clickAvatar":src="item.user_id[0].avatar_file.url"></cloud-image>
								<image style="width:40px;height:40px;"mode="aspectFill" v-else @click="clickAvatar"src="@/static/user.png"></image>
							</view>
							<!-- 文字内容 -->
							<view class="content left" v-if="item.user_id[0]._id!=userNow">
								{{item.text}}
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
			<!-- 底部消息发送栏 -->
			<!-- 用来占位，防止聊天消息被发送框遮挡 -->
			<view class="chat-bottom" :style="{height: `${inputHeight}rpx`}">
				<view class="send-msg" :style="{bottom:`${keyboardHeight}rpx`}">
					<view class="uni-textarea">
						<textarea v-model="text" maxlength="300" confirm-type="send" @confirm="handleSend"
							:show-confirm-bar="false" :adjust-position="false" @linechange="sendHeight" @focus="focus"
							@blur="blur" auto-height></textarea>
					</view>
					<button @click="text?send():''" class="send-btn">发送</button>
				</view>
			</view>
		</view>
	</unicloud-db>
</template>
<script>
	export default {
		data() {
			return {
				userNow:'',
				file_is_show:1,
				//键盘高度
				keyboardHeight: 0,
				//底部消息发送高度
				bottomHeight: 0,
				//滚动距离
				scrollTop: 0,
				userId: '',
				//发送的消息
				text: "",
				msgList: [
					/* {
					    botContent: "hello，请问我有什么可以帮助你的吗？",
					    recordId: 0,
					    titleId: 0,
					    userContent: "",
					    userId: 0
					},
					{
					    botContent: "",
					    recordId: 0,
					    titleId: 0,
					    userContent: "你好呀我想问你一件事",
					    userId: 0
					}, */
				]
			}
		},
		watch: {
		    // 监听json数据变化，重新渲染文件夹内容
		    data(newVal) {
		        this.file_is_show = false
		        if (true) {
		            this.$nextTick(()=>{ // $nextTick 是在 DOM 更新循环结束之后执行延迟回调
		                this.file_is_show = true
		            })
		        }
		    }
		},
		updated() {
			//页面更新时调用聊天消息定位到最底部
			this.scrollToBottom();
		},
		computed: {
			windowHeight() {
				return this.rpxTopx(uni.getSystemInfoSync().windowHeight)
			},
			// 键盘弹起来的高度+发送框高度
			inputHeight() {
				return this.bottomHeight + this.keyboardHeight
			}
		},
		onLoad() {
			this.userNow=uniCloud.getCurrentUserInfo().uid;
			this.scrollToBottom();
			uni.onKeyboardHeightChange(res => {
				//这里正常来讲代码直接写
				//this.keyboardHeight=this.rpxTopx(res.height)就行了
				//但是之前界面ui设计聊天框的高度有点高,为了不让键盘和聊天输入框之间距离差太大所以我改动了一下。
				this.keyboardHeight = this.rpxTopx(res.height - 30)
				if (this.keyboardHeight < 0) this.keyboardHeight = 0;
			})
		},
		onUnload() {
			uni.offKeyboardHeightChange()
		},
		methods: {
			clickAvatar()
			{
				uni.navigateTo({
					url:'/pages/MyInfo/MyInfo'
				})
			},
			focus() {
				this.scrollToBottom()
			},
			blur() {
				this.scrollToBottom()
			},
			// px转换成rpx
			rpxTopx(px) {
				let deviceWidth = wx.getSystemInfoSync().windowWidth
				let rpx = (750 / deviceWidth) * Number(px)
				return Math.floor(rpx)
			},
			// 监视聊天发送栏高度
			sendHeight() {
				setTimeout(() => {
					let query = uni.createSelectorQuery();
					query.select('.send-msg').boundingClientRect()
					query.exec(res => {
						this.bottomHeight = this.rpxTopx(res[0].height)
					})
				}, 10)
			},
			// 滚动至聊天底部
			scrollToBottom(e) {
				setTimeout(() => {
					let query = uni.createSelectorQuery().in(this);
					query.select('#scrollview').boundingClientRect();
					query.select('#msglistview').boundingClientRect();
					query.exec((res) => {
						if (res[1].height > res[0].height) {
							this.scrollTop = this.rpxTopx(res[1].height - res[0].height)
						}
					})
				}, 15)
			},
			send() {
				const db = uniCloud.database();
				const guestbookTable = db.collection('guestbook-2')
				let res = guestbookTable.add({
					"text": this.text,
					
				})
				this.text = '';
				this.$forceUpdate();
				this.scrollToBottom()
				this.$refs.udb.loadData();
				uni.showToast({
					title:"发送成功",
				})
			},
			// 发送消息
			handleSend() {
				//如果消息不为空
				if (!this.chatMsg || !/^\s+$/.test(this.chatMsg)) {
					let obj = {
						botContent: "",
						recordId: 0,
						titleId: 0,
						userContent: this.chatMsg,
						userId: 0
					}
					this.msgList.push(obj);
					this.chatMsg = '';
					this.scrollToBottom()
				} else {
					this.$modal.showToast('不能发送空白消息')
				}
			},
		}
	}
</script>
<style lang="scss" scoped>
	$chatContentbgc: #C2DCFF;
	$sendBtnbgc: #4F7DF5;

	view,
	button,
	text,
	input,
	textarea {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}
	.avatar{
		width:50rpx;
		height:60rpx;
	}
	/* 聊天消息 */
	.chat {
		.scroll-view {
			::-webkit-scrollbar {
				display: none;
				width: 0 !important;
				height: 0 !important;
				-webkit-appearance: none;
				background: transparent;
				color: transparent;
			}

			// background-color: orange;
			background-color: #F6F6F6;

			.chat-body {
				display: flex;
				flex-direction: column;
				padding-top: 23rpx;
				// background-color:skyblue;

				.self {
					justify-content: flex-end;
				}

				.item {
					display: flex;
					padding: 23rpx 30rpx;
					// background-color: greenyellow;

					.right {
						background-color: #ffaa00;
						
					}
					
					.left {
						background-color: #FFFFFF;
					}
					
					// 聊天消息的三角形
					.right::after {
						position: absolute;
						display: inline-block;
						content: '';
						width: 0;
						height: 0;
						left: 100%;              //这个是决定了气泡在左方还是在右方的！
						top: 10px;
						border: 12rpx solid transparent;
						border-left: 12rpx solid #ffaa00;
					}

					.left::after {
						position: absolute;
						display: inline-block;
						content: '';
						width: 0;
						height: 0;
						top: 10px;
						right: 100%;
						border: 12rpx solid transparent;
						border-right: 12rpx solid #FFFFFF;
					}

					.content {
						position: relative;
						max-width: 486rpx;
						border-radius: 8rpx;
						word-wrap: break-word;
						padding: 24rpx 24rpx;
						margin: 0 24rpx;
						border-radius: 5px;
						font-size: 32rpx;
						font-family: PingFang SC;
						font-weight: 500;
						color: #333333;
						line-height: 42rpx;
					}

					.avatar {
						display: flex;
						justify-content: center;
						width: 78rpx;
						height: 78rpx;
						background: #FFFFFF;
						border-radius: 8rpx;
						overflow: hidden;

						image {
							align-self: center;
						}

					}
				}
			}
		}

		/* 底部聊天发送栏 */
		.chat-bottom {
			width: 100%;
			height: 177rpx;
			background: #F4F5F7;
			transition: all 0.1s ease;


			.send-msg {
				display: flex;
				align-items: flex-end;
				padding: 16rpx 30rpx;
				width: 100%;
				min-height: 177rpx;
				position: fixed;
				bottom: 0;
				background: #EDEDED;
				transition: all 0.1s ease;
			}

			.uni-textarea {
				padding-bottom: 70rpx;

				textarea {
					width: 537rpx;
					min-height: 75rpx;
					max-height: 500rpx;
					background: #FFFFFF;
					border-radius: 8rpx;
					font-size: 32rpx;
					font-family: PingFang SC;
					color: #333333;
					line-height: 43rpx;
					padding: 5rpx 8rpx;
				}
			}

			.send-btn {
				display: flex;
				align-items: center;
				justify-content: center;
				margin-bottom: 70rpx;
				margin-left: 25rpx;
				width: 128rpx;
				height: 75rpx;
				background: $sendBtnbgc;
				border-radius: 8rpx;
				font-size: 28rpx;
				font-family: PingFang SC;
				font-weight: 500;
				color: #FFFFFF;
				line-height: 28rpx;
			}
		}
	}
</style>