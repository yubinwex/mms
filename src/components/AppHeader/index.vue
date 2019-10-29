<template>
	<div class="header">
		<!-- 头部左侧Logo和标题 -->
		<a href="#/">
			<img class="logo" src="@/assets/logo.png" width="25px" />
			<span class="company">后台管理系统</span>
		</a>

		<!-- 头部右侧下拉菜单 -->
		<el-dropdown @command="handleCommand">
			<span class="el-dropdown-link">
				{{user.name}}<i class="el-icon-arrow-down el-icon--right"></i>
			</span>
			<el-dropdown-menu slot="dropdown">
				<el-dropdown-item command="a">修改密码</el-dropdown-item>
				<el-dropdown-item command="b">退出系统</el-dropdown-item>
			</el-dropdown-menu>
		</el-dropdown>
		<!-- 修改密码弹框 -->
		<el-dialog title="修改密码" :visible.sync="dialogFormVisible" width="400px">
			<el-form :model="ruleForm" status-icon :rules="rules" ref="ruleForm" label-width="100px" style="width: 300px;">
				<el-form-item label="原密码" prop="oldPass">
					<el-input type="password" v-model="ruleForm.oldPass" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="新密码" prop="pass">
					<el-input type="password" v-model="ruleForm.pass" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="确认密码" prop="checkPass">
					<el-input type="password" v-model="ruleForm.checkPass" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="submitForm('ruleForm')">提交</el-button>
					<el-button @click="$refs['ruleForm'].resetFields()">重置</el-button>
				</el-form-item>
			</el-form>
		</el-dialog>
	</div>
</template>

<script>
	import {
		logout
	} from '@/api/login'
	import pwdApi from '@/api/password.js'

	export default {
		data() {
			//检验原密码
			const validateOldPass = (rule, value, callback) => {
				pwdApi.checkPwd(this.user.id, value).then(response => {
					const resp = response.data
					if (resp.flag) {
						callback()
					} else {
						callback(new Error(resp.message))
					}
				})
			}
			//检验确认密码和新密码是否一致
			const validatePass = (rule, value, callback) => {
				if (value !== this.ruleForm.pass) {
					callback(new Error('两次输入的密码不一致'))
				} else {
					callback()
				}
			}

			return {
				user: this.$store.state.user.user,
				ruleForm: {
					oldPass: '',
					pass: '',
					checkPass: ''
				},
				rules: {
					oldPass: [{
							required: true,
							message: '原密码不能为空',
							trigger: 'blur'
						},
						{
							validator: validateOldPass,
							trigger: 'blur'
						}
					],
					pass: [{
						required: true,
						message: '新密码不能为空',
						trigger: 'blur'
					}, ],
					checkPass: [{
							required: true,
							message: '确认密码不能为空',
							trigger: 'blur'
						},
						{
							validator: validatePass,
							trigger: 'blur'
						}
					]
				},
				dialogFormVisible: false
			}
		},
		methods: {
			handleCommand(command) {
				switch (command) {
					case 'a':
						//打开修改密码窗口
						this.handlePwd()
						break;
					case 'b':
						//退出系统
						this.handleLogout()
						break;
					default:
						break;
				}
			},
			handlePwd() {
				this.dialogFormVisible = true
				//清空原填写的数据
				this.$nextTick(() => {
					this.$refs['ruleForm'].resetFields()
				})
			},
			
			//提交修改密码
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						// 验证通过，提交
						pwdApi.updatePwd(this.user.id, this.ruleForm.checkPass).then(response => {
							const resp = response.data
							this.$message({
								message: resp.message,
								type: resp.flag ? 'success': 'warning'
							})
							if(resp.flag) {
								// 修改成功, 清除本地数据, 重新登录
								this.handleLogout()
								// 关闭窗口 
								this.dialogFormVisible = false
							}
						})
					} else {
						// 验证不通过
						return false;
					}
				});
			},
			
			//退出
			handleLogout() {
				this.$store.dispatch('Logout').then(response => {
					if (response.flag) {
						//成功退出,回到登陆页面
						this.$router.push('/login')
					} else{
						this.$message({
							message: response.message,
							type: 'warning',
							duration: 500
						})
					}
				})
			}
		}
	}
</script>

<style scoped>
	/* 头部区域 */
	.header {
		position: absolute;
		line-height: 50px;
		padding: 0px;
		top: 0px;
		left: 0px;
		right: 0px;
		background-color: #2d3a4b;
	}

	.header a {
		text-decoration: none;
	}

	.logo {
		vertical-align: middle;
		/* 上 右 下 左 */
		padding: 0 10px 0 40px;
	}

	.company {
		/* position: absolute; */
		color: white;
	}

	/* 下拉菜单 */
	.el-dropdown {
		float: right;
		margin-right: 40px;
	}

	.el-dropdown-link {
		cursor: pointer;
		color: #fff;
	}
</style>
