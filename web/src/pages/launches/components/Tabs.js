import { Tabs, Badge, Spin } from 'antd';
import React, { PureComponent } from 'react'
import { withI18n } from '@lingui/react'
import styles from './List.less'

import List from './List'
import Filter from './Filter'

const TabPane = Tabs.TabPane;

@withI18n()
class TabsPane extends PureComponent {

  render() {
    const { active = 'upcoming', filter, list } = this.props
   
    const {tabAction, showLoading} = list
    const onClinkTab = (tab) => {
        tabAction(tab)
    }

    return (
        <Spin spinning={showLoading} tip={'Please wait...'}>
            <Tabs onTabClick={onClinkTab} defaultActiveKey={active}>
                <TabPane  tab={<span> <Badge status="processing" text="" />Upcoming launches</span>} key="upcoming">
                    <Filter {...filter}/>
                    <List {...list} />
                </TabPane>
                <TabPane tab={<span> <Badge status="success" />Past launches</span>} key="launches">
                    <Filter {...filter}/>
                    <List {...list} />
                </TabPane>
            </Tabs>
        </Spin>
        
    )
  }
}

export default TabsPane