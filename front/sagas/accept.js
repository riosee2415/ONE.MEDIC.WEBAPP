import { all, call, delay, fork, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import {
  ACCEPT_LOG_REQUEST,
  ACCEPT_LOG_SUCCESS,
  ACCEPT_LOG_FAILURE,
  //
  ACCEPT_LOG_CREATE_REQUEST,
  ACCEPT_LOG_CREATE_SUCCESS,
  ACCEPT_LOG_CREATE_FAILURE,
} from "../reducers/accept";

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function acceptLogoAPI(data) {
  return axios.get(`/api/accept/list/graph/${data.typeId}`);
}

function* acceptLogo(action) {
  try {
    const result = yield call(acceptLogoAPI, action.data);

    yield put({
      type: ACCEPT_LOG_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: ACCEPT_LOG_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function acceptLogCreateAPI(data) {
  return axios.post(`/api/accept/create`, data);
}

function* acceptLogCreate(action) {
  try {
    const result = yield call(acceptLogCreateAPI, action.data);

    yield put({
      type: ACCEPT_LOG_CREATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: ACCEPT_LOG_CREATE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

//////////////////////////////////////////////////////////////
function* watchAcceptLogo() {
  yield takeLatest(ACCEPT_LOG_REQUEST, acceptLogo);
}
function* watchAcceptLogCreate() {
  yield takeLatest(ACCEPT_LOG_CREATE_REQUEST, acceptLogCreate);
}

//////////////////////////////////////////////////////////////
export default function* bannerSaga() {
  yield all([
    fork(watchAcceptLogo),
    fork(watchAcceptLogCreate),
    //
  ]);
}
