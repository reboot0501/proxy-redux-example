import React, { Component } from 'react';
import Button from '@material-ui/core/Button';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as listAction from '../modules/list'

class CustomerSearch extends Component {

    searchCustomer = async (searchName) => {
        try {
            const { SearchAction } = this.props;
            console.log(" ★★★ CustomerSearch.js searchCustomer request searchName : " + searchName);
            await SearchAction.getSearch(searchName)
                            .then((response) => {
                                console.log(" ★★★ CustomerSearch.js searchCustomer 결과 : \n" + JSON.stringify(response,null,2));
                                this.props.searchNameClear(); // 부모 컴포넌트의 검색성명 값 Clear 이벤트 함수 호출
                            });
        } catch (error) {
            console.log(" ★★★ CustomerSearch.js searchCustomer 에러 : " + error );
        }
    }

    render() {

        return (
            <div>
                <Button variant="contained" color="primary" onClick={(e) => {this.searchCustomer(this.props.searchName)}}>
                    고객 조회 하기
                </Button>                
            </div>
        );
    }
}

export default connect(
    (state) => ({
        customers: state.list.customers, // state.[리듀스덕스파일명].[리듀스덕스파일內state변수명]
        loading: state.pender.pending['GET_SEARCH'], // 추후 로딩 중 처리
        error: state.pender.failure['GET_SEARCH'] // 추후 에러 페이지 처리
    }),
    (dispatch) => ({
        SearchAction: bindActionCreators(listAction, dispatch)
    })
)(CustomerSearch);