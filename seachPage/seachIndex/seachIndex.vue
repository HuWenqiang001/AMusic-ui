<template>
	<view class="seach-page-container">
		<view class="seach-page-header">
			<view>
				<u-icon name="arrow-left" @click="back" size="18px"></u-icon>
			</view>
			<view>
				<u-search v-model="seachContext" :show-action="true" actionText="搜索" :animation="true" :focus="true" @change="seachChange" @search="gitSongName" @custom="gitSongName"></u-search>
				<view class="seach-panel">
					<ul>
						<li v-for="item in seachList" :key="item.id" @click="gitSongName(item.name)"><view>
							<view>
								<text>{{item.name}}</text>
							</view>
						</view><u-line color="#2979ff" :dashed="true"></u-line></li>
					</ul>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import { seachMusic, seachMusicAll } from '@/api/seach.js'
	export default {
		data() {
			return {
				seachContext:'',
				seachList:[],
			}
		},
		onLoad(options) {
			this.seachContext = options?.keyWord;
		},
		methods: {
			back(){
				uni.navigateBack({
					delta:1
				})
			},
			seachChange(){
				if(this.seachContext == ''){
					this.seachList = [];
					return;
				}
				seachMusic({
					keyWord:this.seachContext,
					limit:10,
					offset:0,
					type:null
				}).then(res => {
					// console.log(res.data.result.songs)
					this.seachList = res.data.result.songs;
				})
			},
			gitSongName(val = ''){
				if(val != '') this.seachContext = val;
				uni.navigateTo({
					url:`../seachResult/seachResult?keyWords=${this.seachContext}`
				})
			}
		}
	}
</script>

<style lang="scss">
*{
	margin: 0;
	padding: 0;
}
.seach-page-container{
	width: 100vw;
	height: 100vh;
	>.seach-page-header{
		width: 100%;
		height: 80px;
		display: flex;
		justify-content: center;
		align-items: center;
		
		>view{
			display: flex;
			justify-content: center;
			align-items: center;
			margin-top: 30px;
		}
		
		>view:first-child{
			width: 30px;
		}
		
		>view:last-child{
			flex: 1;
			position: relative;
			.seach-panel{
				width: calc(100% - 30px);
				height: 300px;
				position: absolute;
				left: 0;
				top: 50px;
				
				>ul{
					width: 100%;
					height: 100%;
					
					>li{
						width: 80%;
						height: 10%;
						margin: 0 auto;
						display: flex;
						flex-direction: column;
						
						>.u-line{
							flex: 1;
						}
						
						>view{
							flex: 9;
							width: 100%;
							display: flex;
							
							>view{
								flex: 1;
								display: flex;
								align-items: center;
							}
							
							>view{
								padding-left: 10px;
								justify-content: flex-start;
								>text{
									color: $u-content-color;
								}
							}
							
							// >view:last-child{
							// 	padding-right: 10px;
							// 	justify-content: flex-end;
							// 	>text{
							// 		color: $u-tips-color;
							// 	}
							// }
						}
					}
				}
			}
		}
	}
}
</style>
