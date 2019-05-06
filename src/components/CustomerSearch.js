import React, { Component } from 'react';
import Button from '@material-ui/core/Button';

class CustomerSearch extends Component {

    render() {

        return (
            <div>
                <Button variant="contained" color="primary" onClick={this.props.onClick} >
                    고객 조회 하기
                </Button>                
            </div>
        );
    }
}

export default CustomerSearch;