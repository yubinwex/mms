/*权限校验： 通过router路由前置钩子函数 beforeEach() ， 
在跳转路由前进行拦截判断是否已经登录， 
如果已登录，则进行路由跳转，如果没有则回到登录页
*/


import router from './router.js'
import {getUserInfo} from './api/login'
import store from './store'

router.beforeEach((to, from, next) => {
	//从store状态中获取token
	const token = store.state.user.token
	if (!token) {
		//没有token，不允许访问，回到登陆页
		if (to.path !== '/login') {
			//请求的不是路由login，让用户回到登陆页
			next({
				path: '/login'
			})
		} else {
			next()
		}
	} else {
		//有token
		if (to.path === '/login') {
			next()
		} else {
			//有token查看是否有用户信息
			const userInfo = store.state.user.user
			if (userInfo) {
				//本地有信息则进入目标路由
				next()
			} else {
				// 如果本地没有用户信息， 就通过token去获取用户信息
				store.dispatch('GetUserInfo', token).then(response => {
					if (response.flag) {
						next()
					} else{
						next({path: 'login'})
					}
				}).catch(error => {
					
				})
			}
		}
	}
})
