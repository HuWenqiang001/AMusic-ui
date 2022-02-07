<template>
	<view class="list-container">
		<!-- <image class="page-bj"
			src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Finews.gtimg.com%2Fnewsapp_match%2F0%2F8667643970%2F0.jpg&refer=http%3A%2F%2Finews.gtimg.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1645259775&t=baa74148dcbcd977ba97d74bac27264c"
			mode="heightFix"></image> -->
		<scroll-view v-if="listData.length > 0" class="song-list" :scroll-y="true" @scrolltolower="scrollLower">
			<view class="song-list-item" v-for="(item, index) in listData" :key="index" @click="play(item, 0)">
				<view class="item-container">
					<view>
						<u-avatar :src="item.picUrl" size="90%"></u-avatar>
					</view>
					<view>
						<view class="song-name">
							<text>{{item.name}}</text>
						</view>
					</view>
					<view>
						<u-button color="rgb(41,121,255)" icon="plus" iconColor="rgb(255,255,255)" text="关注" size="mini"></u-button>
					</view>
				</view>
			</view>
			<!-- 占位元素 -->
			<view style="height: 88px;"></view>
		</scroll-view>
		<!-- 骨架屏 -->
		<view v-else>
			<view v-for="(item,index) in initialData" :key="index"
				style="width: 95%; height: 50px; display: flex; align-items: center; margin: 0 auto;" animated>
				<view style="width: 100%; height: 80%; display: flex;justify-content: center;">
					<view style="width: 10%; height: 100%;">
						<u-skeleton :title="false" :rows="1" rowsWidth="100%" rowsHeight="40px" :animate="true">
						</u-skeleton>
					</view>
					<view style="width: 70%; height: 100%;">
						<u-skeleton :title="false" :rows="1" rowsWidth="80%" rowsHeight="20px"
							style="margin-bottom:10px;" :animate="true"></u-skeleton>
						<u-skeleton :title="false" :rows="1" rowsWidth="100%" rowsHeight="10px" :animate="true">
						</u-skeleton>
					</view>
					<view style="width: 10%; height: 100%;">
						<u-skeleton :title="false" :rows="1" rowsWidth="100%" rowsHeight="40px" :animate="true">
						</u-skeleton>
					</view>
					<view style="width: 10%; height: 100%;">
						<u-skeleton :title="false" :rows="1" rowsWidth="100%" rowsHeight="40px" :animate="true">
						</u-skeleton>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		debounce
	} from '@/tools/ask.js'
	export default {
		name: "c-list",
		props: {
			listData: {
				type: Array,
				default: () => {
					return []
				}
			},
			listType: Number
		},
		data() {
			return {
				songId: NaN,
				query: null,
				initialData: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
			};
		},
		onLoad() {

		},
		onReady() {
			this.query = uni.createSelectorQuery().in(this);
		},
		methods: {
			scrollLower() {
				debounce(this.$emit('singleSeach'), 200)
			},
			play(song, identification) {
				this.$emit('play', song, identification);
				this.songId = song.id;
				getApp().globalData.CurrentlyPlayingSongId = song.id;
			}
		}
	}
</script>

<style lang="scss">
	@import url(../../static/icon/iconfont.css);

	.list-container {
		width: 100%;
		height: 100%;

		// background-color: #f8f8f8;
		>.page-bj {
			// display: none;
			position: absolute;
			left: 0;
			top: 0;
			height: 100vh;
			filter: blur(50px);
		}

		.song-list {
			width: 100%;
			height: 100%;
			border-top-left-radius: 20px;

			.song-list-item {
				width: 100%;
				height: 80px;
				margin: 15px 0;
				// border: 1px solid #000;
				display: flex;
				align-items: center;

				.item-container {
					width: 95%;
					height: 90%;
					margin: 0 auto;
					// border: 1px solid #007AFF;
					display: flex;
					background-color: rgba(0, 0, 0, .3);
					border-radius: 5px;

					>view {
						width: 20%;
						display: flex;
						justify-content: center;
						align-items: center;
					}

					>view:first-child {}

					>view:nth-child(2) {
						width: 60%;
						display: flex;
						flex-direction: column;
						margin-left: 10px;

						>view {
							width: 100%;
							display: flex;

							>text {
								overflow: hidden;
								text-overflow: ellipsis;
								white-space: nowrap;
							}
						}

						.song-name {
							flex: 1;
							display: flex;
							align-items: center;

							>text {
								font-size: 16px;
								color: rgb(191, 191, 191);
							}
						}
					}
					
					>view:last-child {
						.u-button{
							width: 80%;
							height: 40%;
							color: rgb(131, 131, 131);
						}
					}
				}
			}
		}
	}

	@keyframes one {
		0% {
			transform: rotate(0deg);
		}

		100% {
			transform: rotate(360deg);
		}
	}
</style>
