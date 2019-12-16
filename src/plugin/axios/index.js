import store from '@/store'
import axios from 'axios'
import { cookieGet } from '@/common/cookie'
import { Message } from 'element-ui'
import { isPlainObject } from 'lodash'
import qs from 'qs'

import util from '@/libs/util'

// 创建一个错误
function errorCreate(msg) {
  const error = new Error(msg)
  errorLog(error)
  throw error
}

// 记录和显示错误
function errorLog(error) {
  // // 添加到日志
  // store.dispatch('d2admin/log/push', {
  //   message: '数据请求异常',
  //   type: 'danger',
  //   meta: {
  //     error
  //   }
  // })
  // // 打印到控制台
  // if (process.env.NODE_ENV === 'development') {
  //   util.log.danger('>>>>>> Error >>>>>>')
  //   console.log(error)
  // }
  // 显示提示
  Message({
    message: error,//error.message,
    type: 'error',
    duration: 2 * 1000
  })
}

// 创建一个 axios 实例
const service = axios.create({
  baseURL: window.SITE_CONFIG["apiURL"],
  //baseURL: process.env.VUE_APP_API,
  timeout: 10000, // 请求超时时间
})

// 请求拦截器
service.interceptors.request.use(
  config => {
    config.headers['Accept-Language'] = cookieGet('language') || 'zh-CN'
    // 在请求发送之前做一些处理
    //const token = util.cookies.get('token')
    // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
    config.headers['token'] = cookieGet('token') || ''//'71f37c9f038a8f2309263df66ac40dc9'//token
    var defaults = {}
    // 防止缓存，GET请求默认带_t参数
    if (config.method === 'get') {
      //注意：后端需要content-type，config.data = true绕过axios的if判段，axios get时把content-type删了 【if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type')delete requestHeaders[key]】
      //config.headers['content-type']='application/json; charset=utf-8'
      //config.data=true
      config.params = {
        ...config.params,
        ...{ '_t': new Date().getTime() }
      }
    }
    if (isPlainObject(config.params)) {
      config.params = {
        ...defaults,
        ...config.params
      }
    }
    if (isPlainObject(config.data)) {
      config.data = {
        ...defaults,
        ...config.data
      }
      if (/^application\/x-www-form-urlencoded/.test(config.headers['content-type'])) {
        config.data = qs.stringify(config.data)
      }
    }

    config.cancelToken = new axios.CancelToken(cancel => {
      //取消请求存在全局，切换路由时执行
      window.__axiosPromiseArr.push({ cancel })
    })

    return config
  },
  error => {
    // 发送失败
    //console.log(error)
    return Promise.reject(error)
  }
)

// 响应拦截器
service.interceptors.response.use(
  response => {

    if (response.data.code === 401 || response.data.code === 10001) {  //
      store.dispatch('d2admin/account/logout')
      return Promise.reject(response.data.message)
    } else if (response.data.code !== 200 && response.data.code !== 201) { //200成功 201数据空
      errorLog(response.data.message)
      return Promise.reject(response.data.message)
    } else {
      return response.data.data
    }
  },
  error => {
    if (error && error.response) {
      switch (error.response.status) {
        case 400: error.message = '请求错误'; break
        case 401: error.message = '未授权，请登录'; break
        case 403: error.message = '拒绝访问'; break
        case 404: error.message = `请求地址出错: ${error.response.config.url}`; break
        case 408: error.message = '请求超时'; break
        case 500: error.message = '服务器内部错误'; break
        case 501: error.message = '服务未实现'; break
        case 502: error.message = '网关错误'; break
        case 503: error.message = '服务不可用'; break
        case 504: error.message = '网关超时'; break
        case 505: error.message = 'HTTP版本不受支持'; break
        default: break
      }
      errorLog(error)
      return Promise.reject(error)

    }else{
      // 处理断网的情况
      if (window.__axiosPromiseArr.length !== 0) { //非用户取消
        error.message = '请求超时';
        window.__axiosPromiseArr=[]
        errorLog(error)
        return Promise.reject(error)
      }
    }
    // if(error.message){
    //   errorLog(error)
    //   return Promise.reject(error)
    // }
  }
)


// /**
//  * get方法，对应get请求
//  * @param {String} url [请求的url地址]
//  * @param {Object} params [请求时携带的参数]
//  */
// export function get(url, params){    
//   return new Promise((resolve, reject) =>{        
//       axios.get(url, {            
//           params: params        
//       }).then(res => {
//           resolve(res);
//       }).catch(err =>{
//           reject(err.data)        
//     })    
//   });
// }

export default service
