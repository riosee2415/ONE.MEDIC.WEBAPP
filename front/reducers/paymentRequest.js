import produce from "../util/produce";

export const initialState = {
  paymentRequest: null,
  paymentDetail: null,

  paymentId: null,

  unitModal: false,
  userDetailModal: false,
  detailModal: false,
  deliveryModal: false,

  st_paymentRequestListLoading: false,
  st_paymentRequestListDone: false,
  st_paymentRequestListError: null,
  //
  st_paymentRequestCompleteLoading: false,
  st_paymentRequestCompleteDone: false,
  st_paymentRequestCompleteError: null,
  //
  st_paymentRequestDeliveryLoading: false,
  st_paymentRequestDeliveryDone: false,
  st_paymentRequestDeliveryError: null,
  //
  st_paymentRequestCreateLoading: false,
  st_payemtnRequestCreateDone: false,
  st_paymentRequestCreateError: null,
  //
  st_paymentDetailLoading: false,
  st_payemtnDetailDone: false,
  st_paymentDetailError: null,
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

export const PAYMENTREQUEST_DELIVERY_REQUEST =
  "PAYMENTREQUEST_DELIVERY_REQUEST";
export const PAYMENTREQUEST_DELIVERY_SUCCESS =
  "PAYMENTREQUEST_DELIVERY_SUCCESS";
export const PAYMENTREQUEST_DELIVERY_FAILURE =
  "PAYMENTREQUEST_DELIVERY_FAILURE";

export const PAYMENTREQUEST_CREATE_REQUEST = "PAYMENTREQUEST_CREATE_REQUEST";
export const PAYMENTREQUEST_CREATE_SUCCESS = "PAYMENTREQUEST_CREATE_SUCCESS";
export const PAYMENTREQUEST_CREATE_FAILURE = "PAYMENTREQUEST_CREATE_FAILURE";

export const PAYMENT_DETAIL_REQUEST = "PAYMENT_DETAIL_REQUEST";
export const PAYMENT_DETAIL_SUCCESS = "PAYMENT_DETAIL_SUCCESS";
export const PAYMENT_DETAIL_FAILURE = "PAYMENT_DETAIL_FAILURE";

export const UNIT_MODAL_TOGGLE = "UNIT_MODAL_TOGGLE";

export const USER_DETAIL_MODAL_TOGGLE = "USER_DETAIL_MODAL_TOGGLE";

export const DETAIL_MODAL_TOGGLE = "DETAIL_MODAL_TOGGLE";

export const DELIVERY_MODAL_TOGGLE = "DELIVERY_MODAL_TOGGLE";

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
      case PAYMENTREQUEST_DELIVERY_REQUEST:
        draft.st_paymentRequestDeliveryLoading = true;
        draft.st_paymentRequestDeliveryDone = false;
        draft.st_paymentRequestDeliveryError = null;
        break;
      case PAYMENTREQUEST_DELIVERY_SUCCESS:
        draft.st_paymentRequestDeliveryLoading = false;
        draft.st_paymentRequestDeliveryDone = true;
        break;
      case PAYMENTREQUEST_DELIVERY_FAILURE:
        draft.st_paymentRequestDeliveryLoading = false;
        draft.st_paymentRequestDeliveryDone = false;
        draft.st_paymentRequestDeliveryError = action.error;
        break;

      ////////////////////
      case PAYMENTREQUEST_CREATE_REQUEST:
        draft.st_paymentRequestCreateLoading = true;
        draft.st_payemtnRequestCreateDone = false;
        draft.st_paymentRequestCreateError = null;
        break;
      case PAYMENTREQUEST_CREATE_SUCCESS:
        draft.st_paymentRequestCreateLoading = false;
        draft.st_payemtnRequestCreateDone = true;
        draft.paymentId = action.data.paymentId;
        break;
      case PAYMENTREQUEST_CREATE_FAILURE:
        draft.st_paymentRequestCreateLoading = false;
        draft.st_payemtnRequestCreateDone = false;
        draft.st_paymentRequestCreateError = action.error;
        break;

      ////////////////////
      case PAYMENT_DETAIL_REQUEST:
        draft.st_paymentDetailLoading = true;
        draft.st_payemtnDetailDone = false;
        draft.st_paymentDetailError = null;
        break;
      case PAYMENT_DETAIL_SUCCESS:
        draft.st_paymentDetailLoading = false;
        draft.st_payemtnDetailDone = true;
        draft.paymentDetail = action.data;
        break;
      case PAYMENT_DETAIL_FAILURE:
        draft.st_paymentDetailLoading = false;
        draft.st_payemtnDetailDone = false;
        draft.st_paymentDetailError = action.error;
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

      case DELIVERY_MODAL_TOGGLE:
        draft.deliveryModal = !draft.deliveryModal;
        break;

      ////////////////////
      default:
        break;
    }
  });

export default reducer;
