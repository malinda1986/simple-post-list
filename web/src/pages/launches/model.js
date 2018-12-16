/* global window */
import modelExtend from 'dva-model-extend'
import { pathMatchRegexp } from 'utils'

import {
  queryLaunches,
} from 'api'
import { pageModel } from 'utils/model'

export default modelExtend(pageModel, {
  namespace: 'spaceXModel',

  state: {
    currentItem: {},
    modalVisible: false,
    modalType: 'create',
    selectedRowKeys: [],
    status: {},
    record: {count : 0},
    selectedTab:  'upcoming',
    searchKey: '',
    showLoading: true
  },

  subscriptions: {
    setup({ dispatch, history }) {
      history.listen(location => {
        if (pathMatchRegexp('/launches', location.pathname)) {
          const payload = !location.query.type ?  { page: 1, pageSize: 10, type:'upcoming' } : location.query
          dispatch({
            type: 'query',
            payload,
          })
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

      yield put({
        type: 'querySuccess',
        payload: {
          list: [],
        },
      })

      yield put({
        type: 'setTab',
        payload: {
          selectedTab: payload.type,
        },
      })

      const data = yield call(queryLaunches, payload)
      if (data) {
        let selectedTab = payload.type;
        
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.response,
            selectedTab,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: 10,
              total: data.response.length,
            },
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




    *itemSearch({ payload = {} }, { call, put }) {
      yield put({
        type: 'setLoading',
        payload: {
          showLoading: true,
        },
      })

      const data = yield call(queryLaunches, payload)
      let selectedTab = payload.type;
      yield put({
        type: 'setTab',
        payload: {
          selectedTab: payload.type,
        },
      })
      if (data) {
        yield put({
          type: 'querySuccess',
          payload: {
            list: data.response,
            selectedTab,
            pagination: {
              current: Number(payload.page) || 1,
              pageSize: 10,
              total: data.response.length,
            },
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

  },

  reducers: {
    showModal(state, { payload }) {
      return { ...state, ...payload, modalVisible: true }
    },

    hideModal(state) {
      return { ...state, modalVisible: false }
    },

    setLoading(state, { payload }) {
      return { ...state, ...payload }
    },

    setTab(state, { payload }) {
      return { ...state, ...payload }
    },
  },
})
