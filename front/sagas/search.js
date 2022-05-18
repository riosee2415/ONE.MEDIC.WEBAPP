import { all, call, delay, fork, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import {
  SEARCH_LIST_REQUEST,
  SEARCH_LIST_SUCCESS,
  SEARCH_LIST_FAILURE,
  //
  SEARCH_RECIPE_LIST_REQUEST,
  SEARCH_RECIPE_LIST_SUCCESS,
  SEARCH_RECIPE_LIST_FAILURE,
  //
  SEARCH_RECIPE_CREATE_REQUEST,
  SEARCH_RECIPE_CREATE_SUCCESS,
  SEARCH_RECIPE_CREATE_FAILURE,
  //
  SEARCH_RECIPE_UPDATE_REQUEST,
  SEARCH_RECIPE_UPDATE_SUCCESS,
  SEARCH_RECIPE_UPDATE_FAILURE,
  //
  SEARCH_RECIPE_DELETE_REQUEST,
  SEARCH_RECIPE_DELETE_SUCCESS,
  SEARCH_RECIPE_DELETE_FAILURE,
  //
  SEARCH_MATERIAL_LIST_REQUEST,
  SEARCH_MATERIAL_LIST_SUCCESS,
  SEARCH_MATERIAL_LIST_FAILURE,
  //
  SEARCH_MATERIAL_CREATE_REQUEST,
  SEARCH_MATERIAL_CREATE_SUCCESS,
  SEARCH_MATERIAL_CREATE_FAILURE,
  //
  SEARCH_MATERIAL_DELETE_REQUEST,
  SEARCH_MATERIAL_DELETE_SUCCESS,
  SEARCH_MATERIAL_DELETE_FAILURE,
} from "../reducers/search";

// ******************************************************************************************************************
// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************

async function searchListAPI(data) {
  return await axios.get(`/api/search/list/?search=${data.search}`);
}

function* searchList(action) {
  try {
    const result = yield call(searchListAPI, action.data);

    yield put({
      type: SEARCH_LIST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: SEARCH_LIST_FAILURE,
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

async function recipeListAPI(data) {
  return await axios.get(`/api/search/recipe/list/?search=${data.search}`);
}

function* recipeList(action) {
  try {
    const result = yield call(recipeListAPI, action.data);

    yield put({
      type: SEARCH_RECIPE_LIST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: SEARCH_RECIPE_LIST_FAILURE,
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

async function recipeCreateAPI(data) {
  return await axios.post(`/api/search/recipe/create`, data);
}

function* recipeCreate(action) {
  try {
    const result = yield call(recipeCreateAPI, action.data);

    yield put({
      type: SEARCH_RECIPE_CREATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: SEARCH_RECIPE_CREATE_FAILURE,
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

async function recipeUpdateAPI(data) {
  return await axios.patch(`/api/search/recipe/update`, data);
}

function* recipeUpdate(action) {
  try {
    const result = yield call(recipeUpdateAPI, action.data);

    yield put({
      type: SEARCH_RECIPE_UPDATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: SEARCH_RECIPE_UPDATE_FAILURE,
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

async function recipeDeleteAPI(data) {
  return await axios.delete(`/api/search/recipe/delete/${data.recipeId}`);
}

function* recipeDelete(action) {
  try {
    const result = yield call(recipeDeleteAPI, action.data);

    yield put({
      type: SEARCH_RECIPE_DELETE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: SEARCH_RECIPE_DELETE_FAILURE,
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

async function materialListAPI(data) {
  return await axios.get(`/api/search/material/list?recipeId=${data.recipeId}`);
}

function* materialList(action) {
  try {
    const result = yield call(materialListAPI, action.data);

    yield put({
      type: SEARCH_MATERIAL_LIST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: SEARCH_MATERIAL_LIST_FAILURE,
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

async function materialCreateAPI(data) {
  return await axios.post(`/api/search/material/create`, data);
}

function* materialCreate(action) {
  try {
    const result = yield call(materialCreateAPI, action.data);

    yield put({
      type: SEARCH_MATERIAL_CREATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: SEARCH_MATERIAL_CREATE_FAILURE,
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

async function materialDeleteAPI(data) {
  return await axios.delete(`/api/search/material/delete/${data.materialId}`);
}

function* materialDelete(action) {
  try {
    const result = yield call(materialDeleteAPI, action.data);

    yield put({
      type: SEARCH_MATERIAL_DELETE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: SEARCH_MATERIAL_DELETE_FAILURE,
      error: err.response.data,
    });
  }
}

// ******************************************************************************************************************
// ******************************************************************************************************************
// ******************************************************************************************************************

//////////////////////////////////////////////////////////////
function* watchSearchList() {
  yield takeLatest(SEARCH_LIST_REQUEST, searchList);
}

function* watchSearchRecipeList() {
  yield takeLatest(SEARCH_RECIPE_LIST_REQUEST, recipeList);
}

function* watchSearchRecipeCreate() {
  yield takeLatest(SEARCH_RECIPE_CREATE_REQUEST, recipeCreate);
}

function* watchSearchRecipeUpdate() {
  yield takeLatest(SEARCH_RECIPE_UPDATE_REQUEST, recipeUpdate);
}

function* watchSearchRecipeDelete() {
  yield takeLatest(SEARCH_RECIPE_DELETE_REQUEST, recipeDelete);
}

function* watchSearchMaterialList() {
  yield takeLatest(SEARCH_MATERIAL_LIST_REQUEST, materialList);
}

function* watchSearchMaterialCreate() {
  yield takeLatest(SEARCH_MATERIAL_CREATE_REQUEST, materialCreate);
}

function* watchSearchMaterialDelete() {
  yield takeLatest(SEARCH_MATERIAL_DELETE_REQUEST, materialDelete);
}

//////////////////////////////////////////////////////////////
export default function* searchSaga() {
  yield all([
    fork(watchSearchList),
    fork(watchSearchRecipeList),
    fork(watchSearchRecipeCreate),
    fork(watchSearchRecipeUpdate),
    fork(watchSearchRecipeDelete),
    fork(watchSearchMaterialList),
    fork(watchSearchMaterialCreate),
    fork(watchSearchMaterialDelete),
    //
  ]);
}
