import { fetchUtils } from "react-admin";

const apiUrl = "http://127.0.0.1:8000/api";
const httpClient = fetchUtils.fetchJson;

export const dataProvider = {
  // Fetch files
  getList: async (resource, params) => {
    const url = `${apiUrl}/${resource}/`;
    return httpClient(url).then(({ json }) => ({
      data: json.results,
      total: json.count,
    }));
  },

  // Fetch single file
  getOne: (resource, params) => {
    return httpClient(`${apiUrl}/${resource}/${params.id}/`).then(({ json }) => ({
      data: json,
    }));
  },

  // Upload file
  create: (resource, params) => {
    const formData = new FormData();
    formData.append("file", params.data.file.rawFile);
    formData.append("title", params.data.title);
    formData.append("author", params.data.author);
    formData.append("type", params.data.type);

    return httpClient(`${apiUrl}/${resource}/`, {
      method: "POST",
      body: formData,
    }).then(({ json }) => ({ data: json }));
  },

  // Update file
  update: (resource, params) => {
    return httpClient(`${apiUrl}/${resource}/${params.id}/`, {
      method: "PATCH",
      body: JSON.stringify(params.data),
    }).then(({ json }) => ({ data: json }));
  },

  // Delete file
  delete: (resource, params) => {
    return httpClient(`${apiUrl}/${resource}/${params.id}/`, {
      method: "DELETE",
    }).then(({ json }) => ({ data: json }));
  },
};
