import produce from "../util/produce";

export const initialState = {
  // 아이디
  boughtId: null,

  // 상세 정보
  boughtDetail: null,

  // 주문목록
  boughtList: [],

  // 관리자 주문목록
  adminBoughtList: [],

  // 구매하기 - 배송정보
  st_boughtDeliveryLoading: false,
  st_boughtDeliveryDone: false,
  st_boughtDeliveryError: null,

  // 구매하기 - 결제정보
  st_boughtPayLoading: false,
  st_boughtPayDone: false,
  st_boughtPayError: null,

  // 구매하기 - 상세정보
  st_boughtDetailLoading: false,
  st_boughtDetailDone: false,
  st_boughtDetailError: null,

  // 주문목록
  st_boughtListLoading: false,
  st_boughtListDone: false,
  st_boughtListError: null,

  // 관리자 주문목록
  st_boughtAdminListLoading: false,
  st_boughtAdminListDone: false,
  st_boughtAdminListError: null,

  // 배송정보 수정
  st_boughtDeliveryUpdateLoading: false,
  st_boughtDeliveryUpdateDone: false,
  st_boughtDeliveryUpdateError: null,

  // 처리완료
  st_boughtCompleteUpdateLoading: false,
  st_boughtCompleteUpdateDone: false,
  st_boughtCompleteUpdateError: null,

  // 거절하기
  st_boughtRefuseUpdateLoading: false,
  st_boughtRefuseUpdateDone: false,
  st_boughtRefuseUpdateError: null,
};

export const BOUGHT_DELIVERY_REQUEST = "BOUGHT_DELIVERY_REQUEST";
export const BOUGHT_DELIVERY_SUCCESS = "BOUGHT_DELIVERY_SUCCESS";
export const BOUGHT_DELIVERY_FAILURE = "BOUGHT_DELIVERY_FAILURE";

export const BOUGHT_PAY_REQUEST = "BOUGHT_PAY_REQUEST";
export const BOUGHT_PAY_SUCCESS = "BOUGHT_PAY_SUCCESS";
export const BOUGHT_PAY_FAILURE = "BOUGHT_PAY_FAILURE";

export const BOUGHT_DETAIL_REQUEST = "BOUGHT_DETAIL_REQUEST";
export const BOUGHT_DETAIL_SUCCESS = "BOUGHT_DETAIL_SUCCESS";
export const BOUGHT_DETAIL_FAILURE = "BOUGHT_DETAIL_FAILURE";

export const BOUGHT_LIST_REQUEST = "BOUGHT_LIST_REQUEST";
export const BOUGHT_LIST_SUCCESS = "BOUGHT_LIST_SUCCESS";
export const BOUGHT_LIST_FAILURE = "BOUGHT_LIST_FAILURE";

export const BOUGHT_ADMIN_LIST_REQUEST = "BOUGHT_ADMIN_LIST_REQUEST";
export const BOUGHT_ADMIN_LIST_SUCCESS = "BOUGHT_ADMIN_LIST_SUCCESS";
export const BOUGHT_ADMIN_LIST_FAILURE = "BOUGHT_ADMIN_LIST_FAILURE";

export const BOUGHT_DELIVERY_UPDATE_REQUEST = "BOUGHT_DELIVERY_UPDATE_REQUEST";
export const BOUGHT_DELIVERY_UPDATE_SUCCESS = "BOUGHT_DELIVERY_UPDATE_SUCCESS";
export const BOUGHT_DELIVERY_UPDATE_FAILURE = "BOUGHT_DELIVERY_UPDATE_FAILURE";

export const BOUGHT_COMPLETE_UPDATE_REQUEST = "BOUGHT_COMPLETE_UPDATE_REQUEST";
export const BOUGHT_COMPLETE_UPDATE_SUCCESS = "BOUGHT_COMPLETE_UPDATE_SUCCESS";
export const BOUGHT_COMPLETE_UPDATE_FAILURE = "BOUGHT_COMPLETE_UPDATE_FAILURE";

export const BOUGHT_REFUSE_UPDATE_REQUEST = "BOUGHT_REFUSE_UPDATE_REQUEST";
export const BOUGHT_REFUSE_UPDATE_SUCCESS = "BOUGHT_REFUSE_UPDATE_SUCCESS";
export const BOUGHT_REFUSE_UPDATE_FAILURE = "BOUGHT_REFUSE_UPDATE_FAILURE";

