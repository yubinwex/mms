<template>
	<div>
		<!-- 查询、新增、重置 -->
		<el-form ref="searcForm" :inline="true" :model="searchMap" style="margin-top: 20px;">
			<el-form-item prop="cardNum">
				<el-input v-model="searchMap.cardNum" placeholder="会员卡号"></el-input>
			</el-form-item>
			<el-form-item prop="name">
				<el-input v-model="searchMap.name" placeholder="会员名字"></el-input>
			</el-form-item>
			<el-form-item prop="payType">
				<el-select v-model="searchMap.payType" placeholder="支付类型" style="width: 130px;">
					<el-option v-for="option in payTypeOptions" :key="option.type" :label="option.name" :value="option.type">
					</el-option>
				</el-select>
			</el-form-item>
			<el-form-item prop="birthday">
				<el-date-picker value-format="yyyy-MM-dd" v-model="searchMap.birthday" type="date" placeholder="选择日期">
				</el-date-picker>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="fetchData">查询</el-button>
				<el-button type="primary" @click="handleAdd">新增</el-button>
				<el-button @click="resetForm('searcForm')">重置</el-button>
			</el-form-item>
		</el-form>
		<!-- 数据列表 -->
		<el-table :data="list" height="380" border style="width: 100%">
			<el-table-column type="index" label="序号" width="55"></el-table-column>
			<el-table-column prop="cardNum" label="会员卡号"></el-table-column>
			<el-table-column prop="name" label="会员姓名"></el-table-column>
			<el-table-column prop="birthday" label="会员生日"></el-table-column>
			<el-table-column prop="phone" label="手机号码" width="110"></el-table-column>
			<el-table-column prop="integral" label="可用积分"></el-table-column>
			<el-table-column prop="money" label="开卡金额"></el-table-column>
			<el-table-column prop="payType" label="支付类型">
				<template slot-scope="scope">
					<span>{{scope.row.payType | payTypeFilter}}</span>
				</template>
			</el-table-column>
			<el-table-column prop="address" label="会员地址" width="180"></el-table-column>
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
		<el-dialog title="会员编辑" :visible.sync="dialogFormVisible" width="500px">
			<el-form :model="pojo" :rules="rules" ref="pojoForm" label-width="100px" label-position="right" style="width: 400px;">
				<!-- <el-form-item  prop="id" ></el-form-item> -->
				<el-form-item label="会员卡号" prop="cardNum">
					<el-input v-model="pojo.cardNum"></el-input>
				</el-form-item>
				<el-form-item label="会员姓名" prop="name">
					<el-input v-model="pojo.name"></el-input>
				</el-form-item>
				<el-form-item label="会员生日" prop="birthday">
					<el-date-picker style="width: 200px" value-format="yyyy-MM-dd" v-model="pojo.birthday" type="date" placeholder="会员生日">
					</el-date-picker>
				</el-form-item>
				<el-form-item label="手机号码" prop="phone">
					<el-input v-model="pojo.phone"></el-input>
				</el-form-item>
				<el-form-item label="开卡金额" prop="money">
					<el-input v-model="pojo.money"></el-input>
				</el-form-item>
				<el-form-item label="可用积分" prop="integral">
					<el-input v-model="pojo.integral"></el-input>
				</el-form-item>
				<el-form-item label="支付类型" prop="payType">
					<el-select v-model="pojo.payType" placeholder="支付类型" style="width: 110px">
						<el-option v-for="option in payTypeOptions" :key="option.type" :label="option.name" :value="option.type"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="会员地址" prop="address">
					<el-input type="textarea" v-model="pojo.address" :autosize="{ minRows: 2, maxRows: 4}"></el-input>
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
	import memberApi from '@/api/member.js'

	//支付类型
	const payTypeOptions = [{
			type: '1',
			name: '现金'
		},
		{
			type: '2',
			name: '微信'
		},
		{
			type: '3',
			name: '支付宝'
		},
		{
			type: '4',
			name: '银行卡'
		}
	]
	export default {
		data() {
			return {
				list: [],
				total: 0, // 总记录数
				currentPage: 1, // 当前页, 默认第1页
				pageSize: 10, // 每页显示条数
				searchMap: { // 条件查询绑定条件值
					cardNum: '',
					name: '',
					payType: '',
					birthday: '',
				},
				payTypeOptions,
				dialogFormVisible: false, //控制新增弹框
				pojo: {
					id: null,
					cardNum: '',
					name: '',
					birthday: '',
					phone: '',
					money: '',
					integral: '',
					payType: '',
					address: ''
				},
				rules: {
					cardNum: [{
						required: true,
						message: '卡号不能为空',
						trigger: 'blur'
					}],
					name: [{
						required: true,
						message: '姓名不能为空',
						trigger: 'blur'
					}],
					payType: [{
						required: true,
						message: '支付不能为空',
						trigger: 'change'
					}]
				}
			}
		},
		created() {
			//获取初始数据
			this.fetchData()
		},
		methods: {
			fetchData() {
				memberApi.search(this.currentPage, this.pageSize, this.searchMap).then(response => {
					// console.log(response)
					const resp = response.data.data
					this.total = resp.total
					this.list = resp.rows
				})
			},
			//每页显示多少数据
			handleSizeChange(val) {
				this.pageSize = val
				this.fetchData()
			},
			//当前页数据
			handleCurrentChange(val) {
				this.currentPage = val
				this.fetchData()
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
						memberApi.add(this.pojo).then(response => {
							const resp = response.data
							if (resp.flag) {
								this.fetchData()
								this.dialogFormVisible = false
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
						memberApi.update(this.pojo).then(response => {
							const resp = response.data
							if (resp.flag) {
								this.fetchData()
								this.dialogFormVisible = false
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
			//打开新增窗口
			handleAdd() {
				this.dialogFormVisible = true
				this.pojo.id = null
				//清空原填写的数据
				this.$nextTick(() => {
					this.$refs['pojoForm'].resetFields()
				})
			},
			//打开编辑窗口
			handleEdit(id) {
				this.handleAdd()
				//通过id查询数据
				memberApi.getById(id).then(response => {
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
					memberApi.deleteById(id).then(response => {
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
			}

		},

		//过滤器
		filters: {
			payTypeFilter(type) {
				const payObj = payTypeOptions.find(obj => obj.type === type)
				return payObj ? payObj.name : null
			}
		}
	}
</script>

<style scoped>

</style>
