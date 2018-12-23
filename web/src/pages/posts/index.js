import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { router } from 'utils'
import { connect } from 'dva'
import { withI18n } from '@lingui/react'
import { Page } from 'components'
import { stringify } from 'qs'
import { routerRedux } from 'dva/router'

import Modal from './components/Modal'
import Posts from './components/Posts'

@withI18n()
@connect(({ post, loading }) => ({ post, loading }))
class Post extends PureComponent {
  render() {
    const { location, dispatch, loading, post } = this.props
   
    const { query, pathname } = location
    const {
      list,
      postList,
      pagination,
      currentItem,
      modalVisible,
      modalType,
      showLoading,
      selectedTab,
      commentList,
      record,
      commentPage,
    } = post
    console.log('post list====', postList)
    const handleRefresh = newQuery => {
      router.push({
        pathname,
        search: stringify(
          {
            ...query,
            ...newQuery,
          },
          { arrayFormat: 'repeat' }
        ),
      })
    }

    const modalProps = {
      item: currentItem,
      visible: modalVisible,
      record,
      maskClosable: false,
      confirmLoading: loading.effects[`post/${modalType}`],
      title: `Create Post`,
      wrapClassName: 'vertical-center-modal',
      onOk(data) {
        dispatch({
          type: `post/createPost`,
          payload: data,
        }).then(() => {
          handleRefresh()
        })
      },
      onCancel() {
        dispatch({
          type: 'post/hideModal',
        })
      },
      afterClose(){
        dispatch({
          type: 'post/updateState',
          payload: {currentItem: {}}
        })
      }
      
    }

    const listProps = {
      dataSource: postList,
      handleRefresh,
      commentList,
      commentPage,
      showLoading,
      loading: loading.effects['post/query'],
      pagination,
      onChange(page) {
        handleRefresh({
          page: page.current,
          pageSize: page.pageSize,
        })
      },
      onShowItem(item) {
        dispatch({
          type: 'post/showModal',
          payload: {
            modalType: 'update',
            currentItem: item,
          },
        })
      },
      viewMore(id){
        routerRedux.push(`post/${id}`)
      },
      loadMore(page){
        dispatch({
          type: 'post/query',
          payload: {
            page
          },
        })
      },
      loadMoreComment(page){
        dispatch({
          type: 'post/loadComment',
          payload: {
            page
          },
        })
      }
      
    }

    const filterProps = {
      filter: {
        ...query,
      },
      list,
      onTextEnter(data) {
        dispatch({
          type: `post/nameSearch`,
          payload: {query: {name:data}},
        })
      },
      onFilterChange(value) {
        handleRefresh({
          ...value,
          page: 1,
        })
      },
      onItemSearch(value) {
        value.type = selectedTab
        dispatch({
          type: `post/itemSearch`,
          payload: value,
        })
      },
      onAdd() {
        dispatch({
          type: 'post/showModal',
          payload: {
            modalType: 'create',
          },
        })
      },
    }

    return (
      <Page inner>
        <Posts filter = {filterProps} list={listProps}/>
        {modalVisible === true ? <Modal {...modalProps}/> : ''}
      </Page>
    )
  }
}

Post.propTypes = {
  post: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default Post
