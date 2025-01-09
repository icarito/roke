
export function getOrSet(key, value) {
  if (localStorage.getItem(key) === null) {
    localStorage.setItem(key, value);
  }
  return localStorage.getItem(key);
}
