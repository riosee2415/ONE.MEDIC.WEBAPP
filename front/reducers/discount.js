import produce from "../util/produce";

export const initialState = {
  discounts: null,

  cuModal: false,
  unitModal: false,
  //
  st_discountListLoading: false,
  st_discountListDone: false,
  st_discountListError: null,
  //
  st_discountCreateLoading: false,
  st_discountCreateDone: false,
  st_discountCreateError: null,
  //
  st_discountUpdateLoading: false,
  st_discountUpdateDone: false,
  st_discountUpdateError: null,
};

export const DISCOUNT_LIST_REQUEST = "DISCOUNT_LIST_REQUEST";
export const DISCOUNT_LIST_SUCCESS = "DISCOUNT_LIST_SUCCESS";
export const DISCOUNT_LIST_FAILURE = "DISCOUNT_LIST_FAILURE";

export const DISCOUNT_CREATE_REQUEST = "DISCOUNT_CREATE_REQUEST";
export const DISCOUNT_CREATE_SUCCESS = "DISCOUNT_CREATE_SUCCESS";
export const DISCOUNT_CREATE_FAILURE = "DISCOUNT_CREATE_FAILURE";

export const DISCOUNT_UPDATE_REQUEST = "DISCOUNT_UPDATE_REQUEST";
export const DISCOUNT_UPDATE_SUCCESS = "DISCOUNT_UPDATE_SUCCESS";
export const DISCOUNT_UPDATE_FAILURE = "DISCOUNT_UPDATE_FAILURE";

export const UNIT_MODAL_TOGGLE = "UNIT_MODAL_TOGGLE";
export const CU_MODAL_TOGGLE = "CU_MODAL_TOGGLE";

const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      ///////////////////////////////////////////////////////
      case DISCOUNT_LIST_REQUEST: {
        draft.st_discountListLoading = true;
        draft.st_discountListDone = null;
        draft.st_discountListError = false;
        break;
      }
      case DISCOUNT_LIST_SUCCESS: {
        draft.st_discountListLoading = false;
        draft.st_discountListDone = true;
        draft.discounts = action.data;
        break;
      }
      case DISCOUNT_LIST_FAILURE: {
        draft.st_discountListLoading = false;
        draft.st_discountListDone = false;
        draft.st_discountListError = action.error;
        break;
      }
      ///////////////////////////////////////////////////////
      case DISCOUNT_CREATE_REQUEST: {
        draft.st_discountCreateLoading = true;
        draft.st_discountCreateDone = null;
        draft.st_discountCreateError = false;
        break;
      }
      case DISCOUNT_CREATE_SUCCESS: {
        draft.st_discountCreateLoading = false;
        draft.st_discountCreateDone = true;
        break;
      }
      case DISCOUNT_CREATE_FAILURE: {
        draft.st_discountCreateLoading = false;
        draft.st_discountCreateDone = false;
        draft.st_discountCreateError = action.error;
        break;
      }
      ///////////////////////////////////////////////////////
      case DISCOUNT_UPDATE_REQUEST: {
        draft.st_discountUpdateLoading = true;
        draft.st_discountUpdateDone = null;
        draft.st_discountUpdateError = false;
        break;
      }
      case DISCOUNT_UPDATE_SUCCESS: {
        draft.st_discountUpdateLoading = false;
        draft.st_discountUpdateDone = true;
        break;
      }
      case DISCOUNT_UPDATE_FAILURE: {
        draft.st_discountUpdateLoading = false;
        draft.st_discountUpdateDone = false;
        draft.st_discountUpdateError = action.error;
        break;
      }
      ///////////////////////////////////////////////////////
      case UNIT_MODAL_TOGGLE: {
        draft.unitModal = !draft.unitModal;
        break;
      }

      case CU_MODAL_TOGGLE: {
        draft.cuModal = !draft.cuModal;
        break;
      }
      ///////////////////////////////////////////////////////

      default:
        break;
    }
  });

export default reducer;
