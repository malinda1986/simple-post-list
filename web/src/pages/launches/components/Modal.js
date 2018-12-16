import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Form,  Modal, Avatar, Icon, Spin,List } from 'antd'
import { Trans, withI18n } from '@lingui/react'


const FormItem = Form.Item



const IconText = ({ type, text }) => (
  <span>
    <Icon type={type} style={{ marginRight: 8 }} />
    {text}
  </span>
);

@withI18n()
@Form.create()
class SpaceXModal extends PureComponent {

  render() {
    const { item = {}, onOk, form, i18n, loading, record,  ...modalProps } = this.props

    const listData = [];
    for (let i = 0; i < 1; i++) {
      listData.push({
        href: '#',
        title: item.launch_site.site_name_long,
        avatar: <Icon type={'rocket'}></Icon>,
        description: item.details,
        ...item,
      });
    }




    console.log(item)
    return (
      <Modal {...modalProps} onOk={this.handleOk}
      footer={null}
      >
        <List
            itemLayout="vertical"
            size="large"
          
            dataSource={listData}
            
            renderItem={item => (
              <List.Item
                key={item.title}
                actions={[<IconText type="calendar" text={item.launch_date_local} />]}
              >
                <List.Item.Meta
                  avatar={<Icon type='rocket' />}
                  title={<a href={item.href}>{item.title}</a>}
                  description={item.description}
                />
                {item.content}
              </List.Item>
            )}
        />
      </Modal>
    )
  }
}

SpaceXModal.propTypes = {
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
}

export default SpaceXModal
