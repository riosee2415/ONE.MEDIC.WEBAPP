import produce from "../util/produce";

export const initialState = {
  materials: null,

  unitModal: false,
  cuModal: false,
  deleteModal: false,
  //
  st_materialListLoading: false,
  st_materialListDone: false,
  st_materialListError: false,
  //
  st_materialCreateLoading: false,
  st_materialCreateDone: false,
  st_materialCreateError: false,
  //
  st_materialUpdateLoading: false,
  st_materialUpdateDone: false,
  st_materialUpdateError: false,
  //
  st_materialDeleteLoading: false,
  st_materialDeleteDone: false,
  st_materialDeleteError: false,
  //
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

export const CU_MODAL_TOGGLE = "CU_MODAL_TOGGLE";
export const UNIT_MODAL_TOGGLE = "UNIT_MODAL_TOGGLE";
export const DELETE_MODAL_TOGGLE = "DELETE_MODAL_TOGGLE";

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
      case MATERIAL_UPDATE_FAILURE:
        draft.st_materialUpdateLoading = true;
        draft.st_materialUpdateDone = false;
        draft.st_materialUpdateError = null;
        break;
      case MATERIAL_UPDATE_FAILURE:
        draft.st_materialUpdateLoading = true;
        draft.st_materialUpdateDone = false;
        break;
      case MATERIAL_UPDATE_FAILURE:
        draft.st_materialUpdateLoading = true;
        draft.st_materialUpdateDone = false;
        draft.st_materialUpdateError = null;
        break;

      ////////////////////
      case MATERIAL_DELETE_FAILURE:
        draft.st_materialDeleteLoading = true;
        draft.st_materialDeleteDone = false;
        draft.st_materialDeleteError = null;
        break;
      case MATERIAL_DELETE_FAILURE:
        draft.st_materialDeleteLoading = true;
        draft.st_materialDeleteDone = false;
        break;
      case MATERIAL_DELETE_FAILURE:
        draft.st_materialDeleteLoading = true;
        draft.st_materialDeleteDone = false;
        draft.st_materialDeleteError = null;
        break;

      ////////////////////

      case CU_MODAL_TOGGLE:
        draft.cuModal = !draft.cuModal;
        break;

      case DELETE_MODAL_TOGGLE:
        draft.deleteModal = !draft.deleteModal;
        break;

      case UNIT_MODAL_TOGGLE:
        draft.unitModal = !draft.unitModal;
        break;

      default:
        break;
    }
  });

export default reducer;
