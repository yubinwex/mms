import request from '@/utils/request'

export default {
	search(page, size, searchMap) {
		return request({
			url: `/staff/list/search/${page}/${size}`,
			method: 'post',
			data: searchMap,
		})
	},
	//新增会员
	add(pojo) {
		return request({
			url: '/staff',
			method: 'post',
			data: pojo,
		})
	},
	
	//查询
	getById(id) {
		return request({
			url: `/staff/${id}`,
			method: 'get'
		})
	},
	
	//更新
	update(pojo) {
		return request({
			url: `/staff/${pojo.id}`,
			method: 'put',
			data: pojo
		})
	},
	
	//删除
	deleteById(id) {
		return request({
			url: `/staff/${id}`,
			method: 'delete'
		})
	}
}