/**
 *
 *prefix:监听的前缀
 *actionMutationMap:如果它指定了函数，那么直接调用它来修改
 */
export default function keducer(prefix, actionMutationMap = {}) {
  return (state = {}, action) => {
    return actionMutationMap[action.type]
      ? actionMutationMap[action.type](state, action.payload)
      : action.type.indexOf(`${prefix}.`) === 0
        ? { ...state, ...action.payload }
        : state
  }
}
