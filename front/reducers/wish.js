import produce from "../util/produce";

export const initailState = {
  // 값
  wishList: [],

  // 장바구니에 리스트
  st_wishListLoading: false,
  st_wishListDone: false,
  st_wishListError: null,
  // 장바구니에 상품 추가(약속처방)
  st_wishPaymentCreateLoading: false,
  st_wishPaymentCreateDone: false,
  st_wishPaymentCreateError: null,
  // 장바구니 상품 삭제(약속처방)
  st_wishPaymentDeleteLoading: false,
  st_wishPaymentDeleteDone: false,
  st_wishPaymentDeleteError: null,
};

// 장바구니에 리스트
export const WISH_LIST_REQUEST = "WISH_LIST_REQUEST";
export const WISH_LIST_SUCCESS = "WISH_LIST_SUCCESS";
export const WISH_LIST_FAILURE = "WISH_LIST_FAILURE";

// 장바구니에 상품 추가(약속처방)
export const WISH_PAYMENT_CREATE_REQUEST = "WISH_PAYMENT_CREATE_REQUEST";
export const WISH_PAYMENT_CREATE_SUCCESS = "WISH_PAYMENT_CREATE_SUCCESS";
export const WISH_PAYMENT_CREATE_FAILURE = "WISH_PAYMENT_CREATE_FAILURE";

// 장바구니에 상품 삭제(약속처방)
export const WISH_PAYMENT_DELETE_REQUEST = "WISH_PAYMENT_DELETE_REQUEST";
export const WISH_PAYMENT_DELETE_SUCCESS = "WISH_PAYMENT_DELETE_SUCCESS";
export const WISH_PAYMENT_DELETE_FAILURE = "WISH_PAYMENT_DELETE_FAILURE";

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

      /////////////////////////////////////////////////////// 장바구니에 상품 추가(약속처방)
      case WISH_PAYMENT_DELETE_REQUEST: {
        draft.st_wishPaymentDeleteLoading = true;
        draft.st_wishPaymentDeleteDone = false;
        draft.st_wishPaymentDeleteError = null;
        break;
      }
      case WISH_PAYMENT_DELETE_SUCCESS: {
        draft.st_wishPaymentDeleteLoading = false;
        draft.st_wishPaymentDeleteDone = true;
        draft.st_wishPaymentDeleteError = null;
        break;
      }
      case WISH_PAYMENT_DELETE_FAILURE: {
        draft.st_wishPaymentDeleteLoading = false;
        draft.st_wishPaymentDeleteDone = false;
        draft.st_wishPaymentDeleteError = action.error;
        break;
      }

      ///////////////////////////////////////////////////////

      ///////////////////////////////////////////////////////

      default:
        break;
    }
  });

export default reducer;
