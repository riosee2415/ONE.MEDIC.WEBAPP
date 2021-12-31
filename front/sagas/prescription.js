import { all, call, delay, fork, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import {
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAILURE,
  //
  PRODUCT_TYPE_LIST_REQUEST,
  PRODUCT_TYPE_LIST_SUCCESS,
  PRODUCT_TYPE_LIST_FAILURE,
  //
  PRODUCT_TYPE_ADD_REQUEST,
  PRODUCT_TYPE_ADD_SUCCESS,
  PRODUCT_TYPE_ADD_FAILURE,
} from "../reducers/prescription";

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function productListAPI(data) {
  if (data.title) {
    return axios.get(`/api/prescription/list/${data.title}`);
  } else {
    return axios.get(`/api/prescription/list`);
  }
}

function* productList(action) {
  try {
    const result = yield call(productListAPI, action.data);

    yield put({
      type: PRODUCT_LIST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: PRODUCT_LIST_FAILURE,
      error: err.response.data,
    });
  }
}

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function productTypeListAPI(data) {
  return axios.get(`/api/prescription/type/list/${data.id}`);
}

function* productTypeList(action) {
  try {
    const result = yield call(productTypeListAPI, action.data);

    yield put({
      type: PRODUCT_TYPE_LIST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: PRODUCT_TYPE_LIST_FAILURE,
      error: err.response.data,
    });
  }
}

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function productAddListAPI(data) {
  return axios.post(`/api/prescription/type/add`, data);
}

function* productAddList(action) {
  try {
    const result = yield call(productAddListAPI, action.data);

    yield put({
      type: PRODUCT_TYPE_ADD_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: PRODUCT_TYPE_ADD_FAILURE,
      error: err.response.data,
    });
  }
}

//////////////////////////////////////////////////////////////
function* watchProductList() {
  yield takeLatest(PRODUCT_LIST_REQUEST, productList);
}

function* watchProductTypeList() {
  yield takeLatest(PRODUCT_TYPE_LIST_REQUEST, productTypeList);
}

function* watchProductAddList() {
  yield takeLatest(PRODUCT_TYPE_ADD_REQUEST, productAddList);
}

//////////////////////////////////////////////////////////////
export default function* prescriptionSaga() {
  yield all([
    fork(watchProductList),
    fork(watchProductTypeList),
    fork(watchProductAddList),
    //
  ]);
}
