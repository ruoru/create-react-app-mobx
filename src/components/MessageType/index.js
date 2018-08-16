import React, {Component} from 'react';
import './MessageType.scss';

class OthersText extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {id, name, datetime, text} = this.props;

    return (
      <div key={id} id={id} className="others-text">
        <div className="info">
          <span className="name">{name}</span>
          <span className="datetime">{datetime}</span>
        </div>
        <div className="bubble">
          <span className="arrow-bg"></span>
          <span className="arrow"></span>
          <div className="text">{text}</div>
        </div>
      </div>
    );
  }
}

class MeText extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {id, datetime, text} = this.props;

    return (
      <div key={id} id={id} className="me-text">
        <div className="info">
          <span className="datetime">{datetime}</span>
        </div>
        <div className="bubble">
          <span className="arrow-bg"></span>
          <span className="arrow"></span>
          <div className="text">{text}</div>
        </div>
      </div>
    );
  }
}

const MessageType = {
  OthersText,
  MeText,
}

export default MessageType;