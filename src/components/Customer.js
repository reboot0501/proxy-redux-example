import React, { Component } from 'react';

import CustomerList from './CustomerList';
import CustomerInsert from './CustomerInsert';
import CustomerSearch from './CustomerSearch';

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

class Customer extends Component {

    constructor(props) {
        super(props);
        this.state = {
            searchName: ''
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
                <Paper className="paper">
                    <Table>
                        <TableHead > 
                            <TableRow>
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
                                        <CustomerList stateRefresh={this.props.stateRefresh}
                                            key={c.id}
                                            id={c.id}
                                            image={c.image}
                                            name={c.name}
                                            birthday={c.birthday}
                                            gender={c.gender}
                                            job={c.job}
                                        />
                                    );
                                }) 
                                :
                                <TableRow>
                                    <TableCell colSpan="7" align="center">
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