<template>
	<view class="container">
		<u-notify ref="uNotify"></u-notify>
		<view class="header-cover-box">
			<image v-if="songData.length > 0" :src="songSheetData ? songSheetData.playlist.coverImgUrl : ''"
				mode="aspectFill"></image>
			<view></view>
		</view>
		<view v-if="songData.length > 0" class="song-list">
			<view class="song-list-item" v-for="(item, index) in songData" :key="item.id" @click="play(item, 0)">
				<view class="item-container">
					<view>
						<i v-if="item.id == songId" class="iconfont icon-changpian"></i>
						<text v-else>{{index+1}}</text>
					</view>
					<view>
						<view class="song-name">
							<text>{{item.name}}</text>
						</view>
						<view class="singer-name">
							<text>{{item.ar.map(u => {return u.name}).join('/')}}-{{item.al.name}}</text>
						</view>
					</view>
					<view>
						<i class="iconfont icon-tengxunshipin1"></i>
					</view>
					<view>
						<i class="iconfont icon-androidgengduo"></i>
					</view>
				</view>
			</view>

		</view>
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
		<!-- 播放器 -->
		<music-controller ref="musicController">
			<template v-slot:songList>
				<view class="song-list" style="overflow: auto;">
					<view class="song-list-item" v-for="(item, index) in songListData" :key="item.id" @click="play(item, 1)">
						<view class="item-container">
							<view>
								<i v-if="item.id == songId" class="iconfont icon-changpian"></i>
								<text v-else>{{index+1}}</text>
							</view>
							<view>
								<view class="song-name">
									<text>{{item.name}}</text>
								</view>
								<view class="singer-name">
									<text>{{item.ar.map(u => {return u.name}).join('/')}}-{{item.al.name}}</text>
								</view>
							</view>
							<view>
								<i class="iconfont icon-tengxunshipin1"></i>
							</view>
							<view>
								<i class="iconfont icon-androidgengduo"></i>
							</view>
						</view>
					</view>
				</view>
			</template>
		</music-controller>
	</view>
</template>

<script>
	import {
		getSongSheet,
		getTreckAll,
		checkMusic,
		getMusic,
		getMusicLyric,
		getM
	} from '@/api/songSheet.js'
	export default {
		data() {
			return {
				songSheetData: null,
				initialData: [1, 2, 3, 4, 5, 6, 7, 8, 9],
				songListData:[],
				songData: [],
				songId:NaN
			}
		},
		onLoad(options) {
			this.getSongSheet(options.id);
			this.getTreckAll(options.id)
			this.playStatus = getApp().globalData.playStatus;
			this.coverImgUrl =  uni.getStorageSync('_CurrentObj')?.al?.picUrl;
			this.songListData = uni.getStorageSync('__songData');
			getM().then(res => {
				console.log(res)
			})
		},
		onShow() {
			if(this.$refs.musicController) this.$refs.musicController.createBj();
			// this.$refs.musicController.createBj();
			this.songId = uni.getStorageSync('_CurrentlyPlayingSongId');
			// this.$refs.uNotify.show({
			//     top: 0,
			//     type: 'error',
			//     color: '#000',
			//     bgColor: 'rgba(255,0,0,.5)',
			//     message: 'Hi uView',
			//     duration: 1000 * 3,
			//     fontSize: 20,
			//     safeAreaInsetTop:true
			// })
		},
		methods: {
			play(song, identification){
				console.log(song, identification);
				this.$store.commit('changeCover', {
					songId: song.id
				});
				// this.$refs.musicController.play(song, identification);
				this.songId = song.id;
				if(identification === 0){
					this.songListData = this.songData;
					getApp().globalData._songData = this.songData;
				}
			},
			
			getSongSheet(id) {
				getSongSheet(id).then(res => {
					let data = res.data;
					this.songSheetData = data;
					console.log(data)
				})
			},
			
			getTreckAll(id) { //获取歌单全部歌曲
				getTreckAll(id).then(res => {
					this.songData = res.data.songs;
					console.log(this.songData)
				})
			},
		}
	}
</script>

<style lang="scss" scoped>
	@import url(../../static/icon/iconfont.css);

	.container {
		width: 100%;
		min-height: calc(100vh - 44px);
		position: relative;

		.header-cover-box {
			width: 100%;
			aspect-ratio: 1/1;
			position: relative;
			z-index: 0;

			>image {
				width: 100%;
				height: 100%;
				position: absolute;
				left: 0;
				top: 0;
				z-index: 0;
			}

			>view {
				position: absolute;
				width: 100%;
				height: 30px;
				left: 0;
				bottom: -5px;
				background-color: rgb(245, 245, 245);
				border-radius: 10px 10px 0 0;
				z-index: 999;
			}
		}

		.song-list {
			width: 100%;
			height: 100%;
			border-top-left-radius: 20px;

			.song-list-item {
				width: 100%;
				height: 50px;
				// border: 1px solid #000;
				display: flex;
				align-items: center;

				.item-container {
					width: 95%;
					height: 80%;
					margin: 0 auto;
					// border: 1px solid #007AFF;
					display: flex;

					>view {
						min-width: 10%;
						display: flex;
						justify-content: center;
						align-items: center;
					}

					>view:first-child {
						text {
							font-size: 18px;
							color: rgb(151, 151, 151);
						}

						i {
							font-size: 22px;
							font-weight: bold;
							color: rgb(255, 0, 0);
							animation: one 5s linear infinite;
						}
					}

					>view:nth-child(2) {
						width: 70%;
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
							flex: 6;
							padding-top: 5px;

							>text {
								font-size: 16px;
								color: rgb(51, 51, 51);
							}
						}

						.singer-name {
							flex: 4;

							>text {
								margin-top: -5px;
								font-size: 12px;
								color: rgb(151, 151, 151);

							}
						}
					}

					>view:nth-child(3),
					>view:last-child {
						i {
							font-size: 20px;
							color: rgb(151, 151, 151);
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
