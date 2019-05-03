// createStore, applyMiddleware 패키지 import
import { createStore, applyMiddleware } from 'redux';
// redux-actions 로 정의 액션type 정의/액션생성, 액션에 따른 함수 정의된 컴포넌트 import
import modules from './modules';
// createLogger
import { createLogger } from 'redux-logger'
// Promise 기반 액션을 관리하는 미들웨어가 포함되어 있는 라이브러리 import
import promiseMiddleware from 'redux-pender';

const logger = createLogger();

const store = createStore(modules, applyMiddleware(logger, promiseMiddleware()));

export default store;