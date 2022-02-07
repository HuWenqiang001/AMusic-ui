import axios from './axios/axios.js'


export function getSongSheet(id){
	return axios.get(`/playlist/detail?id=${id}&realIP=116.25.146.177`)
}

export function getTreckAll(id){
	return axios.get(`/playlist/track/all?id=${id}&realIP=116.25.146.177`)
}

export function checkMusic(id){
	return axios.get(`/check/music?id=${id}&realIP=116.25.146.177`)
}

export function getMusic(id){
	return axios.get(`/song/url?id=${id}&realIP=116.25.146.177`)
}

export function getMusicLyric(id){
	return axios.get(`/lyric?id=${id}&realIP=116.25.146.177`)
}

export function getMusicDetails(id){
	return axios.get(`/song/detail?ids=${id}&realIP=116.25.146.177`)
}

export function getM(id){
	return axios.get('http://m802.music.126.net/20220129160510/f1d654dd1ecdf832aa596d52a8dc5304/jd-musicrep-ts/8900/5d9e/f028/85e77d0e2df80bee4ab4f23ea5f72dc1.')
}