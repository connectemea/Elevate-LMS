export const api = {
  get: (url: string) => fetch(`/api${url}`).then((r) => r.json()),
  post: (url: string, body: any) =>
    fetch(`/api${url}`, { method: "POST", body: JSON.stringify(body), headers: { "Content-Type": "application/json" } }).then((r) =>
      r.json()
    ),
  put: (url: string, body: any) =>
    fetch(`/api${url}`, { method: "PUT", body: JSON.stringify(body), headers: { "Content-Type": "application/json" } }).then((r) =>
      r.json()
    ),
  delete: (url: string) => fetch(`/api${url}`, { method: "DELETE" }).then((r) => r.json()),
};
