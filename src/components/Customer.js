import React, { Component } from 'react';

import CustomerList from './CustomerList';
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

class Customer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            searchName: '',
            selected: []
        }
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
          this.setState(state => ({ selected: this.props.customers.map(c => { return c.id} ) })); // 새로운 state 의 selected 에 전체 행번호 셋팅
          return;
        }
        this.setState({ selected: [] }); // 전체 선택 체크 박스를 언체크 하면
    };
    // 행 선택 처리 함수
    handleClick = (event, id) => {
        const { selected } = this.state; // 이전에 선택된 행들의 index 
        const selectedIndex = selected.indexOf(id); // 현재 state에 저장되어 있는 row 값 중에 현재 클릭 된 행 id가 존재하는 행 index 반환
        console.log(" 클릭된 행번호 : " + id + " 가 있는 이전 클릭/체크 된 행들 중의 인덱스 : " + selectedIndex);
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
        console.log(" 새롭게 클릭/체크 된 행 번호(들) : " + newSelected);
        this.setState({ selected: newSelected }); // 새로운 selected를 state에 셋팅
    };
    // 페이지 번호 변경
    handleChangePage = (event, page) => {
        console.log(" 변경 될 페이지 번호 : " + page);
        this.setState({ page }); // 새로운 page 값 세팅
    };
    // 페이지당 행 갯수 변경
    handleChangeRowsPerPage = event => {
        this.setState({ page: 0, rowsPerPage: event.target.value }); // 페이지당 행 갯수를 변경하면 page 번호 0 셋팅
    };    

    isSelected = id => this.state.selected.indexOf(id) !== -1;  // 선택된 행이 있으면 true 설정 

    render() {
        const cellList = ["번호", "프로필이미지", "이름", "생년월일", "성별", "직업", "삭제"];
        return (
            <div className="root">
                <Paper className="paper">
                    <div className="menuTextField" >
                        <TextField label="검색할 고객이름" type="text" name="searchName" value={this.state.searchName} onChange={this.handleValueChange}/>
                    </div>
                    <div className="menuButtonWrap">
                        <span className="menuButton">
                            <CustomerInsert stateRefresh={this.props.stateRefresh}/>
                        </span>
                        <span className="menuButton">
                            <CustomerSearch searchName={this.state.searchName} searchNameClear={this.handleSearchNameClear} />
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
                            { this.props.customers ? this.props.customers.map(c => {
                                return (
                                    <TableRow 
                                        hover
                                    >
                                        <TableCell padding="checkbox"><Checkbox checked={this.isSelected(c.id)} onChange={event => this.handleClick(event, c.id)}/></TableCell>
                                        <TableCell>{c.id}</TableCell>
                                        <TableCell><img src={c.image} alt="profile" /></TableCell>
                                        <TableCell>{c.name}</TableCell>
                                        <TableCell>{c.birthday}</TableCell>
                                        <TableCell>{c.gender}</TableCell>
                                        <TableCell>{c.job}</TableCell>
                                        <TableCell><CustomerDelete stateRefresh={this.props.stateRefresh} id={c.id} /></TableCell>                                        
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
                                        <LinearProgress className="progress" color="primary" variant="buffer" value={this.props.completed} valueBuffer={this.props.buffer} />
                                    </TableCell>
                                </TableRow> 
                            }
                        </TableBody>
                    </Table>
                </Paper>
            </div>
        );
    }
}

export default Customer