import { all, call, delay, fork, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import {
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAILURE,
  //
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

//////////////////////////////////////////////////////////////
function* watchProductList() {
  yield takeLatest(PRODUCT_LIST_REQUEST, productList);
}

//////////////////////////////////////////////////////////////
export default function* prescriptionSaga() {
  yield all([
    fork(watchProductList),
    //
  ]);
}
