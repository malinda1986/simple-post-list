import request from 'utils/request'
import { apiPrefix } from 'utils/config'

import api from './api'

const gen = params => {
  let url = apiPrefix + params
  let method = 'GET'

  const paramsArray = params.split(' ')
  if (paramsArray.length === 2) {
    method = paramsArray[0]
    url = apiPrefix + paramsArray[1]
  }

  return function(data) {
    return request({
      url,
      data,
      method,
    })
  }
}

const APIFunction = {}
for (const key in api) {
  APIFunction[key] = gen(api[key])
}


APIFunction.queryPosts = params => {

  return request({
    url: `${apiPrefix}/posts`,
    data: params,
  })
}

APIFunction.findPost = params => {

  return request({
    url: `${apiPrefix}/posts/:id`,
    data: params,
  })
}

APIFunction.queryComments = params => {

  return request({
    url: `${apiPrefix}/posts/:id/comment`,
    data: params,
  })
}

APIFunction.addPost = params => {

  return request({
    url: `${apiPrefix}/posts`,
    data: params,
    method: 'post'
  })
}

APIFunction.addComment = params => {

  return request({
    url: `${apiPrefix}/posts/:id/comment`,
    data: params,
    method: 'post'
  })
}

module.exports = APIFunction