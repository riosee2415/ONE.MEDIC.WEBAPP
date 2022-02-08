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
  //
  ADDRESS_UPDATE_REQUEST,
  ADDRESS_UPDATE_SUCCESS,
  ADDRESS_UPDATE_FAILURE,
  //
  ADDRESS_DELETE_REQUEST,
  ADDRESS_DELETE_SUCCESS,
  ADDRESS_DELETE_FAILURE,
  //
  ADDRESS_ISNORMAL_REQUEST,
  ADDRESS_ISNORMAL_SUCCESS,
  ADDRESS_ISNORMAL_FAILURE,
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

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function addressUpdateAPI(data) {
  return axios.patch(`/api/address/update`, data);
}

function* addressUpdate(action) {
  try {
    const result = yield call(addressUpdateAPI, action.data);

    yield put({
      type: ADDRESS_UPDATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: ADDRESS_UPDATE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function addressDeleteAPI(data) {
  return axios.delete(`/api/address/delete/${data.addressId}`);
}

function* addressDelete(action) {
  try {
    const result = yield call(addressDeleteAPI, action.data);

    yield put({
      type: ADDRESS_DELETE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: ADDRESS_DELETE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function addressIsNormalAPI(data) {
  return axios.patch(`/api/address/isNormal`, data);
}

function* addressIsNormal(action) {
  try {
    const result = yield call(addressIsNormalAPI, action.data);

    yield put({
      type: ADDRESS_ISNORMAL_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: ADDRESS_ISNORMAL_FAILURE,
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

function* watchAddressUpdate() {
  yield takeLatest(ADDRESS_UPDATE_REQUEST, addressUpdate);
}

function* watchAddressDelete() {
  yield takeLatest(ADDRESS_DELETE_REQUEST, addressDelete);
}

function* watchAddressIsNormal() {
  yield takeLatest(ADDRESS_ISNORMAL_REQUEST, addressIsNormal);
}

//////////////////////////////////////////////////////////////
export default function* bannerSaga() {
  yield all([
    fork(watchAddressGet),
    fork(watchAddressCreate),
    fork(watchAddressUpdate),
    fork(watchAddressDelete),
    fork(watchAddressIsNormal),
    //
  ]);
}
