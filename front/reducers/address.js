import produce from "../util/produce";

export const initailState = {
  addressList: null,

  //
  st_addressListLoading: false, // 주소 리스트 가져오기
  st_addressListDone: false,
  st_addressListError: null,
  //
};

export const ADDRESS_LIST_REQUEST = "ADDRESS_LIST_REQUEST";
export const ADDRESS_LIST_SUCCESS = "ADDRESS_LIST_SUCCESS";
export const ADDRESS_LIST_FAILURE = "ADDRESS_LIST_FAILURE";

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
        draft.addressList = action.data;

        break;
      }

      case ADDRESS_LIST_FAILURE: {
        draft.st_addressListLoading = false;
        draft.st_addressListDone = false;
        draft.st_addressListError = action.error;
        break;
      }

      //////////////////////////////////////////////

      default:
        break;
    }
  });

export default reducer;
