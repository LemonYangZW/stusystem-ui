import request from '@/utils/request'
import { praseStrEmpty } from '@/utils/index'

// 登陆
export function login (data) {
  return request({
    url: '/login',
    method: 'post',
    data
  })
}

// 获取用户信息
export function getInfo (token) {
  return request({
    url: '/getInfo',
    method: 'get',
    params: { token }
  })
}

// 登出
export function logout () {
  return request({
    url: '/logout',
    method: 'post'
  })
}

// 查询用户列表
export function getUserInfoList (query) {
  return request({
    url: '/system/user/getUserInfoList',
    method: 'get',
    params: query
  })
}

// 获取用户基础参数
export function getUserBaseParam (userId) {
  return request({
    url: '/system/user/' + praseStrEmpty(userId),
    method: 'get',
    params: userId
  })
}
