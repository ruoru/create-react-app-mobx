import './ip-info-corpu-package.scss';
import React, { Component } from 'react';
import { Badge, Icon, Card, Modal, Button, message, Checkbox, Input, InputNumber, Radio, DatePicker } from 'antd';
import { observable, action, get, runInAction } from "mobx";
import { observer } from "mobx-react";
import SelectionCard from '../../components/SelectionCard';
import getGateway from '../../utils/getGateway';



// import man from '../../assets/icon/man.svg';
// import man1 from '../../assets/icon/man1.svg';
// import woman from '../../assets/icon/woman.svg';
// import woman1 from '../../assets/icon/woman1.svg';
// import svgMessage from '../../assets/icon/message.svg';
// import svgMessage1 from '../../assets/icon/message1.svg';
// import specialty from '../../assets/icon/specialty.svg';
// import specialty1 from '../../assets/icon/specialty1.svg';


class IPInfoCorpuPackageState {

  @observable id = '';
  @observable info = {};
  @observable data = [];
  @observable dataConfig = [];

  constructor(id) {
    this.id = id;
    this.loadDataConfig(id);
  }

  @action.bound
  async loadDataConfig(id) {
    let dataConfig = [];
    try {
      const response = await getGateway.middleware('GET', '/corpusbatches/?format=json', {});

      this.dataConfig = response.results.map(item => {
        return {
          id: item.id,
          imgSrc: item.inactive_cover,
          imgSrc1: item.active_cover,
          title: item.name,
          description: item.description,
          url: item.url,
        }
      });
    } catch (error) {
      message.error('请求配置出错');
    }
    this.loadData(id);
  }

  @action.bound
  async loadData(id) {
    let data = [], info = {};
    try {
      const response = await getGateway.middleware('GET', `/bots/${id}/?format=json`);
      data = response.corpus_batch;
      info = response;
    } catch (error) {
      message.error('请求 bot 信息出错');
    }
    this.data = data;
    this.info = info;
  }

  @action.bound
  async saveInfo(id, data, name, description) {
    try {
      const response = await getGateway.middleware('PUT', `/bots/${id}/?format=json`, {
        data: {
          name,
          description,
          corpus_batch: data,
        }
      });
      message.success('保存成功');
    } catch (error) {
      message.error('修改 bot 信息出错');
    }
  }

  @action.bound
  onCardChange(data, value) {
    data = data.slice();
    if (data.includes(value)) {
      const index = data.indexOf(value);
      data.splice(index, 1);
    } else {
      data.push(value);
    }

    this.data = data;
  }
}

@observer
class IPInfoCorpuPackageView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { id, info, data, dataConfig, onCardChange, saveInfo } = this.props.appState;

    return (
      <div className="ip-info-corpu-package">
        <div className="bar">
          <Button style={{ width: '120px' }} type="primary" icon="save" onClick={e => saveInfo(id, data, info.name, info.description)}>保存</Button>
        </div>
        <div className="cards">
          {
            dataConfig.map((item, i) => <SelectionCard key={i} {...item} status={data.includes(item.url)} onClick={value => onCardChange(data, item.url)} />)
          }
        </div>
      </div>
    );
  }
}

class IPInfoCorpuPackage extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { match } = this.props;
    return <IPInfoCorpuPackageView appState={new IPInfoCorpuPackageState(match.params.id)} />
  }
}

export default IPInfoCorpuPackage;
