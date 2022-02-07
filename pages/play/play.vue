<template>
	<view class="container">
		<view class="btn-back">
			<u-icon size="22px" name="arrow-down" @click="back"></u-icon>
		</view>

		<view class="play-bj">
			<image :src="coverImgUrl"></image>
		</view>

		<view class="header">

		</view>
		<view class="content">
			<swiper class="swiper" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval"
				:duration="duration" :circular="circular" :current="currentTab">
				<swiper-item class="swiper-item" @click="coverShow = !coverShow">
					<view v-if="coverShow" :class="{'play-cover':true, 'rotate':movetate && playStatus}">
						<image :src="coverImgUrl" mode="widthFix"></image>
					</view>
					<view v-else class="lrc-box">
						<scroll-view class="scroll-view" scroll-y="true" :scroll-with-animation="true" :scroll-top="600"
							:scroll-into-view="lrcIndex < 4 ? 'lrc0' : 'lrc'+(lrcIndex - 4)">
							<view class="lrc-item">
								<text :id="'lrc'+index"
									:class="{'lrcShow':item[0] <= currentTime && currentTime <= lrcKeys[index + 1]}"
									v-for="(item, index) in lrcMap" :key="item[0]">{{item[1]}}</text>
							</view>
						</scroll-view>
					</view>
				</swiper-item>
			</swiper>
		</view>
		<view class="foot">
			<view>
				<view>
					<u-slider v-model="value" min="0" :max="totalTime" @changing="changing" @change="change"></u-slider>
				</view>
				<view>
					<text>{{timeHandle(value)}}/</text>
					<text>{{timeHandle(totalTime)}}</text>
				</view>
			</view>
			<view>
				<view></view>
				<view>
					<u-icon name="play-left" color="rgba(255,255,255,.8)" size="36px" @click="playPrev"></u-icon>
				</view>
				<view class="play-suspend">
					<i v-if="!playStatus" class="play-icon iconfont icon-bofang1" @click="stateSwitching"></i>
					<i v-else class="iconfont icon-zanting" @click="stateSwitching"></i>
				</view>
				<view>
					<u-icon name="play-right" color="rgba(255,255,255,.8)" size="36px" @click="playNext"></u-icon>
				</view>
				<view></view>
			</view>
		</view>
	</view>
</template>

<script>
	import {
		mapState,
		mapGetters
	} from 'vuex'
	export default {
		computed: {
			...mapState(['coverImgUrl', 'playStatus', 'lrcMap', 'lrcKeys', 'currentTime', "songId", "totalTime"]),
			...mapGetters(['currentTime'])
		},
		data() {
			return {
				value: 0,
				playWork: null,
				//轮播图配置>>>
				indicatorDots: false,
				autoplay: false,
				interval: 2000,
				duration: 500,
				circular: false,
				currentTab: 0,
				//>>>>封面
				movetate: true,
				coverShow: true,
				//<<<,

				lrcIndex: 0
			}
		},
		wacth: {

		},
		onLoad() {
			// console.log(this.$store.getters.currentTime);
			this.audioContext.onTimeUpdate(this.onTimeUpdate);
		},
		methods: {
			playNext() { //下一首
				console.log('emmmmmmmmmm')
				let songList = uni.getStorageSync('__songData');

				//获取当前歌曲在列表中的下标
				let index = songList.findIndex(o => o.id == this.songId);
				console.log(index)
				if (index < songList.length - 1)
					this.$store.commit('changeCover', {
						songId: songList[index + 1].id
					});
				else
					this.$store.commit('changeCover', {
						songId: songList[0].id
					});
			},
			playPrev() { //上一首
				let songList = uni.getStorageSync('__songData');

				let index = songList.findIndex(o => o.id == this.songId);
				console.log(index)
				if (index > 0)
					this.$store.commit('changeCover', {
						songId: songList[index - 1].id
					});
				else
					this.$store.commit('changeCover', {
						songId: songList[songList.length - 1].id
					});
			},
			stateSwitching() {
				console.log('emmmmmmmmmmmm')
				if (this.audioContext.src) {
					if (this.playStatus)
						this.audioContext.pause();
					else
						this.audioContext.play();
					this.$store.commit('changeCover', {
						playStatus: !this.playStatus
					})
				} else {
					this.play(uni.getStorageSync('_CurrentObj'), 1)
				}
			},
			onTimeUpdate() {
				this.value = this.audioContext.currentTime;
				let index = 0;
				this.lrcMap.forEach((v, k, m) => {
					if (k <= this.currentTime && this.currentTime <= this.lrcKeys[index + 1]) {
						// console.log('>>>>>>>>>>>>>'+index)\
						this.lrcIndex = index;
					}
					index++;
				})

			},
			back() {
				uni.navigateBack({
					delta: 1
				})
			},
			change() {
				console.log('>>>>>>>>>>>>>>>')
				this.audioContext.seek(this.value);
				this.$store.commit('currentTime', {
					currentTime: this.value
				});
			},
			changing() {
				console.log('<<<<<<<<<<<<<<<<')
				this.audioContext.offTimeUpdate();
			},
			timeHandle(value) {
				var theTime = parseInt(value);
				var theTime1 = 0;
				var theTime2 = 0;

				if (theTime >= 60) {
					theTime1 = parseInt(theTime / 60);
					theTime = parseInt(theTime % 60);
					if (theTime1 >= 60) {
						theTime2 = parseInt(theTime1 / 60);
						theTime1 = parseInt(theTime1 % 60);
					}
				}
				if (theTime < 10) {
					theTime = "0" + parseInt(theTime)
				}
				var result = "" + theTime + "";
				if (theTime1 >= 0) {
					if (theTime1 < 10) {
						theTime1 = "0" + parseInt(theTime1)
					}
					result = "" + theTime1 + ":" + result;
				}
				if (theTime2 >= 0) {
					if (theTime2 < 10) {
						theTime2 = "0" + parseInt(theTime2)
					}
					result = "" + theTime2 + ":" + result;
				}
				return result;

			}
		}
	}
