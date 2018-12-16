import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { router } from 'utils'
import { connect } from 'dva'
import { Row, Col, Button, Popconfirm } from 'antd'
import { withI18n } from '@lingui/react'
import { Page } from 'components'
import { stringify } from 'qs'
import Filter from './components/Filter'
import Modal from './components/Modal'
import Tabs from './components/Tabs'

@withI18n()
@connect(({ spaceXModel, loading }) => ({ spaceXModel, loading }))
class SpaceX extends PureComponent {
  render() {
    const { location, dispatch, spaceXModel, loading, i18n } = this.props
   
    const { query, pathname } = location
    const {
      list,
      pagination,
      currentItem,
      modalVisible,
      modalType,
      showLoading,
      selectedTab,
      record,
    } = spaceXModel
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
      confirmLoading: loading.effects[`spaceXModel/${modalType}`],
      title: `${
        currentItem.mission_name 
      } / Flight Number: ${currentItem.flight_number}`,
      wrapClassName: 'vertical-center-modal',
      onOk(data) {
        dispatch({
          type: `spaceXModel/${modalType}`,
          payload: data,
        }).then(() => {
          handleRefresh()
        })
      },
      onCancel() {
        dispatch({
          type: 'spaceXModel/hideModal',
        })
      },
      afterClose(){
        dispatch({
          type: 'spaceXModel/updateState',
          payload: {currentItem: {}}
        })
      }
      
    }

    const listProps = {
      dataSource: list,
      showLoading,
      loading: loading.effects['spaceXModel/query'],
      pagination,
      onChange(page) {
        handleRefresh({
          page: page.current,
          pageSize: page.pageSize,
        })
      },
      onShowItem(item) {
        dispatch({
          type: 'spaceXModel/showModal',
          payload: {
            modalType: 'update',
            currentItem: item,
          },
        })
      },
      tabAction(type){
        dispatch({
          type: 'spaceXModel/query',
          payload: {
            type,
            selectedTab: type
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
          type: `spaceXModel/nameSearch`,
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
          type: `spaceXModel/itemSearch`,
          payload: value,
        })
      },
      onAdd() {
        dispatch({
          type: 'spaceXModel/showModal',
          payload: {
            modalType: 'create',
          },
        })
      },
    }

    return (
      <Page inner>
        <Tabs filter = {filterProps} list={listProps}/>
        {modalVisible === true ? <Modal {...modalProps}/> : ''}
      </Page>
    )
  }
}

SpaceX.propTypes = {
  spaceXModel: PropTypes.object,
  location: PropTypes.object,
  dispatch: PropTypes.func,
  loading: PropTypes.object,
}

export default SpaceX
