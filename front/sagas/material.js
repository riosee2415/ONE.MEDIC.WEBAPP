import { all, call, delay, fork, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import {
  MATERIAL_LIST_REQUEST,
  MATERIAL_LIST_SUCCESS,
  MATERIAL_LIST_FAILURE,
  //
  MATERIAL_CREATE_REQUEST,
  MATERIAL_CREATE_SUCCESS,
  MATERIAL_CREATE_FAILURE,
  //
  MATERIAL_UPDATE_REQUEST,
  MATERIAL_UPDATE_SUCCESS,
  MATERIAL_UPDATE_FAILURE,
  //
  MATERIAL_DELETE_REQUEST,
  MATERIAL_DELETE_SUCCESS,
  MATERIAL_DELETE_FAILURE,
  //
} from "../reducers/material";

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function materialListAPI() {
  return axios.get(`/api/materials/list`);
}

function* materialList(action) {
  try {
    const result = yield call(materialListAPI, action.data);

    yield put({
      type: MATERIAL_LIST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: MATERIAL_LIST_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function materialCreateAPI(data) {
  return axios.post(`/api/materials/create`, data);
}

function* materialCreate(action) {
  try {
    const result = yield call(materialCreateAPI, action.data);

    yield put({
      type: MATERIAL_CREATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: MATERIAL_CREATE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function materialUpdateAPI(data) {
  return axios.patch(`/api/materials/update`, data);
}

function* materialUpdate(action) {
  try {
    const result = yield call(materialUpdateAPI, action.data);

    yield put({
      type: MATERIAL_UPDATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: MATERIAL_UPDATE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function materialDeleteAPI(data) {
  return axios.delete(`/api/materials/delete/${data.materialId}`);
}

function* materialDelete(action) {
  try {
    const result = yield call(materialDeleteAPI, action.data);

    yield put({
      type: MATERIAL_DELETE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: MATERIAL_DELETE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

function* watchMaterialList() {
  yield takeLatest(MATERIAL_LIST_REQUEST, materialList);
}

function* watchMaterialCreate() {
  yield takeLatest(MATERIAL_CREATE_REQUEST, materialCreate);
}

function* watchMaterialUpdate() {
  yield takeLatest(MATERIAL_UPDATE_REQUEST, materialUpdate);
}

function* watchMaterialDelete() {
  yield takeLatest(MATERIAL_DELETE_REQUEST, materialDelete);
}

//////////////////////////////////////////////////////////////
export default function* materialSaga() {
  yield all([
    fork(watchMaterialList),
    fork(watchMaterialCreate),
    fork(watchMaterialUpdate),
    fork(watchMaterialDelete),
    //
  ]);
}
