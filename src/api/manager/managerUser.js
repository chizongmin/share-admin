import request from '@/utils/request'

export function changePassword(params) {
  return request({
    url: '/vue-admin-template/user/changePassword',
    method: 'post',
    params
  })
}
