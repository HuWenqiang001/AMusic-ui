<template>
	<view class="result-page-container">
		<image class="page-bj" src="https://gimg2.baidu.com/image_search/src=http%3A%2F%2Finews.gtimg.com%2Fnewsapp_match%2F0%2F8667643970%2F0.jpg&refer=http%3A%2F%2Finews.gtimg.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1645259775&t=baa74148dcbcd977ba97d74bac27264c" mode="heightFix"></image>
		<view class="page-nav">
			<view>
				<u-icon name="arrow-left" @click="back" size="18px"></u-icon>
			</view>
			<view>
				<u-search v-model="keyWord" :show-action="true" :showAction="false" :disabled="true" @click="seach">
				</u-search>
			</view>
		</view>
		<u-tabs :list="topTabs" lineWidth="30" lineColor="#2979ff" :activeStyle="{
			color: 'rgb(245,245,245)',
			fontWeight: 'bold',
			transform: 'scale(1.05)'
		}" :inactiveStyle="{
			color: 'rgba(245,245,245,.5)',
			transform: 'scale(1)'
		}" itemStyle="padding-left: 15px; padding-right: 15px; height: 34px;" :current="currentTab" @change="tabChange">
		</u-tabs>
		<view class="list-box">
			<view class="swiper-box" ref='swiperBox'>
				<!-- <image v-for="(item, index) in indexSwiperList" :key="index" :src="item.pic" mode=""></image> -->
				<swiper class="swiper" :indicator-dots="indicatorDots" :autoplay="autoplay" :interval="interval"
					:duration="duration" :circular="circular" :current="currentTab" @change="tabChange">
					<swiper-item class="swiper-item">
						<a-list :listData="singleList" @singleSeach="singleSeach" @play="play"></a-list>
					</swiper-item>
					<swiper-item class="swiper-item">
						<b-list :listData="albumList"></b-list>
					</swiper-item>
					<swiper-item class="swiper-item">
						<c-list :listData="singerList"></c-list>
					</swiper-item>
					<swiper-item class="swiper-item">
						<d-list :listData="songSheetList"></d-list>
					</swiper-item>
					<swiper-item class="swiper-item">
						<e-list :listData="mvList" :currentTab="currentTab"></e-list>
					</swiper-item>
				</swiper>
			</view>
		</view>
		<!-- 播放器 -->
		<music-controller ref="musicController" style="z-index: 999;">
			<!-- <template v-slot:songList>
				<view class="song-list" style="overflow: auto;">
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
				</view>
			</template> -->
		</music-controller>
	</view>
</template>

