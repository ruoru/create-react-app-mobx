import './ip-info-corpus.scss';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Table, Icon, Card, Modal, Button, message, Checkbox, Input, InputNumber, Radio, DatePicker } from 'antd';
import { observable, action, runInAction } from "mobx";
import { observer } from "mobx-react";
import getGateway from '../../utils/getGateway';
import environments from '../../../packages/environments';
const environment = environments[process.env.NODE_ENV];

class IPInfoCorpusState {

  @observable id = '';
  @observable columns = [{
    title: '序号',
    dataIndex: 'code',
    key: 'code',
  }, {
    title: '问题',
    dataIndex: 'question',
    key: 'question',
  }, {
    title: '答案',
    dataIndex: 'answer',
    key: 'answer',
  }, {
    title: '创建时间',
    dataIndex: 'createdAt',
    key: 'createdAt',
  }, {
    title: '操作',
    dataIndex: 'options',
    key: 'options',
    render: (self, item) => <div>
      <a onClick={e => this.showUpdateModal(item.id, item.question, item.answer, item)}>配置</a> | <a onClick={e => this.delCorporaById(item.id)}>删除</a>
    </div>
  }];
  @observable data = [];
  @observable visible = false;
  @observable confirmLoading = false;

  @observable corpusId = '';
  @observable question = '';
  @observable answer = '';

  constructor(id) {
    this.id = id;
    this.loadData();
  }

  @action.bound
  async loadData() {
    try {
      const response = await getGateway.middleware('GET', `/bots/${this.id}/corpus/?format=json`, {});

      this.data = response.map((item, i) => {
        return {
          code: i + 1,
          id: item.id,
          question: item.query,
          answer: item.answer,
          createdAt: '',
        }
      });
    } catch (error) {
      message.error('数据加载出错');
    }
  }

  @action.bound
  async delCorporaById(id) {
    try {
      await getGateway.middleware('DELETE', `/corpora/${id}?format=json`, {});
      this.loadData();
      message.success('删除成功');
    } catch (error) {
      message.error('删除失败');
    }
  }

  @action.bound
  showModal() {
    this.visible = true;
    this.corpusId = ''
  }

  @action.bound
  showUpdateModal(id, question, answer, a) {
    this.visible = true;
    this.corpusId = id;
    this.question = question;
    this.answer = answer;console.log(0, this.corpusId, a.question)
  }

  @action.bound
  async handleOk(question, answer, id) {
    this.confirmLoading = true;
    const self = this;

    try {
      if (this.corpusId) {
        const response = await getGateway.middleware('PUT', `/corpora/${this.corpusId}/?format=json`, {
          data: {
            query: question,
            answer,
            bot: `http:${environment.api}/bots/${id}/`,
          }
        });
      } else {
        const response = await getGateway.middleware('POST', `/corpora/?format=json`, {
          data: {
            query: question,
            answer,
            bot: `http:${environment.api}/bots/${id}/`,
          }
        });
      }
      self.loadData();
      message.success('操作成功');
    } catch (error) {
      message.error('操作失败');
    }

    this.visible = false;
    this.confirmLoading = false;
  }

  @action.bound
  handleCancel() {
    this.visible = false;
  }

  @action.bound
  onQuestionChange(question) {
    this.question = question;
  }

  @action.bound
  onAnswerChange(answer) {
    this.answer = answer;
  }
}

@observer
class IPInfoCorpusView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { id, columns, data, visible, confirmLoading, question, answer, delCorporaById, showModal, handleOk, handleCancel, onQuestionChange, onAnswerChange } = this.props.appState;

    return (
      <div className="ip-info-corpus">
        <div className="bar">
          <Input.Search
            placeholder="search question or answer"
            onSearch={value => console.log(value)}
            style={{ width: 200 }}
          />
          <Button style={{ width: '100px' }} type="primary" icon="plus" onClick={showModal}>添 加</Button>
        </div>
        <Table dataSource={data} columns={columns} />

        <Modal
          title="答句管理"
          className="ip-info-corpus-modal"
          visible={visible}
          confirmLoading={confirmLoading}
          onOk={e => handleOk(question, answer, id)}
          onCancel={handleCancel}
        >
          <ul>
            <li>
              <div className="name">
                问句
              </div>
              <div className="description">
                <Input value={question} onChange={e => onQuestionChange(e.target.value)} />
              </div>
            </li>
            <li>
              <div className="name">
                答句
              </div>
              <div className="description">
                <Input value={answer} onChange={e => onAnswerChange(e.target.value)} />
              </div>
            </li>
          </ul>
        </Modal>
      </div>
    );
  }
}

class IPInfoCorpus extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { match } = this.props;
    return <IPInfoCorpusView appState={new IPInfoCorpusState(match.params.id)} />
  }
}

export default IPInfoCorpus;
