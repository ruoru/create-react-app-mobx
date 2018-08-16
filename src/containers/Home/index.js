import './home.scss';
import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { observable, action, runInAction } from 'mobx';
import { observer } from 'mobx-react';
import { message, Modal, Input } from 'antd';
import getGateway from '../../utils/getGateway';
import environments from '../../../packages/environments';
const environment = environments[process.env.NODE_ENV];

class HomeState {
  @observable height = document.documentElement.clientHeight;
  @observable visible = false;
  @observable loading = false;

  @observable account = '';
  @observable password = '';

  constructor() {
    const self = this;
    window.onresize = () => {
      this.resetHeight();
    }

    this.load();
  }

  @action.bound
  resetHeight() {
    this.height = document.documentElement.clientHeight;
  }

  @action.bound
  async load() {
    const data = await this.getData();

    runInAction(() => {
      this.name = data.name; 1
    });
  }

  @action.bound
  async getData() {
    const response = await fetch(`//172.26.1.211:50000/module/query`, {
      method: 'POST',
      mode: 'cors',
      headers: new Headers({
        // 'Content-Type': 'application/json',
        'Accept': 'application/json',
      }),
      body: JSON.stringify({
      }),
    })
    const result = await response.json();
    return result;
  }

  @action.bound
  showModal() {
    this.visible = true;

    function loadXMLDoc() {
      let xmlhttp;
      if (window.XMLHttpRequest) { // code for IE7+, Firefox, Chrome, Opera, Safari
        xmlhttp = new XMLHttpRequest();
      }
      xmlhttp.withCredentials = true;
      xmlhttp.onreadystatechange = async function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {

          const { csrfmiddlewaretoken, csrftoken } = JSON.parse(xmlhttp.responseText);
          localStorage.setItem('csrftoken', csrftoken);
          localStorage.setItem('csrfmiddlewaretoken', csrfmiddlewaretoken);
        }
      }
      xmlhttp.open("GET", `${environment.api}/login/?format=json`, true);
      xmlhttp.send();
    }
    loadXMLDoc();
  }

  @action.bound
  async handleOk(account, password) {
    try {
      this.loading = true;
      const csrfmiddlewaretoken = localStorage.getItem('csrfmiddlewaretoken');
      const formData = new FormData();
      formData.append('username', account);
      formData.append('password', password);
      formData.append('csrfmiddlewaretoken', csrfmiddlewaretoken);
      const response = await fetch(`${environment.api}/login/?format=json`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
        },
        mode: 'cors',
        body: formData,
      });
      const body = await response.json();
      localStorage.setItem('csrftoken', body.csrftoken);
      window.location.href = `/app`;


      // const respToken = await getGateway.middleware('GET', `/login/?format=json`);
      // document.cookie = respToken.token;
      // await getGateway.middleware('POST', `/login/?format=json`, {
      //   data: {
      //     username: account,
      //     password,
      //     csrfmiddlewaretoken: respToken.token,
      //   }
      // });
      // localStorage.setItem();
      // window.location.href = `/app`;
    } catch (error) {
      message.error(`登录失败`);
    }

    this.loading = false;
    this.visible = false;
  }

  @action.bound
  handleCancel(e) {
    this.visible = false;
  }

  @action.bound
  setAccount(account) {
    this.account = account;
  }

  @action.bound
  setPassword(password) {
    this.password = password;
  }
}

@observer
class HomeView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { homeState } = this.props;
    const { height, visible, loading, account, password, showModal, handleCancel, handleOk, setAccount, setPassword } = homeState;
    return (
      <div className="home" style={{ height: `${height}px` }}>
        <div className="header">
          <ul className="left">
            <li><img src="" /></li>
          </ul>
          <ul className="right">
            <li>
              about us
            </li>
            <li>
              <button onClick={showModal}>Sign in</button>
            </li>
          </ul>
        </div>

        <div className="content">
          <h1>IP DreamWork</h1>
          <p>Join us in the world of create your own bot.</p>
          <p>To Build a vitur life what you like.</p>
          <button onClick={showModal}>Get started</button>
        </div>

        <Modal
          className="home-modal"
          title="登录"
          visible={visible}
          loading={loading}
          onOk={e => handleOk(account, password)}
          onCancel={handleCancel}
          okText="确认"
          cancelText="取消"
        >
          <ul>
            <li>
              <div className="name">账 号</div>
              <div className="description">
                <Input
                  placeholder="账号/邮箱/手机号"
                  value={account}
                  onChange={e => setAccount(e.target.value)}
                />
              </div>
            </li>
            <li>
              <div className="name">密 码</div>
              <div className="description">
                <Input
                  type="password"
                  placeholder="密码"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                />
              </div>
            </li>
          </ul>
        </Modal>
      </div>
    );
  }
}


class Home extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <HomeView homeState={new HomeState()} />
  }
}

export default withRouter(Home);