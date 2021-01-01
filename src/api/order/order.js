import request from '@/utils/request'

export function list(params) {
  return request({
    url: '/order/list',
    method: 'get',
    params: params
  })
}
