import React, { Component } from 'react';
import Topbar from './Topbar';
import Footer from './Footer';
import Pageheading from './Pageheading';
import Card from './Card';
import Piechart from './Piechart';
import Process from './Process';
import { db } from '../firebase';
import Port from './Port';
import LinechartCpu from './LinechartCpu';
import LinechartNet from './LinechartNet';
import Log from './Log';
import ServerInfo from './ServerInfor';

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loadAvg: '',
      memUsed: '',
      total: '',
      cpu: ''
    };
  }
  getLoadAvg = () => {
    let ref = db.ref(`monitor/users/${this.props.user}/domain/001/loadAvg/onesec`);
    ref.on('value', snapshot => {
      const state = snapshot.val();
      this.setState({
        loadAvg: state + "s"
      });
    });
    console.log('DATA RETRIEVED');
  }
  getUsedMem = () => {
    let ref = db.ref(`monitor/users/${this.props.user}/domain/001/mem/used`);
    ref.on('value', snapshot => {
      const state = snapshot.val();
      this.setState({
        memUsed: state + "%"
      });
    });
    console.log('DATA RETRIEVED');
  }
  getTotalProc = () => {
    let ref = db.ref(`/monitor/users/${this.props.user}/domain/001/totalProc/total`);
    ref.on('value', snapshot => {
      const state = snapshot.val();
      this.setState({
        total: state
      });
    });
    console.log('DATA RETRIEVED');
  }
  getCpu = () => {
    let ref = db.ref(`monitor/users/${this.props.user}/domain/001/cpu/cpus`);
    ref.on('value', snapshot => {
      const state = snapshot.val();
      this.setState({
        cpu: state + "%"
      });
    });
    console.log('DATA RETRIEVED');
  }
  componentDidMount() {
    this.getLoadAvg();
    this.getUsedMem();
    this.getTotalProc();
    this.getCpu();
  }
  render() {
    return (
      <div className="App">
        <Topbar />
        <div className="container-fluid">
          <Pageheading title="Dashboard" />

          {/* Content row */}
          <div className="row">

            <div class="col-xl-4 col-lg-5">
              <ServerInfo></ServerInfo>
            </div>
            <div class="col-xl-4 col-lg-5">
              {/* Card listing */}
              <Card title="CPU Utilization" color="primary" num={this.state.cpu} icon="microchip" />
              <Card title="Load Averages" color="success" num={this.state.loadAvg} icon="clock" />
            </div>
            <div class="col-xl-4 col-lg-5">
              <Card title="Used Memory" color="info" num={this.state.memUsed} icon="server" />
              <Card title="Running Process" color="warning" num={this.state.total} icon="layer-group" />
            </div>

          </div>

          {/* Chart area */}
          <div className="row">
            <div className="col-xl-4 col-lg-5">
              <LinechartNet user={this.props.user}></LinechartNet>
            </div>
            <div className="col-xl-4 col-lg-5">
              <LinechartCpu user={this.props.user} ></LinechartCpu>
            </div>
            <div className="col-xl-4 col-lg-5">
              <Piechart user={this.props.user} title="Disk"></Piechart>
            </div>
          </div>
          <div className="row">
            <div class="col-lg-6 mb-4">
              <Process user={this.props.user}></Process>
            </div>
            <div class="col-lg-6 mb-4">
              <Port user={this.props.user}></Port>
              <Log></Log>
            </div>
          </div>

        </div>
        <Footer />
      </div>
    );
  }
}

export default Home;