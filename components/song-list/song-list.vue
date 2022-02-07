<template>
	<view>
		<view v-if="songData.length > 0" class="song-list1">
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
	</view>
</template>

<script>
	import {
		getSongSheet,
		getTreckAll,
		checkMusic,
		getMusic
	} from '@/api/songSheet.js'
	export default {
		name: "song-list",
		props:{
			songData:{
				type:Array,
				default:[]
			}
		},
		data() {
			return {
				songSheetData: null,
				songId: 0,
				coverImgUrl: '',
				playStatus: false,
				initialData: [1, 2, 3, 4, 5, 6, 7, 8, 9],
				songListData:[]
			};
		},
		onShow() {
			this.songId = uni.getStorageSync('_CurrentlyPlayingSongId');
		},
		methods:{
			play(song, identification) { //播放		identification:标识 0:正常列表播放, 1:控制器播放
				checkMusic(song.id) //判断歌曲是否有版权
					.then(res => {
						console.log(res.data.success)
						this.songId = song.id;
						getApp().globalData.CurrentlyPlayingSongId = song.id;
						return getMusic(song.id)
					}).then(res => {
						let data = res.data.data[0];
						console.log(data)
						this.audioContext.src = data.url;
						this.coverImgUrl = song.al.picUrl;
						
						getApp().globalData.playStatus = true;
						getApp().globalData.CurrentObj = song;
						
						if(identification === 0){
							this.songListData = this.songData;
							getApp().globalData._songData = this.songData;
						}
						
						this.playStatus = true;
					}).catch(error => {
						uni.showToast({
							title: '此歌曲,暂无版权哦',
							icon: 'error',
							duration: 2000
						});
					})
			},
			stateSwitching() {
				if(this.audioContext.src){
					if (getApp().globalData.playStatus)
						this.audioContext.pause();
					else
						this.audioContext.play();
					getApp().globalData.playStatus = !getApp().globalData.playStatus;
					this.playStatus = getApp().globalData.playStatus;
				}else{
					this.play(uni.getStorageSync('_CurrentObj'), 1)
				}
			}
		}
	}
</script>

<style>
	.song-list1 {
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
	
	@keyframes one {
		0% {
			transform: rotate(0deg);
		}
	
		100% {
			transform: rotate(360deg);
		}
	}
</style>
