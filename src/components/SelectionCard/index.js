import './index.scss'
import React, { Component } from 'react';
import { Card, Checkbox } from 'antd';

class SelectionCard extends Component {
  constructor(props) {
    super(props);

    this.state = {
      status: props.status,
    }

    this.onClick = this.onClick.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ status: nextProps.status });
  }

  onClick() {
    const { status } = this.state;
    if (this.props.onClick) {
      this.setState({status: !status});
      this.props.onClick();
    }
  }

  render() {
    const {  id, imgSrc, imgSrc1, title, description } = this.props;
    const { status } = this.state;
    return (
      <Card key={id} className="selection-card" style={{ width: 300 }} status={false} onClick={this.onClick}>
        <img src={status? imgSrc1: imgSrc} />
        <p className="title">{title}</p>
        <div className="check">
          <Checkbox checked={status} />
        </div>
      </Card>
    )
  }
}

export default SelectionCard;