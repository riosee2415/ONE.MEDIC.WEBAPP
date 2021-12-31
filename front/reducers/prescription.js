import produce from "../util/produce";

export const initailState = {
  products: [],
  //
  st_productLoading: false,
  st_productDone: false,
  st_productError: null,
  //
  guideModal: false,
  typeModal: false,
  packModal: false,
  unitModal: false,
};

export const PRODUCT_LIST_REQUEST = "PRODUCT_LIST_REQUEST";
export const PRODUCT_LIST_SUCCESS = "PRODUCT_LIST_SUCCESS";
export const PRODUCT_LIST_FAILURE = "PRODUCT_LIST_FAILURE";

export const GUIDE_MODAL_TOGGLE = "GUIDE_MODAL_TOGGLE";
export const TYPE_MODAL_TOGGLE = "TYPE_MODAL_TOGGLE";
export const PACK_MODAL_TOGGLE = "PACK_MODAL_TOGGLE";
export const UNIT_MODAL_TOGGLE = "UNIT_MODAL_TOGGLE";

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
      ////////////////////

      case GUIDE_MODAL_TOGGLE:
        draft.guideModal = !draft.guideModal;
        break;

      case TYPE_MODAL_TOGGLE:
        draft.typeModal = !draft.typeModal;
        break;

      case PACK_MODAL_TOGGLE:
        draft.packModal = !draft.packModal;
        break;

      case UNIT_MODAL_TOGGLE:
        draft.unitModal = !draft.unitModal;
        break;

      default:
        break;
    }
  });

export default reducer;
