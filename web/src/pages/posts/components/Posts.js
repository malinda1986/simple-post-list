import { Button } from 'antd';
import React, { PureComponent } from 'react'
import { withI18n } from '@lingui/react'
import styles from './List.less'

import List from './List'

@withI18n()
class ListPane extends PureComponent {

  render() {

    const { list } = this.props    
    const AddItem = () => {
        return (
          <Button type="primary" icon="plus" onClick={()=>{list.onShowItem()}}>Add Post</Button>
        )
    }
  
    return (
        <div>
          {AddItem()}
          <List {...list} />    
        </div>
       
    )
  }
}

export default ListPane