export const setFuck = () => {
  const random = parseInt(Math.random() * 10);
  return {
    type: 'auth.Fuck' + random,
    payload: {
      ["name"+random]: 'Fuck' + random
    }
  }
}


export const setEdit = () => {
  const random = parseInt(Math.random() * 10);
  return {
    type: 'edit.Fuck' + random,
    payload: {
      ["name"+random]: 'edit' + random
    }
  }
}
