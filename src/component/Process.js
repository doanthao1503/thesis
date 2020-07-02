import React, { Component } from 'react';
import { db } from '../firebase';
import { Pagination } from './Pagination';


class Process extends Component {

  constructor(props) {
    super(props);
    this.options = {
      sizePage: 5,
      sizePagination: 3
    }
    this.state = {
      process: {},
      page: 0,
      idMemAsc: true,
      isCpuAsc: false,
    }
  }

  sortMem = (process) => {
    const processArray = Object.keys(process).map(key => {
      return process[key];
    });

    const { isMemAsc } = this.state;
    this.setState({
      isMemAsc: !isMemAsc,
    })
    let sorted = [];
    if (isMemAsc) {
      sorted = processArray.sort((a, b) => b.mem - a.mem);
      this.setState({ process: { ...sorted } });
      return;
    }
    sorted = processArray.sort((a, b) => a.mem - b.mem);
    this.setState({ process: { ...sorted } });
  }

  sortCPU = (process) => {
    const processArray = Object.keys(process).map(e => {
      return process[e]
    })
    const { isCpuAsc } = this.state;
    this.setState({
      isCpuAsc: !isCpuAsc
    })
    let sortedArray = [];
    if (isCpuAsc) {
      sortedArray = processArray.sort((a, b) => b.cpu - a.cpu);
      this.setState({
        process: { ...sortedArray }
      })
      return
    }
    sortedArray = processArray.sort((a, b) => a.cpu - b.cpu);
    this.setState({
      process: { ...sortedArray }
    })
  }

  getData = () => {
    let ref = db.ref(`monitor/users/${this.props.user}/domain/001/procRunning`);
    ref.on('value', snapshot => {
      this.setState({
        process: snapshot.val(),
      });
      console.log(snapshot.val());
    });
  }

  killProcess = (e) => {
    if (!window.confirm(`Do you really want to kill process ${e.target.value}?`))
      return;
    let ref = db.ref(`monitor/users/${this.props.user}/domain/001/task`);
    ref.set({
      cmd: 'kill -9 ' + e.target.value
    });
  }
  componentDidMount() {
    this.getData();
  }
  render() {
    const { process } = this.state;
    let len = Object.keys(this.state.process).length
    return (
      <div className="card shadow mb-4">
        <div className="card-header py-3">
          <h6 className="m-0 font-weight-bold text-primary text-left">Process Running</h6>
        </div>
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-striped" id="dataTable" width="100%" cellSpacing={0}>
              <thead>
                <tr>
                  <th scope="col">#</th>
                  <th scope="col">PID</th>
                  <th scope="col">Command</th>
                  <th scope="col">%Mem
                    <button type="button" className="btn btn-outline-light btn-sm"
                      onClick={() => {
                        this.sortMem(process)
                      }}
                    >
                      <i className="fas text-gray-300 fa-sort" />
                    </button>
                  </th>
                  <th scope="col">%CPU
                    <button type="button" className="btn btn-outline-light btn-sm"
                      onClick={() => {
                        this.sortCPU(process)
                      }}
                    >
                      <i className="fas text-gray-300 fa-sort" />
                    </button>
                  </th>
                  <th scope="col"></th>
                </tr>
              </thead>
              <tfoot></tfoot>
              <tbody>
                {
                  this.createPage()
                }
              </tbody>
            </table>
            <Pagination currentPage={this.state.page + 1} totalPage={Math.ceil(len / 5)} onChangePage={this.handlePageChange} />
          </div>
        </div>
      </div>
    );
  }
  createPage = () => {
    let rows = [], index = this.state.page * this.options.sizePage,
      tmp = Object.keys(this.state.process);
    while (
      (index < (this.state.page + 1) * this.options.sizePage) &&
      (index < tmp.length)
    ) {
      rows.push((
        <tr>
          <td>{index + 1}</td>
          <td>{tmp[index]}</td>
          <td>{this.state.process[tmp[index]].cmd}</td>
          <td>{this.state.process[tmp[index]].mem}</td>
          <td>{this.state.process[tmp[index]].cpu}</td>
          <td><button value={tmp[index]} type="button" class="btn btn-danger" onClick={this.killProcess}>Kill</button></td>
        </tr>
      ));
      index++;
    }
    return rows;
  }
  handlePageChange = (e) => {
    this.setState({
      page: e - 1,
    })
  }
}

export default Process;