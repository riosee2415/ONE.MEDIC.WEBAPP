import { all, call, delay, fork, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import {
  PPR_LIST_REQUEST,
  PPR_LIST_SUCCESS,
  PPR_LIST_FAILURE,
  //
  PPR_DETAIL_REQUEST,
  PPR_DETAIL_SUCCESS,
  PPR_DETAIL_FAILURE,
  //
  PPR_CREATE_REQUEST,
  PPR_CREATE_SUCCESS,
  PPR_CREATE_FAILURE,
  //
  PPR_COMPLETE_REQUEST,
  PPR_COMPLETE_SUCCESS,
  PPR_COMPLETE_FAILURE,
  //
  PPR_REFUSE_REQUEST,
  PPR_REFUSE_SUCCESS,
  PPR_REFUSE_FAILURE,
  //
  PPR_DELIVERY_REQUEST,
  PPR_DELIVERY_SUCCESS,
  PPR_DELIVERY_FAILURE,
  //
  PPR_ISPAYMENT_REQUEST,
  PPR_ISPAYMENT_SUCCESS,
  PPR_ISPAYMENT_FAILURE,
  //
  PPR_ADDRESS_UPDATE_REQUEST,
  PPR_ADDRESS_UPDATE_SUCCESS,
  PPR_ADDRESS_UPDATE_FAILURE,
} from "../reducers/prescriptionPaymentRequest";

// ******************************************************************************************************************
// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
async function pprListAPI(data) {
  return await axios.get(
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

// ******************************************************************************************************************
// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
async function pprDetailAPI(data) {
  return await axios.post(`/api/prescriptionPayment/detail`, data);
}
function* pprDetail(action) {
  try {
    const result = yield call(pprDetailAPI, action.data);

    yield put({
      type: PPR_DETAIL_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: PPR_DETAIL_FAILURE,
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
async function pprCreateAPI(data) {
  return await axios.post(`/api/prescriptionPayment/create`, data);
}
function* pprCreate(action) {
  try {
    const result = yield call(pprCreateAPI, action.data);

    yield put({
      type: PPR_CREATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: PPR_CREATE_FAILURE,
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
async function pprIsCompleteAPI(data) {
  return await axios.patch(
    `/api/prescriptionPayment/isCompleted/${data.pprId}`
  );
}
function* pprIsComplete(action) {
  try {
    const result = yield call(pprIsCompleteAPI, action.data);

    yield put({
      type: PPR_COMPLETE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: PPR_COMPLETE_FAILURE,
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
async function pprIsRefuseAPI(data) {
  return await axios.patch(
    `/api/prescriptionPayment/isRefuse/${data.pprId}`,
    data
  );
}
function* pprIsRefuse(action) {
  try {
    const result = yield call(pprIsRefuseAPI, action.data);

    yield put({
      type: PPR_REFUSE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: PPR_REFUSE_FAILURE,
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
async function pprDeliveryAPI(data) {
  return await axios.patch(
    `/api/prescriptionPayment/delivery/${data.pprId}`,
    data
  );
}
function* pprDelivery(action) {
  try {
    const result = yield call(pprDeliveryAPI, action.data);

    yield put({
      type: PPR_DELIVERY_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: PPR_DELIVERY_FAILURE,
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
async function pprIsPaymentAPI(data) {
  return await axios.patch(
    `/api/prescriptionPayment/isPayment/${data.pprId}`,
    data
  );
}
function* pprIsPayment(action) {
  try {
    const result = yield call(pprIsPaymentAPI, action.data);

    yield put({
      type: PPR_ISPAYMENT_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: PPR_ISPAYMENT_FAILURE,
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
async function pprAddressUpdateAPI(data) {
  return await axios.patch(`/api/prescriptionPayment/address/update`, data);
}
function* pprAddressUpdate(action) {
  try {
    const result = yield call(pprAddressUpdateAPI, action.data);

    yield put({
      type: PPR_ADDRESS_UPDATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: PPR_ADDRESS_UPDATE_FAILURE,
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

function* watchPprDetail() {
  yield takeLatest(PPR_DETAIL_REQUEST, pprDetail);
}

function* watchPprCreate() {
  yield takeLatest(PPR_CREATE_REQUEST, pprCreate);
}

function* watchPprIsComplete() {
  yield takeLatest(PPR_COMPLETE_REQUEST, pprIsComplete);
}

function* watchPprIsRefuse() {
  yield takeLatest(PPR_REFUSE_REQUEST, pprIsRefuse);
}

function* watchPprDelivery() {
  yield takeLatest(PPR_DELIVERY_REQUEST, pprDelivery);
}

function* watchPprIsPayment() {
  yield takeLatest(PPR_ISPAYMENT_REQUEST, pprIsPayment);
}

function* watchPprAddressUpdate() {
  yield takeLatest(PPR_ADDRESS_UPDATE_REQUEST, pprAddressUpdate);
}

//////////////////////////////////////////////////////////////
export default function* pprSaga() {
  yield all([
    fork(watchPprList),
    fork(watchPprDetail),
    fork(watchPprCreate),
    fork(watchPprIsComplete),
    fork(watchPprIsRefuse),
    fork(watchPprDelivery),
    fork(watchPprIsPayment),
    fork(watchPprAddressUpdate),
    //
  ]);
}
