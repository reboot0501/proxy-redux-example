import React, { Component } from 'react';

//import CustomerList from './CustomerList';
import CustomerInsert from './CustomerInsert';
import CustomerSearch from './CustomerSearch';
import CustomerDelete from './CutomerDelete';

import TextField from '@material-ui/core/TextField';
import './Customer.scss'
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableHead from '@material-ui/core/TableHead';
import LinearProgress from '@material-ui/core/LinearProgress';
import TableBody from '@material-ui/core/TableBody';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import TableFooter from '@material-ui/core/TableFooter';
import TablePagination from '@material-ui/core/TablePagination';
import TablePaginationActionsWrapped from './TablePaginationActions';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import * as listAction from '../modules/list'
class Customer extends Component {

    state = {
        searchName: '',
        order: 'asc', // asc/desc
        orderBy: 'id', // sort 컬럼            
        selected: [],
        pageNo: 0, // 페이지 번호
        rowsPerPage: 5, // 페이지당 row 갯수
        customers: [],
        totalCount: 0,
        /**
         * Linear Progrss bar 적용 : completed, buffer
         */
        completed: 0,
        buffer: 10        
    }

    componentDidMount() {
        this.timer = () => setInterval(this.progress, 200);    
        this.loadData();
    }   
    
    componentWillUnmount() {
        clearInterval(this.timer);
    }        

    handleValueChange = (e) => {
        let nextState = {};
        nextState[e.target.name] = e.target.value;
        this.setState(nextState);
    }

    handleSearchNameClear = () => {
        this.setState({
            searchName: ''
        })
    }

    // 전체 선택 처리 함수
    handleSelectAllClick = event => {
        if (event.target.checked) { // 전체 선택 체크 박스를 체크 하면
          this.setState({
            selected: this.state.customers.map(c => c.id) 
          }); // 새로운 state 의 selected 에 전체 행번호 셋팅
          return;
        }
        this.setState({
            selected: [] 
        }); // 전체 선택 체크 박스를 언체크 하면
    };
    // 행 선택 처리 함수
    handleClick = (event, id) => {
        let { selected } = this.state; // 이전에 선택된 행들의 index 
        let selectedIndex = selected.indexOf(id); // 현재 state에 저장되어 있는 row 값 중에 현재 클릭 된 행 id가 존재하는 행 index 반환
        let newSelected = [];
    
        if (selectedIndex === -1) { // 현재 선택된 행번호가 이전에 클릭/체크 된 행들의 번호 중에 없는 경우
          newSelected = newSelected.concat(selected, id); // 클릭된 행번호를 추가
        } else if (selectedIndex === 0) { // 현재 선택된 행번호가 이전에 클릭/체크 된 행 번호가 첫번째 행인 경우
          newSelected = newSelected.concat(selected.slice(1)); // 이전에 클릭된 행 두번째부터 끝까지 가져오기 ( 값이 없으면 무시 )
        } else if (selectedIndex === selected.length - 1) { // 현재 선택된 행번호가 이전에 클릭/체크 된 행이 마지막 행인 경우(현재 클릭한 행번호가 가 있는 index 전체가 선태된 길이-1 과 같은 경우)
          newSelected = newSelected.concat(selected.slice(0, -1)); // 마지막 행 이전 선택된 행 모두 가져오기
        } else if (selectedIndex > 0) { // 이전에 클릭/체크 된 행 번호가 두번째 행 이상인 경우
          newSelected = newSelected.concat(
            selected.slice(0, selectedIndex), // 첫번째 행의 index 부터 체크된 행 index 전까지의 이전에 선택된 모든 행의 index
            selected.slice(selectedIndex + 1), // 체크된 행 index의 다음 행 부터 이전에 선택된 모든 해의 index
          );
        }
        this.setState({
            selected: newSelected 
        }); // 새로운 selected를 state에 셋팅
    };
    // 페이지 번호 변경
    handleChangePage = (event, page) => {
        let { searchName, rowsPerPage, orderBy, order } = this.state;    
        const params = {};
        params.searchName  = searchName;
        params.pageNo = page;
        params.rowsPerPage = rowsPerPage;
        params.orderBy = orderBy;
        params.order = order;        
        this.searchCustomer(params);
    };

