import produce from "../util/produce";

export const initailState = {
  deliveryRequestList: [],
  deliveryRequestLastPage: 1,
  deliveryRequestAllList: [],
  //
  st_deliveryRequestListLoading: false,
  st_deliveryRequestListDone: false,
  st_deliveryRequestListError: null,
  //
  st_deliveryRequestCreateLoading: false,
  st_deliveryRequestCreateDone: false,
  st_deliveryRequestCreateError: null,
  //
  st_deliveryRequestUpdateLoading: false,
  st_deliveryRequestUpdateDone: false,
  st_deliveryRequestUpdateError: null,
  //
  st_deliveryRequestDeleteLoading: false,
  st_deliveryRequestDeleteDone: false,
  st_deliveryRequestDeleteError: null,
  //
  st_deliveryRequestAllListLoading: false,
  st_deliveryRequestAllListDone: false,
  st_deliveryRequestAllListError: null,
};

export const DELIVERY_REQUEST_LIST_REQUEST = "DELIVERY_REQUEST_LIST_REQUEST";
export const DELIVERY_REQUEST_LIST_SUCCESS = "DELIVERY_REQUEST_LIST_SUCCESS";
export const DELIVERY_REQUEST_LIST_FAILURE = "DELIVERY_REQUEST_LIST_FAILURE";

export const DELIVERY_REQUEST_ALL_LIST_REQUEST =
  "DELIVERY_REQUEST_ALL_LIST_REQUEST";
export const DELIVERY_REQUEST_ALL_LIST_SUCCESS =
  "DELIVERY_REQUEST_ALL_LIST_SUCCESS";
export const DELIVERY_REQUEST_ALL_LIST_FAILURE =
  "DELIVERY_REQUEST_ALL_LIST_FAILURE";

export const DELIVERY_REQUEST_CREATE_REQUEST =
  "DELIVERY_REQUEST_CREATE_REQUEST";
export const DELIVERY_REQUEST_CREATE_SUCCESS =
  "DELIVERY_REQUEST_CREATE_SUCCESS";
export const DELIVERY_REQUEST_CREATE_FAILURE =
  "DELIVERY_REQUEST_CREATE_FAILURE";

export const DELIVERY_REQUEST_UPDATE_REQUEST =
  "DELIVERY_REQUEST_UPDATE_REQUEST";
export const DELIVERY_REQUEST_UPDATE_SUCCESS =
  "DELIVERY_REQUEST_UPDATE_SUCCESS";
export const DELIVERY_REQUEST_UPDATE_FAILURE =
  "DELIVERY_REQUEST_UPDATE_FAILURE";

export const DELIVERY_REQUEST_DELETE_REQUEST =
  "DELIVERY_REQUEST_DELETE_REQUEST";
export const DELIVERY_REQUEST_DELETE_SUCCESS =
  "DELIVERY_REQUEST_DELETE_SUCCESS";
export const DELIVERY_REQUEST_DELETE_FAILURE =
  "DELIVERY_REQUEST_DELETE_FAILURE";

const reducer = (state = initailState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case DELIVERY_REQUEST_LIST_REQUEST: {
        draft.st_deliveryRequestListLoading = true;
        draft.st_deliveryRequestListDone = false;
        draft.st_deliveryRequestListError = null;
        break;
      }
      case DELIVERY_REQUEST_LIST_SUCCESS: {
        draft.st_deliveryRequestListLoading = false;
        draft.st_deliveryRequestListDone = true;
        draft.st_deliveryRequestListError = null;
        draft.deliveryRequestList = action.data.list;
        draft.deliveryRequestLastPage = action.data.lastPage;
        break;
      }
      case DELIVERY_REQUEST_LIST_FAILURE: {
        draft.st_deliveryRequestListLoading = false;
        draft.st_deliveryRequestListDone = false;
        draft.st_deliveryRequestListError = action.error;
        break;
      }

      ///////////////////////////////////////////////////////

      case DELIVERY_REQUEST_ALL_LIST_REQUEST: {
        draft.st_deliveryRequestAllListLoading = true;
        draft.st_deliveryRequestAllListDone = false;
        draft.st_deliveryRequestAllListError = null;
        break;
      }
      case DELIVERY_REQUEST_ALL_LIST_SUCCESS: {
        draft.st_deliveryRequestAllListLoading = false;
        draft.st_deliveryRequestAllListDone = true;
        draft.st_deliveryRequestAllListError = null;
        draft.deliveryRequestAllList = action.data;
        break;
      }
      case DELIVERY_REQUEST_ALL_LIST_FAILURE: {
        draft.st_deliveryRequestAllListLoading = false;
        draft.st_deliveryRequestAllListDone = false;
        draft.st_deliveryRequestAllListError = action.error;
        break;
      }

      ///////////////////////////////////////////////////////

      case DELIVERY_REQUEST_CREATE_REQUEST: {
        draft.st_deliveryRequestCreateLoading = true;
        draft.st_deliveryRequestCreateDone = false;
        draft.st_deliveryRequestCreateError = null;
        break;
      }
      case DELIVERY_REQUEST_CREATE_SUCCESS: {
        draft.st_deliveryRequestCreateLoading = false;
        draft.st_deliveryRequestCreateDone = true;
        draft.st_deliveryRequestCreateError = null;
        break;
      }
      case DELIVERY_REQUEST_CREATE_FAILURE: {
        draft.st_deliveryRequestCreateLoading = false;
        draft.st_deliveryRequestCreateDone = false;
        draft.st_deliveryRequestCreateError = action.error;
        break;
      }

      ///////////////////////////////////////////////////////

      case DELIVERY_REQUEST_UPDATE_REQUEST: {
        draft.st_deliveryRequestUpdateLoading = true;
        draft.st_deliveryRequestUpdateDone = false;
        draft.st_deliveryRequestUpdateError = null;
        break;
      }
      case DELIVERY_REQUEST_UPDATE_SUCCESS: {
        draft.st_deliveryRequestUpdateLoading = false;
        draft.st_deliveryRequestUpdateDone = true;
        draft.st_deliveryRequestUpdateError = null;
        break;
      }
      case DELIVERY_REQUEST_UPDATE_FAILURE: {
        draft.st_deliveryRequestUpdateLoading = false;
        draft.st_deliveryRequestUpdateDone = false;
        draft.st_deliveryRequestUpdateError = action.error;
        break;
      }

      ///////////////////////////////////////////////////////

      case DELIVERY_REQUEST_DELETE_REQUEST: {
        draft.st_deliveryRequestDeleteLoading = true;
        draft.st_deliveryRequestDeleteDone = false;
        draft.st_deliveryRequestDeleteError = null;
        break;
      }
      case DELIVERY_REQUEST_DELETE_SUCCESS: {
        draft.st_deliveryRequestDeleteLoading = false;
        draft.st_deliveryRequestDeleteDone = true;
        draft.st_deliveryRequestDeleteError = null;
        break;
      }
      case DELIVERY_REQUEST_DELETE_FAILURE: {
        draft.st_deliveryRequestDeleteLoading = false;
        draft.st_deliveryRequestDeleteDone = false;
        draft.st_deliveryRequestDeleteError = action.error;
        break;
      }

      ///////////////////////////////////////////////////////

      default:
        break;
    }
  });

export default reducer;
