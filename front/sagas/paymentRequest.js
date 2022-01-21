import { all, call, delay, fork, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import {
  PAYMENTREQUEST_LIST_REQUEST,
  PAYMENTREQUEST_LIST_SUCCESS,
  PAYMENTREQUEST_LIST_FAILURE,
  //
  PAYMENTREQUEST_COMPLETE_REQUEST,
  PAYMENTREQUEST_COMPLETE_SUCCESS,
  PAYMENTREQUEST_COMPLETE_FAILURE,
} from "../reducers/paymentRequest";

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function paymentRequestListAPI(data) {
  return axios.get(
    `/api/payment/list?type=${data.type}&isComplete=${data.isComplete}`
  );
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

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function paymentRequestCompleteAPI(data) {
  return axios.patch(`/api/payment/complete/${data.paymentId}`);
}

function* paymentRequestComplete(action) {
  try {
    const result = yield call(paymentRequestCompleteAPI, action.data);

    yield put({
      type: PAYMENTREQUEST_COMPLETE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: PAYMENTREQUEST_COMPLETE_FAILURE,
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

function* watchPaymentRequestComplete() {
  yield takeLatest(PAYMENTREQUEST_COMPLETE_REQUEST, paymentRequestComplete);
}

//////////////////////////////////////////////////////////////
export default function* paymentRequestSaga() {
  yield all([
    fork(watchPaymentRequestList),
    fork(watchPaymentRequestComplete),
    //
  ]);
}
