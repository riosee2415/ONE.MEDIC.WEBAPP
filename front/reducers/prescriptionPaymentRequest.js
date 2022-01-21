import produce from "../util/produce";

export const initialState = {
  pprs: null,

  unitModal: false,

  userDetailModal: false,
  detialMdoal: false,

  st_pprListLoading: false,
  st_pprListDone: false,
  st_pprListError: null,
  //
};

export const PPR_LIST_REQUEST = "PPR_LIST_REQUEST";
export const PPR_LIST_SUCCESS = "PPR_LIST_SUCCESS";
export const PPR_LIST_FAILURE = "PPR_LIST_FAILURE";

export const UNIT_MODAL_TOGGLE = "UNIT_MODAL_TOGGLE";
export const DETAIL_MODAL_TOGLE = "DETAIL_MODAL_TOGLE";
export const USER_DETAIL_MODAL_TOGGLE = "USER_DETAIL_MODAL_TOGGLE";

const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case PPR_LIST_REQUEST:
        draft.st_pprListLoading = true;
        draft.st_pprListDone = false;
        draft.st_pprListError = false;
        break;
      case PPR_LIST_SUCCESS:
        draft.st_pprListLoading = true;
        draft.st_pprListDone = false;
        draft.st_pprListError = false;
        draft.pprs = action.data;
        break;
      case PPR_LIST_FAILURE:
        draft.st_pprListLoading = true;
        draft.st_pprListDone = false;
        draft.st_pprListError = false;
        break;

      ////////////////////

      case UNIT_MODAL_TOGGLE:
        draft.unitModal = !draft.unitModal;
        break;

      case DETAIL_MODAL_TOGLE:
        draft.detailModal = !draft.detailModal;
        break;

      case USER_DETAIL_MODAL_TOGGLE:
        draft.userDetailModal = !draft.userDetailModal;
        break;

      ////////////////////

      default:
        break;
    }
  });

export default reducer;
