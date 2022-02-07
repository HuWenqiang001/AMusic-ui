import Axios from 'axios'
import axiosAdapterUniapp from 'axios-adapter-uniapp'

const axios = Axios.create({
	baseURL:'https://music-api-f0atvtwcj-huwenqiang001.vercel.app',
	//#ifdef APP-PLUS 
	//uniapp移动端axios适配器
	adapter: axiosAdapterUniapp,
	//#endif
})

export default axios;