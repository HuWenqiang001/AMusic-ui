import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state:{
		lrcMap: null,
		currentTime: 0,
		lrcKeys: [],
		songId: 0,
		coverImgUrl: '../../static/logo.png',
		playStatus: false,
		totalTime: 0
	},
	getters: {
		currentTime: state => {
			return state.currentTime;
		}
	},
	mutations: {
		changeCover(state, e){
			if(e.coverImgUrl) state.coverImgUrl = e.coverImgUrl;
			if(e.playStatus != undefined) state.playStatus = e.playStatus;
			if(e.lrcMap) state.lrcMap = e.lrcMap;
			if(e.lrcKeys) state.lrcKeys = e.lrcKeys;
			if(e.songId) state.songId = e.songId;
			if(e.totalTime) state.totalTime = e.totalTime;
		},
		currentTime(state, e){
			if(e.currentTime) state.currentTime = e.currentTime;
		}
	},
	actions: {
	
	}
})

export default store
