function noargActionCreator(type) {
  return () => ({
    type: type,
  })
}

export {
  noargActionCreator,
}
