import * as BoundForm from 'taro/components/form/BoundForm'

import TextField from 'taro/components/form/TextField'

const BoundTextField = BoundForm.bindInput({
  ComponentToWrap: TextField,
  defaultValue: '',
  bindPropMaker: (onChange) => ({
    onChange: (text) => {
      onChange(text)
    },
  }),
  valuePropMaker: (value, error) => ({
    value: value,
  }),
  otherPropMaker: () => ({
    placeholderTextColor: '#fff',
  }),
})

export default BoundTextField
