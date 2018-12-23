/* global document */
import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'
import { Trans, withI18n } from '@lingui/react'
import { Form, Button, Row, Col, AutoComplete } from 'antd'

const ColProps = {
  xs: 24,
  sm: 12,
  style: {
    marginBottom: 16,
  },
}

const TwoColProps = {
  ...ColProps,
  xl: 96,
}

@withI18n()
@Form.create()
class Filter extends PureComponent {
  handleFields = fields => {    
    return fields
  }

  handleSubmit = () => {
    const {  form , onItemSearch} = this.props
    const { getFieldsValue } = form

    let fields = getFieldsValue()
    fields = this.handleFields(fields)
   
    onItemSearch(fields)
  }

  handleReset = () => {
    const { form } = this.props
    const { getFieldsValue, setFieldsValue } = form

    const fields = getFieldsValue()
    for (let item in fields) {
      if ({}.hasOwnProperty.call(fields, item)) {
        if (fields[item] instanceof Array) {
          fields[item] = []
        } else {
          fields[item] = undefined
        }
      }
    }
    setFieldsValue(fields)
    this.handleSubmit()
  }
  handleChange = (key, values) => {
    const { form, onFilterChange } = this.props
    const { getFieldsValue } = form

    let fields = getFieldsValue()
    fields[key] = values
    fields = this.handleFields(fields)
    onFilterChange(fields)
  }


  render() {
    const { form, ...filter } = this.props
    const { getFieldDecorator } = form
    const { list = [] } = filter
   
    let dataSource = []
    if(list && _.isArray(list) > 0 && !_.isEmpty(list)){
      dataSource = list.map(val => {
        if(val){
          return val.launch_site.site_name
        }
      });
  
    }
     
   

    return (
      <Row gutter={24}>
        
        <Col {...ColProps} xl={{ span: 4 }} md={{ span: 8 }}>
          {getFieldDecorator('site_name', { initialValue: '' })(
            <AutoComplete
            id="site_name"
            className="global-search"
            size="default"
            style={{ width: '90%' }}
            dataSource={_.uniq(dataSource)}
            onSelect={this.handleSearch}
            onSearch={this.handleSearch}
            placeholder="Search by site name"
            filterOption={(inputValue, option) => option.props.children.toUpperCase().indexOf(inputValue.toUpperCase()) !== -1}

          >
            
          </AutoComplete>
          )}
        </Col>
        
     
        <Col
          {...TwoColProps}
          xl={{ span: 10 }}
          md={{ span: 24 }}
          sm={{ span: 24 }}
        >
          <Row type="flex" align="middle" justify="space-between">
            <div>
              <Button
                type="primary"
                className="margin-right"
                onClick={this.handleSubmit}
              >
                <Trans>Search</Trans>
              </Button>
              <Button onClick={this.handleReset}>
                <Trans>Reset</Trans>
              </Button>
            </div>
            
          </Row>
        </Col>
      </Row>
    )
  }
}

Filter.propTypes = {
  onAdd: PropTypes.func,
  form: PropTypes.object,
  filter: PropTypes.object,
  onFilterChange: PropTypes.func,
}

export default Filter
