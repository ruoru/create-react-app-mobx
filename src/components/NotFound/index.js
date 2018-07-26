import React, { Component } from 'react';
import { Layout, Menu, Breadcrumb, Icon } from 'antd';
const { SubMenu } = Menu;
const { Header, Content, Sider } = Layout;

class NotFound extends Component {
  constructor (props) {
    super(props);
  }

  componentDidMount () {
    
  }

  render() {
    return (
      <div className="not-found">
        404
      </div>
    );
  }
}

export default NotFound;
