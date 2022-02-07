<template>
	<view class="container">
		<view class="swiper-box" ref='swiperBox'>
			<!-- <image v-for="(item, index) in indexSwiperList" :key="index" :src="item.pic" mode=""></image> -->
			<swiper class="swiper" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval"
				:duration="duration" :circular="circular">
				<swiper-item class="swiper-item" v-for="(item, index) in indexSwiperList" :key="index">
					<image :src="item.pic" mode=""></image>
				</swiper-item>
			</swiper>
		</view>
		<!-- <view class="round-but-box">
			<u-scroll-list :indicator="indicator" indicatorColor="rgba(0, 132, 255, 0.1)" indicatorActiveColor="#2979ff">
				<view class="btn-list-item" v-for="(item, index) in ballData" :key="index" @click="ballClick(item.url)">
					<view>
						<image :src="item.iconUrl" mode="widthFix"></image>
					</view>
					<view>
						<text>{{item.name}}</text>
					</view>
				</view>
			</u-scroll-list>
		</view> -->
		<view class="column-one" style="touch-action: none;">
			<!-- 推荐歌单分栏 -->
			<special-list :data="recommendedSongListData" @openSongSheet="openSongSheet">
			</special-list>
		</view>

		<view class="column-two">
			<view class="two-title" v-if="beSimilarSong.uiElement">
				<view>
					<u-icon name="reload" :style="{transform: `rotate(${reloadDeg}deg)`}" @click="xsReload"></u-icon>
					<text>{{beSimilarSong.uiElement.subTitle.title}}</text>
				</view>
				<view>
					<u-button type="primary" :plain="true" icon="play-right-fill"
						:text="beSimilarSong.uiElement.button.text" size="mini" color="rgb(129, 129, 129)"></u-button>
				</view>
			</view>
			<view class="two-container">
				<swiper class="swiper" :duration="duration">
					<swiper-item class="swiper-item" v-for="(item, index) in beSimilarSong.creatives" :key="index">
						<view class="item-box">
							<h-list :listData="item.resources" @play="play" :songId="songId"></h-list>
						</view>
					</swiper-item>
				</swiper>
			</view>
		</view>
		
		<view class="column-three" style="touch-action: none;">
			<!-- 推荐歌单分栏 -->
			<video-special-list :data="recommendedSongListData" @openSongSheet="openSongSheet">
			</video-special-list>
		</view>


		<!-- 播放器 -->
		<music-controller class="music-controller" ref="musicController" style="z-index: 999;">
			<template v-slot:songList>
				<!-- <a-list :listData="listData" @play="play"></a-list> -->
				<!-- <view class="song-list" style="overflow: auto;">
					<view class="song-list-item" v-for="(item, index) in songListData" :key="item.id"
						@click="play(item, 1)">
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
				</view> -->
			</template>
		</music-controller>
	</view>
</template>

