import React, { Component } from 'react';
import { observable, action } from "mobx";
import { observer } from "mobx-react";

class AppState {
  @observable timer = 0;

  constructor() {
    setInterval(() => {
      this.timer += 1;
    }, 1000);
  }

  @action.bound
  reset() {
    this.timer = 0;
    this.getData();
  }

  async getData () {
    const response = await fetch(`//172.26.1.211:50000/module/query`, {
      method: 'POST',
      mode: 'cors',
      headers: new Headers({
        // 'Content-Type': 'application/json',
        'Accept': 'application/json',
      }),
      body: JSON.stringify({
      }),
    })
    const result = await response.json();
    console.log(result)
  }
}

const TimerView = observer(({ appState }) => (
  <button onClick={appState.reset}>Seconds passed: {appState.timer}</button>
));

class Test extends Component {
  constructor (props) {
    super(props);
  }

  render () {
    return <TimerView appState={new AppState()} />
  }
}

export default Test;