import axios from './axios/axios.js'


export function seachMusic(query){
	return axios.get(`/cloudsearch?keywords=${query.keyWord}&limit=${query.limit}&offset=${query.offset}${query.type != null ? "&type="+query.type : ''}&realIP=116.25.146.177`)
}


export function seachMusicAll(keyWord){//综合搜索
	return axios.get(`/search/multimatch?keywords=${keyWord}&realIP=116.25.146.177`)
}

export function getMvUrl(mvid){//综合搜索
	return axios.get(`/mv/url?id=${mvid}&realIP=116.25.146.177`)
}