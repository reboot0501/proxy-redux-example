import React, { Component } from 'react';

import CustomerList from './CustomerList';
import CustomerInsert from './CustomerInsert';

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

    render() {
        const cellList = ["번호", "프로필이미지", "이름", "생년월일", "성별", "직업", "삭제"];
        return (
            <div className="root">
                <div className="menu">
                    <CustomerInsert stateRefresh={this.props.stateRefresh}/>
                </div>
                <Paper className="paper">
                    <Table>
                        <TableHead > 
                            <TableRow>
                                { cellList.map(c => {
                                    return (
                                        <TableCell className="tableHead"><Typography variant="h6">{c}</Typography></TableCell>
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
                                    <TableCell colSpan="7">
                                        <LinearProgress className="progress" color="secondary" variant="buffer" value={this.props.completed} valueBuffer={this.props.buffer} />
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