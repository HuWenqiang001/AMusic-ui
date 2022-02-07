import axios from './axios/axios.js'

export function getMusic(url){
	return axios.get(url)
}

export function getHomePageData(){
	return axios.get(`/homepage/block/page?realIP=116.25.146.177`)
}

export function getSongSheet(id){
	return axios.get(`/playlist/detail?id=${id}&realIP=116.25.146.177`)
}

export function getSeachText(){
	return axios.get(`/search/default?realIP=116.25.146.177`)
}

export function getBall(){
	return axios.get(`/homepage/dragon/ball?realIP=116.25.146.177`)
}
