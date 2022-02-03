import produce from "../util/produce";

export const initailState = {
  addressList: null,
  addressDetail: null,

  addressListModal: false,
  createModal: false,
  searchAddressModal: false,

  //
  st_addressListLoading: false, // 주소 리스트 가져오기
  st_addressListDone: false,
  st_addressListError: null,
  //
  st_addressCreateLoading: false, // 주소 생성
  st_addressCreateDone: false,
  st_addressCreateError: null,
  //
};

export const ADDRESS_LIST_REQUEST = "ADDRESS_LIST_REQUEST";
export const ADDRESS_LIST_SUCCESS = "ADDRESS_LIST_SUCCESS";
export const ADDRESS_LIST_FAILURE = "ADDRESS_LIST_FAILURE";

export const ADDRESS_CREATE_REQUEST = "ADDRESS_CREATE_REQUEST";
export const ADDRESS_CREATE_SUCCESS = "ADDRESS_CREATE_SUCCESS";
export const ADDRESS_CREATE_FAILURE = "ADDRESS_CREATE_FAILURE";

export const ADDRESS_LIST_MODAL_TOGGLE = "ADDRESS_LIST_MODAL_TOGGLE";
export const ADDRESS_CREATE_MODAL_TOGGLE = "ADDRESS_CREATE_MODAL_TOGGLE";
export const SEARCH_ADDRESS_MODAL_TOGGLE = "SEARCH_ADDRESS_MODAL_TOGGLE";

const reducer = (state = initailState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case ADDRESS_LIST_REQUEST: {
        draft.st_addressListLoading = true;
        draft.st_addressListDone = null;
        draft.st_addressListError = false;
        break;
      }

      case ADDRESS_LIST_SUCCESS: {
        draft.st_addressListLoading = false;
        draft.st_addressListDone = true;
        draft.addressList = action.data.list;
        draft.addressDetail = action.data.detail;
        break;
      }

      case ADDRESS_LIST_FAILURE: {
        draft.st_addressListLoading = false;
        draft.st_addressListDone = false;
        draft.st_addressListError = action.error;
        break;
      }

      //////////////////////////////////////////////
      case ADDRESS_CREATE_REQUEST: {
        draft.st_addressCreateLoading = true;
        draft.st_addressCreateDone = null;
        draft.st_addressCreateError = false;
        break;
      }

      case ADDRESS_CREATE_SUCCESS: {
        draft.st_addressCreateLoading = false;
        draft.st_addressCreateDone = true;
        draft.st_addressCreateError = null;
        break;
      }

      case ADDRESS_CREATE_FAILURE: {
        draft.st_addressCreateLoading = false;
        draft.st_addressCreateDone = false;
        draft.st_addressCreateError = action.error;
        break;
      }

      //////////////////////////////////////////////

      case ADDRESS_LIST_MODAL_TOGGLE: {
        draft.addressListModal = !draft.addressListModal;
        break;
      }

      case ADDRESS_CREATE_MODAL_TOGGLE: {
        draft.createModal = !draft.createModal;
        break;
      }

      case SEARCH_ADDRESS_MODAL_TOGGLE: {
        draft.searchAddressModal = !draft.searchAddressModal;
        break;
      }

      default:
        break;
    }
  });

export default reducer;
