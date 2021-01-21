import request from '@/utils/request'
export function addressList(params) {
  return request({
    url: '/address/list',
    method: 'get',
    params: params
  })
}
export function upsertAddress(data) {
  return request({
    url: '/address/upsert',
    method: 'post',
    data
  })
}
export function updateSort(data) {
  return request({
    url: '/address/updateSort',
    method: 'post',
    data
  })
}