const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      //////////////////////////////////////////////

      case BOUGHT_DELIVERY_REQUEST: {
        draft.st_boughtDeliveryLoading = true;
        draft.st_boughtDeliveryDone = false;
        draft.st_boughtDeliveryError = null;
        break;
      }
      case BOUGHT_DELIVERY_SUCCESS: {
        draft.st_boughtDeliveryLoading = false;
        draft.st_boughtDeliveryDone = true;
        draft.st_boughtDeliveryError = null;
        draft.boughtId = action.data.id;
        break;
      }
      case BOUGHT_DELIVERY_FAILURE: {
        draft.st_boughtDeliveryLoading = false;
        draft.st_boughtDeliveryDone = false;
        draft.st_boughtDeliveryError = action.error;
        break;
      }

      //////////////////////////////////////////////

      case BOUGHT_PAY_REQUEST: {
        draft.st_boughtPayLoading = true;
        draft.st_boughtPayDone = false;
        draft.st_boughtPayError = null;
        break;
      }
      case BOUGHT_PAY_SUCCESS: {
        draft.st_boughtPayLoading = false;
        draft.st_boughtPayDone = true;
        draft.st_boughtPayError = null;
        break;
      }
      case BOUGHT_PAY_FAILURE: {
        draft.st_boughtPayLoading = false;
        draft.st_boughtPayDone = false;
        draft.st_boughtPayError = action.error;
        break;
      }

      //////////////////////////////////////////////

      case BOUGHT_DETAIL_REQUEST: {
        draft.st_boughtDetailLoading = true;
        draft.st_boughtDetailDone = false;
        draft.st_boughtDetailError = null;
        break;
      }
      case BOUGHT_DETAIL_SUCCESS: {
        draft.st_boughtDetailLoading = false;
        draft.st_boughtDetailDone = true;
        draft.st_boughtDetailError = null;
        draft.boughtDetail = action.data;
        break;
      }
      case BOUGHT_DETAIL_FAILURE: {
        draft.st_boughtDetailLoading = false;
        draft.st_boughtDetailDone = false;
        draft.st_boughtDetailError = action.error;
        break;
      }

      //////////////////////////////////////////////

      case BOUGHT_LIST_REQUEST: {
        draft.st_boughtListLoading = true;
        draft.st_boughtListDone = false;
        draft.st_boughtListError = null;
        break;
      }
      case BOUGHT_LIST_SUCCESS: {
        draft.st_boughtListLoading = false;
        draft.st_boughtListDone = true;
        draft.st_boughtListError = null;
        draft.boughtList = action.data;
        break;
      }
      case BOUGHT_LIST_FAILURE: {
        draft.st_boughtListLoading = false;
        draft.st_boughtListDone = false;
        draft.st_boughtListError = action.error;
        break;
      }

      //////////////////////////////////////////////

      case BOUGHT_ADMIN_LIST_REQUEST: {
        draft.st_boughtAdminListLoading = true;
        draft.st_boughtAdminListDone = false;
        draft.st_boughtAdminListError = null;
        break;
      }
      case BOUGHT_ADMIN_LIST_SUCCESS: {
        draft.st_boughtAdminListLoading = false;
        draft.st_boughtAdminListDone = true;
        draft.st_boughtAdminListError = null;
        draft.adminBoughtList = action.data;
        break;
      }
      case BOUGHT_ADMIN_LIST_FAILURE: {
        draft.st_boughtAdminListLoading = false;
        draft.st_boughtAdminListDone = false;
        draft.st_boughtAdminListError = action.error;
        break;
      }

      //////////////////////////////////////////////

      case BOUGHT_DELIVERY_UPDATE_REQUEST: {
        draft.st_boughtDeliveryUpdateLoading = true;
        draft.st_boughtDeliveryUpdateDone = false;
        draft.st_boughtDeliveryUpdateError = null;
        break;
      }
      case BOUGHT_DELIVERY_UPDATE_SUCCESS: {
        draft.st_boughtDeliveryUpdateLoading = false;
        draft.st_boughtDeliveryUpdateDone = true;
        draft.st_boughtDeliveryUpdateError = null;
        break;
      }
      case BOUGHT_DELIVERY_UPDATE_FAILURE: {
        draft.st_boughtDeliveryUpdateLoading = false;
        draft.st_boughtDeliveryUpdateDone = false;
        draft.st_boughtDeliveryUpdateError = action.error;
        break;
      }

      //////////////////////////////////////////////

      case BOUGHT_COMPLETE_UPDATE_REQUEST: {
        draft.st_boughtCompleteUpdateLoading = true;
        draft.st_boughtCompleteUpdateDone = false;
        draft.st_boughtCompleteUpdateError = null;
        break;
      }
      case BOUGHT_COMPLETE_UPDATE_SUCCESS: {
        draft.st_boughtCompleteUpdateLoading = false;
        draft.st_boughtCompleteUpdateDone = true;
        draft.st_boughtCompleteUpdateError = null;
        break;
      }
      case BOUGHT_COMPLETE_UPDATE_FAILURE: {
        draft.st_boughtCompleteUpdateLoading = false;
        draft.st_boughtCompleteUpdateDone = false;
        draft.st_boughtCompleteUpdateError = action.error;
        break;
      }

      //////////////////////////////////////////////

      case BOUGHT_REFUSE_UPDATE_REQUEST: {
        draft.st_boughtRefuseUpdateLoading = true;
        draft.st_boughtRefuseUpdateDone = false;
        draft.st_boughtRefuseUpdateError = null;
        break;
      }
      case BOUGHT_REFUSE_UPDATE_SUCCESS: {
        draft.st_boughtRefuseUpdateLoading = false;
        draft.st_boughtRefuseUpdateDone = true;
        draft.st_boughtRefuseUpdateError = null;
        break;
      }
      case BOUGHT_REFUSE_UPDATE_FAILURE: {
        draft.st_boughtRefuseUpdateLoading = false;
        draft.st_boughtRefuseUpdateDone = false;
        draft.st_boughtRefuseUpdateError = action.error;
        break;
      }

      //////////////////////////////////////////////

      default:
        break;
    }
  });

export default reducer;
