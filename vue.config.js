module.exports = {
  devServer: {
    port: 8888,
    host: "localhost",
    https: false,
    open: true, //启动服务自动打开浏览器
    //代理配置
		proxy: {
      // 匹配 /dev-api 开头的请求
      [process.env.VUE_APP_BASE_API]: {
        //目标服务器地址
        target: process.env.VUE_APP_SERVICE_URL,
				changOrigin: true, //开启代理服务
        pathRewrite: {
          //将dev-api前缀替换为''，就是移除
          ['^' + process.env.VUE_APP_BASE_API]: ''
        }
      }
    }
  },
	
  lintOnSave: false, //关闭格式检查
	productionSourceMap: false//打宝石不会生产map文件，加快打包速度
};