    // 페이지당 행 갯수 변경
    handleChangeRowsPerPage = event => {
        let { searchName, orderBy, order } = this.state;         
        let params = {};
        params.searchName  = searchName;
        params.pageNo = 0;
        params.rowsPerPage = event.target.value;
        params.orderBy = orderBy;
        params.order = order;        
        this.searchCustomer(params);
    };
    
    handleSearchCustomer = (searchName)  => {
        let { orderBy, order, rowsPerPage } = this.state;         
        let params = {};
        params.searchName  = searchName;
        params.pageNo = 0;
        params.rowsPerPage = rowsPerPage;
        params.orderBy = orderBy;
        params.order = order;        
        this.searchCustomer(params);        
    }

    /**
    * Linear Progrss bar 이벤트 함수 progress 정의
    */
   progress = () => {
       let { completed } = this.state;
       if (completed > 100) {
           this.setState({
               completed: 0,
               buffer: 10 
           });
       } else {
        let diff = Math.random() * 10;
        let diff2 = Math.random() * 10;
        this.setState({ 
            completed: completed + diff, 
            buffer: completed + diff + diff2 
        });
       }
    };

    stateRefresh = () => {
        this.setState({
            searchName: '',
            order: 'asc', // asc/desc
            orderBy: 'id', // sort 컬럼            
            selected: [],
            pageNo: 0, // 페이지 번호
            rowsPerPage: 5, // 페이지당 row 갯수
            customers: [],
            totalCount: 0,
            completed: 0,
            buffer: 10       
        });
        this.loadData();
    }   
    
    loadData = async () => { // 비동기 웹요청
        let { ListActions } = this.props; // mapDispatchToProps(액션연결)에서 생성한 ListActions 상수 정의
        let { searchName, pageNo, rowsPerPage, orderBy, order } = this.state;
        try { // await 문을 쓸때는 반드시 try catch 사용
            const params = {};
            params.searchName  = searchName;
            params.pageNo = pageNo;
            params.rowsPerPage = rowsPerPage;
            params.orderBy = orderBy;
            params.order = order;
            await ListActions.postSearch(params) // 액션연결의 액션함수 호출, 기다려야 할 Promise 앞에 await
                            .then((response) => {
                                this.setState({
                                    customers: response.data.content,
                                    totalCount: response.data.totalElements,
                                });
                            }); 
        } catch (error) {
            console.log(error);
        }
    }

    searchCustomer = async (params) => {
        let { ListActions } = this.props; // mapDispatchToProps(액션연결)에서 생성한 ListActions 상수 정의
        try {
            await ListActions.postSearch(params)
                            .then((response) => { 
                                this.setState({
                                    searchName: params.searchName,
                                    pageNo: params.pageNo,
                                    rowsPerPage: params.rowsPerPage,
                                    customers: response.data.content,
                                    totalCount: response.data.totalElements
                                });                                
                                //this.handleSearchNameClear(); // 부모 컴포넌트의 검색성명 값 Clear 이벤트 함수 호출
                            });
        } catch (error) {
            console.log(" ★★★ CustomerSearch.js searchCustomer 에러 : " + error );
        }
    }

    isSelected = id => {
        let { selected } = this.state;
        return selected.indexOf(id) !== -1;  // 선택된 행이 있으면 true 설정 
    }

