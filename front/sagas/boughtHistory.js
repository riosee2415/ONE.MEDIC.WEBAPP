import { all, call, delay, fork, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import {
  BOUGHT_DELIVERY_REQUEST,
  BOUGHT_DELIVERY_SUCCESS,
  BOUGHT_DELIVERY_FAILURE,
  //
  BOUGHT_PAY_REQUEST,
  BOUGHT_PAY_SUCCESS,
  BOUGHT_PAY_FAILURE,
  //
  BOUGHT_DETAIL_REQUEST,
  BOUGHT_DETAIL_SUCCESS,
  BOUGHT_DETAIL_FAILURE,
  //
  BOUGHT_LIST_REQUEST,
  BOUGHT_LIST_SUCCESS,
  BOUGHT_LIST_FAILURE,
  //
  BOUGHT_ADMIN_LIST_REQUEST,
  BOUGHT_ADMIN_LIST_SUCCESS,
  BOUGHT_ADMIN_LIST_FAILURE,
  //
  BOUGHT_DELIVERY_UPDATE_REQUEST,
  BOUGHT_DELIVERY_UPDATE_SUCCESS,
  BOUGHT_DELIVERY_UPDATE_FAILURE,
} from "../reducers/boughtHistory";

// ******************************************************************************************************************
// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
async function boughtDeliveryAPI(data) {
  return await axios.post(`/api/bought/create/delivery`, data);
}

function* boughtDelivery(action) {
  try {
    const result = yield call(boughtDeliveryAPI, action.data);

    yield put({
      type: BOUGHT_DELIVERY_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: BOUGHT_DELIVERY_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// ******************************************************************************************************************
// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
async function boughtPayAPI(data) {
  return await axios.post(`/api/bought/create/isPay`, data);
}

function* boughtPay(action) {
  try {
    const result = yield call(boughtPayAPI, action.data);

    yield put({
      type: BOUGHT_PAY_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: BOUGHT_PAY_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// ******************************************************************************************************************
// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
async function boughtDetailAPI(data) {
  return await axios.post(`/api/bought/detail`, data);
}

function* boughtDetail(action) {
  try {
    const result = yield call(boughtDetailAPI, action.data);

    yield put({
      type: BOUGHT_DETAIL_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: BOUGHT_DETAIL_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// ******************************************************************************************************************
// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
async function boughtListAPI(data) {
  return await axios.post(`/api/bought/list`, data);
}

function* boughtList(action) {
  try {
    const result = yield call(boughtListAPI, action.data);

    yield put({
      type: BOUGHT_LIST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: BOUGHT_LIST_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// ******************************************************************************************************************
// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
async function boughtAdminListAPI(data) {
  return await axios.post(`/api/bought/admin/list`, data);
}

function* boughtAdminList(action) {
  try {
    const result = yield call(boughtAdminListAPI, action.data);

    yield put({
      type: BOUGHT_ADMIN_LIST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: BOUGHT_ADMIN_LIST_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// ******************************************************************************************************************
// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
async function boughtDeliveryUpdateAPI(data) {
  return await axios.post(`/api/bought/delivery/update`, data);
}

function* boughtDeliveryUpdate(action) {
  try {
    const result = yield call(boughtDeliveryUpdateAPI, action.data);

    yield put({
      type: BOUGHT_DELIVERY_UPDATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: BOUGHT_DELIVERY_UPDATE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

//////////////////////////////////////////////////////////////

function* watchBoughtDelivery() {
  yield takeLatest(BOUGHT_DELIVERY_REQUEST, boughtDelivery);
}

function* watchBoughtPay() {
  yield takeLatest(BOUGHT_PAY_REQUEST, boughtPay);
}

function* watchBoughtDetail() {
  yield takeLatest(BOUGHT_DETAIL_REQUEST, boughtDetail);
}

function* watchBoughtList() {
  yield takeLatest(BOUGHT_LIST_REQUEST, boughtList);
}

function* watchBoughtAdminList() {
  yield takeLatest(BOUGHT_ADMIN_LIST_REQUEST, boughtAdminList);
}

function* watchBoughtDeliveryUpdate() {
  yield takeLatest(BOUGHT_DELIVERY_UPDATE_REQUEST, boughtDeliveryUpdate);
}

//////////////////////////////////////////////////////////////
export default function* boughtHistorySaga() {
  yield all([
    fork(watchBoughtDelivery),
    fork(watchBoughtPay),
    fork(watchBoughtDetail),
    fork(watchBoughtList),
    fork(watchBoughtAdminList),
    fork(watchBoughtDeliveryUpdate),
    //
  ]);
}
