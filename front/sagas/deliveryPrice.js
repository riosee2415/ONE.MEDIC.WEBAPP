import { all, call, delay, fork, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import {
  DELIVERYPRICE_GET_REQUEST,
  DELIVERYPRICE_GET_SUCCESS,
  DELIVERYPRICE_GET_FAILURE,
  //
  DELIVERYPRICE_UPDATE_REQUEST,
  DELIVERYPRICE_UPDATE_SUCCESS,
  DELIVERYPRICE_UPDATE_FAILURE,
} from "../reducers/deliveryPrice";

// ******************************************************************************************************************
// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
async function deliveryPriceGetAPI() {
  return await axios.post(`/api/delivery/get`);
}

function* deliveryPriceGet() {
  try {
    const result = yield call(deliveryPriceGetAPI);

    yield put({
      type: DELIVERYPRICE_GET_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: DELIVERYPRICE_GET_FAILURE,
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
async function deliveryPriceUpdateAPI(data) {
  return await axios.post(`/api/delivery/update`, data);
}

function* deliveryPriceUpdate(action) {
  try {
    const result = yield call(deliveryPriceUpdateAPI, action.data);

    yield put({
      type: DELIVERYPRICE_UPDATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: DELIVERYPRICE_UPDATE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

//////////////////////////////////////////////////////////////
function* watchDeliveryPriceGet() {
  yield takeLatest(DELIVERYPRICE_GET_REQUEST, deliveryPriceGet);
}

function* watchDeliveryPriceUpdate() {
  yield takeLatest(DELIVERYPRICE_UPDATE_REQUEST, deliveryPriceUpdate);
}

//////////////////////////////////////////////////////////////
export default function* deliveryPriceSaga() {
  yield all([
    fork(watchDeliveryPriceGet),
    fork(watchDeliveryPriceUpdate),
    //
  ]);
}
