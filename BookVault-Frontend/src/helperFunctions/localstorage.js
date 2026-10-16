export function getLocalUsername() {
  const res = localStorage.getItem("username");
  return res;
}

