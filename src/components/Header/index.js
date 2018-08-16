import './header.scss';
import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Layout, Button, Avatar, Popover, Menu, Icon } from 'antd';
import getGateway from '../../utils/getGateway';

class Header extends Component {
  constructor(props) {
    super(props);
  }

  async logout() {
    try {
      const result = await getGateway.middleware('GET', `/logout/?format=json`);
      localStorage.clear();
      window.location.href = `/`;
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    const { title, component, history } = this.props;
    return (
      <Layout.Header className="header">
        <ul className="left">
          <li>
            <img src="" />
            <span><Link to="/">IP Dreamwork</Link></span>
          </li>
          <li>
            <Menu
              onClick={options => history.push(`/app/${options.key}`)}
              selectedKeys={['ips']}
              mode="horizontal"
            >
              <Menu.Item key="ips">
                <Icon type="appstore" />IP List
              </Menu.Item>
              {/* <Menu.Item key="app" disabled>
                <Icon type="appstore" />Navigation Two
              </Menu.Item>
              <Menu.SubMenu title={<span><Icon type="setting" />Navigation Three - Menu.SubMenu</span>}>
                <Menu.ItemGroup title="Item 1">
                  <Menu.Item key="setting:1">Option 1</Menu.Item>
                  <Menu.Item key="setting:2">Option 2</Menu.Item>
                </Menu.ItemGroup>
                <Menu.ItemGroup title="Item 2">
                  <Menu.Item key="setting:3">Option 3</Menu.Item>
                  <Menu.Item key="setting:4">Option 4</Menu.Item>
                </Menu.ItemGroup>
              </Menu.SubMenu>
              <Menu.Item key="alipay">
                <a href="https://ant.design" target="_blank" rel="noopener noreferrer">Navigation Four - Link</a>
              </Menu.Item> */}
            </Menu>
          </li>
        </ul>
        {component}
        <ul className="right">
          <li>
            <Popover
              content={
                <div>
                  <Button onClick={this.logout}>退出</Button>
                </div>
              }
              title={localStorage.getItem('user')}
              trigger="click"
              placement="bottom"
            >
              <Avatar style={{ color: '#f56a00', backgroundColor: '#fde3cf', cursor: 'pointer' }} src={localStorage.getItem('userAvatar')}>
                {localStorage.getItem('user')}
              </Avatar>
            </Popover>
          </li>
        </ul>
      </Layout.Header>
    );
  }
}

export default withRouter(Header);