<script>
	import {
		getHomePageData,
		getSeachText,
		getBall
	} from '@/api/index.js'

	export default {
		data() {
			return {
				//轮播图配置>>>
				indicatorDots: true,
				autoplay: true,
				interval: 2000,
				duration: 500,
				circular: true,
				indexSwiperList: [],
				//<<<
				audioContext: null,
				seachText: '',
				//推荐歌单数据源>>>
				recommendedSongListData: {},
				//相似推荐数据源>>>
				beSimilarSong: {},
				//圆形图标数据
				ballData:[],

				reloadDeg: 0,
				indicator: true,
				
				songId:NaN,
				
				listData:[]
				
			}
		},
		onLoad() {
			this.getHomePageData();
			this.listData = getApp().globalData._songData;
		},
		onNavigationBarSearchInputClicked() {
			uni.navigateTo({
				url: `../../seachPage/seachIndex/seachIndex?keyWord=${this.seachText}`
			});
		},
		onShow() {
			getSeachText().then(res => { //获取搜索热词
				let data = res.data.data;
				this.setNavSearchInput(data.showKeyword);
				this.seachText = data.realkeyword;
			})
			if (this.$refs.musicController) this.$refs.musicController.createBj();

			this.playStatus = getApp().globalData.playStatus;
			this.coverImgUrl = uni.getStorageSync('_CurrentObj')?.al?.picUrl;
			this.songListData = uni.getStorageSync('__songData');
			this.songId = uni.getStorageSync('_CurrentlyPlayingSongId');
		},
		onPullDownRefresh() {
			console.log('refresh');
			this.getHomePageData();

			setTimeout(function() {
				uni.stopPullDownRefresh();
			}, 2000);
		},
		methods: {
			openSongSheet(code) {
				uni.navigateTo({
					url: `../songSheet/songSheet?id=${code}`
				})
			},
			play(song, identification){//播放
				this.$refs.musicController.play(song, identification);
				this.songId = song.id;
				getApp().globalData.CurrentlyPlayingSongId = song.id;
				// if(identification === 0){
				// 	this.songListData = this.songData;
				// 	getApp().globalData._songData = this.songData;
				// }
			},
			getHomePageData() {
				getHomePageData().then(res => {
					this.indexSwiperList = res
					let data = res.data.data;
					// console.log(data)
					this.indexSwiperList = data.blocks.filter(u => u.blockCode == "HOMEPAGE_BANNER")[0].extInfo
						.banners
					this.recommendedSongListData = data.blocks.filter(u => u.blockCode ==
						"HOMEPAGE_BLOCK_PLAYLIST_RCMD")[0]
					this.beSimilarSong = data.blocks.filter(u => u.blockCode == 'HOMEPAGE_BLOCK_STYLE_RCMD')[0];
					
					return getBall();
				}).then(res => {
					let data = res.data.data;
					this.ballData = data;
					console.log(res)
				})

			},
			setNavSearchInput(keyword) {
				// #ifdef APP-PLUS
				let webView = this.$mp.page.$getAppWebview();
				webView.setTitleNViewSearchInputText(keyword);
				// #endif
				// #ifdef H5
				let inputSearch = document.querySelector('.uni-input-input[type=search]');
				var evt = new InputEvent('input', {
					inputType: 'insertText',
					data: keyword,
					dataTransfer: null,
					isComposing: false
				});
				if (inputSearch) {
					inputSearch.value = keyword;
					inputSearch.dispatchEvent(evt);
				}
				// #endif
			},
			xsReload() {
				this.reloadDeg += 360;
			},
			ballClick(url){
				console.log(url)
				uni.navigateTo({
					url:`../../webPage/webViewPage/webViewPage?url=${url}`
				})
			}
		}
	}
</script>

<style lang="scss">
	.container {

		>view {
			background-color: #fff;
		}

		/deep/.music-controller-container {
			//#ifdef H5
			bottom: 50px;
			//#endif
		}

		.swiper-box {
			width: 100vw;
			height: 150px;

			.swiper {
				width: 100%;
				height: 100%;

				.swiper-item> {

					image {
						display: block;
						width: 95%;
						height: 100%;
						margin: 0 auto;
						border-radius: 10px;
					}
				}
			}
		}

		.round-but-box {
			width: 100%;
			height: 150px;
			// border: 1px solid #000;
			display: flex;
			align-items: center;

			>.u-scroll-list {
				width: 100%;
				touch-action: none;

				.btn-list-item {
					height: 80px;
					min-width: 60px;
					margin-left: 14px;
					// border: 1px solid #000;
					display: flex;
					flex-direction: column;
					
					view:first-child{
						width: 100%;
						height: 60px;
						background-color: rgba(3, 125, 255, 0.2);
						border-radius: 50%;
						image{
							width: 100%;
						}
					}
					
					view:last-child{
						display: flex;
						justify-content: center;
						align-items: center;
						flex: 1;
					}
				}
			}
		}

		.column-one {
			border-radius: 0 0 10px 10px;
		}

		.column-two {
			width: 100%;
			height: 300px;
			margin-top: 10px;
			border-radius: 10px;
			display: flex;
			flex-direction: column;

			.two-title {
				display: flex;
				width: 100%;
				height: 40px;

				>view {
					flex: 1;
					display: flex;
					align-items: center;
				}

				>view:first-child {
					padding-left: 20px;
					font-size: 16px;

					>.u-icon {
						transition: 1s;
					}
				}

				>view:last-child {
					justify-content: flex-end;
					padding-right: 20px;
					position: relative;

					.u-button {
						width: 50px;
						height: 20px;
						border-radius: 15px;
						position: absolute;
						right: 20px;
					}
				}
			}

			.two-container {
				flex: 1;

				>.swiper {
					width: 100%;
					height: 100%;

					.swiper-item {
						display: flex;
						justify-content: center;
						align-items: center;

						>.item-box {
							width: 95%;
							height: 90%;
						}
					}
				}
			}
		}
		
		
		.column-three{
			margin-top: 10px;
		}
	}
</style>
