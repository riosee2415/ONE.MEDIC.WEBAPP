import { all, call, delay, fork, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import {
  DELIVERY_REQUEST_LIST_REQUEST,
  DELIVERY_REQUEST_LIST_SUCCESS,
  DELIVERY_REQUEST_LIST_FAILURE,
  //
  DELIVERY_REQUEST_CREATE_REQUEST,
  DELIVERY_REQUEST_CREATE_SUCCESS,
  DELIVERY_REQUEST_CREATE_FAILURE,
  //
  DELIVERY_REQUEST_UPDATE_REQUEST,
  DELIVERY_REQUEST_UPDATE_SUCCESS,
  DELIVERY_REQUEST_UPDATE_FAILURE,
  //
  DELIVERY_REQUEST_DELETE_REQUEST,
  DELIVERY_REQUEST_DELETE_SUCCESS,
  DELIVERY_REQUEST_DELETE_FAILURE,
  //
  DELIVERY_REQUEST_ALL_LIST_REQUEST,
  DELIVERY_REQUEST_ALL_LIST_SUCCESS,
  DELIVERY_REQUEST_ALL_LIST_FAILURE,
} from "../reducers/userDeliveryRequest";

// ******************************************************************************************************************
// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
async function deliveryRequestListAPI(data) {
  return await axios.post(`/api/deliveryReq/list`, data);
}

function* deliveryRequestList(action) {
  try {
    const result = yield call(deliveryRequestListAPI, action.data);

    yield put({
      type: DELIVERY_REQUEST_LIST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: DELIVERY_REQUEST_LIST_FAILURE,
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
async function deliveryRequestCreateAPI(data) {
  return await axios.post(`/api/deliveryReq/create`, data);
}

function* deliveryRequestCreate(action) {
  try {
    const result = yield call(deliveryRequestCreateAPI, action.data);

    yield put({
      type: DELIVERY_REQUEST_CREATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: DELIVERY_REQUEST_CREATE_FAILURE,
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
async function deliveryRequestUpdateAPI(data) {
  return await axios.post(`/api/deliveryReq/update`, data);
}

function* deliveryRequestUpdate(action) {
  try {
    const result = yield call(deliveryRequestUpdateAPI, action.data);

    yield put({
      type: DELIVERY_REQUEST_UPDATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: DELIVERY_REQUEST_UPDATE_FAILURE,
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
async function deliveryRequestDeleteAPI(data) {
  return await axios.post(`/api/deliveryReq/delete`, data);
}

function* deliveryRequestDelete(action) {
  try {
    const result = yield call(deliveryRequestDeleteAPI, action.data);

    yield put({
      type: DELIVERY_REQUEST_DELETE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: DELIVERY_REQUEST_DELETE_FAILURE,
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
async function deliveryRequestAllListAPI(data) {
  return await axios.post(`/api/deliveryReq/allList`, data);
}

function* deliveryRequestAllList(action) {
  try {
    const result = yield call(deliveryRequestAllListAPI, action.data);

    yield put({
      type: DELIVERY_REQUEST_ALL_LIST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: DELIVERY_REQUEST_ALL_LIST_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

//////////////////////////////////////////////////////////////

function* watchDeliveryRequestList() {
  yield takeLatest(DELIVERY_REQUEST_LIST_REQUEST, deliveryRequestList);
}

function* watchDeliveryRequestCreate() {
  yield takeLatest(DELIVERY_REQUEST_CREATE_REQUEST, deliveryRequestCreate);
}

function* watchDeliveryRequestUpdate() {
  yield takeLatest(DELIVERY_REQUEST_UPDATE_REQUEST, deliveryRequestUpdate);
}

function* watchDeliveryRequestDelete() {
  yield takeLatest(DELIVERY_REQUEST_DELETE_REQUEST, deliveryRequestDelete);
}

function* watchDeliveryRequestAllList() {
  yield takeLatest(DELIVERY_REQUEST_ALL_LIST_REQUEST, deliveryRequestAllList);
}

//////////////////////////////////////////////////////////////
export default function* deliveryRequestSaga() {
  yield all([
    fork(watchDeliveryRequestList),
    fork(watchDeliveryRequestCreate),
    fork(watchDeliveryRequestUpdate),
    fork(watchDeliveryRequestDelete),
    fork(watchDeliveryRequestAllList),
  ]);
}
