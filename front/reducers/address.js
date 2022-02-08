import produce from "../util/produce";

export const initailState = {
  addressList: null,
  addressDetail: null,

  addressListModal: false,
  addressModal: false,
  addressDeleteModal: false,
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
  st_addressUpdateLoading: false, // 주소 수정
  st_addressUpdateDone: false,
  st_addressUpdateError: null,
  //
  st_addressDeleteLoading: false, // 주소 삭제
  st_addressDeleteDone: false,
  st_addressDeleteError: null,
  //
  st_addressIsNormalLoading: false, // 기본 주소 설정
  st_addressIsNormalDone: false,
  st_addressIsNormalError: false,
};

export const ADDRESS_LIST_REQUEST = "ADDRESS_LIST_REQUEST";
export const ADDRESS_LIST_SUCCESS = "ADDRESS_LIST_SUCCESS";
export const ADDRESS_LIST_FAILURE = "ADDRESS_LIST_FAILURE";

export const ADDRESS_CREATE_REQUEST = "ADDRESS_CREATE_REQUEST";
export const ADDRESS_CREATE_SUCCESS = "ADDRESS_CREATE_SUCCESS";
export const ADDRESS_CREATE_FAILURE = "ADDRESS_CREATE_FAILURE";

export const ADDRESS_UPDATE_REQUEST = "ADDRESS_UPDATE_REQUEST";
export const ADDRESS_UPDATE_SUCCESS = "ADDRESS_UPDATE_SUCCESS";
export const ADDRESS_UPDATE_FAILURE = "ADDRESS_UPDATE_FAILURE";

export const ADDRESS_DELETE_REQUEST = "ADDRESS_DELETE_REQUEST";
export const ADDRESS_DELETE_SUCCESS = "ADDRESS_DELETE_SUCCESS";
export const ADDRESS_DELETE_FAILURE = "ADDRESS_DELETE_FAILURE";

export const ADDRESS_ISNORMAL_REQUEST = "ADDRESS_ISNORMAL_REQUEST";
export const ADDRESS_ISNORMAL_SUCCESS = "ADDRESS_ISNORMAL_SUCCESS";
export const ADDRESS_ISNORMAL_FAILURE = "ADDRESS_ISNORMAL_FAILURE";

export const ADDRESS_LIST_MODAL_TOGGLE = "ADDRESS_LIST_MODAL_TOGGLE";
export const ADDRESS_MODAL_TOGGLE = "ADDRESS_MODAL_TOGGLE";
export const ADDRESS_DELETE_MODAL_TOGGLE = "ADDRESS_DELETE_MODAL_TOGGLE";
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
      case ADDRESS_UPDATE_REQUEST: {
        draft.st_addressUpdateLoading = true;
        draft.st_addressUpdateDone = null;
        draft.st_addressUpdateError = false;
        break;
      }

      case ADDRESS_UPDATE_SUCCESS: {
        draft.st_addressUpdateLoading = false;
        draft.st_addressUpdateDone = true;
        draft.st_addressUpdateError = null;
        break;
      }

      case ADDRESS_UPDATE_FAILURE: {
        draft.st_addressUpdateLoading = false;
        draft.st_addressUpdateDone = false;
        draft.st_addressUpdateError = action.error;
        break;
      }

      //////////////////////////////////////////////
      case ADDRESS_ISNORMAL_REQUEST: {
        draft.st_addressIsNormalLoading = true;
        draft.st_addressIsNormalDone = null;
        draft.st_addressIsNormalError = false;
        break;
      }

      case ADDRESS_ISNORMAL_SUCCESS: {
        draft.st_addressIsNormalLoading = false;
        draft.st_addressIsNormalDone = true;
        draft.st_addressIsNormalError = null;
        break;
      }

      case ADDRESS_ISNORMAL_FAILURE: {
        draft.st_addressIsNormalLoading = false;
        draft.st_addressIsNormalDone = false;
        draft.st_addressIsNormalError = action.error;
        break;
      }

      //////////////////////////////////////////////
      case ADDRESS_DELETE_REQUEST: {
        draft.st_addressDeleteLoading = true;
        draft.st_addressDeleteDone = null;
        draft.st_addressDeleteError = false;
        break;
      }

      case ADDRESS_DELETE_SUCCESS: {
        draft.st_addressDeleteLoading = false;
        draft.st_addressDeleteDone = true;
        draft.st_addressDeleteError = null;
        break;
      }

      case ADDRESS_DELETE_FAILURE: {
        draft.st_addressDeleteLoading = false;
        draft.st_addressDeleteDone = false;
        draft.st_addressDeleteError = action.error;
        break;
      }

      //////////////////////////////////////////////

      case ADDRESS_LIST_MODAL_TOGGLE: {
        draft.addressListModal = !draft.addressListModal;
        break;
      }

      case ADDRESS_MODAL_TOGGLE: {
        draft.addressModal = !draft.addressModal;
        break;
      }

      case SEARCH_ADDRESS_MODAL_TOGGLE: {
        draft.searchAddressModal = !draft.searchAddressModal;
        break;
      }

      case ADDRESS_DELETE_MODAL_TOGGLE: {
        draft.addressDeleteModal = !draft.addressDeleteModal;
        break;
      }

      default:
        break;
    }
  });

export default reducer;
