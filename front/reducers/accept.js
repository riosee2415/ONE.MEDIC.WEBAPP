import produce from "../util/produce";

export const initialState = {
  acceptList: [],
  //
  st_acceptLogLoading: false, // 접속기록 가져오기
  st_acceptLogDone: false,
  st_acceptLogError: null,
  //
  st_acceptLogCreateLoading: false, // 접속기록 만들기
  st_acceptLogCreateDone: false,
  st_acceptLogCreateError: null,
};

export const ACCEPT_LOG_REQUEST = "ACCEPT_LOG_REQUEST";
export const ACCEPT_LOG_SUCCESS = "ACCEPT_LOG_SUCCESS";
export const ACCEPT_LOG_FAILURE = "ACCEPT_LOG_FAILURE";

export const ACCEPT_LOG_CREATE_REQUEST = "ACCEPT_LOG_CREATE_REQUEST";
export const ACCEPT_LOG_CREATE_SUCCESS = "ACCEPT_LOG_CREATE_SUCCESS";
export const ACCEPT_LOG_CREATE_FAILURE = "ACCEPT_LOG_CREATE_FAILURE";

const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case ACCEPT_LOG_REQUEST: {
        draft.st_acceptLogLoading = true;
        draft.st_acceptLogDone = null;
        draft.st_acceptLogError = false;
        break;
      }
      case ACCEPT_LOG_SUCCESS: {
        draft.st_acceptLogLoading = false;
        draft.st_acceptLogDone = true;
        draft.acceptList = action.data;
        break;
      }
      case ACCEPT_LOG_FAILURE: {
        draft.st_acceptLogLoading = false;
        draft.st_acceptLogDone = false;
        draft.st_acceptLogError = action.error;
        break;
      }
      //////////////////////////////////////////////
      case ACCEPT_LOG_CREATE_REQUEST: {
        draft.st_acceptLogCreateLoading = true;
        draft.st_acceptLogCreateDone = null;
        draft.st_acceptLogCreateError = false;
        break;
      }
      case ACCEPT_LOG_CREATE_SUCCESS: {
        draft.st_acceptLogCreateLoading = false;
        draft.st_acceptLogCreateDone = true;
        break;
      }
      case ACCEPT_LOG_CREATE_FAILURE: {
        draft.st_acceptLogCreateLoading = false;
        draft.st_acceptLogCreateDone = false;
        draft.st_acceptLogCreateError = action.error;
        break;
      }
      //////////////////////////////////////////////

      default:
        break;
    }
  });

export default reducer;
