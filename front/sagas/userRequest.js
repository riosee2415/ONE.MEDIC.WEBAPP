import { all, call, delay, fork, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import {
  REQUEST_LIST_REQUEST,
  REQUEST_LIST_SUCCESS,
  REQUEST_LIST_FAILURE,
  //
  REQUEST_CREATE_REQUEST,
  REQUEST_CREATE_SUCCESS,
  REQUEST_CREATE_FAILURE,
  //
  REQUEST_UPDATE_REQUEST,
  REQUEST_UPDATE_SUCCESS,
  REQUEST_UPDATE_FAILURE,
  //
  REQUEST_DELETE_REQUEST,
  REQUEST_DELETE_SUCCESS,
  REQUEST_DELETE_FAILURE,
} from "../reducers/userRequest";

// ******************************************************************************************************************
// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
async function requestListAPI(data) {
  return await axios.post(`/api/userRequest/list`, data);
}

function* requestList(action) {
  try {
    const result = yield call(requestListAPI, action.data);

    yield put({
      type: REQUEST_LIST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: REQUEST_LIST_FAILURE,
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
async function requestCreateAPI(data) {
  return await axios.post(`/api/userRequest/create`, data);
}

function* requestCreate(action) {
  try {
    const result = yield call(requestCreateAPI, action.data);

    yield put({
      type: REQUEST_CREATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: REQUEST_CREATE_FAILURE,
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
async function requestUpdateAPI(data) {
  return await axios.post(`/api/userRequest/update`, data);
}

function* requestUpdate(action) {
  try {
    const result = yield call(requestUpdateAPI, action.data);

    yield put({
      type: REQUEST_UPDATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: REQUEST_UPDATE_FAILURE,
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
async function requestDeleteAPI(data) {
  return await axios.post(`/api/userRequest/delete`, data);
}

function* requestDelete(action) {
  try {
    const result = yield call(requestDeleteAPI, action.data);

    yield put({
      type: REQUEST_DELETE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: REQUEST_DELETE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

//////////////////////////////////////////////////////////////

function* watchRequestList() {
  yield takeLatest(REQUEST_LIST_REQUEST, requestList);
}

function* watchRequestCreate() {
  yield takeLatest(REQUEST_CREATE_REQUEST, requestCreate);
}

function* watchRequestDelete() {
  yield takeLatest(REQUEST_UPDATE_REQUEST, requestUpdate);
}

function* watchRequestUpdate() {
  yield takeLatest(REQUEST_DELETE_REQUEST, requestDelete);
}

//////////////////////////////////////////////////////////////
export default function* requestSaga() {
  yield all([
    fork(watchRequestList),
    fork(watchRequestCreate),
    fork(watchRequestDelete),
    fork(watchRequestUpdate),
  ]);
}
