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
  //
  PAYMENTREQUEST_DELIVERY_REQUEST,
  PAYMENTREQUEST_DELIVERY_SUCCESS,
  PAYMENTREQUEST_DELIVERY_FAILURE,
  //
  PAYMENTREQUEST_CREATE_REQUEST,
  PAYMENTREQUEST_CREATE_SUCCESS,
  PAYMENTREQUEST_CREATE_FAILURE,
  //
  PAYMENT_DETAIL_REQUEST,
  PAYMENT_DETAIL_SUCCESS,
  PAYMENT_DETAIL_FAILURE,
  //
  PAYMENT_DELIVERY_REQUEST,
  PAYMENT_DELIVERY_SUCCESS,
  PAYMENT_DELIVERY_FAILURE,
  //
  PAYMENT_ISPAYMENT_REQUEST,
  PAYMENT_ISPAYMENT_SUCCESS,
  PAYMENT_ISPAYMENT_FAILURE,
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
  return axios.patch(`/api/payment/isCompleted/${data.paymentId}`);
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

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function paymentRequestDeliveryAPI(data) {
  return axios.patch(`/api/payment/delivery/${data.paymentId}`, data);
}

function* paymentRequestDelivery(action) {
  try {
    const result = yield call(paymentRequestDeliveryAPI, action.data);

    yield put({
      type: PAYMENTREQUEST_DELIVERY_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: PAYMENTREQUEST_DELIVERY_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function paymentCreateAPI(data) {
  return axios.post(`/api/payment/create`, data);
}

function* paymentCreate(action) {
  try {
    const result = yield call(paymentCreateAPI, action.data);

    yield put({
      type: PAYMENTREQUEST_CREATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: PAYMENTREQUEST_CREATE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************
// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function paymentDetailAPI(data) {
  return axios.get(`/api/payment/detail/${data.paymentId}`, data);
}

function* paymentDetail(action) {
  try {
    const result = yield call(paymentDetailAPI, action.data);

    yield put({
      type: PAYMENT_DETAIL_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: PAYMENT_DETAIL_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************
// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function paymentDeliveryAPI(data) {
  return axios.patch(`/api/payment/address/update`, data);
}

function* paymentDelivery(action) {
  try {
    const result = yield call(paymentDeliveryAPI, action.data);

    yield put({
      type: PAYMENT_DELIVERY_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: PAYMENT_DELIVERY_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************
// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function paymentIsPaymentAPI(data) {
  return axios.patch(`/api/payment/isPayment/${data.paymentId}`, data);
}

function* paymentIsPayment(action) {
  try {
    const result = yield call(paymentIsPaymentAPI, action.data);

    yield put({
      type: PAYMENT_ISPAYMENT_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: PAYMENT_ISPAYMENT_FAILURE,
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

function* watchPaymentRequestDelivery() {
  yield takeLatest(PAYMENTREQUEST_DELIVERY_REQUEST, paymentRequestDelivery);
}

function* watchPaymentCreate() {
  yield takeLatest(PAYMENTREQUEST_CREATE_REQUEST, paymentCreate);
}

function* watchPaymentDetail() {
  yield takeLatest(PAYMENT_DETAIL_REQUEST, paymentDetail);
}

function* watchPaymentDelivery() {
  yield takeLatest(PAYMENT_DELIVERY_REQUEST, paymentDelivery);
}

function* watchPaymentIsPayment() {
  yield takeLatest(PAYMENT_ISPAYMENT_REQUEST, paymentIsPayment);
}

//////////////////////////////////////////////////////////////
export default function* paymentRequestSaga() {
  yield all([
    fork(watchPaymentRequestList),
    fork(watchPaymentRequestComplete),
    fork(watchPaymentRequestDelivery),
    fork(watchPaymentCreate),
    fork(watchPaymentDetail),
    fork(watchPaymentDelivery),
    fork(watchPaymentIsPayment),
    //
  ]);
}
