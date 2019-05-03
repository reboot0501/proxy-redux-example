import React, { Component } from 'react';
import Customer from './components/Customer';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as listAction from './modules/list'

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      customers: '',
      completed: 0,
      buffer: 10
    }
  }

  progress = () => {
    const { completed } = this.state;
    if (completed > 100) {
      this.setState({ completed: 0, buffer: 10 });
    } else {
      const diff = Math.random() * 10;
      const diff2 = Math.random() * 10;
      this.setState({ completed: completed + diff, buffer: completed + diff + diff2 });
    }
  };


  stateRefresh = () => {
    console.log(" ★★★ App.js stateRefresh called !!! ");
    this.setState({
      customers: ''
    });
    this.loadData();
  }  

  loadData = async () => { // 비동기 웹요청
    const { ListActions } = this.props; // mapDispatchToProps(액션연결)에서 생성한 ListActions 상수 정의
    try { // await 문을 쓸때는 반드시 try catch 사용
        const response = await ListActions.getList(); // 액션연결의 액션함수 호출, 기다려야 할 Promise 앞에 await
        console.log("★★★★ " + JSON.stringify(response,null,2));
    } catch (error) {
        console.log(error);
    }
  }

  componentDidMount() {
    this.timer = setInterval(this.progress, 500);    
    //this.loadData();
  }   

  componentWillUnmount() {
    clearInterval(this.timer);
  }  

  render() {
    const { completed, buffer } = this.state;
    return (
        <Customer 
                  stateRefresh={this.stateRefresh} 
                  customers={this.props.customers} 
                  completed={completed} 
                  buffer={buffer}
        />
    );
  }
}

export default connect(
  (state) => ({
      customers: state.list.customers, // state.[리듀스덕스파일명].[리듀스덕스파일內state변수명]
      loading: state.pender.pending['GET_LIST'], // 추후 로딩 중 처리
      error: state.pender.failure['GET_LIST'] // 추후 에러 페이지 처리
  }),
  (dispatch) => ({
      ListActions: bindActionCreators(listAction, dispatch)
  })
)(App);