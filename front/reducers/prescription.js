import produce from "../util/produce";

export const initailState = {
  products: [],
  typeList: [],
  packList: [],
  unitList: [],
  //
  st_productLoading: false,
  st_productDone: false,
  st_productError: null,
  //
  st_productTypeLoading: false,
  st_productTypeDone: false,
  st_productTypeError: null,
  //
  st_productTypeAddLoading: false,
  st_productTypeAddDone: false,
  st_productTypeAddError: null,
  //
  st_productTypeDeleteLoading: false,
  st_productTypeDeleteDone: false,
  st_productTypeDeleteError: null,
  //
  st_productPackListLoading: false,
  st_productPackListDone: false,
  st_productPackListError: null,
  //
  st_productPackAddLoading: false,
  st_productPackAddDone: false,
  st_productPackAddError: null,
  //
  st_productPackDeleteLoading: false,
  st_productPackDeleteDone: false,
  st_productPackDeleteError: null,
  //
  st_productUnitListLoading: false,
  st_productUnitListDone: false,
  st_productUnitListError: null,
  //
  st_productUnitAddLoading: false,
  st_productUnitAddDone: false,
  st_productUnitAddError: null,
  //
  st_productUnitDeleteLoading: false,
  st_productUnitDeleteDone: false,
  st_productUnitDeleteError: null,

  guideModal: false,
  typeModal: false,
  packModal: false,
  unitModal: false,
};

export const PRODUCT_LIST_REQUEST = "PRODUCT_LIST_REQUEST";
export const PRODUCT_LIST_SUCCESS = "PRODUCT_LIST_SUCCESS";
export const PRODUCT_LIST_FAILURE = "PRODUCT_LIST_FAILURE";

export const PRODUCT_TYPE_LIST_REQUEST = "PRODUCT_TYPE_LIST_REQUEST";
export const PRODUCT_TYPE_LIST_SUCCESS = "PRODUCT_TYPE_LIST_SUCCESS";
export const PRODUCT_TYPE_LIST_FAILURE = "PRODUCT_TYPE_LIST_FAILURE";

export const PRODUCT_TYPE_ADD_REQUEST = "PRODUCT_TYPE_ADD_REQUEST";
export const PRODUCT_TYPE_ADD_SUCCESS = "PRODUCT_TYPE_ADD_SUCCESS";
export const PRODUCT_TYPE_ADD_FAILURE = "PRODUCT_TYPE_ADD_FAILURE";

export const PRODUCT_TYPE_DELETE_REQUEST = "PRODUCT_TYPE_DELETE_REQUEST";
export const PRODUCT_TYPE_DELETE_SUCCESS = "PRODUCT_TYPE_DELETE_SUCCESS";
export const PRODUCT_TYPE_DELETE_FAILURE = "PRODUCT_TYPE_DELETE_FAILURE";

export const PRODUCT_PACK_LIST_REQUEST = "PRODUCT_PACK_LIST_REQUEST";
export const PRODUCT_PACK_LIST_SUCCESS = "PRODUCT_PACK_LIST_SUCCESS";
export const PRODUCT_PACK_LIST_FAILURE = "PRODUCT_PACK_LIST_FAILURE";

export const PRODUCT_PACK_ADD_REQUEST = "PRODUCT_PACK_ADD_REQUEST";
export const PRODUCT_PACK_ADD_SUCCESS = "PRODUCT_PACK_ADD_SUCCESS";
export const PRODUCT_PACK_ADD_FAILURE = "PRODUCT_PACK_ADD_FAILURE";

export const PRODUCT_PACK_DELETE_REQUEST = "PRODUCT_PACK_DELETE_REQUEST";
export const PRODUCT_PACK_DELETE_SUCCESS = "PRODUCT_PACK_DELETE_SUCCESS";
export const PRODUCT_PACK_DELETE_FAILURE = "PRODUCT_PACK_DELETE_FAILURE";

export const PRODUCT_UNIT_LIST_REQUEST = "PRODUCT_UNIT_LIST_REQUEST";
export const PRODUCT_UNIT_LIST_SUCCESS = "PRODUCT_UNIT_LIST_SUCCESS";
export const PRODUCT_UNIT_LIST_FAILURE = "PRODUCT_UNIT_LIST_FAILURE";

