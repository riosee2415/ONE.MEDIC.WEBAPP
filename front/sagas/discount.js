import { all, call, delay, fork, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import {
  DISCOUNT_LIST_REQUEST,
  DISCOUNT_LIST_SUCCESS,
  DISCOUNT_LIST_FAILURE,
  //
  DISCOUNT_CREATE_REQUEST,
  DISCOUNT_CREATE_SUCCESS,
  DISCOUNT_CREATE_FAILURE,
  //
  DISCOUNT_UPDATE_REQUEST,
  DISCOUNT_UPDATE_SUCCESS,
  DISCOUNT_UPDATE_FAILURE,
} from "../reducers/discount";

// ******************************************************************************************************************
// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function discountListAPI() {
  return axios.get(`/api/discount/list`);
}

function* discountList(action) {
  try {
    const result = yield call(discountListAPI, action.data);

    yield put({
      type: DISCOUNT_LIST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: DISCOUNT_LIST_FAILURE,
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
function discountCreateAPI(data) {
  return axios.post(`/api/discount/create`, data);
}

function* discountCreate(action) {
  try {
    const result = yield call(discountCreateAPI, action.data);

    yield put({
      type: DISCOUNT_CREATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: DISCOUNT_CREATE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// ******************************************************************************************************************
// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function discountUpdateAPI(data) {
  return axios.patch(`/api/discount/update`, data);
}

function* discountUpdate(action) {
  try {
    const result = yield call(discountUpdateAPI, action.data);

    yield put({
      type: DISCOUNT_UPDATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: DISCOUNT_UPDATE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

//////////////////////////////////////////////////////////////
function* watchDiscountList() {
  yield takeLatest(DISCOUNT_LIST_REQUEST, discountList);
}
function* watchDiscountCreate() {
  yield takeLatest(DISCOUNT_CREATE_REQUEST, discountCreate);
}
function* watchDiscountUpdate() {
  yield takeLatest(DISCOUNT_UPDATE_REQUEST, discountUpdate);
}

//////////////////////////////////////////////////////////////
export default function* discountSaga() {
  yield all([
    fork(watchDiscountList),
    fork(watchDiscountCreate),
    fork(watchDiscountUpdate),
    //
  ]);
}
