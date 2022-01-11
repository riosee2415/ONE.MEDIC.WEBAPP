import produce from "../util/produce";

export const initialState = {
  discounts: null,

  cuModal: false,
  unitModal: false,
  //
  st_discountListLoading: false,
  st_discountListDone: false,
  st_discountListError: null,
};

export const DISCOUNT_LIST_REQUEST = "DISCOUNT_LIST_REQUEST";
export const DISCOUNT_LIST_SUCCESS = "DISCOUNT_LIST_SUCCESS";
export const DISCOUNT_LIST_FAILURE = "DISCOUNT_LIST_FAILURE";

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
