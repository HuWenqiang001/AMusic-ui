<template>
	<view class="music-controller-container">
		<view class="simplify-controller">
			<!-- 控制器歌曲列表 -->
			<view :class="{'controller-song-list':true, info:show, out:!show}">
				<slot name="songList"></slot>
				<view class="tianChong"></view>
			</view>
			<!-- 控制器背景 -->
			<view class="con-bj">
				<!-- <canvas v-show="imageShow" :style="{transform: `scale(${scale})`}" canvas-id="bjCanvas" id="bjCanvas"></canvas> -->
				<image :src="coverImgUrl" v-show="imageShow" :style="{transform: `skew(${skewX}deg, ${skewY}deg)`}"
				></image>
			</view>
			<!-- 控制器封面 -->
			<view class="controller-cover">
				<image :src="coverImgUrl" mode="widthFix" v-show="imageShow" :style="{transform: `skew(${skewX}deg, ${skewY}deg)`}"
					@load="imgload"></image>
			</view>
			<!-- 歌词区域 -->
			<view class="lyric-box" @click="openPlay">
				<text :class="{'lrcShow':item[0] <= currentTime && currentTime <= lrcKeys[index + 1]}"
					v-for="(item, index) in lrcMap" :key="item[0]">{{item[1]}}</text>
			</view>
			<!-- 控制按钮 -->
			<view class="control-btn-box">
				<!-- 播放暂停 -->
				<view>
					<view type="default" class="play-btn" @click="stateSwitching">
						<i v-if="!playStatus" class="play-icon iconfont icon-bofang1"></i>
						<i v-else class="iconfont icon-zanting"></i>
					</view>
				</view>
				<!-- 控制器列表按钮 -->
				<view @click="openList">
					<i class="iconfont icon-24gf-playlistMusic4"></i>
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
		getMusic,
		getMusicLyric,
		getMusicDetails
	} from '@/api/songSheet.js'
	import { mapState, mapGetters } from 'vuex'
	import { debounce } from '../../tools/ask.js'
	export default {
		name: "music-controller",
		computed: {
			...mapState(['coverImgUrl','playStatus','lrcMap','lrcKeys', 'currentTime', "songId"]),
			getSongId(){
				return this.songId;
			}
		},
		data() {
			return {
				imageShow: false, //控制器及封面背景图片状态
				scale: 0, //控制器背景状态
				show: false, //控制器列表状态,
				// ctx: null,
				lrcStr:'',
				rotate:360,
				skewX:45,
				skewY:45
			};
		},
		watch: {
			lrcStr(newVal) {
				if (this.timer) clearInterval(this.timer);
				this.$store.commit('changeCover',{lrcMap:this.lyricsProcessing(newVal)});
				this.$store.commit('changeCover',{lrcKeys:[...this.lrcMap.keys()]});
			},
			coverImgUrl(newVal) {
				this.createBj();//绘制播放器背景
			},
			getSongId(newVal) {
				getMusicDetails(newVal).then(res => {
					// console.log(res.data)
					this.play(res.data.songs[0], 0)
				})
			}
		},
		onLoad() {
		},
		mounted() {
			this.audioContext.onPlay(this.onPlay);
			this.audioContext.onPause(this.onPause);
			this.audioContext.onStop(this.onStop);
			this.audioContext.onEnded(this.onEnded);
			this.audioContext.onTimeUpdate(this.onTimeUpdate);
			this.audioContext.onEnded(this.onEnded);
			this.audioContext.onError(this.onError);
		},
		methods: {
			openPlay(){
				uni.navigateTo({
					url:'../../pages/play/play'
				})
			},
			play(song, identification) { //播放		identification:标识 0:正常列表播放, 1:控制器播放
				
				checkMusic(song.id) //判断歌曲是否有版权
					.then(res => {
						console.log(res.data.success)
						this.$store.commit('changeCover',{songId:song.id});
						getApp().globalData.CurrentlyPlayingSongId = song.id;
						return getMusic(song.id)
					}).then(res => {
						let data = res.data.data[0];
						console.log(data)
						this.audioContext.src = data.url;
						this.$store.commit('changeCover',{coverImgUrl:song.al.picUrl, playStatus:true})
						
						getApp().globalData.playStatus = true;
						getApp().globalData.CurrentObj = song;
						
						// this.playStatus = true;
						
						return getMusicLyric(song.id)
					}).then(res => {
						this.lrcStr = res.data.lrc.lyric;
						
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
					if (this.playStatus)
						this.audioContext.pause();
					else
						this.audioContext.play();
					this.$store.commit('changeCover',{playStatus:!this.playStatus})
				}else{
					this.play(uni.getStorageSync('_CurrentObj'), 1)
				}
			},
			imgload() {
				this.scale = 0;
				this.rotate = 360;
				this.skewX = 45;
				this.skewY = 45;
				this.imageShow = false;
				
				setTimeout(() => {
					this.imageShow = true;

					setTimeout(() => {
						this.scale = 1;
						this.rotate = 0;
						this.skewX = 0;
						this.skewY = 0;
					}, 500)
				}, 1000)
			},
			onPlay() {
				console.log('音乐开始>>>>>>>>>>>>>>>>>>')
				console.log(this.audioContext.src)
				this.createBj()
				console.log(this.lrcMap, this.audioContext.duration)
				this.$store.commit('changeCover',{totalTime: this.audioContext.duration});
			},
			onTimeUpdate() {
				this.$store.commit('currentTime', {currentTime: this.audioContext.currentTime.toFixed(2)})
			},
			onPause() {
				console.log('音乐暂停>>>>>>>>>>>>>>>>>>')
			},
			onStop() {
				console.log('音乐停止>>>>>>>>>>>>>>>>>>')
			},
			onEnded() {
				console.log('音乐结束>>>>>>>>>>>>>>>>>>')
			},
			onError() {
				console.log('播放错误>>>>>>>>>>>>>>>>>>')
			},
			switching() {
				this.$emit('stateSwitching')
			},
			openList() {
				this.show = !this.show
			},
			onEnded(){
				let songList = uni.getStorageSync('__songData');
				let index = songList.findIndex(o => o.id == this.songId);
				if(index < songList.length - 1)
					this.$store.commit('changeCover', {
						songId: songList[index + 1].id
					});
				else
					this.$store.commit('changeCover', {
						songId: songList[0].id
					});
			},
			lyricsProcessing(lrc) {
				let data = lrc.split('\n');
				let lrcMap = new Map();
				data.forEach((item, index) => {
					if (index == data.length - 1) return;
					let times = item.substr(1, 9).split(':');
					let time = ((parseInt(times[0]) * 60) + (parseFloat(times[1])))
					console.log(time)
					let lrcStr = item.split(']')[1];
					lrcMap.set(time, lrcStr);
				})
				console.log(lrcMap)
				return lrcMap;
			},
			getPixelColor(x, y) {
				let colors = {};
				uni.canvasGetImageData({
					canvasId: 'bjCanvas',
					x: 0,
					y: 0,
					width: 100,
					height: 100,
				}).then(res => {
					console.log('>>>>>>>>>>>>>>')
					var pixel = res[1].data;
					var r = pixel[0];
					var g = pixel[1];
					var b = pixel[2];
					var a = pixel[3] / 255;
					a = Math.round(a * 100) / 100;
					var rHex = r.toString(16);
					r < 16 && (rHex = "0" + rHex);
					var gHex = g.toString(16);
					g < 16 && (gHex = "0" + gHex);
					var bHex = b.toString(16);
					b < 16 && (bHex = "0" + bHex);
					var rgbaColor = "rgba(" + r + "," + g + "," + b + "," + a + ")";
					var rgbColor = "rgb(" + r + "," + g + "," + b + ")";
					var hexColor = "#" + rHex + gHex + bHex;
					
					colors.r = r;
					colors.g = g;
					colors.b = b;
					colors.a = a;
				})
				
				
				return colors;
			},
			createBj(){
				// this.ctx = uni.createCanvasContext('bjCanvas');
				// let context = this.ctx;
				
				// const query = uni.createSelectorQuery().in(this);
				// query.select('.con-bj').boundingClientRect(data => {
				// 	context.drawImage(this.coverImgUrl, 0, 0, data.width, data.height)
				// 	context.save();
				// 	context.draw();
				// 	let bjColor;
				// 	setTimeout(() => {
				// 		bjColor = this.getPixelColor(data.width / 2, data.height / 2)
				// 		let colorDepth = Math.max(bjColor.r, bjColor.g, bjColor.b);
				// 		console.log(bjColor)
				// 		console.log(colorDepth)
				// 	},2000)
				// }).exec();
			}
		}
	}
</script>

<style lang="scss">
	@import url(../../static/icon/iconfont.css);

	.music-controller-container {
		width: 100vw;
		position: sticky;
		left: 0;
		bottom: 0px;
		padding-bottom: 20px;
		background-color: rgba(255,255,255,0) !important;

		.simplify-controller {
			width: 90%;
			height: 50px;
			// border: 1px solid #0000FF;
			border-radius: 25px;
			margin: 0 auto;
			position: relative;
			display: flex;
			// overflow: hidden;

			//控制器歌曲列表
			.controller-song-list {
				position: absolute;
				width: 100%;
				height: 50vh;
				left: 0;
				bottom: 50%;
				border-radius: 15px 15px 0 0;
				// border: 1px solid #000000;
				background-color: $u-primary-disabled;
				opacity: 1;
				padding-bottom: 25px;
			}

			.con-bj {
				position: absolute;
				width: 100%;
				height: 100%;
				top: 0;
				left: 0;
				border-radius: 25px;
				overflow: hidden;
				background: linear-gradient(145deg, #ffffff, #e6e6e6);
				box-shadow: 5px 5px 10px rgba(0,0,0,.3);

				transition: 1s;

				>image{
					width: 101%;
					height: 100%;
					filter: blur(10px);
					transition: 1s;
				}
			}

			.controller-cover {
				position: absolute;
				left: 0;
				bottom: 0;
				width: 60px;
				height: 60px;
				background-color: #909399;
				overflow: hidden;
				border-radius: 5px;

				>image {
					width: 100%;
					transition: 1s;
				}
			}


			>.lyric-box {
				width: 55%;
				height: 100%;
				// border: 1px solid #000;
				z-index: 1;
				margin-left: 60px;
				display: flex;
				align-items: center;
				padding-left: 10px;
				// display: flex;
				// flex-direction: column;
				position: relative;
				overflow: hidden;

				>text {
					position: absolute;
					display: inline-block;
					width: calc(100% - 10px);
					height: 100%;
					color: $u-info-light;
					transition: .2s;
					left: 10px;
					top: -200%;
					display: flex;
					align-items: center;
					opacity: 0;
				}
			}

			>.control-btn-box {
				width: calc(45% - 60px);
				// border: 1px solid #000;
				z-index: 1;

				display: flex;

				>view {
					flex: 1;
					// border: 1px solid #000;
					display: flex;
					justify-content: center;
					align-items: center;
				}

				>view:first-child {
					>view {
						height: 60%;
						aspect-ratio: 1/1;
						border: 2px solid #fff;
						border-radius: 50%;
						display: flex;
						justify-content: center;
						align-items: center;
						color: #fff;

						>i {
							font-size: 18px;
						}

						>.play-icon {
							margin-left: 2px;
						}
					}
				}

				>view {
					>i {
						font-size: 18px;
						color: #fff;
					}
				}


			}
		}
	}

	.lrcShow {
		transition: 1.5s !important; // animation: lrc 1s;	top: 0 !important;
		opacity: 1 !important;
		top: 0 !important;
	}

	.lrcHidden {
		transition: .5s;
		opacity: 0;
	}

	.info {
		display: block;
		animation: info .5s;
		pointer-events: auto;
	}

	.out {
		// display: none;
		animation: out .5s;
		animation-fill-mode: forwards;
		pointer-events: none;
	}

	@keyframes info {
		0% {
			bottom: 0;
			opacity: 0;
		}

		100% {
			bottom: 50%;
			opacity: 1;
		}
	}

	@keyframes out {
		0% {
			bottom: 50%;
			opacity: 1;
			display: block;
		}

		100% {
			bottom: 0;
			opacity: 0;
			display: none;
		}
	}

	@keyframes lrc {
		0% {
			top: 0 !important;
		}

		20% {
			top: 100% !important;
		}

		95% {
			top: 100% !important;
		}

		100% {
			top: 0 !important;
		}
	}
</style>
