import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { observable, action, runInAction } from 'mobx';
import { observer } from 'mobx-react';
import './home.scss';

class HomeState {
  @observable height = document.documentElement.clientHeight;

  constructor() {
    const self = this;
    window.onresize = () => {
      this.resetHeight();
    }

    this.load();
  }

  @action.bound
  resetHeight() {
    this.height = document.documentElement.clientHeight;
  }

  @action.bound
  async load() {
    const data = await this.getData();

    runInAction(() => {
      this.name = data.name;1
    });
  }

  async getData() {
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

// const TimerView = observer(({ homeState }) => (
//   <div>
//     <button onClick={homeState.reset}>Seconds passed: {homeState.timer}</button>
//     <button onClick={homeState.load}>xx</button>
//     <p>{homeState.name}</p>
//   </div>
// ));

@observer
class HomeView extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { homeState } = this.props;
    return (
      <div className="home" style={{height: `${homeState.height}px`}}>
        <div className="header">
          <ul className="left">
            <li><img src="" /></li>
          </ul>
          <ul className="right">
            <li>
              about us
            </li>
            <li>
              <button>Sign up</button>
            </li>
          </ul>
        </div>

        <div className="content">
          <h1>IP DreamWork</h1>
          <p>Join us in the world of create your own bot.</p>
          <p>To Build a vitur life what you like.</p>
          <button><Link to='/app'>Get started</Link></button>
        </div>

      </div>
    );
  }
}


class Home extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <HomeView homeState={new HomeState()} />
  }
}

export default withRouter(Home);