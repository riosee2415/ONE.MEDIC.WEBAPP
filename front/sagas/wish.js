import { all, call, delay, fork, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import {
  // 장바구니에 리스트
  WISH_LIST_REQUEST,
  WISH_LIST_SUCCESS,
  WISH_LIST_FAILURE,
  // 장바구니에 상품 추가(약속처방)
  WISH_PAYMENT_CREATE_REQUEST,
  WISH_PAYMENT_CREATE_SUCCESS,
  WISH_PAYMENT_CREATE_FAILURE,
  // 장바구니에 상품 삭제(약속처방)
  WISH_PAYMENT_DELETE_REQUEST,
  WISH_PAYMENT_DELETE_SUCCESS,
  WISH_PAYMENT_DELETE_FAILURE,
  // 장바구니에 상품 추가(탕전처방)
  WISH_PRE_CREATE_REQUEST,
  WISH_PRE_CREATE_SUCCESS,
  WISH_PRE_CREATE_FAILURE,
} from "../reducers/wish";

// ******************************************************************************************************************
// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
async function wishListAPI(data) {
  return await axios.post(`/api/wish/list/view`, data);
}

function* wishList(action) {
  try {
    const result = yield call(wishListAPI, action.data);

    yield put({
      type: WISH_LIST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: WISH_LIST_FAILURE,
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
async function wishPaymentCreateAPI(data) {
  return await axios.post(`/api/wish/payment/container/create`, data);
}

function* wishPaymentCreate(action) {
  try {
    const result = yield call(wishPaymentCreateAPI, action.data);

    yield put({
      type: WISH_PAYMENT_CREATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: WISH_PAYMENT_CREATE_FAILURE,
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
async function wishPaymentDeleteAPI(data) {
  return await axios.post(`/api/wish/payment/container/delete`, data);
}

function* wishPaymentDelete(action) {
  try {
    const result = yield call(wishPaymentDeleteAPI, action.data);

    yield put({
      type: WISH_PAYMENT_DELETE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: WISH_PAYMENT_DELETE_FAILURE,
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
async function wishPreCreateAPI(data) {
  return await axios.post(`/api/wish/pre/item/create`, data);
}

function* wishPreCreate(action) {
  try {
    const result = yield call(wishPreCreateAPI, action.data);

    yield put({
      type: WISH_PRE_CREATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: WISH_PRE_CREATE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

//////////////////////////////////////////////////////////////

function* watchWishList() {
  yield takeLatest(WISH_LIST_REQUEST, wishList);
}

function* watchWishPaymentCreate() {
  yield takeLatest(WISH_PAYMENT_CREATE_REQUEST, wishPaymentCreate);
}

function* watchWishPaymentDelete() {
  yield takeLatest(WISH_PAYMENT_DELETE_REQUEST, wishPaymentDelete);
}

function* watchWishPreCreate() {
  yield takeLatest(WISH_PRE_CREATE_REQUEST, wishPreCreate);
}

//////////////////////////////////////////////////////////////

export default function* wishSaga() {
  yield all([
    //
    fork(watchWishList),
    fork(watchWishPaymentCreate),
    fork(watchWishPaymentDelete),
    fork(watchWishPreCreate),
  ]);
}
