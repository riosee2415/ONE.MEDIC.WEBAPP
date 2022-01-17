import { all, call, delay, fork, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import {
  PAYMENTREQUEST_LIST_REQUEST,
  PAYMENTREQUEST_LIST_SUCCESS,
  PAYMENTREQUEST_LIST_FAILURE,
} from "../reducers/paymentRequest";

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function paymentRequestListAPI(data) {
  return axios.get(`/api/payment/list/${data.type}`);
}

function* paymentRequestList(action) {
  try {
    const result = yield call(paymentRequestListAPI, action.data);

    yield put({
      type: PAYMENTREQUEST_LIST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: PAYMENTREQUEST_LIST_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

function* watchPaymentRequestList() {
  yield takeLatest(PAYMENTREQUEST_LIST_REQUEST, paymentRequestList);
}

//////////////////////////////////////////////////////////////
export default function* paymentRequestSaga() {
  yield all([
    fork(watchPaymentRequestList),
    //
  ]);
}
