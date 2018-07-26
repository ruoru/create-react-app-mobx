import './header.scss';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Layout, Button, Avatar, Popover } from 'antd';
import getGateway from '../../utils/getGateway';

class Header extends Component {
  constructor(props) {
    super(props);
  }

  async logout() {
    try {
      const result = await getGateway.middleware('GET', `/logout/?format=json`);
      localStorage.clear();
      window.location.href = `${result.location}`;
    } catch (error) {
      console.error(error);
    }
  }

  render() {
    const { title, component } = this.props;
    return (
      <Layout.Header className="header">
        <ul className="left">
        <li>
            <img src="" />
            <span>IP Dreamwork</span>
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

export default Header;