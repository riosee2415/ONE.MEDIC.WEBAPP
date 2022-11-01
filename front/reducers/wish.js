import produce from "../util/produce";

export const initailState = {
  // 장바구니에 상품 추가(약속처방)
  st_wishPaymentCreateLoading: false,
  st_wishPaymentCreateDone: false,
  st_wishPaymentCreateError: null,
};

// 장바구니에 상품 추가(약속처방)
export const WISH_PAYMENT_CREATE_REQUEST = "WISH_PAYMENT_CREATE_REQUEST";
export const WISH_PAYMENT_CREATE_SUCCESS = "WISH_PAYMENT_CREATE_SUCCESS";
export const WISH_PAYMENT_CREATE_FAILURE = "WISH_PAYMENT_CREATE_FAILURE";

const reducer = (state = initailState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
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

      ///////////////////////////////////////////////////////

      ///////////////////////////////////////////////////////

      default:
        break;
    }
  });

export default reducer;
