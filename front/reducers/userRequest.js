import produce from "../util/produce";

export const initailState = {
  requestList: [],
  requestLastPage: 1,
  requestAllList: [],
  //
  st_requestListLoading: false,
  st_requestListDone: false,
  st_requestListError: null,
  //
  st_requestCreateLoading: false,
  st_requestCreateDone: false,
  st_requestCreateError: null,
  //
  st_requestUpdateLoading: false,
  st_requestUpdateDone: false,
  st_requestUpdateError: null,
  //
  st_requestDeleteLoading: false,
  st_requestDeleteDone: false,
  st_requestDeleteError: null,
  //
  st_requestAllListLoading: false,
  st_requestAllListDone: false,
  st_requestAllListError: null,
};

export const REQUEST_LIST_REQUEST = "REQUEST_LIST_REQUEST";
export const REQUEST_LIST_SUCCESS = "REQUEST_LIST_SUCCESS";
export const REQUEST_LIST_FAILURE = "REQUEST_LIST_FAILURE";

export const REQUEST_ALL_LIST_REQUEST = "REQUEST_ALL_LIST_REQUEST";
export const REQUEST_ALL_LIST_SUCCESS = "REQUEST_ALL_LIST_SUCCESS";
export const REQUEST_ALL_LIST_FAILURE = "REQUEST_ALL_LIST_FAILURE";

export const REQUEST_CREATE_REQUEST = "REQUEST_CREATE_REQUEST";
export const REQUEST_CREATE_SUCCESS = "REQUEST_CREATE_SUCCESS";
export const REQUEST_CREATE_FAILURE = "REQUEST_CREATE_FAILURE";

export const REQUEST_UPDATE_REQUEST = "REQUEST_UPDATE_REQUEST";
export const REQUEST_UPDATE_SUCCESS = "REQUEST_UPDATE_SUCCESS";
export const REQUEST_UPDATE_FAILURE = "REQUEST_UPDATE_FAILURE";

export const REQUEST_DELETE_REQUEST = "REQUEST_DELETE_REQUEST";
export const REQUEST_DELETE_SUCCESS = "REQUEST_DELETE_SUCCESS";
export const REQUEST_DELETE_FAILURE = "REQUEST_DELETE_FAILURE";

const reducer = (state = initailState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case REQUEST_LIST_REQUEST: {
        draft.st_requestListLoading = true;
        draft.st_requestListDone = false;
        draft.st_requestListError = null;
        break;
      }
      case REQUEST_LIST_SUCCESS: {
        draft.st_requestListLoading = false;
        draft.st_requestListDone = true;
        draft.st_requestListError = null;
        draft.requestList = action.data.list;
        draft.requestLastPage = action.data.lastPage;
        break;
      }
      case REQUEST_LIST_FAILURE: {
        draft.st_requestListLoading = false;
        draft.st_requestListDone = false;
        draft.st_requestListError = action.error;
        break;
      }

      ///////////////////////////////////////////////////////

      case REQUEST_ALL_LIST_REQUEST: {
        draft.st_requestAllListLoading = true;
        draft.st_requestAllListDone = false;
        draft.st_requestAllListError = null;
        break;
      }
      case REQUEST_ALL_LIST_SUCCESS: {
        draft.st_requestAllListLoading = false;
        draft.st_requestAllListDone = true;
        draft.st_requestAllListError = null;
        draft.requestAllList = action.data;
        break;
      }
      case REQUEST_ALL_LIST_FAILURE: {
        draft.st_requestAllListLoading = false;
        draft.st_requestAllListDone = false;
        draft.st_requestAllListError = action.error;
        break;
      }

      ///////////////////////////////////////////////////////

      case REQUEST_CREATE_REQUEST: {
        draft.st_requestCreateLoading = true;
        draft.st_requestCreateDone = false;
        draft.st_requestCreateError = null;
        break;
      }
      case REQUEST_CREATE_SUCCESS: {
        draft.st_requestCreateLoading = false;
        draft.st_requestCreateDone = true;
        draft.st_requestCreateError = null;
        break;
      }
      case REQUEST_CREATE_FAILURE: {
        draft.st_requestCreateLoading = false;
        draft.st_requestCreateDone = false;
        draft.st_requestCreateError = action.error;
        break;
      }

      ///////////////////////////////////////////////////////

      case REQUEST_UPDATE_REQUEST: {
        draft.st_requestUpdateLoading = true;
        draft.st_requestUpdateDone = false;
        draft.st_requestUpdateError = null;
        break;
      }
      case REQUEST_UPDATE_SUCCESS: {
        draft.st_requestUpdateLoading = false;
        draft.st_requestUpdateDone = true;
        draft.st_requestUpdateError = null;
        break;
      }
      case REQUEST_UPDATE_FAILURE: {
        draft.st_requestUpdateLoading = false;
        draft.st_requestUpdateDone = false;
        draft.st_requestUpdateError = action.error;
        break;
      }

      ///////////////////////////////////////////////////////

      case REQUEST_DELETE_REQUEST: {
        draft.st_requestDeleteLoading = true;
        draft.st_requestDeleteDone = false;
        draft.st_requestDeleteError = null;
        break;
      }
      case REQUEST_DELETE_SUCCESS: {
        draft.st_requestDeleteLoading = false;
        draft.st_requestDeleteDone = true;
        draft.st_requestDeleteError = null;
        break;
      }
      case REQUEST_DELETE_FAILURE: {
        draft.st_requestDeleteLoading = false;
        draft.st_requestDeleteDone = false;
        draft.st_requestDeleteError = action.error;
        break;
      }

      ///////////////////////////////////////////////////////

      default:
        break;
    }
  });

export default reducer;
