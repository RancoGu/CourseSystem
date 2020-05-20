import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/vue-element-admin/user/login',
    method: 'post',
    data
  })
}

export function info() {
  return request({
    url: '/vue-element-admin/user/get_info',
    method: 'get',
    params: {}
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}

export function create(data) {
  return request({
    url: '/vue-element-admin/user/create',
    method: 'post',
    data
  })
}

export function update(data) {
  return request({
    url: '/vue-element-admin/user/update',
    method: 'post',
    data
  })
}

export function find(data) {
  return request({
    url: '/vue-element-admin/user/find',
    method: 'post',
    data
  })
}
