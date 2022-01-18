import produce from "../util/produce";

export const initialState = {
  paymentRequest: null,

  unitModal: false,

  userDetailModal: false,

  detailModal: false,

  st_paymentRequestListLoading: false,
  st_paymentRequestListDone: false,
  st_paymentRequestListError: null,
  //
  st_paymentRequestCompleteLoading: false,
  st_paymentRequestCompleteDone: false,
  st_paymentRequestCompleteError: null,
};

export const PAYMENTREQUEST_LIST_REQUEST = "PAYMENTREQUEST_LIST_REQUEST";
export const PAYMENTREQUEST_LIST_SUCCESS = "PAYMENTREQUEST_LIST_SUCCESS";
export const PAYMENTREQUEST_LIST_FAILURE = "PAYMENTREQUEST_LIST_FAILURE";

export const PAYMENTREQUEST_COMPLETE_REQUEST =
  "PAYMENTREQUEST_COMPLETE_REQUEST";
export const PAYMENTREQUEST_COMPLETE_SUCCESS =
  "PAYMENTREQUEST_COMPLETE_SUCCESS";
export const PAYMENTREQUEST_COMPLETE_FAILURE =
  "PAYMENTREQUEST_COMPLETE_FAILURE";

export const UNIT_MODAL_TOGGLE = "UNIT_MODAL_TOGGLE";
export const USER_DETAIL_MODAL_TOGGLE = "USER_DETAIL_MODAL_TOGGLE";
export const DETAIL_MODAL_TOGGLE = "DETAIL_MODAL_TOGGLE";

const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case PAYMENTREQUEST_LIST_REQUEST:
        draft.st_paymentRequestListLoading = true;
        draft.st_paymentRequestListDone = false;
        draft.st_paymentRequestListError = null;
        break;
      case PAYMENTREQUEST_LIST_SUCCESS:
        draft.st_paymentRequestListLoading = false;
        draft.st_paymentRequestListDone = true;
        draft.paymentRequest = action.data;
        break;
      case PAYMENTREQUEST_LIST_FAILURE:
        draft.st_paymentRequestListLoading = false;
        draft.st_paymentRequestListDone = false;
        draft.st_paymentRequestListError = action.error;
        break;

      ////////////////////
      case PAYMENTREQUEST_COMPLETE_REQUEST:
        draft.st_paymentRequestCompleteLoading = true;
        draft.st_paymentRequestCompleteDone = false;
        draft.st_paymentRequestCompleteError = null;
        break;
      case PAYMENTREQUEST_COMPLETE_SUCCESS:
        draft.st_paymentRequestCompleteLoading = false;
        draft.st_paymentRequestCompleteDone = true;
        break;
      case PAYMENTREQUEST_COMPLETE_FAILURE:
        draft.st_paymentRequestCompleteLoading = false;
        draft.st_paymentRequestCompleteDone = false;
        draft.st_paymentRequestCompleteError = action.error;
        break;

      ////////////////////

      case UNIT_MODAL_TOGGLE:
        draft.unitModal = !draft.unitModal;
        break;

      case DETAIL_MODAL_TOGGLE:
        draft.detailModal = !draft.detailModal;
        break;

      case USER_DETAIL_MODAL_TOGGLE:
        draft.userDetailModal = !draft.userDetailModal;
        break;

      ////////////////////
      default:
        break;
    }
  });

export default reducer;
