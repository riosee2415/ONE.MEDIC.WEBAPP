import produce from "../util/produce";

export const initialState = {
  materials: null,

  materialsHistory: null,

  userMaterials: [],

  material: null,

  unitModal: false,
  cuModal: false,

  historyUnitModal: false,

  //
  st_materialListLoading: false,
  st_materialListDone: false,
  st_materialListError: null,
  //
  st_materialCreateLoading: false,
  st_materialCreateDone: false,
  st_materialCreateError: null,
  //
  st_materialUpdateLoading: false,
  st_materialUpdateDone: false,
  st_materialUpdateError: null,
  //
  st_materialDeleteLoading: false,
  st_materialDeleteDone: false,
  st_materialDeleteError: null,
  //
  st_materialHistoryListLoading: false,
  st_materialHistoryListDone: false,
  st_materialHistoryListError: null,
  //
  st_materialDetailLoading: false,
  st_materialDetailDone: false,
  st_materialDetailError: null,
};

export const MATERIAL_LIST_REQUEST = "MATERIAL_LIST_REQUEST";
export const MATERIAL_LIST_SUCCESS = "MATERIAL_LIST_SUCCESS";
export const MATERIAL_LIST_FAILURE = "MATERIAL_LIST_FAILURE";

export const MATERIAL_CREATE_REQUEST = "MATERIAL_CREATE_REQUEST";
export const MATERIAL_CREATE_SUCCESS = "MATERIAL_CREATE_SUCCESS";
export const MATERIAL_CREATE_FAILURE = "MATERIAL_CREATE_FAILURE";

export const MATERIAL_UPDATE_REQUEST = "MATERIAL_UPDATE_REQUEST";
export const MATERIAL_UPDATE_SUCCESS = "MATERIAL_UPDATE_SUCCESS";
export const MATERIAL_UPDATE_FAILURE = "MATERIAL_UPDATE_FAILURE";

export const MATERIAL_DELETE_REQUEST = "MATERIAL_DELETE_REQUEST";
export const MATERIAL_DELETE_SUCCESS = "MATERIAL_DELETE_SUCCESS";
export const MATERIAL_DELETE_FAILURE = "MATERIAL_DELETE_FAILURE";

export const MATERIAL_HISTORY_LIST_REQUEST = "MATERIAL_HISTORY_LIST_REQUEST";
export const MATERIAL_HISTORY_LIST_SUCCESS = "MATERIAL_HISTORY_LIST_SUCCESS";
export const MATERIAL_HISTORY_LIST_FAILURE = "MATERIAL_HISTORY_LIST_FAILURE";

export const MATERIAL_DETAIL_REQUEST = "MATERIAL_DETAIL_REQUEST";
export const MATERIAL_DETAIL_SUCCESS = "MATERIAL_DETAIL_SUCCESS";
export const MATERIAL_DETAIL_FAILURE = "MATERIAL_DETAIL_FAILURE";

export const MATERIAL_USER_ADD = "MATERIAL_USER_ADD";

export const CU_MODAL_TOGGLE = "CU_MODAL_TOGGLE";
export const UNIT_MODAL_TOGGLE = "UNIT_MODAL_TOGGLE";
export const HISTORY_UNIT_MODAL_TOGGLE = "HISTORY_UNIT_MODAL_TOGGLE";

const reducer = (state = initialState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case MATERIAL_LIST_REQUEST:
        draft.st_materialListLoading = true;
        draft.st_materialListDone = false;
        draft.st_materialListError = null;
        break;
      case MATERIAL_LIST_SUCCESS:
        draft.st_materialListLoading = false;
        draft.st_materialListDone = true;
        draft.materials = action.data;
        break;
      case MATERIAL_LIST_FAILURE:
        draft.st_materialListLoading = false;
        draft.st_materialListDone = false;
        draft.st_materialListError = action.error;
        break;

      ////////////////////
      case MATERIAL_CREATE_REQUEST:
        draft.st_materialCreateLoading = true;
        draft.st_materialCreateDone = false;
        draft.st_materialCreateError = null;
        break;
      case MATERIAL_CREATE_SUCCESS:
        draft.st_materialCreateLoading = false;
        draft.st_materialCreateDone = true;
        break;
      case MATERIAL_CREATE_FAILURE:
        draft.st_materialCreateLoading = false;
        draft.st_materialCreateDone = false;
        draft.st_materialCreateError = action.error;
        break;

      ////////////////////
      case MATERIAL_UPDATE_REQUEST:
        draft.st_materialUpdateLoading = true;
        draft.st_materialUpdateDone = false;
        draft.st_materialUpdateError = null;
        break;
      case MATERIAL_UPDATE_SUCCESS:
        draft.st_materialUpdateLoading = false;
        draft.st_materialUpdateDone = true;
        break;
      case MATERIAL_UPDATE_FAILURE:
        draft.st_materialUpdateLoading = false;
        draft.st_materialUpdateDone = false;
        draft.st_materialUpdateError = action.error;
        break;

      ////////////////////
      case MATERIAL_DELETE_REQUEST:
        draft.st_materialDeleteLoading = true;
        draft.st_materialDeleteDone = false;
        draft.st_materialDeleteError = null;
        break;
      case MATERIAL_DELETE_SUCCESS:
        draft.st_materialDeleteLoading = false;
        draft.st_materialDeleteDone = true;
        break;
      case MATERIAL_DELETE_FAILURE:
        draft.st_materialDeleteLoading = false;
        draft.st_materialDeleteDone = false;
        draft.st_materialDeleteError = action.error;
        break;

      ////////////////////
      case MATERIAL_HISTORY_LIST_REQUEST:
        draft.st_materialHistoryListLoading = true;
        draft.st_materialHistoryListDone = false;
        draft.st_materialHistoryListError = null;
        break;
      case MATERIAL_HISTORY_LIST_SUCCESS:
        draft.st_materialHistoryListLoading = false;
        draft.st_materialHistoryListDone = true;
        draft.materialsHistory = action.data;
        break;
      case MATERIAL_HISTORY_LIST_FAILURE:
        draft.st_materialHistoryListLoading = false;
        draft.st_materialHistoryListDone = false;
        draft.st_materialHistoryListError = action.error;
        break;

      ////////////////////
      case MATERIAL_DETAIL_REQUEST:
        draft.st_materialDetailLoading = true;
        draft.st_materialDetailDone = false;
        draft.st_materialDetailError = null;
        break;
      case MATERIAL_DETAIL_SUCCESS:
        draft.st_materialDetailLoading = false;
        draft.st_materialDetailDone = true;
        draft.material = action.data;
        break;
      case MATERIAL_DETAIL_FAILURE:
        draft.st_materialDetailLoading = false;
        draft.st_materialDetailDone = false;
        draft.st_materialDetailError = action.error;
        break;

      ////////////////////

      case CU_MODAL_TOGGLE:
        draft.cuModal = !draft.cuModal;
        break;

      case UNIT_MODAL_TOGGLE:
        draft.unitModal = !draft.unitModal;
        break;

      case HISTORY_UNIT_MODAL_TOGGLE:
        draft.historyUnitModal = !draft.historyUnitModal;
        break;

      case MATERIAL_USER_ADD:
        draft.userMaterials = action.data;
        break;

      default:
        break;
    }
  });

export default reducer;
