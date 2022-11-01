import { all, call, delay, fork, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import {
  WISH_PAYMENT_CREATE_REQUEST,
  WISH_PAYMENT_CREATE_SUCCESS,
  WISH_PAYMENT_CREATE_FAILURE,
} from "../reducers/wish";

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

//////////////////////////////////////////////////////////////

function* watchWishPaymentCreate() {
  yield takeLatest(WISH_PAYMENT_CREATE_REQUEST, wishPaymentCreate);
}

//////////////////////////////////////////////////////////////

export default function* wishSaga() {
  yield all([
    //
    fork(watchWishPaymentCreate),
  ]);
}
