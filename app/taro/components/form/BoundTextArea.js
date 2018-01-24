import * as BoundForm from 'taro/components/form/BoundForm'

import TextArea from 'taro/components/form/TextArea'

const BoundTextArea = BoundForm.bindInput({
  ComponentToWrap: TextArea,
  defaultValue: '',
  bindPropMaker: (onChange) => ({
    onChange: (text) => {
      onChange(text)
    },
  }),
  valuePropMaker: (value, error) => ({
    value: value,
  }),
})

export default BoundTextArea