<script>
	import {
		seachMusic
	} from '@/api/seach.js'
	// import Alist from '@/components/a-list/a-list.vue'
	export default {
		data() {
			return {
				//>>>>>>>公共
				keyWord: '',
				currentTab: 0,
				pageSize:50,
				//<<<<<<<<<
				//轮播图配置>>>
				indicatorDots: false,
				autoplay: false,
				interval: 2000,
				duration: 500,
				circular: false,
				//<<<,
				//>>>>单曲
				singleList: [],
				singleCurrent:0,
				//<<<<<
				//>>>>>专辑
				albumList:[],
				albumCurrent:0,
				//<<<<<
				//>>>>>歌手
				singerList:[],
				singerCurrent:0,
				//<<<<<
				//>>>>>歌单
				songSheetList:[],
				songSheetCurrent:0,
				//<<<<<
				//>>>>>MV
				mvList:[],
				mvCurrent:0,
				//<<<<<
				topTabs: [{
					key: 1,
					name: '单曲',
				}, {
					key: 10,
					name: '专辑',
				}, {
					key: 100,
					name: '歌手'
				}, {
					key: 1000,
					name: '歌单'
				}, {
					key: 1004,
					name: 'MV'
				}],
			}
		},
		watch: {
			currentTab(newVal) {
				if (newVal != undefined) {
					if(this.singleList.length <= 0 && newVal == 0) this.seachMusic(50, 0, 1);
					else if(this.albumList.length <= 0 && newVal == 1) this.seachMusic(50, 0, 10);
					else if(this.singerList.length <= 0 && newVal == 2) this.seachMusic(50, 0, 100);
					else if(this.songSheetList.length <= 0 && newVal == 3) this.seachMusic(50, 0, 1000);
					else if(this.mvList.length <= 0 && newVal == 4) this.seachMusic(20, 0, 1004);
				}
			}
		},
		onLoad(options) {
			this.keyWord = options?.keyWords;
			if (this.singleList.length <= 0) this.singleSeach();
		},
		methods: {
			back() {//返回上级
				uni.navigateBack({
					delta: 1
				})
			},
			play(song, identification){//播放
				// this.$refs.musicController.play(song, identification);
				this.$store.commit('changeCover', {
					songId: song.id
				});
				this.songId = song.id;
				if(identification === 0){
					this.songListData = this.singleList;
					getApp().globalData._songData = this.singleList;
				}
			},
			seach() {//搜索
				uni.navigateTo({
					url: `../seachIndex/seachIndex?keyWord=${this.keyWord}`
				})
			},
			tabChange(item) {
				if(item.index != undefined){
					this.currentTab = item.index
				}else{
					this.currentTab = item.detail.current
				}
			},
			seachMusic(limit = 50, offset = 0, type = 1) {
				seachMusic({
					keyWord: this.keyWord,
					limit: limit,
					offset: offset,
					type: type
				}).then(res => {
					switch(type){
						case 1:
							this.singleList = [...this.singleList, ...res.data.result.songs];
						break;
						case 10:
							this.albumList = [...this.albumList, ...res.data.result.albums];
						break;
						case 100:
							this.singerList = [...this.singerList, ...res.data.result.artists];
						break;
						case 1000:
							this.songSheetList = [...this.songSheetList, ...res.data.result.playlists];
						break;
						case 1004:
							this.mvList = [...this.mvList, ...res.data.result.mvs];
						break;
					}
				})
			},
			singleSeach(){
				this.seachMusic(this.pageSize, this.singleCurrent, this.topTabs[this.currentTab]?.key)
				this.singleCurrent++;
			},
			mvScrollPlay(){
				
			}
		}
	}
</script>

<style lang="scss">
	.result-page-container {
		position: relative;
		max-height: 100vh;
		overflow: hidden;
		
		>.page-bj{
			// display: none;
			position: absolute;
			left: 0;
			top: 0;
			height: 100vh;
			filter: blur(20px);
		}

		>.page-nav {
			position: sticky;
			left: 0;
			top: 0;
			width: 100%;
			height: 80px;
			display: flex;
			justify-content: center;
			align-items: center;
			// background-color: #2979ff;
			// background-image: linear-gradient(180deg, #8cb1ff 4%, #9cc4ff 19%, #a8c7f9 39%, #c1d9ff 60%, #c0d7fd 80%, #c7dbff 100%);
			// background-color: #fff;
			z-index: 999;
			>view {
				display: flex;
				justify-content: center;
				align-items: center;
				margin-top: 30px;
			}

			>view:first-child {
				width: 30px;
			}

			>view:last-child {
				flex: 1;
				position: relative;
				padding-right: 10px;
			}
		}

		>.u-tabs {
			position: sticky;
			left: 0;
			top: 0;
			z-index: 999;
			// background-color: #c0d5ff;
			// background-image: linear-gradient(180deg, #c7dbff 0%, #e0ecff 29%, #ffffff 90%);
			
			// background-color: #fff;
		}

		.list-box {
			width: 100%;
			height: calc(100vh - 80px) !important;

			.swiper {
				height: calc(100vh - 80px) !important;

				/deep/.u-list {
					height: calc(100vh - 80px) !important;
				}
			}
		}
	}
</style>
