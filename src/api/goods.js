import request from '@/utils/request'

export default {
	search(page, size, searchMap) {
		return request({
			url: `/goods/list/search/${page}/${size}`,
			method: 'post',
			data: searchMap
		})
	},
	
	//新增
	add(pojo) {
		return request({
			url: '/goods',
			method: 'post',
			data: pojo,
		})
	},
	//查询
	getById(id) {
		return request({
			url: `/goods/${id}`,
			method: 'get'
		})
	},
	//更新
	update(pojo) {
		return request({
			url: `/goods/${pojo.id}`,
			method: 'put',
			data: pojo
		})
	},
	
	//删除
	deleteById(id) {
		return request({
			url: `/goods/${id}`,
			method: 'delete'
		})
	}
}