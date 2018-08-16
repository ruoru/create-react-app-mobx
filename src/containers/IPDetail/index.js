import './ip-detail.scss';
import React, { Component } from 'react';
import { Switch, Route, Redirect, withRouter } from "react-router-dom";
import { observable, action, runInAction } from "mobx";
import { observer } from "mobx-react";
import { message, Layout, Menu, Icon, Button } from 'antd';
import IPInfo from '../IPInfo';
import IPInfoSkill from '../IPInfoSkill';
import IPInfoCorpus from '../IPInfoCorpus';
import IPInfoCorpuPackage from '../IPInfoCorpuPackage';

import Bot from '../Bot';
import getGateway from '../../utils/getGateway';

import environments from '../../../packages/environments';
const environment = environments[process.env.NODE_ENV];

class IPDeatilState {
  @observable id = '';
  @observable info = {};
  @observable visible = false;

  constructor(id) {
    this.id = id;
    this.loadData(id);
  }

  @action.bound
  async loadData(id) {
    try {
      const response = await getGateway.middleware('GET', `/bots/${id}/?format=json`);
      this.info = response;
    } catch (error) {
      message.error('请求 bot 详情出错');
    }
  }

  @action.bound
  onVisibleModal (visible) {
    this.visible = !visible;
  }
}

@observer
class IPDeatilView extends Component {
  constructor(props) {
    super(props);

    let defaultSelectedKeys = [];
    ['info', 'skill', 'corpus', 'corpu-package'].forEach(item => {
      if(window.location.pathname.indexOf(item) > -1) {
        defaultSelectedKeys.push(item);
      }
    });
    this.defaultSelectedKeys = defaultSelectedKeys;
  }

  componentDidMount() {
    document.getElementById('ip-detail').style.minHeight = `${document.documentElement.clientHeight - 60 - 65}px`;
    window.onresize = () => {
      document.getElementById('ip-detail').style.minHeight = `${document.documentElement.clientHeight - 60 - 65}px`;
    }
  }

  render() {
    const { history, appState } = this.props;
    const { id, visible, info, onVisibleModal } = appState;

    return (
      <div className="ip-detail">
        <div className="title">
          <h2>{info.name}</h2>
          <Button className="test-bot" type="primary" shape="circle" icon="message" size="small" onClick={e => onVisibleModal(visible)} />
        </div>
        <Bot
          visible={visible}
          myId='test'
          other={{
            id: info.id,
            name: info.name,
            description: info.description,
            avatarURL: info.cover? `${environment.api}/image/${info.cover}`: '//p5gt9sjx9.bkt.clouddn.com/avatar/hp2.jpg',
          }}
          onCancel={e => onVisibleModal(visible)}
        />
        <Layout ref={element => this.ipDetailDOM = element} id="ip-detail">
          <Layout.Sider width={200} style={{ background: '#fff' }}>
            <Menu
              mode="inline"
              defaultSelectedKeys={this.defaultSelectedKeys}
              style={{ height: '100%', borderRight: 0 }}
              onClick={item => history.push(`/app/ips/${id}/${item.key}`)}
            >
              <Menu.Item key="info">
                <Icon type="user" />
                IP 信息
              </Menu.Item>
              <Menu.Item key="skill">
                <Icon type="codepen" />
                技能包
              </Menu.Item>
              <Menu.Item key="corpus">
                <Icon type="file" />
                语料配置
              </Menu.Item>
              <Menu.Item key="corpu-package">
                <Icon type="appstore" />
                通用语料
              </Menu.Item>
            </Menu>
          </Layout.Sider>
          <Layout style={{ padding: '0 24px 24px' }}>
            <Layout.Content style={{ background: '#fff', padding: 24, margin: 0, minHeight: 280 }}>
              <Switch>
                <Route path='/app/ips/:id/info' component={IPInfo} exact />
                <Route path='/app/ips/:id/skill' component={IPInfoSkill} exact />
                <Route path='/app/ips/:id/corpus' component={IPInfoCorpus} exact />
                <Route path='/app/ips/:id/corpu-package' component={IPInfoCorpuPackage} exact />
                <Redirect from='/app/ips/:id' to='/app/ips/:id/info' />
              </Switch>
            </Layout.Content>
          </Layout>
        </Layout>
      </div>
    );
  }
}

class IPDeatil extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { match, history } = this.props;
    return <IPDeatilView history={history} appState={new IPDeatilState(match.params.id)} />
  }
}

export default withRouter(IPDeatil);

