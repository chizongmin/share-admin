import request from '@/utils/request'
export function index(params) {
  return request({
    url: '/config/index',
    method: 'get',
    params: params
  })
}
export function updateConfig(data) {
  return request({
    url: '/config/update',
    method: 'post',
    data
  })
}
