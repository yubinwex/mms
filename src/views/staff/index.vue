<template>
	<div>
		<!-- 查询、新增、重置 -->
		<el-form ref="searcForm" :inline="true" :model="searchMap" style="margin-top: 20px;">
			<el-form-item prop="username">
				<el-input v-model="searchMap.username" placeholder="账号"></el-input>
			</el-form-item>
			<el-form-item prop="name">
				<el-input v-model="searchMap.name" placeholder="姓名"></el-input>
			</el-form-item>
				<el-button type="primary" @click="fetchData">查询</el-button>
				<el-button type="primary" @click="handleAdd">新增</el-button>
				<el-button @click="resetForm('searcForm')">重置</el-button>
			</el-form-item>
		</el-form>
		<!-- 数据列表 -->
		<el-table :data="list" height="380" border style="width: 100%">
			<el-table-column type="index" label="序号" width="60"></el-table-column>
			<el-table-column prop="username" label="账号"></el-table-column>
			<el-table-column prop="name" label="姓名"></el-table-column>
			<el-table-column prop="age" label="年龄"></el-table-column>
			<el-table-column prop="mobile" label="电话"></el-table-column>
			<el-table-column prop="salary" label="薪酬"></el-table-column>
			<el-table-column prop="entryDate" label="入职时间"></el-table-column>
			<el-table-column label="操作" width="150">
				<template slot-scope="scope">
					<el-button size="mini" @click="handleEdit(scope.row.id)">编辑</el-button>
					<el-button size="mini" type="danger" @click="handleDelete(scope.row.id)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!-- 分页 -->
		<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="currentPage"
		 :page-sizes="[10, 20, 30]" :page-size="pageSize" layout="total, sizes, prev, pager, next, jumper" :total="total">
		</el-pagination>
		<!-- 新增弹框 -->
		<el-dialog title="员工编辑" :visible.sync="dialogFormVisible" width="500px">
			<el-form :rules="rules" ref="pojoForm" label-width="100px" label-position="right" style="width: 400px;" :model="pojo">
				<el-form-item label="账号" prop="username">
					<el-input v-model="pojo.username"></el-input>
				</el-form-item>
				<el-form-item label="姓名" prop="name">
					<el-input v-model="pojo.name"></el-input>
				</el-form-item>
				<el-form-item label="年龄" prop="age">
					<el-input v-model="pojo.age"></el-input>
				</el-form-item>
				<el-form-item label="电话" prop="mobile">
					<el-input v-model="pojo.mobile"></el-input>
				</el-form-item>
				<el-form-item label="薪酬" prop="salary">
					<el-input v-model="pojo.salary"></el-input>
				</el-form-item>
				<el-form-item label="入职时间" prop="entryDate">
					<el-date-picker style="width: 200px" value-format="yyyy-MM-dd" v-model="pojo.entryDate" type="date" placeholder="请点击选择">
					</el-date-picker>
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
	import staffApi from '@/api/staff.js'
	export default {
		data() {
			return {
				list: [],
				total: 0,
				pageSize: 10,
				currentPage: 1,
				searchMap: {
					username: '',
					name: ''
				},
				dialogFormVisible: false, //新增弹框控制
				pojo: {
					id: null,
					username: '',
					name: '',
					age: '',
					mobile: '',
					salary: '',
					entryDate: ''
				},
				rules: {
					username: [{required: true,message: '账号不能为空',trigger: 'blur'}],
					name: [{required: true,message: '姓名不能为空',trigger: 'blur'}]
				}
			}
		},
		created() {
			this.fetchData()
		},
		methods: {
			fetchData() {
				staffApi.search(this.currentPage, this.pageSize, this.searchMap).then(response => {
					const resp = response.data.data
					this.total = resp.total
					this.list = resp.rows
				})
			},
			//新增弹框
			handleAdd() {
				this.dialogFormVisible = true
				this.pojo.id = null
				//清空原填写的数据
				this.$nextTick(() => {
					this.$refs['pojoForm'].resetFields()
				})
			},
			//提交新增数据
			addData(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						// 验证通过，提交添加
						staffApi.add(this.pojo).then(response => {
							const resp = response.data
							if (resp.flag) {
								this.fetchData()
								this.dialogFormVisible = false
								this.$message({
									message: '新增成功，初始密码为：123456',
									type: 'warning'
								})
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
						staffApi.update(this.pojo).then(response => {
							const resp = response.data
							if (resp.flag) {
								this.fetchData()
								this.dialogFormVisible = false
								console.log('更新数据')
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
			//重置
			resetForm(formName) {
				this.$refs[formName].resetFields();
			},
			//编辑
			handleEdit(id) {
				this.handleAdd()
				//通过id查询数据
				staffApi.getById(id).then(response => {
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
					staffApi.deleteById(id).then(response => {
						const resp = response.data
						this.$message({
							type: resp.flag? 'success':'error',
							message: resp.message
						});
						if(resp.flag) {
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
			}
		}
	}
</script>

<style scoped>
	
</style>
