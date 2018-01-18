import PropTypes from 'prop-types'

const CHILDREN_TYPE = PropTypes.oneOfType([
  PropTypes.node,
  PropTypes.arrayOf(PropTypes.node),
])

const STYLE_TYPE = PropTypes.oneOfType([
  PropTypes.number,
  PropTypes.object,
  PropTypes.array,
])

// TODO: SPEC IT OUT
const PROMISE_STATE_TYPE = PropTypes.object

export {
  CHILDREN_TYPE,
  PROMISE_STATE_TYPE,
  STYLE_TYPE,
}
