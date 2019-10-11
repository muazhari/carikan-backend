// add to selected, by data[keysToGet]
const getKeys = (data, keysToGet) => {
  const selected = {}
  keysToGet.forEach(keyItem => {
    if (data[keyItem]) {
      selected[keyItem] = data[keyItem]
    }
  })
  return selected
}

// delete from selected, by selected[keysToDel]
const delKeys = (data, keysToDel) => {
  const selected = data
  keysToDel.forEach(keyItem => {
    delete selected[keyItem]
  })
  return selected
}

// generate unique HexString
const setKeys = (data, keysToSet) => {
  const selected = data
  Object.keys(keysToSet).forEach(keyItem => {
    selected[keyItem] = keysToSet[keyItem]
  })
  return selected
}

export { getKeys, delKeys, setKeys }
