<script>
	export default {
		globalData: { //全局变量
			CurrentlyPlayingSongId: 0,
			playStatus: false,
			CurrentObj: {},
			_songData: []
		},
		onLaunch: function() {
			// console.warn('当前组件仅支持 uni_modules 目录结构 ，请升级 HBuilderX 到 3.1.0 版本以上！')
			console.log('App Launch')
			
			
			this.watch(this.globalSetStorage, 'CurrentlyPlayingSongId', '_CurrentlyPlayingSongId');
			// this.watch(this.globalSetStorage, 'playStatus', '_playStatus');
			this.watch(this.globalSetStorage, 'CurrentObj', '_CurrentObj');
			this.watch(this.globalSetStorage, '_songData', '__songData');
			
		},
		onShow: function() {
			console.log('App Show')
		},
		onHide: function() {
			console.log('App Hide')
		},
		methods: {
			watch(method, istr, key = null) {
				let obj = this.globalData
				console.log(obj)
				Object.defineProperty(obj, istr, {
					configurable: true,
					enumerable: true,
					set: function(value) {
						this._consumerGoodsStatus = value
						method(key, value)
					},
					get: function(value) {
						return this._consumerGoodsStatus
					}
				})
			},
			globalSetStorage(key, val){
				if(key) uni.setStorageSync(key, val);
			}
		},
	}
</script>

<style lang="scss">
	/*每个页面公共css */
	@import "uview-ui/index.scss";
	@import '@/uni_modules/uni-scss/index.scss';

	/* #ifndef APP-NVUE */
	@import '@/static/customicons.css';

	// 设置整个项目的背景色
	page {
		background-color: #f5f5f5;
	}

	/* #endif */
	.example-info {
		font-size: 14px;
		color: #333;
		padding: 10px;
	}
	
	li{
		list-style: none;
	}

	// * {
	//    touch-action: none;
	// }
</style>
