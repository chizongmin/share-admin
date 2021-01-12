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
export function updateCategorySort(data) {
  return request({
    url: '/category/updateSort',
    method: 'post',
    data
  })
}

export function upsertGoods(data) {
  return request({
    url: '/goods/upsert',
    method: 'post',
    data
  })
}
export function deleteGoods(params) {
  return request({
    url: '/goods/delete',
    method: 'get',
    params: params
  })
}
export function addToCategoryList(params) {
  return request({
    url: '/goods/addToCategoryList',
    method: 'get',
    params: params
  })
}
export function addGoodsToCategory(data) {
  return request({
    url: '/category/addGoods',
    method: 'post',
    data
  })
}
export function updateGoodsSort(data) {
  return request({
    url: '/category/updateGoodsSort',
    method: 'post',
    data
  })
}
export function deleteGoodsFromCategory(params) {
  return request({
    url: '/category/deleteGoods',
    method: 'get',
    params: params
  })
}
