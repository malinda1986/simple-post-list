import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { List, Badge, Button, Skeleton, Icon} from 'antd'
import { Trans, withI18n } from '@lingui/react'
import styles from './List.less'
import { Link } from 'react-router-dom'



@withI18n()
class PostList extends PureComponent {

  render() {
    const { onDeleteItem, onEditItem, i18n, ...listProps } = this.props
    const { showLoading, dataSource, loadMore, pagination} = listProps

    const IconText = ({ type, text }) => (
      <span>
        <Icon type={type} style={{ marginRight: 8, color:'#5ea21b' }} />
        {text}
        {/* <Badge count={5}></Badge> */}
      </span>
    );

    const ViewText = ({ type, text, id }) => (
      <span>
        <Link  to={`/posts/${id}`}>
          <Button icon={type} type="primary" ghost >{text}</Button>
        </Link>
       
      </span>
    );

    const onLoadMore = () => {
      let {current} = pagination;
      current++
      loadMore(current)
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


    return (
      <List
        className={styles.listView}
        loading={showLoading}
        itemLayout="horizontal"
        loadMore={loadMoreText}
        dataSource={dataSource}
        renderItem={item => (
          <List.Item actions={
            [<IconText type="message" text={item.comments.length} />, <ViewText type="bars" text="View" id={item.id} />]
            }>
            <Skeleton avatar title={false} loading={showLoading} active>
              <List.Item.Meta
               
                title={<Link  to={`/posts/${item.id}`}>{item.title}</Link>}
                description={`${item.body.substring(0, 100)} ...`}
              />
              
            </Skeleton>
          </List.Item>
        )}
      />
    )
  }
}

PostList.propTypes = {
  onDeleteItem: PropTypes.func,
  onEditItem: PropTypes.func,
  location: PropTypes.object,
}

export default PostList