export const PRODUCT_UNIT_ADD_REQUEST = "PRODUCT_UNIT_ADD_REQUEST";
export const PRODUCT_UNIT_ADD_SUCCESS = "PRODUCT_UNIT_ADD_SUCCESS";
export const PRODUCT_UNIT_ADD_FAILURE = "PRODUCT_UNIT_ADD_FAILURE";

export const PRODUCT_UNIT_DELETE_REQUEST = "PRODUCT_UNIT_DELETE_REQUEST";
export const PRODUCT_UNIT_DELETE_SUCCESS = "PRODUCT_UNIT_DELETE_SUCCESS";
export const PRODUCT_UNIT_DELETE_FAILURE = "PRODUCT_UNIT_DELETE_FAILURE";

export const GUIDE_MODAL_TOGGLE = "GUIDE_MODAL_TOGGLE";
export const TYPE_MODAL_TOGGLE = "TYPE_MODAL_TOGGLE";
export const PACK_MODAL_TOGGLE = "PACK_MODAL_TOGGLE";
export const UNIT_MODAL_TOGGLE = "UNIT_MODAL_TOGGLE";

const reducer = (state = initailState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      case PRODUCT_LIST_REQUEST:
        draft.st_productLoading = true;
        draft.st_productDone = false;
        draft.st_productError = null;
        break;

      case PRODUCT_LIST_SUCCESS:
        draft.st_productLoading = false;
        draft.st_productDone = true;
        draft.st_productError = null;
        draft.products = action.data;
        break;

      case PRODUCT_LIST_FAILURE:
        draft.st_productLoading = false;
        draft.st_productDone = false;
        draft.st_productError = action.data;
        break;
      ////////////////////

      case PRODUCT_TYPE_LIST_REQUEST:
        draft.st_productTypeLoading = true;
        draft.st_productTypeDone = false;
        draft.st_productTypeError = null;
        break;

      case PRODUCT_TYPE_LIST_SUCCESS:
        draft.st_productTypeLoading = false;
        draft.st_productTypeDone = true;
        draft.st_productTypeError = null;
        draft.typeList = action.data;
        break;

      case PRODUCT_TYPE_LIST_FAILURE:
        draft.st_productTypeLoading = false;
        draft.st_productTypeDone = false;
        draft.st_productTypeError = action.data;
        break;
      ////////////////////

      case PRODUCT_TYPE_ADD_REQUEST:
        draft.st_productTypeAddLoading = true;
        draft.st_productTypeAddDone = false;
        draft.st_productTypeAddError = null;
        break;

      case PRODUCT_TYPE_ADD_SUCCESS:
        draft.st_productTypeAddLoading = false;
        draft.st_productTypeAddDone = true;
        draft.st_productTypeAddError = null;
        break;

      case PRODUCT_TYPE_ADD_FAILURE:
        draft.st_productTypeAddLoading = false;
        draft.st_productTypeAddDone = false;
        draft.st_productTypeAddError = action.data;
        break;
      ////////////////////

      case PRODUCT_TYPE_DELETE_REQUEST:
        draft.st_productTypeDeleteLoading = true;
        draft.st_productTypeDeleteDone = false;
        draft.st_productTypeDeleteError = null;
        break;

      case PRODUCT_TYPE_DELETE_SUCCESS:
        draft.st_productTypeDeleteLoading = false;
        draft.st_productTypeDeleteDone = true;
        draft.st_productTypeDeleteError = null;
        break;

      case PRODUCT_TYPE_DELETE_FAILURE:
        draft.st_productTypeDeleteLoading = false;
        draft.st_productTypeDeleteDone = false;
        draft.st_productTypeDeleteError = action.data;
        break;
      ////////////////////

      case PRODUCT_PACK_LIST_REQUEST:
        draft.st_productPackListLoading = true;
        draft.st_productPackListDone = false;
        draft.st_productPackListError = null;
        break;

      case PRODUCT_PACK_LIST_SUCCESS:
        draft.st_productPackListLoading = false;
        draft.st_productPackListDone = true;
        draft.st_productPackListError = null;
        draft.packList = action.data;
        break;

      case PRODUCT_PACK_LIST_FAILURE:
        draft.st_productPackListLoading = false;
        draft.st_productPackListDone = false;
        draft.st_productPackListError = action.data;
        break;
      ////////////////////

      case PRODUCT_PACK_ADD_REQUEST:
        draft.st_productPackAddLoading = true;
        draft.st_productPackAddDone = false;
        draft.st_productPackAddError = null;
        break;

      case PRODUCT_PACK_ADD_SUCCESS:
        draft.st_productPackAddLoading = false;
        draft.st_productPackAddDone = true;
        draft.st_productPackAddError = null;
        break;

      case PRODUCT_PACK_ADD_FAILURE:
        draft.st_productPackAddLoading = false;
        draft.st_productPackAddDone = false;
        draft.st_productPackAddError = action.data;
        break;
      ////////////////////

      case PRODUCT_PACK_DELETE_REQUEST:
        draft.st_productPackDeleteLoading = true;
        draft.st_productPackDeleteDone = false;
        draft.st_productPackDeleteError = null;
        break;

      case PRODUCT_PACK_DELETE_SUCCESS:
        draft.st_productPackDeleteLoading = false;
        draft.st_productPackDeleteDone = true;
        draft.st_productPackDeleteError = null;
        break;

      case PRODUCT_PACK_DELETE_FAILURE:
        draft.st_productPackDeleteLoading = false;
        draft.st_productPackDeleteDone = false;
        draft.st_productPackDeleteError = action.data;
        break;
      ////////////////////

      case PRODUCT_UNIT_LIST_REQUEST:
        draft.st_productUnitListLoading = true;
        draft.st_productUnitListDone = false;
        draft.st_productUnitListError = null;
        break;

      case PRODUCT_UNIT_LIST_SUCCESS:
        draft.st_productUnitListLoading = false;
        draft.st_productUnitListDone = true;
        draft.st_productUnitListError = null;
        draft.unitList = action.data;
        break;

      case PRODUCT_UNIT_LIST_FAILURE:
        draft.st_productUnitListLoading = false;
        draft.st_productUnitListDone = false;
        draft.st_productUnitListError = action.data;
        break;
      ////////////////////

      case PRODUCT_UNIT_ADD_REQUEST:
        draft.st_productUnitAddLoading = true;
        draft.st_productUnitAddDone = false;
        draft.st_productUnitAddError = null;
        break;

      case PRODUCT_UNIT_ADD_SUCCESS:
        draft.st_productUnitAddLoading = false;
        draft.st_productUnitAddDone = true;
        draft.st_productUnitAddError = null;
        break;

      case PRODUCT_UNIT_ADD_FAILURE:
        draft.st_productUnitAddLoading = false;
        draft.st_productUnitAddDone = false;
        draft.st_productUnitAddError = action.data;
        break;
      ////////////////////

      case PRODUCT_UNIT_DELETE_REQUEST:
        draft.st_productUnitDeleteLoading = true;
        draft.st_productUnitDeleteDone = false;
        draft.st_productUnitDeleteError = null;
        break;

      case PRODUCT_UNIT_DELETE_SUCCESS:
        draft.st_productUnitDeleteLoading = false;
        draft.st_productUnitDeleteDone = true;
        draft.st_productUnitDeleteError = null;
        break;

      case PRODUCT_UNIT_DELETE_FAILURE:
        draft.st_productUnitDeleteLoading = false;
        draft.st_productUnitDeleteDone = false;
        draft.st_productUnitDeleteError = action.data;
        break;
      ////////////////////

      case GUIDE_MODAL_TOGGLE:
        draft.guideModal = !draft.guideModal;
        break;

      case TYPE_MODAL_TOGGLE:
        draft.typeModal = !draft.typeModal;
        break;

      case PACK_MODAL_TOGGLE:
        draft.packModal = !draft.packModal;
        break;

      case UNIT_MODAL_TOGGLE:
        draft.unitModal = !draft.unitModal;
        break;

      default:
        break;
    }
  });

export default reducer;
