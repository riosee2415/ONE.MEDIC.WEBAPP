import produce from "../util/produce";

export const initailState = {
  // 장바구니 리스트
  wishList: [],
  // 약속처방 상세
  paymentDetail: null,
  // 탕전처방 상세
  preDetail: null,

  // 장바구니에 리스트
  st_wishListLoading: false,
  st_wishListDone: false,
  st_wishListError: null,

  // 장바구니에 상품 상세(약속처방)
  st_wishPaymentDetailLoading: false,
  st_wishPaymentDetailDone: false,
  st_wishPaymentDetailError: null,

  // 장바구니에 상품 추가(약속처방)
  st_wishPaymentCreateLoading: false,
  st_wishPaymentCreateDone: false,
  st_wishPaymentCreateError: null,

  // 장바구니에 상품 상세(탕전처방)
  st_wishPreDetailLoading: false,
  st_wishPreDetailDone: false,
  st_wishPreDetailError: null,

  // 장바구니에 상품 추가(탕전처방)
  st_wishPreCreateLoading: false,
  st_wishPreCreateDone: false,
  st_wishPreCreateError: null,

  // 장바구니 상품 삭제
  st_wishDeleteLoading: false,
  st_wishDeleteDone: false,
  st_wishDeleteError: null,
};

// 장바구니에 리스트
export const WISH_LIST_REQUEST = "WISH_LIST_REQUEST";
export const WISH_LIST_SUCCESS = "WISH_LIST_SUCCESS";
export const WISH_LIST_FAILURE = "WISH_LIST_FAILURE";

// 장바구니에 상품 상세(약속처방)
export const WISH_PAYMENT_DETAIL_REQUEST = "WISH_PAYMENT_DETAIL_REQUEST";
export const WISH_PAYMENT_DETAIL_SUCCESS = "WISH_PAYMENT_DETAIL_SUCCESS";
export const WISH_PAYMENT_DETAIL_FAILURE = "WISH_PAYMENT_DETAIL_FAILURE";

// 장바구니에 상품 추가(약속처방)
export const WISH_PAYMENT_CREATE_REQUEST = "WISH_PAYMENT_CREATE_REQUEST";
export const WISH_PAYMENT_CREATE_SUCCESS = "WISH_PAYMENT_CREATE_SUCCESS";
export const WISH_PAYMENT_CREATE_FAILURE = "WISH_PAYMENT_CREATE_FAILURE";

// 장바구니에 상품 상세(탕전처방)
export const WISH_PRE_DETAIL_REQUEST = "WISH_PRE_DETAIL_REQUEST";
export const WISH_PRE_DETAIL_SUCCESS = "WISH_PRE_DETAIL_SUCCESS";
export const WISH_PRE_DETAIL_FAILURE = "WISH_PRE_DETAIL_FAILURE";

// 장바구니에 상품 추가(탕전처방)
export const WISH_PRE_CREATE_REQUEST = "WISH_PRE_CREATE_REQUEST";
export const WISH_PRE_CREATE_SUCCESS = "WISH_PRE_CREATE_SUCCESS";
export const WISH_PRE_CREATE_FAILURE = "WISH_PRE_CREATE_FAILURE";

// 장바구니에 상품 삭제
export const WISH_DELETE_REQUEST = "WISH_DELETE_REQUEST";
export const WISH_DELETE_SUCCESS = "WISH_DELETE_SUCCESS";
export const WISH_DELETE_FAILURE = "WISH_DELETE_FAILURE";

