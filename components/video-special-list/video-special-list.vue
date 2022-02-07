<template>
	<view class="special-list-container" :style="{height:height}">
		<view class="special-list-box">
			<view class="special-list-item" v-for="(item, index) in data.creatives" :style="{height: `calc(${height} * 0.9)`, minWidth: `calc(${height} * 0.63)`, maxWidth: `calc(${height} * 0.6)`}">
				<view class="play-count" v-if="index > 0">
					<i class="iconfont icon-bofang"></i>
					<text>{{playCountConversion(item.resources[0].resourceExtInfo.playCount)}}</text>
				</view>
				<image :src="item.uiElement.image.imageUrl" mode="widthFix" @click="clicked(item.creativeId)"></image>
				
				<text>{{ index>0 ? item.uiElement.mainTitle.title:
				bottomText==''?item.uiElement.mainTitle.title:bottomText}}</text>
			</view>
		</view>
	</view>
</template>

<script>
	import 'animate.css'
	export default {
		name:"video-special-list",
		props:{
			data:{
				type: Object,
				default:() => {
					return {
						creatives:[]
					}
				}
			},
			height:{
				type:String,
				default:() => {
					return '180px'
				}
			},
			openSongSheet:{
				type:Function,
				default:null
			}
		},
		data() {
			return {
				//轮播图配置>>>
				indicatorDots: false,
				autoplay: true,
				interval: 3000,
				duration: 1000,
				circular:true,
				vertical:true,
				//<<<
				showAnime:true,
				bottomText:'',
			};
		},
		methods:{
			start(){
				
			},
			playCountConversion(val){
				let l = val.toString().length;
				if(l > 8){
					return (val/100000000).toFixed(1)+'亿'
				}else if(l > 4){
					return (val/10000).toFixed(1) + '万'
				}else{
					return val
				}
			},
			updataText(list, e){
				 this.bottomText = list[e.detail.current].uiElement.mainTitle.title
			},
			clicked(data){
				this.$emit('openSongSheet', data)
			}
		}
	}
</script>

<style lang="scss">
	@import url(animate.css);
	@import url(../../static/icon/iconfont.css);
	.special-list-container{
		width: 100%;
		.special-list-box{
			width: 100%;
			height: 100%;
			// border: 1px solid #000;
			display: flex;
			align-items: center;
			overflow: auto;
			
			.special-list-item{
				margin: 0 5px;
				// background-color: red;
				position: relative;
				// background-color: t;
				
				.play-count{
					position: absolute;
					width: 50px;
					height: 20px;
					background-color: rgba(0,0,0,.5);
					top: 5px;
					right:5px;
					border-radius: 10px;
					display: flex;
					justify-content: center;
					align-items: center;
					z-index: 1;
					text, i{
						font-size: 6px;
						color: rgb(215, 215, 215);
					}
					i{
						font-size: 12px;
					}
				}
				
				image{
					width: 100%;
					border-radius: 15px;
				}
				text{
					// word-wrap: break-word;
					display: flex;
					flex-wrap: wrap;
					font-size: 10px;
					vertical-align: top;
					line-height: 1.1;
					color: rgb(91,91,91);
				}
				
				.scroll-item{
					width: 100%;
					aspect-ratio: 1/1;
					// border: 1px solid #007AFF;
					border-radius: 15px;
					overflow: hidden;
					display: flex;
					align-items: center;
					.scroll-item-swiper{
						width: 100%;
						height: 110%;
						
						.scroll-item-swiper-item{
							width: 100%;
							height: 100%;
							display: flex;
							justify-content: center;
							align-items: center;
							image{ 
								width: 100%;
							}
						}
					}
				}
			}
		}
	}
	
	.aniOne{
		animation: one 3s linear 3s infinite;
	}
	
	@keyframes one {
		0%{
			width: 100%;
		}
		20%{
			width: 90%;
		}
		40%{
			width: 100%;
		}
		100%{
			width: 100%;
		}
	}
	
</style>
