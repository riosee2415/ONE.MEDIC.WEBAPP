import produce from "../util/produce";

export const initailState = {
  // 장바구니 리스트
  wishList: [],
  // 약속처방 상세
  wishPaymentDetail: null,
  // 탕전처방 상세
  wishPreDetail: null,

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

  // 장바구니에 상품 수정(약속처방)
  st_wishPaymentUpdateLoading: false,
  st_wishPaymentUpdateDone: false,
  st_wishPaymentUpdateError: null,

  // 장바구니 안에 상품 생성(약속처방)
  st_wishPaymentItemCreateLoading: false,
  st_wishPaymentItemCreateDone: false,
  st_wishPaymentItemCreateError: null,

  // 장바구니 안에 상품 수정(약속처방)
  st_wishPaymentItemUpdateLoading: false,
  st_wishPaymentItemUpdateDone: false,
  st_wishPaymentItemUpdateError: null,

  // 장바구니 안에 상품 삭제(약속처방)
  st_wishPaymentItemDeleteLoading: false,
  st_wishPaymentItemDeleteDone: false,
  st_wishPaymentItemDeleteError: null,

  // 장바구니 안에 상품 수량 수정(약속처방)
  st_wishPaymentItemQntLoading: false,
  st_wishPaymentItemQntDone: false,
  st_wishPaymentItemQntError: null,

  // 장바구니에 상품 상세(탕전처방)
  st_wishPreDetailLoading: false,
  st_wishPreDetailDone: false,
  st_wishPreDetailError: null,

  // 장바구니에 상품 추가(탕전처방)
  st_wishPreCreateLoading: false,
  st_wishPreCreateDone: false,
  st_wishPreCreateError: null,

  // 장바구니에 상품 수정(탕전처방)
  st_wishPreUpdateLoading: false,
  st_wishPreUpdateDone: false,
  st_wishPreUpdateError: null,

  // 장바구니 안에 상품 생성(탕전처방)
  st_wishPreItemCreateLoading: false,
  st_wishPreItemCreateDone: false,
  st_wishPreItemCreateError: null,

  // 장바구니 안에 상품 수정(탕전처방)
  st_wishPreItemUpdateLoading: false,
  st_wishPreItemUpdateDone: false,
  st_wishPreItemUpdateError: null,

  // 장바구니 안에 상품 삭제(탕전처방)
  st_wishPreItemDeleteLoading: false,
  st_wishPreItemDeleteDone: false,
  st_wishPreItemDeleteError: null,

  // 장바구니 안에 상품 수량(탕전처방)
  st_wishPreItemQntLoading: false,
  st_wishPreItemQntDone: false,
  st_wishPreItemQntError: null,

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

// 장바구니에 상품 수정(약속처방)
export const WISH_PAYMENT_UPDATE_REQUEST = "WISH_PAYMENT_UPDATE_REQUEST";
export const WISH_PAYMENT_UPDATE_SUCCESS = "WISH_PAYMENT_UPDATE_SUCCESS";
export const WISH_PAYMENT_UPDATE_FAILURE = "WISH_PAYMENT_UPDATE_FAILURE";

// 장바구니 안에 상품 생성(약속처방)
export const WISH_PAYMENT_ITEM_CREATE_REQUEST =
  "WISH_PAYMENT_ITEM_CREATE_REQUEST";
export const WISH_PAYMENT_ITEM_CREATE_SUCCESS =
  "WISH_PAYMENT_ITEM_CREATE_SUCCESS";
export const WISH_PAYMENT_ITEM_CREATE_FAILURE =
  "WISH_PAYMENT_ITEM_CREATE_FAILURE";

// 장바구니 안에 상품 수정(약속처방)
export const WISH_PAYMENT_ITEM_UPDATE_REQUEST =
  "WISH_PAYMENT_ITEM_UPDATE_REQUEST";
export const WISH_PAYMENT_ITEM_UPDATE_SUCCESS =
  "WISH_PAYMENT_ITEM_UPDATE_SUCCESS";
export const WISH_PAYMENT_ITEM_UPDATE_FAILURE =
  "WISH_PAYMENT_ITEM_UPDATE_FAILURE";

// 장바구니 안에 상품 삭제(약속처방)
export const WISH_PAYMENT_ITEM_DELETE_REQUEST =
  "WISH_PAYMENT_ITEM_DELETE_REQUEST";
export const WISH_PAYMENT_ITEM_DELETE_SUCCESS =
  "WISH_PAYMENT_ITEM_DELETE_SUCCESS";
export const WISH_PAYMENT_ITEM_DELETE_FAILURE =
  "WISH_PAYMENT_ITEM_DELETE_FAILURE";

// 장바구니 안에 상품 수량 수정(약속처방)
export const WISH_PAYMENT_ITEM_QNT_REQUEST = "WISH_PAYMENT_ITEM_QNT_REQUEST";
export const WISH_PAYMENT_ITEM_QNT_SUCCESS = "WISH_PAYMENT_ITEM_QNT_SUCCESS";
export const WISH_PAYMENT_ITEM_QNT_FAILURE = "WISH_PAYMENT_ITEM_QNT_FAILURE";

// 장바구니에 상품 상세(탕전처방)
export const WISH_PRE_DETAIL_REQUEST = "WISH_PRE_DETAIL_REQUEST";
export const WISH_PRE_DETAIL_SUCCESS = "WISH_PRE_DETAIL_SUCCESS";
export const WISH_PRE_DETAIL_FAILURE = "WISH_PRE_DETAIL_FAILURE";

// 장바구니에 상품 추가(탕전처방)
export const WISH_PRE_CREATE_REQUEST = "WISH_PRE_CREATE_REQUEST";
export const WISH_PRE_CREATE_SUCCESS = "WISH_PRE_CREATE_SUCCESS";
export const WISH_PRE_CREATE_FAILURE = "WISH_PRE_CREATE_FAILURE";

// 장바구니에 상품 수정(탕전처방)
export const WISH_PRE_UPDATE_REQUEST = "WISH_PRE_UPDATE_REQUEST";
export const WISH_PRE_UPDATE_SUCCESS = "WISH_PRE_UPDATE_SUCCESS";
export const WISH_PRE_UPDATE_FAILURE = "WISH_PRE_UPDATE_FAILURE";

// 장바구니 안에 상품 생성(탕전처방)
export const WISH_PRE_ITEM_CREATE_REQUEST = "WISH_PRE_ITEM_CREATE_REQUEST";
export const WISH_PRE_ITEM_CREATE_SUCCESS = "WISH_PRE_ITEM_CREATE_SUCCESS";
export const WISH_PRE_ITEM_CREATE_FAILURE = "WISH_PRE_ITEM_CREATE_FAILURE";

// 장바구니 안에 상품 수정(탕전처방)
export const WISH_PRE_ITEM_UPDATE_REQUEST = "WISH_PRE_ITEM_UPDATE_REQUEST";
export const WISH_PRE_ITEM_UPDATE_SUCCESS = "WISH_PRE_ITEM_UPDATE_SUCCESS";
export const WISH_PRE_ITEM_UPDATE_FAILURE = "WISH_PRE_ITEM_UPDATE_FAILURE";

// 장바구니 안에 상품 삭제(탕전처방)
export const WISH_PRE_ITEM_DELETE_REQUEST = "WISH_PRE_ITEM_DELETE_REQUEST";
export const WISH_PRE_ITEM_DELETE_SUCCESS = "WISH_PRE_ITEM_DELETE_SUCCESS";
export const WISH_PRE_ITEM_DELETE_FAILURE = "WISH_PRE_ITEM_DELETE_FAILURE";

// 장바구니 안에 상품 수량(탕전처방)
export const WISH_PRE_ITEM_QNT_REQUEST = "WISH_PRE_ITEM_QNT_REQUEST";
export const WISH_PRE_ITEM_QNT_SUCCESS = "WISH_PRE_ITEM_QNT_SUCCESS";
export const WISH_PRE_ITEM_QNT_FAILURE = "WISH_PRE_ITEM_QNT_FAILURE";

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
        draft.wishPaymentDetail = action.data;
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

      /////////////////////////////////////////////////////// 장바구니에 상품 수정(약속처방)
      case WISH_PAYMENT_UPDATE_REQUEST: {
        draft.st_wishPaymentUpdateLoading = true;
        draft.st_wishPaymentUpdateDone = false;
        draft.st_wishPaymentUpdateError = null;
        break;
      }
      case WISH_PAYMENT_UPDATE_SUCCESS: {
        draft.st_wishPaymentUpdateLoading = false;
        draft.st_wishPaymentUpdateDone = true;
        draft.st_wishPaymentUpdateError = null;
        break;
      }
      case WISH_PAYMENT_UPDATE_FAILURE: {
        draft.st_wishPaymentUpdateLoading = false;
        draft.st_wishPaymentUpdateDone = false;
        draft.st_wishPaymentUpdateError = action.error;
        break;
      }

      /////////////////////////////////////////////////////// 장바구니 안에 상품 추가(약속처방)
      case WISH_PAYMENT_ITEM_CREATE_REQUEST: {
        draft.st_wishPaymentItemCreateLoading = true;
        draft.st_wishPaymentItemCreateDone = false;
        draft.st_wishPaymentItemCreateError = null;
        break;
      }
      case WISH_PAYMENT_ITEM_CREATE_SUCCESS: {
        draft.st_wishPaymentItemCreateLoading = false;
        draft.st_wishPaymentItemCreateDone = true;
        draft.st_wishPaymentItemCreateError = null;
        break;
      }
      case WISH_PAYMENT_ITEM_CREATE_FAILURE: {
        draft.st_wishPaymentItemCreateLoading = false;
        draft.st_wishPaymentItemCreateDone = false;
        draft.st_wishPaymentItemCreateError = action.error;
        break;
      }

      /////////////////////////////////////////////////////// 장바구니 안에 상품 수정(약속처방)
      case WISH_PAYMENT_ITEM_UPDATE_REQUEST: {
        draft.st_wishPaymentItemUpdateLoading = true;
        draft.st_wishPaymentItemUpdateDone = false;
        draft.st_wishPaymentItemUpdateError = null;
        break;
      }
      case WISH_PAYMENT_ITEM_UPDATE_SUCCESS: {
        draft.st_wishPaymentItemUpdateLoading = false;
        draft.st_wishPaymentItemUpdateDone = true;
        draft.st_wishPaymentItemUpdateError = null;
        break;
      }
      case WISH_PAYMENT_ITEM_UPDATE_FAILURE: {
        draft.st_wishPaymentItemUpdateLoading = false;
        draft.st_wishPaymentItemUpdateDone = false;
        draft.st_wishPaymentItemUpdateError = action.error;
        break;
      }

      /////////////////////////////////////////////////////// 장바구니 안에 상품 삭제(약속처방)
      case WISH_PAYMENT_ITEM_DELETE_REQUEST: {
        draft.st_wishPaymentItemDeleteLoading = true;
        draft.st_wishPaymentItemDeleteDone = false;
        draft.st_wishPaymentItemDeleteError = null;
        break;
      }
      case WISH_PAYMENT_ITEM_DELETE_SUCCESS: {
        draft.st_wishPaymentItemDeleteLoading = false;
        draft.st_wishPaymentItemDeleteDone = true;
        draft.st_wishPaymentItemDeleteError = null;
        break;
      }
      case WISH_PAYMENT_ITEM_DELETE_FAILURE: {
        draft.st_wishPaymentItemDeleteLoading = false;
        draft.st_wishPaymentItemDeleteDone = false;
        draft.st_wishPaymentItemDeleteError = action.error;
        break;
      }

      /////////////////////////////////////////////////////// 장바구니 안에 상품 삭제(약속처방)
      case WISH_PAYMENT_ITEM_QNT_REQUEST: {
        draft.st_wishPaymentItemQntLoading = true;
        draft.st_wishPaymentItemQntDone = false;
        draft.st_wishPaymentItemQntError = null;
        break;
      }
      case WISH_PAYMENT_ITEM_QNT_SUCCESS: {
        draft.st_wishPaymentItemQntLoading = false;
        draft.st_wishPaymentItemQntDone = true;
        draft.st_wishPaymentItemQntError = null;
        break;
      }
      case WISH_PAYMENT_ITEM_QNT_FAILURE: {
        draft.st_wishPaymentItemQntLoading = false;
        draft.st_wishPaymentItemQntDone = false;
        draft.st_wishPaymentItemQntError = action.error;
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
        draft.wishPreDetail = action.data;
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

      /////////////////////////////////////////////////////// 장바구니에 상품 수정(탕전처방)
      case WISH_PRE_UPDATE_REQUEST: {
        draft.st_wishPreUpdateLoading = true;
        draft.st_wishPreUpdateDone = false;
        draft.st_wishPreUpdateError = null;
        break;
      }
      case WISH_PRE_UPDATE_SUCCESS: {
        draft.st_wishPreUpdateLoading = false;
        draft.st_wishPreUpdateDone = true;
        draft.st_wishPreUpdateError = null;
        break;
      }
      case WISH_PRE_UPDATE_FAILURE: {
        draft.st_wishPreUpdateLoading = false;
        draft.st_wishPreUpdateDone = false;
        draft.st_wishPreUpdateError = action.error;
        break;
      }
      /////////////////////////////////////////////////////// 장바구니 안에 상품 생성(탕전처방)
      case WISH_PRE_ITEM_CREATE_REQUEST: {
        draft.st_wishPreItemCreateLoading = true;
        draft.st_wishPreItemCreateDone = false;
        draft.st_wishPreItemCreateError = null;
        break;
      }
      case WISH_PRE_ITEM_CREATE_SUCCESS: {
        draft.st_wishPreItemCreateLoading = false;
        draft.st_wishPreItemCreateDone = true;
        draft.st_wishPreItemCreateError = null;
        break;
      }
      case WISH_PRE_ITEM_CREATE_FAILURE: {
        draft.st_wishPreItemCreateLoading = false;
        draft.st_wishPreItemCreateDone = false;
        draft.st_wishPreItemCreateError = action.error;
        break;
      }
      /////////////////////////////////////////////////////// 장바구니 안에 상품 수정(탕전처방)
      case WISH_PRE_ITEM_UPDATE_REQUEST: {
        draft.st_wishPreItemUpdateLoading = true;
        draft.st_wishPreItemUpdateDone = false;
        draft.st_wishPreItemUpdateError = null;
        break;
      }
      case WISH_PRE_ITEM_UPDATE_SUCCESS: {
        draft.st_wishPreItemUpdateLoading = false;
        draft.st_wishPreItemUpdateDone = true;
        draft.st_wishPreItemUpdateError = null;
        break;
      }
      case WISH_PRE_ITEM_UPDATE_FAILURE: {
        draft.st_wishPreItemUpdateLoading = false;
        draft.st_wishPreItemUpdateDone = false;
        draft.st_wishPreItemUpdateError = action.error;
        break;
      }
      /////////////////////////////////////////////////////// 장바구니 안에 상품 삭제(탕전처방)
      case WISH_PRE_ITEM_DELETE_REQUEST: {
        draft.st_wishPreItemDeleteLoading = true;
        draft.st_wishPreItemDeleteDone = false;
        draft.st_wishPreItemDeleteError = null;
        break;
      }
      case WISH_PRE_ITEM_DELETE_SUCCESS: {
        draft.st_wishPreItemDeleteLoading = false;
        draft.st_wishPreItemDeleteDone = true;
        draft.st_wishPreItemDeleteError = null;
        break;
      }
      case WISH_PRE_ITEM_DELETE_FAILURE: {
        draft.st_wishPreItemDeleteLoading = false;
        draft.st_wishPreItemDeleteDone = false;
        draft.st_wishPreItemDeleteError = action.error;
        break;
      }
      /////////////////////////////////////////////////////// 장바구니 안에 상품 삭제(탕전처방)
      case WISH_PRE_ITEM_QNT_REQUEST: {
        draft.st_wishPreItemQntLoading = true;
        draft.st_wishPreItemQntDone = false;
        draft.st_wishPreItemQntError = null;
        break;
      }
      case WISH_PRE_ITEM_QNT_SUCCESS: {
        draft.st_wishPreItemQntLoading = false;
        draft.st_wishPreItemQntDone = true;
        draft.st_wishPreItemQntError = null;
        break;
      }
      case WISH_PRE_ITEM_QNT_FAILURE: {
        draft.st_wishPreItemQntLoading = false;
        draft.st_wishPreItemQntDone = false;
        draft.st_wishPreItemQntError = action.error;
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
