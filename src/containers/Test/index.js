import React, { Component } from 'react';
import { observable, action, runInAction } from "mobx";
import { observer } from "mobx-react";

class AppState {
  @observable timer = 0;
  @observable name = '';

  constructor() {
    setInterval(() => {
      this.timer += 1;
    }, 1000);

    this.load();
  }

  @action.bound
  reset() {
    this.timer = 0;
  }

  @action.bound
  async load () {
    const data = await this.getData();

    runInAction(() => {
      this.name = data.name;    console.log(this.name)
    });
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
    return result;
  }
}

const TimerView = observer(({ appState }) => (
  <div>
    <button onClick={appState.reset}>Seconds passed: {appState.timer}</button>
    <button onClick={appState.load}>xx</button>
    <p>{appState.name}</p>
  </div>
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