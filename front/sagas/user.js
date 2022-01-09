import { all, call, fork, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import {
  LOGIN_REQUEST,
  LOGIN_SUCCESS,
  LOGIN_FAILURE,
  /////////////////////////////
  LOGIN_ADMIN_REQUEST,
  LOGIN_ADMIN_SUCCESS,
  LOGIN_ADMIN_FAILURE,
  /////////////////////////////
  SIGNUP_REQUEST,
  SIGNUP_SUCCESS,
  SIGNUP_FAILURE,
  /////////////////////////////
  USERLIST_REQUEST,
  USERLIST_SUCCESS,
  USERLIST_FAILURE,
  /////////////////////////////
  USERLIST_UPDATE_REQUEST,
  USERLIST_UPDATE_SUCCESS,
  USERLIST_UPDATE_FAILURE,
  /////////////////////////////
  LOAD_MY_INFO_REQUEST,
  LOAD_MY_INFO_SUCCESS,
  LOAD_MY_INFO_FAILURE,
  /////////////////////////////
  KAKAO_LOGIN_REQUEST,
  KAKAO_LOGIN_SUCCESS,
  KAKAO_LOGIN_FAILURE,
  /////////////////////////////
  COMPANY_LIST_REQUEST,
  COMPANY_LIST_SUCCESS,
  COMPANY_LIST_FAILURE,
  /////////////////////////////
  COMPANY_REFUSAL_REQUEST,
  COMPANY_REFUSAL_SUCCESS,
  COMPANY_REFUSAL_FAILURE,
  /////////////////////////////
  COMPANY_APPROVAL_REQUEST,
  COMPANY_APPROVAL_SUCCESS,
  COMPANY_APPROVAL_FAILURE,
  /////////////////////////////
} from "../reducers/user";

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function loadMyInfoAPI(data) {
  return axios.get("/api/user/signin", data);
}

function* loadMyInfo(action) {
  try {
    const result = yield call(loadMyInfoAPI, action.data);
    yield put({
      type: LOAD_MY_INFO_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LOAD_MY_INFO_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// *****

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function signinPI(data) {
  return axios.post(`/api/user/signin`, data);
}

function* signin(action) {
  try {
    const result = yield call(signinPI, action.data);
    yield put({
      type: LOGIN_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LOGIN_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function signinAdminPI(data) {
  return axios.post(`/api/user/signin/admin`, data);
}

function* signinAdmin(action) {
  try {
    const result = yield call(signinAdminPI, action.data);
    yield put({
      type: LOGIN_ADMIN_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: LOGIN_ADMIN_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function signUpAPI(data) {
  return axios.post(`/api/user/signup`, data);
}

function* signUp(action) {
  try {
    const result = yield call(signUpAPI, action.data);
    yield put({
      type: SIGNUP_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: SIGNUP_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function userListAPI(data) {
  return axios.get(
    `/api/user/list/${data.listType}?name=${data.name}&email=${data.email}`
  );
}

function* userList(action) {
  try {
    const result = yield call(userListAPI, action.data);
    yield put({
      type: USERLIST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: USERLIST_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function userListUpdateAPI(data) {
  return axios.patch(`/api/user/level/update`, data);
}

function* userListUpdate(action) {
  try {
    const result = yield call(userListUpdateAPI, action.data);
    yield put({
      type: USERLIST_UPDATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: USERLIST_UPDATE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function kakaoLoginAPI() {
  return axios.get(`/api/user/kakaoLogin`);
}

function* kakaoLogin() {
  try {
    const result = yield call(kakaoLoginAPI);

    yield put({
      type: KAKAO_LOGIN_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: KAKAO_LOGIN_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function companyListAPI(data) {
  return axios.get(`/api/user/company/list/${data.type}`);
}

function* companyList(action) {
  try {
    const result = yield call(companyListAPI, action.data);

    yield put({
      type: COMPANY_LIST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: COMPANY_LIST_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function companyRefusalAPI(data) {
  return axios.patch(`/api/user/company/refusal`, data);
}

function* companyRefusal(action) {
  try {
    const result = yield call(companyRefusalAPI, action.data);

    yield put({
      type: COMPANY_REFUSAL_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: COMPANY_REFUSAL_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function companyApprovalAPI(data) {
  return axios.patch(`/api/user/company/approval`, data);
}

function* companyApproval(action) {
  try {
    const result = yield call(companyApprovalAPI, action.data);

    yield put({
      type: COMPANY_APPROVAL_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: COMPANY_APPROVAL_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

//////////////////////////////////////////////////////////////

function* watchLoadMyInfo() {
  yield takeLatest(LOAD_MY_INFO_REQUEST, loadMyInfo);
}

function* watchSignin() {
  yield takeLatest(LOGIN_REQUEST, signin);
}

function* watchSigninAdmin() {
  yield takeLatest(LOGIN_ADMIN_REQUEST, signinAdmin);
}

function* watchSignUp() {
  yield takeLatest(SIGNUP_REQUEST, signUp);
}

function* watchUserList() {
  yield takeLatest(USERLIST_REQUEST, userList);
}

function* watchUserListUpdate() {
  yield takeLatest(USERLIST_UPDATE_REQUEST, userListUpdate);
}

function* watchKakaoLogin() {
  yield takeLatest(KAKAO_LOGIN_REQUEST, kakaoLogin);
}

function* watchCompanyList() {
  yield takeLatest(COMPANY_LIST_REQUEST, companyList);
}

function* watchCompanyRefusal() {
  yield takeLatest(COMPANY_REFUSAL_REQUEST, companyRefusal);
}

function* watchCompanyApproval() {
  yield takeLatest(COMPANY_APPROVAL_REQUEST, companyApproval);
}

//////////////////////////////////////////////////////////////
export default function* userSaga() {
  yield all([
    fork(watchLoadMyInfo),
    fork(watchSignin),
    fork(watchSigninAdmin),
    fork(watchSignUp),
    fork(watchUserList),
    fork(watchUserListUpdate),
    fork(watchKakaoLogin),
    fork(watchCompanyList),
    fork(watchCompanyRefusal),
    fork(watchCompanyApproval),
    //
  ]);
}
