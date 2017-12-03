const randomKeys = [];
export function generateRandomKey() {
  let key = Math.random().toString().substring(2);
  while (randomKeys.includes(key)) {
    key = Math.random().toString().substring(2);
  }
  return key;
}
