import { all, call, delay, fork, put, takeLatest } from "redux-saga/effects";
import axios from "axios";
import {
  SEARCH_RECIPE_LIST_REQUEST,
  SEARCH_RECIPE_LIST_SUCCESS,
  SEARCH_RECIPE_LIST_FAILURE,
  //
} from "../reducers/search";

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

//////////////////////////////////////////////////////////////
function* watchSearchRecipeList() {
  yield takeLatest(SEARCH_RECIPE_LIST_REQUEST, recipeList);
}

//////////////////////////////////////////////////////////////
export default function* searchSaga() {
  yield all([
    fork(watchSearchRecipeList),
    //
  ]);
}
