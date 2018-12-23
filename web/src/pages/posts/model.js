/* global window */
import modelExtend from 'dva-model-extend'
import { pathMatchRegexp } from 'utils'
import { message } from 'antd'
import {
  queryPosts, findPost, queryComments, addPost, addComment
} from 'api'
import { pageModel } from 'utils/model'

export default modelExtend(pageModel, {
  namespace: 'post',

  state: {
    currentItem: {},
    modalVisible: false,
    modalType: 'create',
    selectedRowKeys: [],
    status: {},
    list: [],
    commentPage: 1,
    postList : [],
    commentList: [],
    showLoading: true
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (pathMatchRegexp('/posts', location.pathname)) {
          const payload = !location.query.type ?  { page: 1, pageSize: 10, forceReset: true } : location.query
          dispatch({
            type: 'query',
            payload,
          })
        }

        const match = pathMatchRegexp('/posts/:id', location.pathname)
        if (match) {
          dispatch({ type: 'find', payload: { id: match[1] } })
          dispatch({ type: 'loadComment', payload: { id: match[1], page:1 } })
        }
        
      })
    },
  },

  effects: {
    *query({ payload = {} }, { call, put }) {
      yield put({
        type: 'setLoading',
        payload: {
          showLoading: true,
        },
      })
      const resetObj = {
        commentList: [],  commentPage:1
      };
      if(payload.forceReset){
        resetObj['postList'] = [];
      };
      yield put({
        type: 'resetState',
        payload: resetObj
      })

      const data = yield call(queryPosts, payload)
      
      if (data.success) {
        yield put({
          type: 'querySuccess',
          payload: {
            pagination: {
              current: Number(payload.page),
              pageSize: 10,
              total: data.response.data.length,
            },
          },
        })

        if(data.response.data.length === 0){
          message.success('You have viewed all the posts!')
        }

        yield put({
          type: 'setPosts',
          payload: {
            postList: data.response.data,
          },
        })

        yield put({
          type: 'setLoading',
          payload: {
            showLoading: false,
          },
        })
      }
    },

    *find({ payload = {} }, { call, put }) {
      yield put({
        type: 'setLoading',
        payload: {
          showLoading: true,
        },
      })

      const data = yield call(findPost, payload)
      console.log('fine post-----', data)
      if (data) {
        yield put({
          type: 'setPostItem',
          payload: {
            currentItem: data.response.data,
          },
        })

        yield put({
          type: 'setLoading',
          payload: {
            showLoading: false,
          },
        })
      }
    },

    *loadComment({ payload = {} }, { call, put }){
      yield put({
        type: 'setLoading',
        payload: {
          showLoading: true,
        },
      })
      if(payload.forceReset){
        const resetObj = {
          commentList: [],  commentPage:1
        };
        
        yield put({
          type: 'resetState',
          payload: resetObj
        })
      }
      const comments = yield call(queryComments, payload)
      if (comments.success) {
        yield put({
          type: 'setComments',
          payload: {
            commentList: comments.response.data,
          },
        })
        if(comments.response.data.length === 0){
          message.success('No comments to view!')
        }

        yield put({
          type: 'setCommentPage',
          payload: {
            commentPage: payload.page,
          },
        })
        yield put({
          type: 'setLoading',
          payload: {
            showLoading: false,
          },
        })
      }
    },

    *createPost({ payload = {} }, { call, put }){
      yield put({
        type: 'setLoading',
        payload: {
          showLoading: true,
        },
      })
      const comments = yield call(addPost, payload)
      if (comments.success) {
        yield put({
          type: 'setComments',
          payload: {
            commentList: comments.response.data,
          },
        })
        yield put({
          type: 'setLoading',
          payload: {
            showLoading: false,
          },
        })
      }
    },

    *createComment({ payload = {} }, { call, put }){
      yield put({
        type: 'setLoading',
        payload: {
          showLoading: true,
        },
      })
      const comments = yield call(addComment, payload)
      if (comments.success) {
        yield put({
          type: 'setLoading',
          payload: {
            showLoading: false,
          },
        })
      }
    },


  },

  reducers: {
    showModal(state, { payload }) {
      return { ...state, ...payload, modalVisible: true }
    },

    resetState(state, { payload }) {
      return { ...state, ...payload}
    },

    hideModal(state) {
      return { ...state, modalVisible: false }
    },

    setLoading(state, { payload }) {
      return { ...state, ...payload }
    },

    setCommentPage(state, { payload }) {
      return { ...state, ...payload }
    },

    setPosts(state, { payload }) {
      const {postList} = state
      return { ...state, postList: postList.concat(payload.postList) }
    },

    setComments(state, { payload }) {
      const {commentList} = state
      return { ...state, commentList: commentList.concat(payload.commentList) }
    },

    setPostItem(state, { payload }) {
      return { ...state, ...payload }
    },
  },
})
