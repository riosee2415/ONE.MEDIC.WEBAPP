import { all, call, delay, fork, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import {
  PP_GET_REQUEST,
  PP_GET_SUCCESS,
  PP_GET_FAILURE,
  //
  PP_CREATE_REQUEST,
  PP_CREATE_SUCCESS,
  PP_CREATE_FAILURE,
  //
  PP_UPDATE_REQUEST,
  PP_UPDATE_SUCCESS,
  PP_UPDATE_FAILURE,
} from "../reducers/prescriptionPrice";

// ******************************************************************************************************************
// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
async function ppGetAPI() {
  return await axios.get(`/api/price/list`);
}
function* ppGet(action) {
  try {
    const result = yield call(ppGetAPI, action.data);

    yield put({
      type: PP_GET_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: PP_GET_FAILURE,
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
async function ppCreateAPI(data) {
  return await axios.post(`/api/price/create`, data);
}
function* ppCreate(action) {
  try {
    const result = yield call(ppCreateAPI, action.data);

    yield put({
      type: PP_CREATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: PP_CREATE_FAILURE,
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
async function ppUpdateAPI(data) {
  return await axios.patch(`/api/price/update`, data);
}
function* ppUpdate(action) {
  try {
    const result = yield call(ppUpdateAPI, action.data);

    yield put({
      type: PP_UPDATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: PP_UPDATE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

function* watchPpGet() {
  yield takeLatest(PP_GET_REQUEST, ppGet);
}

function* watchPpCreate() {
  yield takeLatest(PP_CREATE_REQUEST, ppCreate);
}

function* watchPpUpdate() {
  yield takeLatest(PP_UPDATE_REQUEST, ppUpdate);
}

//////////////////////////////////////////////////////////////
export default function* ppSaga() {
  yield all([
    fork(watchPpGet),
    fork(watchPpCreate),
    fork(watchPpUpdate),
    //
  ]);
}
