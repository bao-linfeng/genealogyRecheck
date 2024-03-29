// const APIURL='http://192.168.1.108:8092/';
let APIURL='https://genealogydatatest.qingtime.cn/';
// APIURL = 'http://genealogydata.1jiapu.com:9041/';
if(window.location.origin.indexOf('genealogy.1jiapu.com') > -1){
    APIURL = 'https://genealogydata.1jiapu.com/';
}
// APIURL = 'https://genealogydata.1jiapu.com/';
function getAxios(url,type){
    return new Promise((resolve, reject) => {
        axios.get(type ? url : (APIURL+url))
        .then(function (response) {
            //console.log(response.data);
            resolve(response.data);
        })
        .catch(function (error) {
            //console.log(error);
            reject(error);
        });
    })
}

function postAxios(url,body,flag){
    return new Promise((resolve, reject) => {
        axios.post(flag ? url : (APIURL+url),body)
        .then(function (response) {
            //console.log(response.data);
            resolve(response.data);
        })
        .catch(function (error) {
            //console.log(error);
            reject(error);
        });
    })
}

function deleteAxios(url,body,flag){
    return new Promise((resolve, reject) => {
        axios.delete(flag ? url : (APIURL+url),{data:body})
        .then(function (response) {
            //console.log(response.data);
            resolve(response.data);
        })
        .catch(function (error) {
            //console.log(error);
            reject(error);
        });
    })
}

function patchAxios(url,body,flag){
    return new Promise((resolve, reject) => {
        axios.patch(flag ? url : (APIURL+url),body)
        .then(function (response) {
            //console.log(response.data);
            resolve(response.data);
        })
        .catch(function (error) {
            //console.log(error);
            reject(error);
        });
    })
}

function postFetch(url,query,variables){
    return new Promise((resolve, reject) => {
        fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
            },
            body: JSON.stringify({
              query,
              variables:variables,
            })
        })
        .then(r => r.json())
        .then(data => resolve(data))
        .catch(error => reject(error));
    })
}

// create an axios instance
const service = axios.create({
    baseURL: process.env.BASE_API || APIURL, // api 的 base_url
    timeout: 5000 // request timeout
})
  
// request interceptor
service.interceptors.request.use(
    config => {
        // Do something before request is sent
        if (window.localStorage.getItem('token')) {
            // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
            //config.headers['X-Token'] = window.localStorage.getItem('token')
            config.headers.Authorization = `token ${window.localStorage.getItem('token')}`;
        }
        return config
    },
    error => {
        // Do something with request error
        console.log(error) // for debug
        Promise.reject(error)
    }
)

// response interceptor
service.interceptors.response.use(
    response => response,
    /**
     * 下面的注释为通过在response里，自定义code来标示请求状态
     * 当code返回如下情况则说明权限有问题，登出并返回到登录页
     * 如想通过 xmlhttprequest 来状态码标识 逻辑可写在下面error中
     * 以下代码均为样例，请结合自生需求加以修改，若不需要，则可删除
     */
    response => {
        const res = response.data;
        if(response.status == 200){
            return Promise.resolve(res);
        }
    },
    response => {
      const res = response.data
      if (res.code !== 20000) {
        Message({
          message: res.message,
          type: 'error',
          duration: 5 * 1000
        })
        // 50008:非法的token; 50012:其他客户端登录了;  50014:Token 过期了;
        if (res.code === 50008 || res.code === 50012 || res.code === 50014) {
          // 请自行在引入 MessageBox
          // import { Message, MessageBox } from 'element-ui'
          MessageBox.confirm('你已被登出，可以取消继续留在该页面，或者重新登录', '确定登出', {
            confirmButtonText: '重新登录',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            store.dispatch('FedLogOut').then(() => {
              location.reload() // 为了重新实例化vue-router对象 避免bug
            })
          })
        }
        return Promise.reject('error')
      } else {
        return response.data
      }
    },
    error => {
        if (error.response) {
            switch (error.response.status) {
                case 401:
                    // 返回 401 清除token信息并跳转到登录页面
                    //store.commit(types.LOGOUT);
                    window.localStorage.setItem('token','');
                    router.replace({
                        path: 'login',
                        query: {redirect: router.currentRoute.fullPath}
                    })
            }
        }
        return Promise.reject(error.response.data)   // 返回接口返回的错误信息
        // console.log('err' + error) // for debug
        // return Promise.reject(error)
    }
)

export default {
    getAxios,
    postAxios,
    deleteAxios,
    patchAxios,
    postFetch,
    service,
    APIURL,
}