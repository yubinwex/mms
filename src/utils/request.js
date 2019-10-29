import axios from 'axios'
import {Loading, Message } from 'element-ui'

//自定义axios对象
const request = axios.create({
	baseURL: process.env.VUE_APP_BASE_API,
	timeout: 5000 //请求超时,5000毫秒
})

const loading = {

	loadingInstance: null,
	//打开加载
	open: function() {
		// 创建单例, 防止切换路由重复加载
		if (this.loadingInstance === null) {
			this.loadingInstance = Loading.service({
				target: '.main',
				text: '加载中...',
				background: 'rgba(0, 0, 0, 0.5)'
			})
		}
	},
	//关闭加载
	close: function() {
		if (this.loadingInstance !== null) {
			this.loadingInstance.close()
		}
		this.loadingInstance = null // 关闭加载实例重新赋值让它重新创建
	}
}

//请求拦截
request.interceptors.request.use(config => {
	loading.open()
	return config;
}, error => {
	loading.close()
	return Promise.reject(error);
});

//响应拦截  
request.interceptors.response.use(response => {
	loading.close()
	const resp = response.data
	if(resp.code !== 2000) {//响应状态如果不是2000，说明后台服务有异常
		Message({
			message: resp.message || '系统异常',
			type: 'warning',
			duration: 5 * 1000
		})
	}
	return response;
}, error => {
	loading.close()
	Message({
		message: error.message,
		type: 'error',
		duration: 2 * 1000
	})
	return Promise.reject(error);
});

export default request
