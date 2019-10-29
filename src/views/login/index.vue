<template>
	<div class="login-container">
		<el-form :model="form" ref="form" :rules="rules" label-width="80px" class="login-form">
			<h2 class="login-title">后台管理系统</h2>
			<el-form-item label="账号" prop="username">
				<el-input v-model="form.username" placeholder="请输入帐号"></el-input>
			</el-form-item>
			<el-form-item label="密码" prop="password">
				<el-input type="password" v-model="form.password" placeholder="请输入密码"></el-input>
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="submitForm('form')">登录</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script>
	import {login, getUserInfo} from '@/api/login.js'
	export default {
		data() {
			return {
				form: {
					username: '',
					password: ''
				},
				rules: {
					username: [{required: true,message: '账号不能为空',trigger: 'blur'}],
					password: [{required: true,message: '密码不能为空',trigger: 'blur',}]
				}
			}
		},
		methods: {
			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						//验证账号和密码是否通过

						this.$store.dispatch('Login', this.form).then(response => {
							if (response.flag) {
								//验证通过前往首页
								this.$router.push('/')
							} else{
								this.$message({
								message: response.message,
								type: 'warning'
								})
							}
						})
					} else {
						return false;
					}
				})
			}
		}
	}
</script>

<style scoped>
	.login-container {
		width: 100%;
		height: 100%;
		background: url(../../assets/login.jpg);
		position: absolute;
		overflow: hidden;
	}

	.login-form {
		width: 350px;
		background: rgb(255, 255, 255, 0.8);
		border-radius: 30px;
		margin: 150px auto;
		padding: 30px;
	}

	.login-title {
		text-align: center;
		color: #303133;
	}
</style>
