import produce from "../util/produce";

export const initialState = {
  paymentRequest: null,

  detailModal: false,

  st_paymentRequestListLoading: false,
  st_paymentRequestListDone: false,
  st_paymentRequestListError: null,
};

export const PAYMENTREQUEST_LIST_REQUEST = "PAYMENTREQUEST_LIST_REQUEST";
export const PAYMENTREQUEST_LIST_SUCCESS = "PAYMENTREQUEST_LIST_SUCCESS";
export const PAYMENTREQUEST_LIST_FAILURE = "PAYMENTREQUEST_LIST_FAILURE";

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

      case DETAIL_MODAL_TOGGLE:
        draft.detailModal = !draft.detailModal;
        break;

      ////////////////////
      default:
        break;
    }
  });

export default reducer;
