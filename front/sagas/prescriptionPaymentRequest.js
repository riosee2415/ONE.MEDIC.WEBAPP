import { all, call, delay, fork, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import {
  PPR_LIST_REQUEST,
  PPR_LIST_SUCCESS,
  PPR_LIST_FAILURE,
} from "../reducers/prescriptionPaymentRequest";

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function pprListAPI(data) {
  return axios.get(
    `/api/prescriptionPayment/list?type=${data.type}&isCondition=${data.isCondition}`
  );
}
function* pprList(action) {
  try {
    const result = yield call(pprListAPI, action.data);

    yield put({
      type: PPR_LIST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: PPR_LIST_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

function* watchPprList() {
  yield takeLatest(PPR_LIST_REQUEST, pprList);
}

//////////////////////////////////////////////////////////////
export default function* pprSaga() {
  yield all([
    fork(watchPprList),
    //
  ]);
}
