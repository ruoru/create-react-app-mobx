class Gateway {
  constructor(domains, options) {
    this.domains = domains;
    this.options = options;
    this.middleware = this.requestMiddleware;
  }

  getCookie() {
    const docCookie = document.cookie, obj = {};

    docCookie.split(';').forEach(item => {
      const arrItem = item.split('=');
      if (arrItem[0]) {
        obj[arrItem[0]] = arrItem[1];
      }
    });

    if (!obj.csrftoken) {
      if (localStorage.getItem('csrftoken')) {
        obj.csrftoken = localStorage.getItem('csrftoken');
      } else {
        this.onAuthFail('no cookie');
      }
    }

    return obj;
  }

  generateRequestURL(method = 'GET', path = '/', filter = {}) {
    if (path.indexOf('//') !== 0 && path.indexOf('http://') !== 0 && path.indexOf('https://') !== 0) {
      path = `${this.domains.api}${path}`;
    }
    if (method === 'GET') {
      let query = '', whereFilter = filter.where;
      for (let key in whereFilter) {
        query += `&${key}=${whereFilter[key]}`;
      }
      query = query.substring(1);
      if (query) {
        path = path.indexOf('?') === -1 ? `${path}?${query}` : `${path}&${query}`;
      }
    }
    return path;
  }

  generateRequestOptions(method = 'GET', filter = {}) {
    const { csrftoken } = this.getCookie();
    const options = {
      method,
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'x-csrftoken': csrftoken,
      },
      mode: 'cors',
    };

    if (method === 'GET') {
      //delete options.headers['x-csrftoken'];
    } else if (method === 'HEAD') {

    } else {
      if (window.File && filter instanceof window.File) {
        options.body = filter;
        delete options.headers['Content-Type'];
      } else {
        options.body = JSON.stringify(Object.assign({}, filter.data, filter.where));
      }
    }

    return options;
  }

  async requestAndResponse(fetchURL, fetchOptions) {
    const response = await fetch(fetchURL, fetchOptions);
    const status = response.status;
    const body = await response.json();

    if (status === 401) {
      this.onAuthFail(body);
    } else if (status === 403) {
      alert('您没有权限，请联系管理员。');
      //window.location.href = `/`;
    } else if (!response || response.status >= 400) {
      alert('请求错误')
      let error = new Error(body.error.message);
      error.status = status;
      throw error;
    }

    return body;
  }

  async requestMiddleware(method, path, filter = {}) {
    method = method.toUpperCase();
    const url = this.generateRequestURL(method, path, filter);
    const options = this.generateRequestOptions(method, filter);
    return await this.requestAndResponse(url, options);
  }

  onAuthFail(responseBody) {
    const error = Object.assign(new Error(), responseBody);
    if (typeof this.options.onAuthFail === 'function') {
      this.options.onAuthFail(error);
    } else {
      throw new Error(error);
    }
  }

}

export default Gateway;