/**
 * 리덕스에서 일반적으로 사용하는 액션타입 / 액션생성자 / 리듀서 파일을 
 * 모두 한 파일에 모듈화하여 관리하는 Ducks 파일구조
 */
// 리덕스에서 더쉬운 액션을 관리 할때 유용한 패키지 import
import { handleActions, createAction } from 'redux-actions';
// 서버 통신 모듈
import axios from 'axios';
// 리듀서에서 비동기 redux-pender 로 관리 할때는 ...pender를 사용합니다.
// 이 비동기 작업을 여러개 관리 한다면 ...pender를 여러번 사용하해야 하나
// applyPenders 함수를 사용하면 ...pender 사용할 필요가 없다.
import { applyPenders } from 'redux-pender';

// API요청 함수
function callApi(params) {
    const url = "/customer/insert";
    console.log(" ★★★ request!!! \n" + JSON.stringify(params, null,2)); 
    const jsonData = JSON.stringify(params);                              
    const config = {
        headers: {
            'Content-type': 'application/json'
        }
    };
    return axios.post(url, jsonData, config);
}
// 액션 타입 정의
const POST_INSERT = 'POST_INSERT';

// 액션 생성자
export const postInsert = createAction(POST_INSERT, callApi);

// 초기 state
const initialState = {
    data: {}
}

// 액션 함수 정의 switch 문 대신 handleActions 사용
const reducer = handleActions({
    // 함수를 생략했을때 기본값으로는 (state, action) => state를 설정한다.
    // (state를 그대로 반환한다는 것이죠)
}, initialState);

// applyPender 함수를 사용할 때 첫번째 파라미터에는 일반 리듀서를 넣어주고
// 두번째 파라미터에는 pender 관련 액션객체들을 배열 형태로 넣어 주면 된다.
// 이제 post 리듀서에서 error 값과 pending 값을 더이상 관여하지 않고 
// pender 리듀서가 대신하게 된다. 
export default applyPenders(reducer, [
    {
        type: POST_INSERT,
        onSuccess: (state, action) => {

            return {
                data: action.payload.data
            }
        },
        /* 다른 Pender 액션들
            { type: GET_SOMETHING1, onSuccess: (state, action) => ... }
            { type: GET_SOMETHING2, onSuccess: (state, action) => ... }            
        */
    }
])



