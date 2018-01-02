const POLL_START = 'ff2-core.PollActions.START'
const POLL_END = 'ff2-core.PollActions.END'

const startPolling = (key, baseAction) => ({
  type: POLL_START,
  __POLL__: {
    key: key,
    action: baseAction,
  },
})

const endPolling = (key) => ({
  type: POLL_END,
  __POLL__: {
    key: key,
  },
})

export {
  POLL_START,
  POLL_END,

  startPolling,
  endPolling,
}
