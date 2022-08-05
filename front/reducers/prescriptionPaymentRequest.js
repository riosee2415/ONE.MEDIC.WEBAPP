import produce from "../util/produce";

export const initialState = {
  pprs: null,
  pprId: null,

  unitModal: false,
  refuseModal: false,
  userDetailModal: false,
  detialMdoal: false,
  deliveryModal: false,
  refuseDetailModal: false,

  st_pprListLoading: false,
  st_pprListDone: false,
  st_pprListError: null,
  //
  st_pprCreateLoading: false, // 생성하기
  st_pprCreateDone: false,
  st_pprCreateError: null,
  //
  st_pprCompleteLoading: false,
  st_pprCompleteDone: false,
  st_pprCompleteError: null,
  //
  st_pprRefuseLoading: false,
  st_pprRefuseDone: false,
  st_pprRefuseError: null,
  //
  st_pprDeliveryLoading: false,
  st_pprDeliveryDone: false,
  st_pprDeliveryError: null,
};

export const PPR_LIST_REQUEST = "PPR_LIST_REQUEST";
export const PPR_LIST_SUCCESS = "PPR_LIST_SUCCESS";
export const PPR_LIST_FAILURE = "PPR_LIST_FAILURE";

export const PPR_CREATE_REQUEST = "PPR_CREATE_REQUEST";
export const PPR_CREATE_SUCCESS = "PPR_CREATE_SUCCESS";
export const PPR_CREATE_FAILURE = "PPR_CREATE_FAILURE";

export const PPR_COMPLETE_REQUEST = "PPR_COMPLETE_REQUEST";
export const PPR_COMPLETE_SUCCESS = "PPR_COMPLETE_SUCCESS";
export const PPR_COMPLETE_FAILURE = "PPR_COMPLETE_FAILURE";

export const PPR_REFUSE_REQUEST = "PPR_REFUSE_REQUEST";
export const PPR_REFUSE_SUCCESS = "PPR_REFUSE_SUCCESS";
export const PPR_REFUSE_FAILURE = "PPR_REFUSE_FAILURE";

export const PPR_DELIVERY_REQUEST = "PPR_DELIVERY_REQUEST";
export const PPR_DELIVERY_SUCCESS = "PPR_DELIVERY_SUCCESS";
export const PPR_DELIVERY_FAILURE = "PPR_DELIVERY_FAILURE";

export const UNIT_MODAL_TOGGLE = "UNIT_MODAL_TOGGLE";

export const DETAIL_MODAL_TOGLE = "DETAIL_MODAL_TOGLE";

export const USER_DETAIL_MODAL_TOGGLE = "USER_DETAIL_MODAL_TOGGLE";

export const ISREFUSE_MODAL_TOGGLE = "ISREFUSE_MODAL_TOGGLE";

export const DELIVERY_MODAL_TOGGLE = "DELIVERY_MODAL_TOGGLE";

export const REFUSE_DETAIL_MODAL_TOGGLE = "REFUSE_DETAIL_MODAL_TOGGLE";

const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case PPR_LIST_REQUEST:
        draft.st_pprListLoading = true;
        draft.st_pprListDone = false;
        draft.st_pprListError = null;
        break;
      case PPR_LIST_SUCCESS:
        draft.st_pprListLoading = false;
        draft.st_pprListDone = true;
        draft.st_pprListError = null;
        draft.pprs = action.data;
        break;
      case PPR_LIST_FAILURE:
        draft.st_pprListLoading = false;
        draft.st_pprListDone = false;
        draft.st_pprListError = action.error;
        break;

      ////////////////////
      case PPR_CREATE_REQUEST:
        draft.st_pprCreateLoading = true;
        draft.st_pprCreateDone = false;
        draft.st_pprCreateError = null;
        break;
      case PPR_CREATE_SUCCESS:
        draft.st_pprCreateLoading = false;
        draft.st_pprCreateDone = true;
        draft.st_pprCreateError = null;
        draft.pprId = action.data.pprId;
        break;
      case PPR_CREATE_FAILURE:
        draft.st_pprCreateLoading = false;
        draft.st_pprCreateDone = false;
        draft.st_pprCreateError = action.error;
        break;

      ////////////////////

      case PPR_COMPLETE_REQUEST:
        draft.st_pprCompleteLoading = true;
        draft.st_pprCompleteDone = false;
        draft.st_pprCompleteError = false;
        break;
      case PPR_COMPLETE_SUCCESS:
        draft.st_pprCompleteLoading = false;
        draft.st_pprCompleteDone = true;
        draft.st_pprCompleteError = null;
        break;
      case PPR_COMPLETE_FAILURE:
        draft.st_pprCompleteLoading = false;
        draft.st_pprCompleteDone = false;
        draft.st_pprCompleteError = action.error;
        break;

      ////////////////////

      case PPR_REFUSE_REQUEST:
        draft.st_pprRefuseLoading = true;
        draft.st_pprRefuseDone = false;
        draft.st_pprRefuseError = false;
        break;
      case PPR_REFUSE_SUCCESS:
        draft.st_pprRefuseLoading = false;
        draft.st_pprRefuseDone = true;
        draft.st_pprRefuseError = null;
        break;
      case PPR_REFUSE_FAILURE:
        draft.st_pprRefuseLoading = false;
        draft.st_pprRefuseDone = false;
        draft.st_pprRefuseError = action.error;
        break;

      ////////////////////

      case PPR_DELIVERY_REQUEST:
        draft.st_pprDeliveryLoading = true;
        draft.st_pprDeliveryDone = false;
        draft.st_pprDeliveryError = false;
        break;
      case PPR_DELIVERY_SUCCESS:
        draft.st_pprDeliveryLoading = false;
        draft.st_pprDeliveryDone = true;
        draft.st_pprDeliveryError = null;
        break;
      case PPR_DELIVERY_FAILURE:
        draft.st_pprDeliveryLoading = false;
        draft.st_pprDeliveryDone = false;
        draft.st_pprDeliveryError = action.error;
        break;

      ////////////////////

      case UNIT_MODAL_TOGGLE:
        draft.unitModal = !draft.unitModal;
        break;

      case DETAIL_MODAL_TOGLE:
        draft.detailModal = !draft.detailModal;
        break;

      case USER_DETAIL_MODAL_TOGGLE:
        draft.userDetailModal = !draft.userDetailModal;
        break;

      case ISREFUSE_MODAL_TOGGLE:
        draft.refuseModal = !draft.refuseModal;
        break;

      case DELIVERY_MODAL_TOGGLE:
        draft.deliveryModal = !draft.deliveryModal;
        break;

      case REFUSE_DETAIL_MODAL_TOGGLE:
        draft.refuseDetailModal = !draft.refuseDetailModal;
        break;

      ////////////////////

      default:
        break;
    }
  });

export default reducer;
