import request from '@/utils/request'

export default {
	//获取会员数据列表
	getList() {
		return request({
			url: '/member/list',
			method: 'get'
		})
	},

	//分页查询,page当前页码，size每页显示条数，searchMap条件
	search(page, size, searchMap) {
		return request({
			url: `/member/list/search/${page}/${size}`,
			method: 'post',
			data: searchMap,
		})
	},

	//新增
	add(pojo) {
		return request({
			url: '/member',
			method: 'post',
			data: pojo,
		})
	},

	//查询
	getById(id) {
		return request({
			url: `/member/${id}`,
			method: 'get'
		})
	},

	//更新
	update(pojo) {
		return request({
			url: `/member/${pojo.id}`,
			method: 'put',
			data: pojo
		})
	},
	
	//删除
	deleteById(id) {
		return request({
			url: `/member/${id}`,
			method: 'delete'
		})
	}
}
