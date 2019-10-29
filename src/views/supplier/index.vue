<template>
	<div>
		<!-- 查询、新增、重置 -->
		<el-form ref="searcForm" :inline="true" :model="searchMap" style="margin-top: 20px;">
			<el-form-item prop="name">
				<el-input v-model="searchMap.name" placeholder="供应商名称"></el-input>
			</el-form-item>
			<el-form-item prop="linkman" v-if="!isDialog">
				<el-input v-model="searchMap.linkman" placeholder="联系人"></el-input>
			</el-form-item>
			<el-form-item prop="mobile" v-if="!isDialog">
				<el-input v-model="searchMap.mobile" placeholder="联系电话"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="fetchData">查询</el-button>
				<el-button type="primary" @click="handleAdd" v-if="!isDialog">新增</el-button>
				<el-button @click="resetForm('searcForm')" v-if="!isDialog">重置</el-button>
			</el-form-item>
		</el-form>

		<!-- 数据列表 -->
		<el-table :highlight-current-row="isDialog"
		 @current-change="clickCurrentChange"
		:data="list" height="380" border style="width: 100%">
			<el-table-column type="index" label="序号" width="60"></el-table-column>
			<el-table-column prop="name" label="供应商名称"></el-table-column>
			<el-table-column prop="linkman" label="联系人"></el-table-column>
			<el-table-column prop="mobile" label="联系电话" v-if="!isDialog"></el-table-column>
			<el-table-column prop="remark" label="备注" v-if="!isDialog"></el-table-column>
			<el-table-column label="操作" width="150" v-if="!isDialog">
				<template slot-scope="scope">
					<el-button size="mini" @click="handleEdit(scope.row.id)">编辑</el-button>
					<el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!-- 分页 -->
		<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
		 :page-sizes="[10, 20, 30]" :page-size="pageSize" :layout="!isDialog?'total, sizes, prev, pager, next, jumper': 'prev, pager, next'" :total="total">
		</el-pagination>
		<!-- 新增弹框 -->
		<el-dialog v-if="!isDialog" title="供应商编辑" :visible.sync="dialogFormVisible" width="500px">
			<el-form :rules="rules" ref="pojoForm" label-width="100px" label-position="right" style="width: 400px;" :model="pojo">
				<el-form-item label="供应商名称" prop="name">
					<el-input v-model="pojo.name"></el-input>
				</el-form-item>
				<el-form-item label="联系人" prop="linkman">
					<el-input v-model="pojo.linkman"></el-input>
				</el-form-item>
				<el-form-item label="联系电话" prop="mobile">
					<el-input v-model="pojo.mobile"></el-input>
				</el-form-item>
				<el-form-item label="备注" prop="remark">
					<el-input type="textarea" v-model="pojo.remark" placeholder="请输入地址" :autosize="{ minRows: 2, maxRows: 4}"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="dialogFormVisible = false">取 消</el-button>
				<el-button type="primary" @click="pojo.id === null ? addData('pojoForm'): updateData('pojoForm')">确 定</el-button>
			</div>
		</el-dialog>
	</div>
</template>

<script>
	import supplierApi from '@/api/supplier.js'

	export default {
		props: {
			isDialog: Boolean
		},
		data() {
			return {
				list: [],
				currentPage: 1,
				pageSize: 10,
				total: 0,
				searchMap: {
					name: '',
					linkman: '',
					mobile: ''
				},
				dialogFormVisible: false,
				pojo: {
					id: null,
					name: '',
					linkman: '',
					mobile: '',
					remark: ''
				},
				rules: {
					name: [{
						required: true,
						message: '供应商名称不能为空',
						trigger: 'blur'
					}],
					linkman: [{
						required: true,
						message: '联系人不能为空',
						trigger: 'blur'
					}],
				},
			}
		},
		created() {
			this.fetchData()
		},
		methods: {
			fetchData() {
				supplierApi.search(this.currentPage, this.pageSize, this.searchMap).then(response => {
					const resp = response.data.data
					this.list = resp.rows
					this.total = resp.total
				})
			},
			//打开新增窗口
			handleAdd() {
				this.dialogFormVisible = true
				this.pojo.id = null
				//清空原填写的数据
				this.$nextTick(() => {
					this.$refs['pojoForm'].resetFields()
				})
			},
			//重置
			resetForm(formName) {
				this.$refs[formName].resetFields();
			},
			//提交新增数据
			addData(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						// 验证通过，提交添加
						supplierApi.add(this.pojo).then(response => {
							const resp = response.data
							if (resp.flag) {
								this.fetchData()
								this.dialogFormVisible = false
								console.log(resp.message)
							} else {
								this.$message({
									message: resp.message,
									type: 'warning'
								})
							}
						})
					} else {
						// 验证不通过
						return false;
					}
				})
			},
			//更新数据
			updateData(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						// 验证通过，提交添加
						supplierApi.update(this.pojo).then(response => {
							const resp = response.data
							if (resp.flag) {
								this.fetchData()
								this.dialogFormVisible = false
								console.log(resp.message)
							} else {
								this.$message({
									message: resp.message,
									type: 'warning'
								})
							}
						})
					} else {
						// 验证不通过
						return false;
					}
				})
			},
			//编辑
			handleEdit(id) {
				this.handleAdd()
				//通过id查询数据
				supplierApi.getById(id).then(response => {
					const resp = response.data
					if (resp.flag) {
						this.pojo = resp.data
					}
				})
			},
			//删除
			handleDelete(id) {
				this.$confirm('确认删除这条记录吗？', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					//确认
					supplierApi.deleteById(id).then(response => {
						const resp = response.data
						this.$message({
							type: resp.flag ? 'success' : 'error',
							message: resp.message
						});
						if (resp.flag) {
							//删除成功，刷新列表
							this.fetchData()
						}
					})
				}).catch(() => {
					//取消删除
				})
			},

			handleSizeChange(val) {
				this.pageSize = val
				this.fetchData()
			},
			handleCurrentChange(val) {
				this.currentPage = val
				this.fetchData()
			},
			//点击某一行时调用这个函数
			clickCurrentChange(currentRow) {
				//子组件向父组件传值
				this.$emit('option-supplier', currentRow)
			}
		}
	}
</script>

<style scoped>

</style>
