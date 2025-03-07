import { fetchUtils } from "react-admin";
import simpleRestProvider from "ra-data-simple-rest";
import { tokenManager } from "./utils/tokenManager";
import { json } from "stream/consumers";
import { NONAME } from "dns";

export const apibase = "http://127.0.0.1:8000/api/files"
export const api = "http://127.0.0.1:8000/media/"
const httpClient = fetchUtils.fetchJson;

// Base provider
const baseDataProvider = simpleRestProvider(apibase);

const customDataProvider = {
  ...baseDataProvider,
  
      create: async (resource, params) => {
            return httpClient(`${apibase}/change-password/`, {
                method: "POST",
                body: JSON.stringify(params.data),
                headers: new Headers({
                    "Content-Type": "application/json",
                    Accept: "application/json",
                    Authorization: `Bearer ${await tokenManager.getAuthHeaders()}`,
                }),
            }).then(({ json }) => ({ data: json }))
              .catch(error => {
                // Re-throw the error to be caught by React Admin's mutationOptions.onError
                throw error;
              });
        
        return baseDataProvider.create(resource, params);
    },

    getList: async (resource, params) => {
      const resourceFilters = {
        approvals: { url: "list/", filter: { approved: "unapproved", disapproval_reason : null } },
        department_files: { url: "list/", filter: { approved: "approved" } },
        libapprovals: { url: "list/", filter: { approved: false } },
      };
    
      const filterConfig = resourceFilters[resource] || { url: resource, filter: {} };
      const url = filterConfig.url;
    
      // Check if params.filter is null, undefined, or an empty object
      const isFilterEmpty = !params.filter || Object.keys(params.filter).length === 0;
      const filterParams = isFilterEmpty ? filterConfig.filter : params.filter;
    
      const query = {
        ...filterParams
      };
    
      const queryString = fetchUtils.queryParameters(query);
    
      const fullUrl = `${apibase}/${url}?${queryString}`;
    
      const options = {
        headers: new Headers({
          Authorization: `Bearer ${await tokenManager.getAuthHeaders()}`,
        }),
      }
    
      try {
        const { json } = await httpClient(fullUrl, options);
        return {
          data: json,
          total: json.length, // Assuming the backend returns the total count
        };
      } catch (error) {
        console.error("Error fetching list:", error);
        throw new Error("Failed to fetch list");
      }
    },

  getdepartemnt: async (resource, params) => {
    try {
      const url = `${apibase}/${resource}/`;
      const options = {
        headers: new Headers({
          Authorization: `Bearer ${await tokenManager.getAuthHeaders()}`,
        }),
      };
      const res = await httpClient(url,options);
      return JSON.parse(res.body);
    } catch (error) {
      console.error("Error fetching resource:", error);
      throw new Error("Failed to fetch resource");
    }
  },



  getOne: async (resource, params) => {
    try {
      const resourceFilters = {
        department_files: { url: 'list/' },
        libapprovals : {url : 'list/'},
        approvals : {url :  'list/'}
      };

      const url = `${apibase}/${resourceFilters[resource].url}?id=${params.id}`;
      const options = {
        headers: new Headers({
          Authorization: `Bearer ${await tokenManager.getAuthHeaders()}`,
        }),
      };

      const { json } = await httpClient(url, options);

      // Ensure the returned data includes all necessary fields
      return { data: json[0] };
    } catch (error) {
      console.error('Error fetching resource:', error);
      throw new Error('Failed to fetch resource');
    }
  },

  createfile: async (resource, params) => {
      const formData = new FormData();
      formData.append("title", params.data.title);
      formData.append("author", params.data.author);
      formData.append("description", params.data.description);
      formData.append("file", params.data.file.rawFile);
      formData.append("department_id", params.data?.departemnt_id);
  
      const token =  await tokenManager.getAuthHeaders()

      return fetch(`${apibase + resource}`, {
        method: "POST",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }).then((response) => {
        if (!response.ok) {
          throw new Error("Failed to upload the file");
        }
        return response.json();
      });
  },

  update: async (resource, params) => {
    const url = `${apibase}/update/${params.id}/`; // Ensure your backend accepts this format
    const formData = new FormData();
    formData.append("title", params.data.title);
    formData.append("author", params.data.author);
    formData.append("description", params.data.description);
    formData.append("file", params.data?.file?.rawFile);

    return httpClient(url, {
      method: "PUT",
      body: formData,
      headers: new Headers({
        // Do not set Content-Type when using FormData
        Accept: "application/json",
        Authorization: `Bearer ${await tokenManager.getAuthHeaders()}`,
      }),
    }).then(({ json }) => ({ data: json }));
  },

  delete: async (resource, params) => {
    const url = `${apibase}/delete/${params.id}/`;
    return httpClient(url, {
      method: "DELETE",
      headers: new Headers({
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${await tokenManager.getAuthHeaders()}`,
      }),
    }).then(({ json }) => ({ data: json }));
  },
  updateAppprove : async (resource,id,data) =>{
    const url = `${apibase}/approval/${id}/`;
    return httpClient(url, {
      method: "post",
      headers: new Headers({
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${await tokenManager.getAuthHeaders()}`,
      }
    ),
    body : JSON.stringify(data)
   })
  }
};



export default customDataProvider;


