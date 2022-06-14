import {message} from "antd";

export const handleResponse = (response: any) => {
  return response.text().then((text: any) => {
    const data = text && JSON.parse(text);
    if (!response.ok) {
      if (response.status === 401) {
        if (response.url && response.url.indexOf("/api/v1/login") > 0) {
          return Promise.reject(data);
        } else {
          // auto logout if 401 response returned from api
          localStorage.removeItem("user");
          window.location.reload();
          message.info("Session timeout!!");
        }
      }
      const error = (data && data.message) || response.statusText;
      return Promise.reject(error);
    }
    return data;
  });
};
