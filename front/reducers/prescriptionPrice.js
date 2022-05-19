import produce from "../util/produce";

export const initialState = {
  price: null,

  st_ppGetLoading: false,
  st_ppGetDone: false,
  st_ppGetError: null,
  //
  st_ppCreateLoading: false,
  st_ppCreateDone: false,
  st_ppCreateError: null,
  //
  st_ppUpdateLoading: false,
  st_ppUpdateDone: false,
  st_ppUpdateError: null,
  //

  priceModal: false,
};

export const PP_GET_REQUEST = "PP_GET_REQUEST";
export const PP_GET_SUCCESS = "PP_GET_SUCCESS";
export const PP_GET_FAILURE = "PP_GET_FAILURE";

export const PP_CREATE_REQUEST = "PP_CREATE_REQUEST";
export const PP_CREATE_SUCCESS = "PP_CREATE_SUCCESS";
export const PP_CREATE_FAILURE = "PP_CREATE_FAILURE";

export const PP_UPDATE_REQUEST = "PP_UPDATE_REQUEST";
export const PP_UPDATE_SUCCESS = "PP_UPDATE_SUCCESS";
export const PP_UPDATE_FAILURE = "PP_UPDATE_FAILURE";

export const PP_MODAL_TOGGLE = "PP_MODAL_TOGGLE";

const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case PP_GET_REQUEST:
        draft.st_ppGetLoading = true;
        draft.st_ppGetDone = false;
        draft.st_ppGetError = null;
        break;
      case PP_GET_SUCCESS:
        draft.st_ppGetLoading = true;
        draft.st_ppGetDone = false;
        draft.price = action.data;
        break;
      case PP_GET_FAILURE:
        draft.st_ppGetLoading = true;
        draft.st_ppGetDone = false;
        draft.st_ppGetError = action.error;
        break;

      ////////////////////
      case PP_CREATE_REQUEST:
        draft.st_ppCreateLoading = true;
        draft.st_ppCreateDone = false;
        draft.st_ppCreateError = null;
        break;
      case PP_CREATE_SUCCESS:
        draft.st_ppCreateLoading = true;
        draft.st_ppCreateDone = false;
        break;
      case PP_CREATE_FAILURE:
        draft.st_ppCreateLoading = true;
        draft.st_ppCreateDone = false;
        draft.st_ppCreateError = action.error;
        break;

      ////////////////////
      case PP_UPDATE_REQUEST:
        draft.st_ppUpdateLoading = true;
        draft.st_ppUpdateDone = false;
        draft.st_ppUpdateError = null;
        break;
      case PP_UPDATE_SUCCESS:
        draft.st_ppUpdateLoading = true;
        draft.st_ppUpdateDone = false;
        break;
      case PP_UPDATE_FAILURE:
        draft.st_ppUpdateLoading = true;
        draft.st_ppUpdateDone = false;
        draft.st_ppUpdateError = action.error;
        break;

      ////////////////////

      case PP_MODAL_TOGGLE:
        draft.priceModal = !draft.priceModal;
        break;

      ////////////////////

      default:
        break;
    }
  });

export default reducer;
