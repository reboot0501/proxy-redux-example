import React, { Component } from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as insertAction from '../modules/insert';

class CustomerInsert extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id: 0,
            image: '',
            name: '',
            birthday: '',
            gender: '',
            job: '',
            open: false
        }
    }

    handleClickOpen = () => {
        this.setState({
            open: true
        });
    }

    handleClickClose = () => {
        this.setState({
            id: 0,
            image: '',
            name: '',
            birthday: '',
            gender: '',
            job: '',
            open: false            
        });     
    }

    handleValueChange = (e) => {
        let nextState = {};
        nextState[e.target.name] = e.target.value;
        this.setState(nextState);
    }

    addCustomer = async() => {
        const { InsertAction } = this.props;
        const params = {};
        params.image = this.state.image;
        params.name = this.state.name;
        params.birthday = this.state.birthday;
        params.gender = this.state.gender;
        params.job = this.state.job;             
        try {
            await InsertAction.postInsert(params) // 액션연결의 액션함수 호출, 기다려야 할 Promise 앞에 await
                    .then((response) => {
                        console.log(JSON.stringify("★★★ addCustomer async 결과 :\n" + response,null,2));
                        this.props.stateRefresh();                         
                    }); 
        } catch (error) {
            console.log(error);
        }
    }

    handleSubmit = async (e) => {
        e.preventDefault();
        this.addCustomer();
        this.setState({
            id : 0,
            image : '',
            name: '',
            birthday: '',
            gender: '',
            job: '',
            open: false            
        });         
        //window.location.reload(); //화면 전체 리로딩

    }

    render() {
        return (
            <div>
                <Button variant="contained" color="primary" onClick={this.handleClickOpen}>
                    고객 추가하기
                </Button>
                <Dialog open={this.state.open} onClose={this.handleClickClose}>
                    <DialogTitle>고객추가</DialogTitle>
                    <DialogContent>
                        <TextField label="프로필이미지" type="text" name="image" value={this.state.fileName} onChange={this.handleValueChange}/><br/>
                        <TextField label="이름" type="text" name="name" value={this.state.name} onChange={this.handleValueChange}/><br/>
                        <TextField label="생년월일" type="text" name="birthday" value={this.state.birthday} onChange={this.handleValueChange}/><br/>
                        <TextField label="성별" type="text" name="gender" value={this.state.gender} onChange={this.handleValueChange}/><br/>
                        <TextField label="직업" type="text" name="job" value={this.state.job} onChange={this.handleValueChange}/><br/>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="primary" onClick={this.handleSubmit}>추가</Button>
                        <Button variant="outlined" color="primary" onClick={this.handleClickClose}>닫기</Button>
                    </DialogActions>                    
                </Dialog>
            </div>
        );
    }
}

export default connect(
    (state) => ({
        customer: state.insert.data, // state.[리듀스덕스파일명].[리듀스덕스파일內state변수명]
        loading: state.pender.pending['POST_INSERT'], // 추후 로딩 중 처리
        error: state.pender.failure['POST_INSERT'] // 추후 에러 페이지 처리
    }),
    (dispatch) => ({
        InsertAction: bindActionCreators(insertAction, dispatch)
    })
)(CustomerInsert);