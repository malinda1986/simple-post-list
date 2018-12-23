import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'
import { Form,  Modal, message, Input } from 'antd'
import {  withI18n } from '@lingui/react'

const { TextArea } = Input;

const FormItem = Form.Item


const formItemLayout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 14,
  },
}


@withI18n()
@Form.create()
class PostModal extends PureComponent {

  handleOk = () => {
    const { onOk, form, onCancel, id } = this.props
    const { validateFields, getFieldsValue } = form

    validateFields(errors => {
      if (errors) {
        return
      }
      
      const data = {
        ...getFieldsValue(),
      }
      if(data.text.length < 5){
        message.error('Please provide valid description!')
        return;
      }
      data.id = id;
      onOk(data)
      onCancel()
    })
  }

  render() {
    const { item = {}, onOk, form, loading, record, type,  ...modalProps } = this.props

    const { getFieldDecorator } = form

    const commentFields = () => {
      if(type === 'comment'){
        return (
          <div>
              <FormItem label={`Name`} hasFeedback {...formItemLayout}>
              {getFieldDecorator('name', {
                initialValue: '',
                rules: [
                  {
                    required: true,
                  },
                ],
              })(<Input />)}
            </FormItem>
            <FormItem label={`Email`} hasFeedback {...formItemLayout}>
              {getFieldDecorator('email', {
                initialValue: '',
                rules: [
                  {
                    required: true,
                    pattern: /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/,
                    message: `The input is not valid E-mail!`,
                  },
                ],
              })(<Input />)}
            </FormItem>
          </div>
        )
      }
    }

    return (
      <Modal {...modalProps} onOk={this.handleOk}
      
      >
        <Form layout="horizontal">
          {commentFields()}
          <FormItem label={`Title`} hasFeedback {...formItemLayout}>
            {getFieldDecorator('title', {
              initialValue: '',
              rules: [
                {
                  required: true,
                },
              ],
            })(<Input />)}
          </FormItem>
          <FormItem label={`Description`} hasFeedback {...formItemLayout}>
            {getFieldDecorator('text', {
              initialValue: '',
              rules: [
                {
                  required: true,
                },
              ],
            })(<TextArea rows={4}  />)}
          </FormItem>
          </Form>
      </Modal>
    )
  }
}

PostModal.propTypes = {
  type: PropTypes.string,
  item: PropTypes.object,
  onOk: PropTypes.func,
}

export default PostModal
