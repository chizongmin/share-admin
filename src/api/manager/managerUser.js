import request from '@/utils/request'
export function login(data) {
  return request({
    url: '/login/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/manager/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/manager/logout',
    method: 'post'
  })
}

export function changePassword(params) {
  return request({
    url: '/manager/changePassword',
    method: 'post',
    params
  })
}
