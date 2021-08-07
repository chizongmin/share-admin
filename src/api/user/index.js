import request from '@/utils/request'

export function list(params) {
  return request({
    url: '/user/list',
    method: 'get',
    params: params
  })
}
export function filterAddress() {
  return request({
    url: '/address/filterList',
    method: 'get'
  })
}
