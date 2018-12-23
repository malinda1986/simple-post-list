import React, { PureComponent } from 'react'
import { Page } from 'components'
import PropTypes from 'prop-types'
import { connect } from 'dva'
import { router } from 'utils'
import { stringify } from 'qs'

import styles from '../components/List.less'
import moment from 'moment'
import { Skeleton, List, Card, Icon, Button } from 'antd';
import CommentModal from '../components/Modal'
const { Meta } = Card;


@connect(({ post }) => ({ post }))
class PostDetail extends PureComponent {
  
  render() {
    const { post , dispatch, match, location} = this.props
    const { query, pathname } = location

    let { currentItem = {}, showLoading, commentPage, commentList = [], modalVisible } = post
    
    const IconText = ({ type, text }) => (
        <span>
          { moment(text).format('LLLL') }
        </span>
    );


    console.log('comments------', commentList)

  
    const onLoadMore = () => {
      commentPage++
      dispatch({
          type: 'post/loadComment',
          payload: {
            page: commentPage,
            id: match.params.id,
          },
        })
      window.dispatchEvent(new Event('resize'));
    }

      const loadMoreText =  !showLoading ? (
        <div style={{
          textAlign: 'center', marginTop: 12, height: 32, lineHeight: '32px',
        }}
        >
          <Button onClick={onLoadMore}>Load more</Button>
        </div>
      ) : null;

    const PostContent = () => {
        return (
            <Card
                style={{ width: '100%', marginTop: 16, boxShadow:'2px 1px 1px 1px #bcd5ec', borderRadius:4 }}
                // actions={[ <Icon type="tag" />]}
                >
                <Skeleton loading={showLoading} avatar active>
                    <Meta
                    title={`${currentItem.title}`}
                    description={currentItem.body}
                    />
                </Skeleton>
            </Card>
        )
    }

    const CommentContent = () => {
        return (
            <List
                style={{marginLeft:20}}
                className="demo-loadmore-list"
                loading={showLoading}
                itemLayout="horizontal"
                loadMore={loadMoreText}
                dataSource={commentList}
                renderItem={item => (
                <List.Item actions={
                    [<IconText type="message" text={item.comments.id} />]
                    }>
                    <Skeleton avatar title={false} loading={showLoading} active>
                    <List.Item.Meta
                    
                        title={`${item.comments.body}`}
                        description={`${item.comments.name} - ${item.comments.email}`}
                    />
                    
                    </Skeleton>
                </List.Item>
                )}
            />
        )
    }

    const onShowItem = () => {
      dispatch({
        type: 'post/showModal',
        payload: {
          modalType: 'update',
        },
      })
    }
    const AddItem = () => {
      return (
        <Button type="primary" icon="plus" onClick={()=>{onShowItem()}}>Add Comment</Button>
      )
    }

    const modelProps = {
      item: currentItem,
      visible: modalVisible,
      maskClosable: false,
      type: 'comment',
      id: match.params.id,
      title: `Add Comment`,
      wrapClassName: 'vertical-center-modal',
      onOk(data) {
        dispatch({
          type: `post/createComment`,
          payload: data,
        }).then(() => {
         // handleRefresh()
         dispatch({ type: 'post/find', payload: { id: match.params.id } })
         dispatch({
          type: 'post/loadComment',
          payload: {
            page: commentPage,
            id:  match.params.id,
            forceReset: true
          },
        })
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


    return (
      <Page inner>
         {modalVisible === true ? <CommentModal {...modelProps}/> : ''}
        {AddItem()}
        <div >{PostContent()}</div>
        <div >{commentList.length > 0 ? CommentContent(): ''}</div>
      </Page>
    )
  }
}

PostDetail.propTypes = {
  post: PropTypes.object,
}

export default PostDetail