    render() {

        const cellList = ["번호", "프로필이미지", "이름", "생년월일", "성별", "직업", "삭제"];
        const { searchName, pageNo, rowsPerPage } = this.state;
        //console.log("109L searchName : " + searchName);
        //console.log("109L order : " + order);
        //console.log("109L orderBy : " + orderBy);
        //console.log("109L selected : " + selected + " selected.length : " + selected.length);
        //console.log("109L rowsPerPage : " + rowsPerPage);
        //console.log("109L pageNo : " + pageNo);
        // 처리 확인 하기 ??????????????
        //const emptyRows = rowsPerPage - Math.min(rowsPerPage, this.state.customers.length - pageNo * rowsPerPage);
        //console.log("116L emptyRows : " + emptyRows);        
        return (
            <div className="root">
                <Paper className="paper">
                    <div className="menuTextField" >
                        <TextField label="검색할 고객이름" type="text" name="searchName" value={searchName} onChange={e => this.handleValueChange(e)}/>
                    </div>
                    <div className="menuButtonWrap">
                        <span className="menuButton">
                            <CustomerInsert stateRefresh={this.stateRefresh}/>
                        </span>
                        <span className="menuButton">
                            <CustomerSearch onClick={() => this.handleSearchCustomer(searchName)}/>
                        </span>
                    </div>
                </Paper>
                <Paper className="paper" >
                    <Table>
                        <TableHead > 
                            <TableRow>
                                <TableCell className="tableHead" padding="checkbox"><Checkbox onChange={this.handleSelectAllClick}/></TableCell>
                                { cellList.map((c, index) => {
                                    return (
                                        <TableCell className="tableHead" key={index}><Typography variant="h6" >{c}</Typography></TableCell>
                                    );
                                })}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            { this.state.customers ? this.state.customers.map(c => {
                                return (
                                    <TableRow 
                                        key={c.id}
                                        hover
                                    >
                                        <TableCell padding="checkbox"><Checkbox checked={this.isSelected(c.id)} onChange={e => this.handleClick(e, c.id)} /></TableCell>
                                        <TableCell>{c.id}</TableCell>
                                        <TableCell><img src={c.image} alt="profile" /></TableCell>
                                        <TableCell>{c.name}</TableCell>
                                        <TableCell>{c.birthday}</TableCell>
                                        <TableCell>{c.gender}</TableCell>
                                        <TableCell>{c.job}</TableCell>
                                        <TableCell><CustomerDelete stateRefresh={this.stateRefresh} id={c.id} /></TableCell>                                        
                                    </TableRow>
                                    /*
                                        <CustomerList stateRefresh={this.props.stateRefresh}
                                            key={c.id}
                                            id={c.id}
                                            image={c.image}
                                            name={c.name}
                                            birthday={c.birthday}
                                            gender={c.gender}
                                            job={c.job}
                                        />
                                    */
                                    );
                                }) 
                                : 
                                <TableRow>
                                    <TableCell colSpan="8" align="center">
                                        <LinearProgress className="progress" color="primary" variant="buffer" value={this.state.completed} valueBuffer={this.state.buffer} />
                                    </TableCell>
                                </TableRow> 
                            }
                        </TableBody>
                        <TableFooter>
                            <TableRow>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 15]}
                                    colSpan={8}
                                    count={this.state.totalCount}
                                    rowsPerPage={rowsPerPage}
                                    page={pageNo}
                                    onChangePage={this.handleChangePage}
                                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                                    ActionsComponent={TablePaginationActionsWrapped}
                                />
                            </TableRow>
                        </TableFooter>                        
                    </Table>
                </Paper>
            </div>
        );
    }
}

export default connect(
    (state) => ({ // mapStateToProps 에 해당
        customers: state.list.customers, // state.[리듀스덕스파일명].[리듀스덕스파일內state변수명]
        totalPages: state.list.totalPages,
        totalCount: state.list.totalCount,
        last: state.list.last,
        first: state.list.first, 
        empty: state.list.empty, 
        loading: state.pender.pending['POST_SEARCH'], // 추후 로딩 중 처리
        error: state.pender.failure['POST_SEARCH'] // 추후 에러 페이지 처리
    }),
    (dispatch) => ({ // mapDispatchToProps 에 해당
        ListActions: bindActionCreators(listAction, dispatch)
    })
)(Customer)