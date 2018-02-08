const wrapApiAction = (action, key) => {
  return {
    ...action,
    __API_STORE_KEY__: key,
  }
}

export {
  wrapApiAction,
}
