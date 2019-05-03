import React, { Component } from 'react';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import * as listAction from '../modules/list'

class CutomerDelete extends Component {

    constructor(props) {
        super(props);
        this.state = {
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
            open: false
        });     
    }    

    deleteCustomer = async (id) => {
        try {
            const { DeleteAction } = this.props;
            console.log(" ★★★ CustomerDelete.js deleteCustomer request id : " + id);
            await DeleteAction.getDelete(id)
                            .then((response) => {
                                console.log(" ★★★ CustomerDelete.js deleteCustomer 결과 : \n" + JSON.stringify(response.result,null,2));
                                this.props.stateRefresh();
                            });
        } catch (error) {
            console.log(" ★★★ CustomerDelete.js deleteCustomer 에러 : " + error );
        }
    }

    render() {
        return (
            <div>
                <Button variant="contained" color="secondary" onClick={this.handleClickOpen}>삭제</Button>
                <Dialog open={this.state.open} onClose={this.handleClickClose}>
                    <DialogTitle>
                        삭제 경고
                    </DialogTitle>
                    <DialogContent>
                        <Typography gutterBottom>
                            선택한 고객정보가 삭제 됩니다.
                        </Typography>
                    </DialogContent>
                    <DialogActions>
                        <Button variant="contained" color="primary" onClick={(e) => {this.deleteCustomer(this.props.id)}}>삭제</Button>
                        <Button variant="outlined" color="primary" onClick={this.handleClickClose}>닫기</Button>                        
                    </DialogActions>
                </Dialog>                
            </div>
        );
    }
}

export default connect(
    (state) => ({
        result: state.list.data, // state.[리듀스덕스파일명].[리듀스덕스파일內state변수명]
        loading: state.pender.pending['GET_DELETE'], // 추후 로딩 중 처리
        error: state.pender.failure['GET_DELETE'] // 추후 에러 페이지 처리
    }),
    (dispatch) => ({
        DeleteAction: bindActionCreators(listAction, dispatch)
    })
)(CutomerDelete);