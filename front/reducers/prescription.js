import produce from "../util/produce";

export const initailState = {
  products: [],
  //
  st_productLoading: false,
  st_productDone: false,
  st_productError: null,
};

export const PRODUCT_LIST_REQUEST = "PRODUCT_LIST_REQUEST";
export const PRODUCT_LIST_SUCCESS = "PRODUCT_LIST_SUCCESS";
export const PRODUCT_LIST_FAILURE = "PRODUCT_LIST_FAILURE";

const reducer = (state = initailState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case PRODUCT_LIST_REQUEST:
        draft.st_productLoading = true;
        draft.st_productDone = false;
        draft.st_productError = null;
        break;

      case PRODUCT_LIST_SUCCESS:
        draft.st_productLoading = false;
        draft.st_productDone = true;
        draft.st_productError = null;
        draft.products = action.data;
        break;

      case PRODUCT_LIST_FAILURE:
        draft.st_productLoading = false;
        draft.st_productDone = false;
        draft.st_productError = action.data;
        break;

      default:
        break;
    }
  });

export default reducer;
