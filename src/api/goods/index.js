import request from '@/utils/request'

export function goodsList(params) {
  return request({
    url: '/goods/editList',
    method: 'get',
    params: params
  })
}
export function categoryList(params) {
  return request({
    url: '/category/editList',
    method: 'get',
    params: params
  })
}
export function updateCategory(data) {
  return request({
    url: '/category/updateInfo',
    method: 'post',
    data
  })
}
