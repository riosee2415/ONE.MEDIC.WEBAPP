import produce from "../util/produce";

export const initialState = {
  deliveryPrice: null,

  //
  st_deliveryPriceGetLoading: false,
  st_deliveryPriceGetDone: false,
  st_deliveryPriceGetError: null,
  //
  st_deliveryPriceUpdateLoading: false,
  st_deliveryPriceUpdateDone: false,
  st_deliveryPriceUpdateError: null,
};

export const DELIVERYPRICE_GET_REQUEST = "DELIVERYPRICE_GET_REQUEST";
export const DELIVERYPRICE_GET_SUCCESS = "DELIVERYPRICE_GET_SUCCESS";
export const DELIVERYPRICE_GET_FAILURE = "DELIVERYPRICE_GET_FAILURE";

export const DELIVERYPRICE_UPDATE_REQUEST = "DELIVERYPRICE_UPDATE_REQUEST";
export const DELIVERYPRICE_UPDATE_SUCCESS = "DELIVERYPRICE_UPDATE_SUCCESS";
export const DELIVERYPRICE_UPDATE_FAILURE = "DELIVERYPRICE_UPDATE_FAILURE";

const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      ///////////////////////////////////////////////////////
      case DELIVERYPRICE_GET_REQUEST: {
        draft.st_deliveryPriceGetLoading = true;
        draft.st_deliveryPriceGetDone = false;
        draft.st_deliveryPriceGetError = null;
        break;
      }
      case DELIVERYPRICE_GET_SUCCESS: {
        draft.st_deliveryPriceGetLoading = false;
        draft.st_deliveryPriceGetDone = true;
        draft.st_deliveryPriceGetError = null;
        draft.deliveryPrice = action.data;
        break;
      }
      case DELIVERYPRICE_GET_FAILURE: {
        draft.st_deliveryPriceGetLoading = false;
        draft.st_deliveryPriceGetDone = false;
        draft.st_deliveryPriceGetError = action.error;
        break;
      }
      ///////////////////////////////////////////////////////
      case DELIVERYPRICE_UPDATE_REQUEST: {
        draft.st_deliveryPriceUpdateLoading = true;
        draft.st_deliveryPriceUpdateDone = false;
        draft.st_deliveryPriceUpdateError = null;
        break;
      }
      case DELIVERYPRICE_UPDATE_SUCCESS: {
        draft.st_deliveryPriceUpdateLoading = false;
        draft.st_deliveryPriceUpdateDone = true;
        draft.st_deliveryPriceUpdateError = null;
        break;
      }
      case DELIVERYPRICE_UPDATE_FAILURE: {
        draft.st_deliveryPriceUpdateLoading = false;
        draft.st_deliveryPriceUpdateDone = false;
        draft.st_deliveryPriceUpdateError = action.error;
        break;
      }
      ///////////////////////////////////////////////////////

      default:
        break;
    }
  });

export default reducer;
