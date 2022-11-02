import { all, call, delay, fork, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import {
  // 장바구니에 리스트
  WISH_LIST_REQUEST,
  WISH_LIST_SUCCESS,
  WISH_LIST_FAILURE,

  // 장바구니에 상품 상세(약속처방)
  WISH_PAYMENT_DETAIL_REQUEST,
  WISH_PAYMENT_DETAIL_SUCCESS,
  WISH_PAYMENT_DETAIL_FAILURE,

  // 장바구니에 상품 추가(약속처방)
  WISH_PAYMENT_CREATE_REQUEST,
  WISH_PAYMENT_CREATE_SUCCESS,
  WISH_PAYMENT_CREATE_FAILURE,

  // 장바구니에 상품 수정(약속처방)
  WISH_PAYMENT_UPDATE_REQUEST,
  WISH_PAYMENT_UPDATE_SUCCESS,
  WISH_PAYMENT_UPDATE_FAILURE,

  // 장바구니에 안에 상품 추가(약속처방)
  WISH_PAYMENT_ITEM_CREATE_REQUEST,
  WISH_PAYMENT_ITEM_CREATE_SUCCESS,
  WISH_PAYMENT_ITEM_CREATE_FAILURE,

  // 장바구니에 안에 상품 수정(약속처방)
  WISH_PAYMENT_ITEM_UPDATE_REQUEST,
  WISH_PAYMENT_ITEM_UPDATE_SUCCESS,
  WISH_PAYMENT_ITEM_UPDATE_FAILURE,

  // 장바구니에 안에 상품 삭제(약속처방)
  WISH_PAYMENT_ITEM_DELETE_REQUEST,
  WISH_PAYMENT_ITEM_DELETE_SUCCESS,
  WISH_PAYMENT_ITEM_DELETE_FAILURE,

  // 장바구니에 안에 상품 수량 수정(약속처방)
  WISH_PAYMENT_ITEM_QNT_REQUEST,
  WISH_PAYMENT_ITEM_QNT_SUCCESS,
  WISH_PAYMENT_ITEM_QNT_FAILURE,

  // 장바구니에 상품 상세(탕전처방)
  WISH_PRE_DETAIL_REQUEST,
  WISH_PRE_DETAIL_SUCCESS,
  WISH_PRE_DETAIL_FAILURE,

  // 장바구니에 상품 추가(탕전처방)
  WISH_PRE_CREATE_REQUEST,
  WISH_PRE_CREATE_SUCCESS,
  WISH_PRE_CREATE_FAILURE,

  // 장바구니에 상품 수정(탕전처방)
  WISH_PRE_UPDATE_REQUEST,
  WISH_PRE_UPDATE_SUCCESS,
  WISH_PRE_UPDATE_FAILURE,

  // 장바구니 안에 상품 생성(탕전처방)
  WISH_PRE_ITEM_CREATE_REQUEST,
  WISH_PRE_ITEM_CREATE_SUCCESS,
  WISH_PRE_ITEM_CREATE_FAILURE,

  // 장바구니 안에 상품 수정(탕전처방)
  WISH_PRE_ITEM_UPDATE_REQUEST,
  WISH_PRE_ITEM_UPDATE_SUCCESS,
  WISH_PRE_ITEM_UPDATE_FAILURE,

  // 장바구니 안에 상품 삭제(탕전처방)
  WISH_PRE_ITEM_DELETE_REQUEST,
  WISH_PRE_ITEM_DELETE_SUCCESS,
  WISH_PRE_ITEM_DELETE_FAILURE,

  // 장바구니에 상품 삭제
  WISH_DELETE_REQUEST,
  WISH_DELETE_SUCCESS,
  WISH_DELETE_FAILURE,
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
async function wishPaymentDetailAPI(data) {
  return await axios.post(`/api/wish/payment/container/detail`, data);
}

function* wishPaymentDetail(action) {
  try {
    const result = yield call(wishPaymentDetailAPI, action.data);

    yield put({
      type: WISH_PAYMENT_DETAIL_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: WISH_PAYMENT_DETAIL_FAILURE,
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
async function wishPaymentUpdateAPI(data) {
  return await axios.post(`/api/wish/payment/container/update`, data);
}

function* wishPaymentUpdate(action) {
  try {
    const result = yield call(wishPaymentUpdateAPI, action.data);

    yield put({
      type: WISH_PAYMENT_UPDATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: WISH_PAYMENT_UPDATE_FAILURE,
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
async function wishPaymentItemCreateAPI(data) {
  return await axios.post(`/api/wish/payment/item/create`, data);
}

function* wishPaymentItemCreate(action) {
  try {
    const result = yield call(wishPaymentItemCreateAPI, action.data);

    yield put({
      type: WISH_PAYMENT_ITEM_CREATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: WISH_PAYMENT_ITEM_CREATE_FAILURE,
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
async function wishPaymentItemUpdateAPI(data) {
  return await axios.post(`/api/wish/payment/item/update`, data);
}

function* wishPaymentItemUpdate(action) {
  try {
    const result = yield call(wishPaymentItemUpdateAPI, action.data);

    yield put({
      type: WISH_PAYMENT_ITEM_UPDATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: WISH_PAYMENT_ITEM_UPDATE_FAILURE,
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
async function wishPaymentItemDeleteAPI(data) {
  return await axios.post(`/api/wish/payment/item/delete`, data);
}

function* wishPaymentItemDelete(action) {
  try {
    const result = yield call(wishPaymentItemDeleteAPI, action.data);

    yield put({
      type: WISH_PAYMENT_ITEM_DELETE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: WISH_PAYMENT_ITEM_DELETE_FAILURE,
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
async function wishPaymentItemQntAPI(data) {
  return await axios.post(`/api/wish/payment/item/qnt`, data);
}

function* wishPaymentItemQnt(action) {
  try {
    const result = yield call(wishPaymentItemQntAPI, action.data);

    yield put({
      type: WISH_PAYMENT_ITEM_QNT_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: WISH_PAYMENT_ITEM_QNT_FAILURE,
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
async function wishPreDetailAPI(data) {
  return await axios.post(`/api/wish/pre/item/detail`, data);
}

function* wishPreDetail(action) {
  try {
    const result = yield call(wishPreDetailAPI, action.data);

    yield put({
      type: WISH_PRE_DETAIL_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: WISH_PRE_DETAIL_FAILURE,
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

// ******************************************************************************************************************
// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
async function wishPreUpdateAPI(data) {
  return await axios.post(`/api/wish/pre/item/update`, data);
}

function* wishPreUpdate(action) {
  try {
    const result = yield call(wishPreUpdateAPI, action.data);

    yield put({
      type: WISH_PRE_UPDATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: WISH_PRE_UPDATE_FAILURE,
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
async function wishPreItemCreateAPI(data) {
  return await axios.post(`/api/wish/pre/material/create`, data);
}

function* wishPreItemCreate(action) {
  try {
    const result = yield call(wishPreItemCreateAPI, action.data);

    yield put({
      type: WISH_PRE_ITEM_CREATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: WISH_PRE_ITEM_CREATE_FAILURE,
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
async function wishPreItemUpdateAPI(data) {
  return await axios.post(`/api/wish/pre/material/update`, data);
}

function* wishPreItemUpdate(action) {
  try {
    const result = yield call(wishPreItemUpdateAPI, action.data);

    yield put({
      type: WISH_PRE_ITEM_UPDATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: WISH_PRE_ITEM_UPDATE_FAILURE,
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
async function wishPreItemDeleteAPI(data) {
  return await axios.post(`/api/wish/pre/material/delete`, data);
}

function* wishPreItemDelete(action) {
  try {
    const result = yield call(wishPreItemDeleteAPI, action.data);

    yield put({
      type: WISH_PRE_ITEM_DELETE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: WISH_PRE_ITEM_DELETE_FAILURE,
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
async function wishDeleteAPI(data) {
  return await axios.post(`/api/wish/delete`, data);
}

function* wishDelete(action) {
  try {
    const result = yield call(wishDeleteAPI, action.data);

    yield put({
      type: WISH_DELETE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: WISH_DELETE_FAILURE,
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

function* watchWishPaymentDetail() {
  yield takeLatest(WISH_PAYMENT_DETAIL_REQUEST, wishPaymentDetail);
}

function* watchWishPaymentCreate() {
  yield takeLatest(WISH_PAYMENT_CREATE_REQUEST, wishPaymentCreate);
}

function* watchWishPaymentUpdate() {
  yield takeLatest(WISH_PAYMENT_UPDATE_REQUEST, wishPaymentUpdate);
}

function* watchWishPaymentItemCreate() {
  yield takeLatest(WISH_PAYMENT_ITEM_CREATE_REQUEST, wishPaymentItemCreate);
}

function* watchWishPaymentItemUpdate() {
  yield takeLatest(WISH_PAYMENT_ITEM_UPDATE_REQUEST, wishPaymentItemUpdate);
}

function* watchWishPaymentItemDelete() {
  yield takeLatest(WISH_PAYMENT_ITEM_DELETE_REQUEST, wishPaymentItemDelete);
}

function* watchWishPaymentItemQnt() {
  yield takeLatest(WISH_PAYMENT_ITEM_QNT_REQUEST, wishPaymentItemQnt);
}

function* watchWishPreDetail() {
  yield takeLatest(WISH_PRE_DETAIL_REQUEST, wishPreDetail);
}

function* watchWishPreCreate() {
  yield takeLatest(WISH_PRE_CREATE_REQUEST, wishPreCreate);
}

function* watchWishPreUpdate() {
  yield takeLatest(WISH_PRE_UPDATE_REQUEST, wishPreUpdate);
}

function* watchWishPreItemCreate() {
  yield takeLatest(WISH_PRE_ITEM_CREATE_REQUEST, wishPreItemCreate);
}

function* watchWishPreItemUpdate() {
  yield takeLatest(WISH_PRE_ITEM_UPDATE_REQUEST, wishPreItemUpdate);
}

function* watchWishPreItemDelete() {
  yield takeLatest(WISH_PRE_ITEM_DELETE_REQUEST, wishPreItemDelete);
}

function* watchWishPaymentDelete() {
  yield takeLatest(WISH_DELETE_REQUEST, wishDelete);
}

//////////////////////////////////////////////////////////////

export default function* wishSaga() {
  yield all([
    //
    fork(watchWishList),
    fork(watchWishPaymentDetail),
    fork(watchWishPaymentCreate),
    fork(watchWishPaymentUpdate),
    fork(watchWishPaymentItemCreate),
    fork(watchWishPaymentItemUpdate),
    fork(watchWishPaymentItemDelete),
    fork(watchWishPaymentItemQnt),
    fork(watchWishPreDetail),
    fork(watchWishPreCreate),
    fork(watchWishPreUpdate),
    fork(watchWishPreItemCreate),
    fork(watchWishPreItemUpdate),
    fork(watchWishPreItemDelete),
    fork(watchWishPaymentDelete),
  ]);
}
