import React, { Component } from 'react';
import TableRow from '@material-ui/core/TableRow';
import TableCell from '@material-ui/core/TableCell';
import Checkbox from '@material-ui/core/Checkbox';

import CustomerDelete from './CutomerDelete';

class CustomerList extends Component {

    state = {
        selected: false
    }

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
        console.log(" this.props.id : " + this.props.id);
        return (
            <TableRow>
                <TableCell padding="checkbox"><Checkbox checked={this.isSelected(this.props.id)} onChange={event => this.handleClick(event, this.props.id)}/></TableCell>
                <TableCell>{this.props.id}</TableCell>
                <TableCell><img src={this.props.image} alt="profile" /></TableCell>
                <TableCell>{this.props.name}</TableCell>
                <TableCell>{this.props.birthday}</TableCell>
                <TableCell>{this.props.gender}</TableCell>
                <TableCell>{this.props.job}</TableCell>  
                <TableCell><CustomerDelete stateRefresh={this.props.stateRefresh} id={this.props.id} /></TableCell>
            </TableRow>
        );
    }
}

export default CustomerList;