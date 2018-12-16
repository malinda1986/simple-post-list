import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Table, Divider, Button, Avatar} from 'antd'
import { Trans, withI18n } from '@lingui/react'
import styles from './List.less'


@withI18n()
class List extends PureComponent {

  render() {
    const { onDeleteItem, onEditItem, i18n, ...tableProps } = this.props
    const {onShowItem} = tableProps

    const columns = [
      {
        title: <Trans>Flight No</Trans>,
        dataIndex: 'flight_number',
        key: 'flight_number',
        width:120,
        defaultSortOrder: 'ascend',
        sorter: (a, b) => a.flight_number - b.flight_number,
        render: (text, record) => (
          <span>
            <Avatar  style={{ backgroundColor: '#00a2ae', verticalAlign: 'middle' }} size="small" onClick={()=>{onShowItem(record)}}> {record.flight_number} </Avatar>
          </span>
        ),
      },
      
      {
        title: <Trans>Mission Name</Trans>,
        dataIndex: 'mission_name',
        key: 'mission_name',
      },
      
      {
        title: <Trans>Year</Trans>,
        dataIndex: 'launch_year',
        key: 'launch_year',
        defaultSortOrder: 'ascend',
        sorter: (a, b) => a.launch_year - b.launch_year,
      },
      
      {
        title: <Trans>Site Name</Trans>,
        dataIndex: 'launch_site.site_name',
        key: 'launch_site.site_name',
      },
      {
        title: 'Action',
        key: 'action',
        render: (text, record) => (
          <span>
            <Button onClick={()=>{onShowItem(record)}}> View </Button>
            <Divider type="vertical" />
          </span>
        ),
      }
    ]

    return (
      <Table
        columns={columns} dataSource={tableProps.dataSource} pagination={{ pageSize: 10 }} scroll={{ x: 1200 }}
      />
    )
  }
}

List.propTypes = {
  onDeleteItem: PropTypes.func,
  onEditItem: PropTypes.func,
  location: PropTypes.object,
}

export default List
