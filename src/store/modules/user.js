import {login, getUserInfo, logout} from '@/api/login'
import {getToken, setToken, getUser, setUser, removeToken} from '@/utils/auth'

const user = {
	state: {
		token: getToken(),
		user: getUser()
	},
	
	mutations: {
		SET_TOKEN(state, token){
			state.token = token
			setToken(token)
		},
		
		SET_USER(state, user){
			state.user = user
			setUser(user)
		}
	},
	
	actions: {
		//登录获取token 
		Login({commit}, form){
			return new Promise((resolve, reject) => { //resolve成功的状态，reject失败的状态
				login(form.username.trim(), form.password).then(response => {
					const resp = response.data
					commit('SET_TOKEN', resp.data.token)
					resolve(resp)
				}).catch(erroe => {
					reject(error)
				})
			})
		},
		
		// 通过token获取用户信息
		GetUserInfo({commit, state}) {
			return  new Promise((resolve, reject) => {
				getUserInfo(state.token).then(response => {
					const respUser = response.data
					commit('SET_USER', respUser.data)
					resolve(respUser)
				}).catch(error => {
					reject(error)
				})
			})
		},
		
		//退出
		Logout({commit, state}) {
			return new Promise((resolve, reject) => {
				logout(state.token).then(response => {
					const resp = response.data
					commit('SET_TOKEN', '')
					commit('SET_USER', null)
					resolve(resp)
				}).catch(error => {
					reject(error)
				})
			})
		}
	}
}

export default user