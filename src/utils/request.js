import axios from "axios";
// 发送请求的对象
const request=axios.create({
    timeout:5000
})

//request拦截器的处理
// 1．可以对请求做统一的处理
//2．比如统一的加入token,Content-Type等
request.interceptors.request.use(config=>{
    config.headers["Content-Type"]='application/json;charset=utf-8';
    return config;
},error => {
    return Promise.reject(error)
})
//导出
export default request