const reducer = (state = initailState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      /////////////////////////////////////////////////////// 장바구니에 리스트
      case WISH_LIST_REQUEST: {
        draft.st_wishListLoading = true;
        draft.st_wishListDone = false;
        draft.st_wishListError = null;
        break;
      }
      case WISH_LIST_SUCCESS: {
        draft.st_wishListLoading = false;
        draft.st_wishListDone = true;
        draft.st_wishListError = null;
        draft.wishList = action.data;
        break;
      }
      case WISH_LIST_FAILURE: {
        draft.st_wishListLoading = false;
        draft.st_wishListDone = false;
        draft.st_wishListError = action.error;
        break;
      }

      /////////////////////////////////////////////////////// 장바구니에 상품 상세(약속처방)
      case WISH_PAYMENT_DETAIL_REQUEST: {
        draft.st_wishPaymentDetailLoading = true;
        draft.st_wishPaymentDetailDone = false;
        draft.st_wishPaymentDetailError = null;
        break;
      }
      case WISH_PAYMENT_DETAIL_SUCCESS: {
        draft.st_wishPaymentDetailLoading = false;
        draft.st_wishPaymentDetailDone = true;
        draft.st_wishPaymentDetailError = null;
        draft.paymentDetail = action.data;
        break;
      }
      case WISH_PAYMENT_DETAIL_FAILURE: {
        draft.st_wishPaymentDetailLoading = false;
        draft.st_wishPaymentDetailDone = false;
        draft.st_wishPaymentDetailError = action.error;
        break;
      }

      /////////////////////////////////////////////////////// 장바구니에 상품 추가(약속처방)
      case WISH_PAYMENT_CREATE_REQUEST: {
        draft.st_wishPaymentCreateLoading = true;
        draft.st_wishPaymentCreateDone = false;
        draft.st_wishPaymentCreateError = null;
        break;
      }
      case WISH_PAYMENT_CREATE_SUCCESS: {
        draft.st_wishPaymentCreateLoading = false;
        draft.st_wishPaymentCreateDone = true;
        draft.st_wishPaymentCreateError = null;
        break;
      }
      case WISH_PAYMENT_CREATE_FAILURE: {
        draft.st_wishPaymentCreateLoading = false;
        draft.st_wishPaymentCreateDone = false;
        draft.st_wishPaymentCreateError = action.error;
        break;
      }

      /////////////////////////////////////////////////////// 장바구니에 상품 상세(탕전처방)
      case WISH_PRE_DETAIL_REQUEST: {
        draft.st_wishPreDetailLoading = true;
        draft.st_wishPreDetailDone = false;
        draft.st_wishPreDetailError = null;
        break;
      }
      case WISH_PRE_DETAIL_SUCCESS: {
        draft.st_wishPreDetailLoading = false;
        draft.st_wishPreDetailDone = true;
        draft.st_wishPreDetailError = null;
        draft.preDetail = action.data;
        break;
      }
      case WISH_PRE_DETAIL_FAILURE: {
        draft.st_wishPreDetailLoading = false;
        draft.st_wishPreDetailDone = false;
        draft.st_wishPreDetailError = action.error;
        break;
      }

      /////////////////////////////////////////////////////// 장바구니에 상품 추가(탕전처방)
      case WISH_PRE_CREATE_REQUEST: {
        draft.st_wishPreCreateLoading = true;
        draft.st_wishPreCreateDone = false;
        draft.st_wishPreCreateError = null;
        break;
      }
      case WISH_PRE_CREATE_SUCCESS: {
        draft.st_wishPreCreateLoading = false;
        draft.st_wishPreCreateDone = true;
        draft.st_wishPreCreateError = null;
        break;
      }
      case WISH_PRE_CREATE_FAILURE: {
        draft.st_wishPreCreateLoading = false;
        draft.st_wishPreCreateDone = false;
        draft.st_wishPreCreateError = action.error;
        break;
      }

      /////////////////////////////////////////////////////// 장바구니에 상품 삭제
      case WISH_DELETE_REQUEST: {
        draft.st_wishDeleteLoading = true;
        draft.st_wishDeleteDone = false;
        draft.st_wishDeleteError = null;
        break;
      }
      case WISH_DELETE_SUCCESS: {
        draft.st_wishDeleteLoading = false;
        draft.st_wishDeleteDone = true;
        draft.st_wishDeleteError = null;
        break;
      }
      case WISH_DELETE_FAILURE: {
        draft.st_wishDeleteLoading = false;
        draft.st_wishDeleteDone = false;
        draft.st_wishDeleteError = action.error;
        break;
      }

      default:
        break;
    }
  });

export default reducer;
