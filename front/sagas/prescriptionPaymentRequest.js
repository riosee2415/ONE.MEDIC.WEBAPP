import { all, call, delay, fork, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import {
  PPR_LIST_REQUEST,
  PPR_LIST_SUCCESS,
  PPR_LIST_FAILURE,
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

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function pprIsCompleteAPI(data) {
  return axios.patch(`/api/prescriptionPayment/isCompleted/${data.pprId}`);
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

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function pprIsRefuseAPI(data) {
  return axios.patch(`/api/prescriptionPayment/isRefuse/${data.pprId}`, data);
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

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function pprDeliveryAPI(data) {
  return axios.patch(`/api/prescriptionPayment/delivery/${data.pprId}`, data);
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

function* watchPprList() {
  yield takeLatest(PPR_LIST_REQUEST, pprList);
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

//////////////////////////////////////////////////////////////
export default function* pprSaga() {
  yield all([
    fork(watchPprList),
    fork(watchPprIsComplete),
    fork(watchPprIsRefuse),
    fork(watchPprDelivery),
    //
  ]);
}
