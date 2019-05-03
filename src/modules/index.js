import { combineReducers } from 'redux';

import list from './list';

import insert from './insert';


import { penderReducer } from 'redux-pender';

export default combineReducers({
    list,
    insert,
    pender: penderReducer // 내장된 리듀서를 루트 리듀서에 넣어 주는 것
});