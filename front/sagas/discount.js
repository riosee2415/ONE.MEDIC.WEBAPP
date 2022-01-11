import { all, call, delay, fork, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import {
  DISCOUNT_LIST_REQUEST,
  DISCOUNT_LIST_SUCCESS,
  DISCOUNT_LIST_FAILURE,
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

//////////////////////////////////////////////////////////////
function* watchDiscountList() {
  yield takeLatest(DISCOUNT_LIST_REQUEST, discountList);
}

//////////////////////////////////////////////////////////////
export default function* discountSaga() {
  yield all([
    fork(watchDiscountList),
    //
  ]);
}
