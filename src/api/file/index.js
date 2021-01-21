import request from '@/utils/request'
export function upload(data) {
  return request({
    url: '/file/upload',
    method: 'post',
    data
  })
}
export function preview(params) {
  return request({
    url: '/file/preview',
    method: 'get',
    params: params
  })
}
