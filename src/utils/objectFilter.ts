interface ObjectWithStringKey {
  [key: string]: any
}

export function objectRemoveKey(
  obj: ObjectWithStringKey,
  keyToRemove: string
): ObjectWithStringKey {
  return Object.keys(obj)
    .filter((key) => key !== keyToRemove)
    .reduce((newObj: ObjectWithStringKey, newKey) => {
      newObj[newKey] = obj[newKey]
      return newObj
    }, {})
}
