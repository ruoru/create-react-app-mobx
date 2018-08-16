import './ip-list.scss';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Badge, Icon, Card, Modal, Button, message, Input } from 'antd';
import { observable, action, runInAction } from "mobx";
import { observer } from "mobx-react";
import Bot from '../Bot';
import getGateway from '../../utils/getGateway';
import { format } from 'date-fns';
import environments from '../../../packages/environments';
const environment = environments[process.env.NODE_ENV];


class IPListState {

  @observable data = [];
  @observable visible = false;
  @observable confirmLoading = false;

  @observable title = '';
  @observable description = '';

  @observable botVisible = false;
  @observable dataIndex = -1;

  constructor() {
    this.loadData();
  }

  @action.bound
  async loadData() {
    let data = [];
    try {
      const response = await getGateway.middleware('GET', '/bots/?format=json', {});

      data = response.results.map(this.getFormatData);
    } catch (error) {
      message.error('请求出错');
    }
    this.data = data;
  }

  getFormatData(dataItem) {
    return {
      id: dataItem.id,
      title: dataItem.name,
      description: dataItem.description,
      time: format(dataItem.created_time, 'YYYY-MM-DD HH:mm'),
      status: dataItem.state,
      cover: dataItem.cover? `${environment.api}/image/${dataItem.cover}`: 'https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png',
    }
  }

  @action.bound
  showModal() {
    this.visible = true;
  }

  @action.bound
  async handleOk(title, description, data) {
    this.confirmLoading = true;

    try {
      const response = await getGateway.middleware('POST', `/bots/?format=json`, {
        data: {
          name: title,
          description,
        }
      });
      data.push(this.getFormatData(response));
      this.data = data;
    } catch (error) {
      message.error('添加失败')
    }

    this.visible = false;
    this.confirmLoading = false;
  }

  @action.bound
  onChat(dataIndex) {
    if (dataIndex > -1) {
      this.dataIndex = dataIndex;
      this.botVisible = true;
    }
  }

  @action.bound
  handleCloseBotModal() {
    this.botVisible = false;
  }

  @action.bound
  handleCancel() {
    this.visible = false;
  }

  @action.bound
  onTitleChange(title) {
    this.title = title;
  }

  @action.bound
  onDescriptionChange(description) {
    this.description = description;
  }
}

@observer
class IPListView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { data, visible, confirmLoading, title, description, botVisible, dataIndex, showModal, handleOk, handleCancel, onTitleChange, onDescriptionChange, onChat, handleCloseBotModal } = this.props.appState;
    const datas = data.slice();
    const info = datas[dataIndex] || {};

    return (
      <div className="ip-list">
        <h2>我的 IP</h2>
        <div className="bar">
          <Button style={{ width: '120px' }} type="primary" icon="plus" onClick={showModal}>新建 IP</Button>
        </div>
        <div className="ips">
          {
            data.map((item, i) =>
              <Card
                key={item.id}
                style={{ width: 300 }}
                cover={<img alt="example" src={item.cover} />}
                actions={[
                  <Icon type="setting" onClick={e => { this.props.history.push(`/app/ips/${item.id}`) }} />,
                  <Icon type="message" onClick={e => onChat(i)} />]}
              >
                <Card.Meta
                  title={item.title}
                  description={
                    <ul>
                      <li>{item.description}</li>
                      <li className="card-description">
                        <Badge
                          status={item.status == 0 ? "warning" : "success"}
                          text={item.status == 0 ? "已创建" : "已运行"}
                        />
                        <span>{item.time}</span>
                      </li>
                    </ul>
                  }
                />
              </Card>
            )
          }
        </div>

        <Bot
          visible={botVisible}
          myId='test'
          other={{
            id: info.id,
            name: info.title,
            description: info.description,
            avatarURL: info.cover,
          }}
          onCancel={handleCloseBotModal}
        />

        <Modal
          title="新建 IP"
          className="ip-list-modal"
          visible={visible}
          onOk={e => handleOk(title, description, data)}
          confirmLoading={confirmLoading}
          onCancel={handleCancel}
        >
          <ul>
            <li>
              <div className="name">
                名称
              </div>
              <div className="description">
                <Input value={title} onChange={e => onTitleChange(e.target.value)} />
              </div>
            </li>
            <li>
              <div className="name">
                描述
              </div>
              <div className="description">
                <Input.TextArea row="4" value={description} onChange={e => onDescriptionChange(e.target.value)} />
              </div>
            </li>
          </ul>
        </Modal>
      </div>
    );
  }
}

class IPList extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <IPListView history={this.props.history} appState={new IPListState()} />
  }
}

export default withRouter(IPList);
