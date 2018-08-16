import './ip-info.scss';
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { Badge, Icon, Card, Modal, Upload, Button, message, Input, InputNumber, Radio, DatePicker } from 'antd';
import { observable, action, runInAction } from "mobx";
import { observer } from "mobx-react";
import moment from 'moment';
import getGateway from '../../utils/getGateway';
import environments from '../../../packages/environments';
const environment = environments[process.env.NODE_ENV];

function beforeUpload(file) {
  const isJPG = file.type === 'image/jpeg';
  if (!isJPG) {
    message.error('You can only upload JPG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error('Image must smaller than 2MB!');
  }
  return isJPG && isLt2M;
}

class IPInfoState {
  @observable id = '';
  @observable cover = '';
  @observable name = '';
  @observable sex = '';
  @observable weight = 0;
  @observable birthday = moment();
  @observable description = '';

  @observable loading = false;
  @observable imageUrl = null;

  constructor(id) {
    this.id = id;
    this.loadData(id);
  }

  @action.bound
  async loadData(id) {
    try {
      const response = await getGateway.middleware('GET', `/bots/${id}/?format=json`, {});
      this.cover = response.cover;
      this.name = response.name;
      this.sex = response.gender;
      this.weight = response.weight;
      this.birthday = moment(new Date(response.created_time));
      this.description = response.description;

      this._name = response.name;
      this._description = response.description;
    } catch (error) {
      message.error('数据请求错误');
    }
  }

  @action.bound
  async saveInfo(id, name, sex, weight, birthday, description) {
    try {
      await getGateway.middleware('PUT', `/bots/${id}/?format=json`, {
        data: {
          name, sex, weight, birthday, description
        }
      });
      message.success('修改成功');
    } catch (error) {
      message.error('修改出错');
    }
  }

  @action.bound
  onNameChange(name) {
    this.name = name;
  }

  @action.bound
  onSexChange(sex) {
    this.sex = sex;
  }

  @action.bound
  onWeightChange(weight) {
    this.weight = weight;
  }

  @action.bound
  onBirthdayChange(birthday) {
    this.birthday = birthday;
  }

  @action.bound
  onDescriptionChange(description) {
    this.description = description;
  }

  @action.bound
  setImage(e) {
    this.imageUrl = e.target.files[0];
  }

  @action.bound
  async uploadImage(image, id) {
    try {
      const formData = new FormData();
      formData.append('image', image);

      const response = await fetch(`${environment.api}/upload/?format=json`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'x-csrftoken': localStorage.getItem('csrftoken'),
        },
        mode: 'cors',
        body: formData,
      });
      const body = await response.json();

      await getGateway.middleware('PUT', `/bots/${id}/?format=json`, {
        data: {
          name: this._name,
          description: this._description,
          cover: `${body.image_name}`,
        }
      })

      this.cover = body.image_name;
      message.success('上传成功');
    } catch (error) {
      message.error('上传失败');
    }
  }
}

@observer
class IPInfoView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { appState } = this.props;
    const { id, name, sex, weight, birthday, description, cover, onNameChange, onSexChange, onWeightChange, onBirthdayChange, onDescriptionChange, saveInfo,
      loading, imageUrl, setImage, uploadImage } = appState;


    return (
      <div className="ip-info">
        <div className="bar">
          <Button style={{ width: '120px' }} type="primary" icon="save" onClick={e => saveInfo(id, name, sex, weight, birthday, description)}>保存</Button>
        </div>

        <div className="cover">
          <img style={{ maxHeight: '200px' }} src={`${environment.api}/image/${cover}`} />
          <div>
            <input type="file" onChange={setImage} />
            <button onClick={e => uploadImage(imageUrl, id)}>上传</button>
          </div>
        </div>

        <div className="info-group">
          <h2>个人信息</h2>
          <ul>
            <li>
              <div className="name">
                姓名
              </div>
              <div className="value">
                <Input value={name} onChange={e => onNameChange(e.target.value)} />
              </div>
            </li>
            <li>
              <div className="name">
                性别
              </div>
              <div className="value">
                <Radio.Group value={sex} onChange={e => onSexChange(e.target.value)}>
                  <Radio value={'1'}>男</Radio>
                  <Radio value={'2'}>女</Radio>
                  <Radio value={'0'}>保密</Radio>
                </Radio.Group>
              </div>
            </li>
            <li>
              <div className="name">
                体重
              </div>
              <div className="value">
                <InputNumber value={weight} onChange={value => onWeightChange(value)} />
                <span style={{ marginLeft: '8px' }}>kg</span>
              </div>
            </li>
            <li>
              <div className="name">
                生日
              </div>
              <div className="value">
                <DatePicker value={birthday} onChange={(date, dateString) => onBirthdayChange(date, dateString)} />
              </div>
            </li>
            <li>
              <div className="name">
                描述
              </div>
              <div className="value">
                <Input.TextArea rows={4} value={description} onChange={e => onDescriptionChange(e.target.value)} />
              </div>
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

class IPInfo extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { match } = this.props;
    return <IPInfoView appState={new IPInfoState(match.params.id)} />
  }
}

export default IPInfo;
