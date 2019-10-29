<template>
	<div>
		<!-- 查询、新增、重置 -->
		<el-form ref="searcForm" :inline="true" :model="searchMap" style="margin-top: 20px;">
			<el-form-item prop="name">
				<el-input v-model="searchMap.name" placeholder="商品名称"></el-input>
			</el-form-item>
			<el-form-item prop="code">
				<el-input v-model="searchMap.code" placeholder="商品编码"></el-input>
			</el-form-item>
			<el-form-item prop="supplierName">
				<el-input readonly 
				@click.native="dialogSupplierVisible = true"
				v-model="searchMap.supplierName" placeholder="选择供应商">
				</el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="fetchData">查询</el-button>
				<el-button type="primary" @click="handleAdd">新增</el-button>
				<el-button @click="resetForm('searcForm')">重置</el-button>
			</el-form-item>
		</el-form>
		<!-- 数据列表 -->
		<el-table :data="list" height="380" border style="width: 100%">
			<el-table-column type="index" label="序号" width="60"></el-table-column>
			<el-table-column prop="name" label="商品名称"></el-table-column>
			<el-table-column prop="code" label="商品编码"></el-table-column>
			<el-table-column prop="spec" label="商品规格"></el-table-column>
			<el-table-column prop="retailPrice" label="零售价"></el-table-column>
			<el-table-column prop="purchasePrice" label="进货价"></el-table-column>
			<el-table-column prop="storageNum" label="库存数量"></el-table-column>
			<el-table-column prop="supplierName" label="供应商"></el-table-column>
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
		<!-- 供应商弹框 -->
		<el-dialog  title="选择供应商" :visible.sync="dialogSupplierVisible" width="500px">
			<supplier :isDialog="true" @option-supplier="optionSupplier"></supplier>
		</el-dialog>
		<!-- 新增弹框 -->
		<el-dialog title="商品编辑" :visible.sync="dialogFormVisible" width="500px">
			<el-form :rules="rules" ref="pojoForm" label-width="100px" label-position="right" style="width: 400px;" :model="pojo">
				<el-form-item label="商品名称" prop="name">
					<el-input v-model="pojo.name"></el-input>
				</el-form-item>
				<el-form-item label="商品编码" prop="code">
					<el-input v-model="pojo.code"></el-input>
				</el-form-item>
				<el-form-item label="商品规格" prop="spec">
					<el-input v-model="pojo.spec"></el-input>
				</el-form-item>
				<el-form-item label="零售价" prop="retailPrice">
					<el-input v-model="pojo.retailPrice"></el-input>
				</el-form-item>
				<el-form-item label="进货价" prop="purchasePrice">
					<el-input v-model="pojo.purchasePrice"></el-input>
				</el-form-item>
				<el-form-item label="库存数量" prop="storageNum">
					<el-input v-model="pojo.storageNum"></el-input>
				</el-form-item>
				<el-form-item label="供应商" prop="supplierName">
					<el-input readonly @click.native="editOptionSupplier" v-model="pojo.supplierName" placeholder="选择供应商"></el-input>
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
	import goodsApi from '@/api/goods.js'
	import Supplier from '@/views/supplier'
	export default {
		components:{Supplier},
		data() {
			return {
				list: [],
				currentPage: 1,
				pageSize: 10,
				total: 0,
				searchMap: {
					name: '',
					code: '',
					supplierName: ''
				},
				dialogSupplierVisible: false ,//控制供应商弹框窗口
				dialogFormVisible: false, //控制新增弹框窗口
				pojo: {
					id: null,
					name: '',
					code: '',
					spec: '',
					retailPrice: '',
					purchasePrice: '',
					storageNum: '',
					supplierName: '',
					supplierId: null
				},
				rules: {
					name: [
						{required: true,message: '商品名称不能为空',trigger: 'blur'}
					],
					code: [
						{required: true,message: '商品编码不能为空',trigger: 'blur'}
					],
					retailPrice: [
						{required: true,message: '零售价不能为空',trigger: 'blur'}
					]
				},
				isEdit: false
			}
		},
		created() {
			this.fetchData()
		},
		methods: {
			fetchData() {
				goodsApi.search(this.currentPage, this.pageSize, this.searchMap).then(response => {
					const resp = response.data.data
					this.list = resp.rows
					this.total = resp.total
				})
			},
			//新增
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
			
			//编辑
			handleEdit(id) {
				this.handleAdd()
				//通过id查询数据
				goodsApi.getById(id).then(response => {
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
					goodsApi.deleteById(id).then(response => {
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
			optionSupplier(currentRow) {
				// 判断是否编辑
				if(this.isEdit) {
					//在新增弹框中选择的供应商查询
					this.pojo.supplierName = currentRow.name
					this.pojo.supplierId = currentRow.id 
				} else{
					this.searchMap.supplierId = currentRow.id 
					this.searchMap.supplierName = currentRow.name
				}
				this.isEdit = false
				this.dialogSupplierVisible = false //关闭窗口
			},
			//提交新增数据
			addData(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						// 验证通过，提交添加
						goodsApi.add(this.pojo).then(response => {
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
			//编辑窗口打开供应商
			editOptionSupplier() { 
				this.isEdit = true // 是编辑窗口 
				this.dialogSupplierVisible = true 
			},
			//更新数据
			updateData(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						// 验证通过，提交添加
						goodsApi.update(this.pojo).then(response => {
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
		}
	}
</script>

<style scoped>

</style>
