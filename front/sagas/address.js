import { all, call, delay, fork, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import {
  ADDRESS_LIST_REQUEST,
  ADDRESS_LIST_SUCCESS,
  ADDRESS_LIST_FAILURE,
  //
  ADDRESS_CREATE_REQUEST,
  ADDRESS_CREATE_SUCCESS,
  ADDRESS_CREATE_FAILURE,
} from "../reducers/address";

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function addressGetAPI(data) {
  return axios.get(`/api/address/list?searchAddress=${data.searchAddress}`);
}

function* addressGet(action) {
  try {
    const result = yield call(addressGetAPI, action.data);

    yield put({
      type: ADDRESS_LIST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: ADDRESS_LIST_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function addressCreateAPI(data) {
  return axios.post(`/api/address/create`, data);
}

function* addressCreate(action) {
  try {
    const result = yield call(addressCreateAPI, action.data);

    yield put({
      type: ADDRESS_CREATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: ADDRESS_CREATE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

//////////////////////////////////////////////////////////////

function* watchAddressGet() {
  yield takeLatest(ADDRESS_LIST_REQUEST, addressGet);
}

function* watchAddressCreate() {
  yield takeLatest(ADDRESS_CREATE_REQUEST, addressCreate);
}

//////////////////////////////////////////////////////////////
export default function* bannerSaga() {
  yield all([
    fork(watchAddressGet),
    fork(watchAddressCreate),
    //
  ]);
}
