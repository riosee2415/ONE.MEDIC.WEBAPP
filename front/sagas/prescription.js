import { all, call, delay, fork, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import {
  PRODUCT_LIST_REQUEST,
  PRODUCT_LIST_SUCCESS,
  PRODUCT_LIST_FAILURE,
  //
  PRODUCT_TYPE_LIST_REQUEST,
  PRODUCT_TYPE_LIST_SUCCESS,
  PRODUCT_TYPE_LIST_FAILURE,
  //
  PRODUCT_TYPE_ADD_REQUEST,
  PRODUCT_TYPE_ADD_SUCCESS,
  PRODUCT_TYPE_ADD_FAILURE,
  //
  PRODUCT_TYPE_DELETE_REQUEST,
  PRODUCT_TYPE_DELETE_SUCCESS,
  PRODUCT_TYPE_DELETE_FAILURE,
  //
  PRODUCT_PACK_ADD_REQUEST,
  PRODUCT_PACK_ADD_SUCCESS,
  PRODUCT_PACK_ADD_FAILURE,
  //
  PRODUCT_PACK_LIST_REQUEST,
  PRODUCT_PACK_LIST_SUCCESS,
  PRODUCT_PACK_LIST_FAILURE,
  //
  PRODUCT_PACK_DELETE_REQUEST,
  PRODUCT_PACK_DELETE_SUCCESS,
  PRODUCT_PACK_DELETE_FAILURE,
  //
  PRODUCT_UNIT_LIST_REQUEST,
  PRODUCT_UNIT_LIST_SUCCESS,
  PRODUCT_UNIT_LIST_FAILURE,
  //
  PRODUCT_UNIT_ADD_REQUEST,
  PRODUCT_UNIT_ADD_SUCCESS,
  PRODUCT_UNIT_ADD_FAILURE,
  //
  PRODUCT_UNIT_DELETE_REQUEST,
  PRODUCT_UNIT_DELETE_SUCCESS,
  PRODUCT_UNIT_DELETE_FAILURE,
  //
  PREVIEW_IMAGE_UPLOAD_REQUEST1,
  PREVIEW_IMAGE_UPLOAD_SUCCESS1,
  PREVIEW_IMAGE_UPLOAD_FAILURE1,
  //
  PREVIEW_IMAGE_UPLOAD_REQUEST2,
  PREVIEW_IMAGE_UPLOAD_SUCCESS2,
  PREVIEW_IMAGE_UPLOAD_FAILURE2,
  //
  PREVIEW_IMAGE_UPLOAD_REQUEST3,
  PREVIEW_IMAGE_UPLOAD_SUCCESS3,
  PREVIEW_IMAGE_UPLOAD_FAILURE3,
  //
  PREVIEW_IMAGE_UPLOAD_REQUEST4,
  PREVIEW_IMAGE_UPLOAD_SUCCESS4,
  PREVIEW_IMAGE_UPLOAD_FAILURE4,
  //
  PRESCRIPTION_CREATE_REQUEST,
  PRESCRIPTION_CREATE_SUCCESS,
  PRESCRIPTION_CREATE_FAILURE,
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

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function productTypeListAPI(data) {
  return axios.get(`/api/prescription/type/list/${data.id}`);
}

function* productTypeList(action) {
  try {
    const result = yield call(productTypeListAPI, action.data);

    yield put({
      type: PRODUCT_TYPE_LIST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: PRODUCT_TYPE_LIST_FAILURE,
      error: err.response.data,
    });
  }
}

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function productAddListAPI(data) {
  return axios.post(`/api/prescription/type/add`, data);
}

function* productAddList(action) {
  try {
    const result = yield call(productAddListAPI, action.data);

    yield put({
      type: PRODUCT_TYPE_ADD_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: PRODUCT_TYPE_ADD_FAILURE,
      error: err.response.data,
    });
  }
}

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function productDeleteListListAPI(data) {
  return axios.patch(`/api/prescription/type/delete`, data);
}

function* productDeleteList(action) {
  try {
    const result = yield call(productDeleteListListAPI, action.data);

    yield put({
      type: PRODUCT_TYPE_DELETE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: PRODUCT_TYPE_DELETE_FAILURE,
      error: err.response.data,
    });
  }
}

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function productPackListAPI(data) {
  return axios.get(`/api/prescription/pack/list/${data.id}`, data);
}

function* productPackList(action) {
  try {
    const result = yield call(productPackListAPI, action.data);

    yield put({
      type: PRODUCT_PACK_LIST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: PRODUCT_PACK_LIST_FAILURE,
      error: err.response.data,
    });
  }
}

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function productPackAddAPI(data) {
  return axios.post(`/api/prescription/pack/add`, data);
}

function* productPackAdd(action) {
  try {
    const result = yield call(productPackAddAPI, action.data);

    yield put({
      type: PRODUCT_PACK_ADD_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: PRODUCT_PACK_ADD_FAILURE,
      error: err.response.data,
    });
  }
}

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function productPackDeleteAPI(data) {
  return axios.patch(`/api/prescription/pack/delete`, data);
}

function* productPackDelete(action) {
  try {
    const result = yield call(productPackDeleteAPI, action.data);

    yield put({
      type: PRODUCT_PACK_DELETE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: PRODUCT_PACK_DELETE_FAILURE,
      error: err.response.data,
    });
  }
}

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function productUnitListAPI(data) {
  return axios.get(`/api/prescription/unit/list/${data.id}`, data);
}

function* productUnitList(action) {
  try {
    const result = yield call(productUnitListAPI, action.data);

    yield put({
      type: PRODUCT_UNIT_LIST_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: PRODUCT_UNIT_LIST_FAILURE,
      error: err.response.data,
    });
  }
}

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function productUnitAddAPI(data) {
  return axios.post(`/api/prescription/unit/add`, data);
}

function* productUnitAdd(action) {
  try {
    const result = yield call(productUnitAddAPI, action.data);

    yield put({
      type: PRODUCT_UNIT_ADD_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: PRODUCT_UNIT_ADD_FAILURE,
      error: err.response.data,
    });
  }
}

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function productUnitDeleteAPI(data) {
  return axios.patch(`/api/prescription/unit/delete`, data);
}

function* productUnitDelete(action) {
  try {
    const result = yield call(productUnitDeleteAPI, action.data);

    yield put({
      type: PRODUCT_UNIT_DELETE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: PRODUCT_UNIT_DELETE_FAILURE,
      error: err.response.data,
    });
  }
}

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function previewImageUpload1API(data) {
  return axios.post(`/api/prescription/image`, data);
}

function* previewImageUpload1(action) {
  try {
    const result = yield call(previewImageUpload1API, action.data);

    yield put({
      type: PREVIEW_IMAGE_UPLOAD_SUCCESS1,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: PREVIEW_IMAGE_UPLOAD_FAILURE1,
      error: err.response.data,
    });
  }
}

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function previewImageUpload2API(data) {
  return axios.post(`/api/prescription/image`, data);
}

function* previewImageUpload2(action) {
  try {
    const result = yield call(previewImageUpload2API, action.data);

    yield put({
      type: PREVIEW_IMAGE_UPLOAD_SUCCESS2,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: PREVIEW_IMAGE_UPLOAD_FAILURE2,
      error: err.response.data,
    });
  }
}

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function previewImageUpload3API(data) {
  return axios.post(`/api/prescription/image`, data);
}

function* previewImageUpload3(action) {
  try {
    const result = yield call(previewImageUpload3API, action.data);

    yield put({
      type: PREVIEW_IMAGE_UPLOAD_SUCCESS3,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: PREVIEW_IMAGE_UPLOAD_FAILURE3,
      error: err.response.data,
    });
  }
}

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function previewImageUpload4API(data) {
  return axios.post(`/api/prescription/image`, data);
}

function* previewImageUpload4(action) {
  try {
    const result = yield call(previewImageUpload4API, action.data);

    yield put({
      type: PREVIEW_IMAGE_UPLOAD_SUCCESS4,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: PREVIEW_IMAGE_UPLOAD_FAILURE4,
      error: err.response.data,
    });
  }
}

// SAGA AREA ********************************************************************************************************
// ******************************************************************************************************************
function prescriptionCreateAPI(data) {
  return axios.post(`/api/prescription/create`, data);
}

function* prescriptionCreate(action) {
  try {
    const result = yield call(prescriptionCreateAPI, action.data);

    yield put({
      type: PRESCRIPTION_CREATE_SUCCESS,
      data: result.data,
    });
  } catch (err) {
    console.error(err);
    yield put({
      type: PRESCRIPTION_CREATE_FAILURE,
      error: err.response.data,
    });
  }
}

//////////////////////////////////////////////////////////////
function* watchProductList() {
  yield takeLatest(PRODUCT_LIST_REQUEST, productList);
}

function* watchProductTypeList() {
  yield takeLatest(PRODUCT_TYPE_LIST_REQUEST, productTypeList);
}

function* watchProductAddList() {
  yield takeLatest(PRODUCT_TYPE_ADD_REQUEST, productAddList);
}

function* watchProductDeleteList() {
  yield takeLatest(PRODUCT_TYPE_DELETE_REQUEST, productDeleteList);
}

function* watchProductPackList() {
  yield takeLatest(PRODUCT_PACK_LIST_REQUEST, productPackList);
}

function* watchProductPackAdd() {
  yield takeLatest(PRODUCT_PACK_ADD_REQUEST, productPackAdd);
}

function* watchProductPackDelete() {
  yield takeLatest(PRODUCT_PACK_DELETE_REQUEST, productPackDelete);
}

function* watchProductUnitList() {
  yield takeLatest(PRODUCT_UNIT_LIST_REQUEST, productUnitList);
}

function* watchProductUnitAdd() {
  yield takeLatest(PRODUCT_UNIT_ADD_REQUEST, productUnitAdd);
}

function* watchProductUnitDelete() {
  yield takeLatest(PRODUCT_UNIT_DELETE_REQUEST, productUnitDelete);
}

function* watchPreviewImageUpload1() {
  yield takeLatest(PREVIEW_IMAGE_UPLOAD_REQUEST1, previewImageUpload1);
}
function* watchPreviewImageUpload2() {
  yield takeLatest(PREVIEW_IMAGE_UPLOAD_REQUEST2, previewImageUpload2);
}
function* watchPreviewImageUpload3() {
  yield takeLatest(PREVIEW_IMAGE_UPLOAD_REQUEST3, previewImageUpload3);
}

function* watchPreviewImageUpload4() {
  yield takeLatest(PREVIEW_IMAGE_UPLOAD_REQUEST4, previewImageUpload4);
}

function* watchPrescriptionCreate() {
  yield takeLatest(PRESCRIPTION_CREATE_REQUEST, prescriptionCreate);
}

//////////////////////////////////////////////////////////////
export default function* prescriptionSaga() {
  yield all([
    fork(watchProductList),
    fork(watchProductTypeList),
    fork(watchProductAddList),
    fork(watchProductDeleteList),
    fork(watchProductPackList),
    fork(watchProductPackAdd),
    fork(watchProductPackDelete),
    fork(watchProductUnitList),
    fork(watchProductUnitAdd),
    fork(watchProductUnitDelete),
    fork(watchPreviewImageUpload1),
    fork(watchPreviewImageUpload2),
    fork(watchPreviewImageUpload3),
    fork(watchPreviewImageUpload4),
    fork(watchPrescriptionCreate),
    //
  ]);
}