</script>

<style lang="scss">
	@import url(../../static/icon/iconfont.css);

	.container {
		width: 100vw;
		height: 100vh;
		position: relative;
		display: flex;
		flex-direction: column;

		.btn-back {
			position: absolute;
			left: 10px;
			top: 40px;
			z-index: 999;
		}

		.play-bj {
			width: 100%;
			height: 100%;
			position: absolute;
			top: 0;
			left: 0;
			display: flex;
			justify-content: center;
			align-items: center;
			z-index: 0;
			overflow: hidden;

			>image {
				width: 120%;
				height: 120%;
				filter: blur(50px);
			}
		}

		.header,
		.content,
		.foot {
			width: 100%;
			// border: 1px solid #000;
			background-color: rgba(0, 0, 0, 0);
			z-index: 2;
		}

		.header {
			height: 12%;
		}

		.content {
			height: 65%;

			.swiper {
				width: 100%;
				height: 100%;

				.swiper-item {
					display: flex;
					justify-content: center;
					align-items: center;

					>.play-cover {
						width: 70%;
						// border: 1px solid #000000;
						border-radius: 50%;
						overflow: hidden;
						display: flex;
						transform: rotate(0deg);
						transition: .5s;

						>image {
							width: 100%;
							transition: .5s;
						}
					}

					>.lrc-box {
						width: 80%;
						aspect-ratio: 1/1.3;
						// border: 1px solid #000;
						// overflow: auto;
						transition: .5s;

						>.scroll-view {
							width: 100%;
							height: 100%;
							transition: .5s;
							background-color: rgba(0, 0, 0, .3);
							border-radius: 15px;

							.lrc-item {
								width: 100%;
								height: 100%;
								display: flex;
								flex-direction: column;
								align-items: center;
								
								transition: .5s;

								>text {
									max-width: 80%;
									color: rgba(255, 255, 255, .5);
									font-size: 16px;
									margin: 10px 0;
									text-align: center;
									transition: .5s;
								}

							}

						}
					}
				}
			}
		}

		.foot {
			height: 23%;
			display: flex;
			flex-direction: column;

			>view:first-child {
				>view:last-child {
					display: flex;
					justify-content: flex-end;
					padding-right: 15px;

					>text {
						font-size: 12px;
					}
				}
			}

			>view:last-child {
				flex: 1;
				display: flex;

				>view {
					flex: 1;
					height: 100%;
					display: flex;
					justify-content: center;
					align-items: center;
				}

				>.play-suspend {
					position: relative;


					>i {
						font-size: 36px;
						transition: 1s;
						color: rgba(255, 255, 255, .8);
						z-index: 999;
					}

					>.play-icon {
						margin-left: 6px;
					}
				}

				>.play-suspend::before {
					content: '';
					position: absolute;
					left: calc(50% - (90% / 2) - (10px / 2));
					top: calc();
					width: 90%;
					aspect-ratio: 1/1;
					border: 5px solid rgba(255, 255, 255, .8);
					border-radius: 50%;
				}
			}
		}
	}

	.rotate {
		animation: zCover 20s linear infinite;
		transition: .5s;
	}

	.lrcShow {
		color: rgba(255, 255, 255, 1) !important;
		transform: scale(1.2);
		font-weight: 500;
		transition: .5s;
	}

	@keyframes zCover {
		0% {
			transform: rotate(0deg);
		}

		100% {
			transform: rotate(360deg);
		}
	}
</style>
