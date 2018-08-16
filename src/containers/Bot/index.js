import './bot.scss';
import React, { Component } from 'react';
import { Modal, Avatar, Button, } from 'antd';
import { format } from 'date-fns';
import MessageType from '../../components/MessageType';
import getGateway from '../../utils/getGateway';

class Bot extends Component {
  constructor(props) {
    super(props);

    this.state = {
      chatList: [],
      message: '',
      bindEnterTimes: true,
    }

    this.messageDOM = null;
  }

  componentDidMount() {

  }

  componentWillUnmount() {
    if (this.messageDOM) {
      this.messageDOM.removeEventListener('keydown', this.onListenEnter);
    }
  }

  onListenEnter = e => {
    const { myId, other } = this.props;
    const { message } = this.state;

    const event = e || window.event;
    const key = event.which || event.keyCode || event.charCode;

    if (key == 13 && event.ctrlKey) {
      this.setState({ message: message + '\r\n' });
    } else if (key == 13) {
      this.onSendMessage(myId, other.id, message);
    }
  }

  setChatListScrollBottom() {
    this.chatListWrapDOM.scrollTop = this.chatListDOM.scrollHeight;
  }

  async onSendMessage(sendId, receiveId, message) {
    if (!message) return;
    const { chatList } = this.state;

    const chatMessage = {
      id: '',
      sendId,
      receiveId,
      time: new Date().getTime(),
      text: message,
    };
    chatList.push(chatMessage);
    this.setState({ chatList, message: '' }, this.setChatListScrollBottom);

    const reply = await getGateway.middleware('POST', '/chat/?format=json', {
      data: {
        'user_id': sendId,
        bot: receiveId,
        query: message,
      }
    });
    let text = JSON.stringify(reply.bot);
    const replyMessage = {
      id: '',
      sendId: receiveId,
      receiveId: sendId,
      time: new Date().getTime(),
      text,
    }
    chatList.push(replyMessage);
    this.setState({ chatList, message: '' }, this.setChatListScrollBottom);
  }

  render() {
    const { visible, myId, other, onCancel } = this.props;
    const { chatList, message, bindEnterTimes } = this.state;
    return (
      <Modal
        className="bot-modal"
        style={{ top: 60 }}
        visible={visible}
        onCancel={e => onCancel(visible)}
      >
        <div className="bot">
          <div className="other-info">
            <Avatar size="large" src={other.avatarURL} />
            <p>{other.name}</p>
          </div>
          <div className="chat">
            <div className="chat-history-warp" ref={dom => this.chatListWrapDOM = dom}>
              <div className="chat-list" ref={dom => this.chatListDOM = dom}>
                {
                  false && <a className="more-history">加载更多历史消息</a>
                }
                {
                  chatList.map(item => {
                    return myId === item.sendId
                      ? <MessageType.MeText id={item.id} name={item.sendId} datetime={format(item.time, 'YYYY-MM-DD HH:mm')} text={item.text} />
                      : <MessageType.OthersText id={item.id} name={other.name} datetime={format(item.time, 'YYYY-MM-DD HH:mm')} text={item.text} />
                  })
                }
              </div>
            </div>
            <div className="chat-input-warp">
              <textarea
                placeholder="请输入"
                value={message}
                ref={dom => this.messageDOM = dom}
                onChange={e => {
                  if (bindEnterTimes) {
                    this.setState({ bindEnterTimes: false });
                    this.messageDOM.addEventListener('keydown', this.onListenEnter);
                  }
                  this.setState({ message: e.target.value });
                }}
              >
              </textarea>
              <div className="input-bottom">
                <Button type="primary" onClick={() => this.onSendMessage(myId, other.id, message)}>发送</Button>
                <span className="tips">按 Ctrl + Enter 换行</span>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    );
  }
}

export default Bot;