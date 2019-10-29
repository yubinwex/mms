import request from '@/utils/request'

export default {
	//获取供应商数据列表
	getList() {
		return request({
			url: '/supplier/list',
			method: 'get'
		})
	},
	
	//分页查询,page当前页码，size每页显示条数，searchMap条件
	search(page, size, searchMap) {
		return request({
			url: `/supplier/list/search/${page}/${size}`,
			method: 'post',
			data: searchMap,
		})
	},
	//新增
	add(pojo) {
		return request({
			url: '/supplier',
			method: 'post',
			data: pojo,
		})
	},
	//查询
	getById(id) {
		return request({
			url: `/supplier/${id}`,
			method: 'get'
		})
	},
	//更新
	update(pojo) {
		return request({
			url: `/supplier/${pojo.id}`,
			method: 'put',
			data: pojo
		})
	},
	
	//删除
	deleteById(id) {
		return request({
			url: `/supplier/${id}`,
			method: 'delete'
		})
	}
}