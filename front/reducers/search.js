import produce from "../util/produce";

export const initailState = {
  // VALUE
  searchRecipe: null,
  searchMaterial: null,

  // MODAL
  recipeModal: false,
  materialModal: false,

  // RECIPE LIST
  st_searchRecipeListLoading: false,
  st_searchRecipeListDone: false,
  st_searchRecipeListError: false,

  // RECIPE CREATE
  st_searchRecipeCreateLoading: false,
  st_searchRecipeCreateDone: false,
  st_searchRecipeCreateError: false,

  // RECIPE UPDATE
  st_searchRecipeUpdateLoading: false,
  st_searchRecipeUpdateDone: false,
  st_searchRecipeUpdateError: false,

  // RECIPE DELETE
  st_searchRecipeDeleteLoading: false,
  st_searchRecipeDeleteDone: false,
  st_searchRecipeDeleteError: false,

  // MATERIAL LIST
  st_searchMaterialListLoading: false,
  st_searchMaterialListDone: false,
  st_searchMaterialListError: false,

  // MATERIAL CREATE
  st_searchMaterialCreateLoading: false,
  st_searchMaterialCreateDone: false,
  st_searchMaterialCreateError: false,

  // MATERIAL DELETE
  st_searchMaterialDeleteLoading: false,
  st_searchMaterialDeleteDone: false,
  st_searchMaterialDeleteError: false,
};

export const SEARCH_RECIPE_LIST_REQUEST = "SEARCH_RECIPE_LIST_REQUEST";
export const SEARCH_RECIPE_LIST_SUCCESS = "SEARCH_RECIPE_LIST_SUCCESS";
export const SEARCH_RECIPE_LIST_FAILURE = "SEARCH_RECIPE_LIST_FAILURE";

export const SEARCH_RECIPE_CREATE_REQUEST = "SEARCH_RECIPE_CREATE_REQUEST";
export const SEARCH_RECIPE_CREATE_SUCCESS = "SEARCH_RECIPE_CREATE_SUCCESS";
export const SEARCH_RECIPE_CREATE_FAILURE = "SEARCH_RECIPE_CREATE_FAILURE";

export const SEARCH_RECIPE_UPDATE_REQUEST = "SEARCH_RECIPE_UPDATE_REQUEST";
export const SEARCH_RECIPE_UPDATE_SUCCESS = "SEARCH_RECIPE_UPDATE_SUCCESS";
export const SEARCH_RECIPE_UPDATE_FAILURE = "SEARCH_RECIPE_UPDATE_FAILURE";

export const SEARCH_RECIPE_DELETE_REQUEST = "SEARCH_RECIPE_DELETE_REQUEST";
export const SEARCH_RECIPE_DELETE_SUCCESS = "SEARCH_RECIPE_DELETE_SUCCESS";
export const SEARCH_RECIPE_DELETE_FAILURE = "SEARCH_RECIPE_DELETE_FAILURE";

export const SEARCH_MATERIAL_LIST_REQUEST = "SEARCH_MATERIAL_LIST_REQUEST";
export const SEARCH_MATERIAL_LIST_SUCCESS = "SEARCH_MATERIAL_LIST_SUCCESS";
export const SEARCH_MATERIAL_LIST_FAILURE = "SEARCH_MATERIAL_LIST_FAILURE";

export const SEARCH_MATERIAL_CREATE_REQUEST = "SEARCH_MATERIAL_CREATE_REQUEST";
export const SEARCH_MATERIAL_CREATE_SUCCESS = "SEARCH_MATERIAL_CREATE_SUCCESS";
export const SEARCH_MATERIAL_CREATE_FAILURE = "SEARCH_MATERIAL_CREATE_FAILURE";

export const SEARCH_MATERIAL_DELETE_REQUEST = "SEARCH_MATERIAL_DELETE_REQUEST";
export const SEARCH_MATERIAL_DELETE_SUCCESS = "SEARCH_MATERIAL_DELETE_SUCCESS";
export const SEARCH_MATERIAL_DELETE_FAILURE = "SEARCH_MATERIAL_DELETE_FAILURE";

export const SEARCH_RECIPE_MODAL_TOGGLE = "SEARCH_RECIPE_MODAL_TOGGLE";

export const SEARCH_MATERIAL_MODAL_TOGGLE = "SEARCH_MATERIAL_MODAL_TOGGLE";

const reducer = (state = initailState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
      /////////////////////////////////////////////////////// RECIPE LIST
      case SEARCH_RECIPE_LIST_REQUEST: {
        draft.st_searchRecipeListLoading = true;
        draft.st_searchRecipeListDone = null;
        draft.st_searchRecipeListError = false;
        break;
      }
      case SEARCH_RECIPE_LIST_SUCCESS: {
        draft.st_searchRecipeListLoading = false;
        draft.st_searchRecipeListDone = true;
        draft.searchRecipe = action.data;
        break;
      }
      case SEARCH_RECIPE_LIST_FAILURE: {
        draft.st_searchRecipeListLoading = false;
        draft.st_searchRecipeListDone = false;
        draft.st_searchRecipeListError = action.error;
        break;
      }
      /////////////////////////////////////////////////////// RECIPE CREATE

      case SEARCH_RECIPE_CREATE_REQUEST: {
        draft.st_searchRecipeCreateLoading = true;
        draft.st_searchRecipeCreateDone = null;
        draft.st_searchRecipeCreateError = false;
        break;
      }
      case SEARCH_RECIPE_CREATE_SUCCESS: {
        draft.st_searchRecipeCreateLoading = false;
        draft.st_searchRecipeCreateDone = true;
        break;
      }
      case SEARCH_RECIPE_CREATE_FAILURE: {
        draft.st_searchRecipeCreateLoading = false;
        draft.st_searchRecipeCreateDone = false;
        draft.st_searchRecipeCreateError = action.error;
        break;
      }
      /////////////////////////////////////////////////////// RECIPE UPDATE

      case SEARCH_RECIPE_UPDATE_REQUEST: {
        draft.st_searchRecipeUpdateLoading = true;
        draft.st_searchRecipeUpdateDone = null;
        draft.st_searchRecipeUpdateError = false;
        break;
      }
      case SEARCH_RECIPE_UPDATE_SUCCESS: {
        draft.st_searchRecipeUpdateLoading = false;
        draft.st_searchRecipeUpdateDone = true;
        break;
      }
      case SEARCH_RECIPE_UPDATE_FAILURE: {
        draft.st_searchRecipeUpdateLoading = false;
        draft.st_searchRecipeUpdateDone = false;
        draft.st_searchRecipeUpdateError = action.error;
        break;
      }
      /////////////////////////////////////////////////////// RECIPE DELETE

      case SEARCH_RECIPE_DELETE_REQUEST: {
        draft.st_searchRecipeDeleteLoading = true;
        draft.st_searchRecipeDeleteDone = null;
        draft.st_searchRecipeDeleteError = false;
        break;
      }
      case SEARCH_RECIPE_DELETE_SUCCESS: {
        draft.st_searchRecipeDeleteLoading = false;
        draft.st_searchRecipeDeleteDone = true;
        break;
      }
      case SEARCH_RECIPE_DELETE_FAILURE: {
        draft.st_searchRecipeDeleteLoading = false;
        draft.st_searchRecipeDeleteDone = false;
        draft.st_searchRecipeDeleteError = action.error;
        break;
      }
      /////////////////////////////////////////////////////// MATERIAL LIST

      case SEARCH_MATERIAL_LIST_REQUEST: {
        draft.st_searchMaterialListLoading = true;
        draft.st_searchMaterialListDone = null;
        draft.st_searchMaterialListError = false;
        break;
      }
      case SEARCH_MATERIAL_LIST_SUCCESS: {
        draft.st_searchMaterialListLoading = false;
        draft.st_searchMaterialListDone = true;
        draft.searchMaterial = action.data;
        break;
      }
      case SEARCH_MATERIAL_LIST_FAILURE: {
        draft.st_searchMaterialListLoading = false;
        draft.st_searchMaterialListDone = false;
        draft.st_searchMaterialListError = action.error;
        break;
      }
      /////////////////////////////////////////////////////// MATERIAL CREATE

      case SEARCH_MATERIAL_CREATE_REQUEST: {
        draft.st_searchMaterialCreateLoading = true;
        draft.st_searchMaterialCreateDone = null;
        draft.st_searchMaterialCreateError = false;
        break;
      }
      case SEARCH_MATERIAL_CREATE_SUCCESS: {
        draft.st_searchMaterialCreateLoading = false;
        draft.st_searchMaterialCreateDone = true;
        break;
      }
      case SEARCH_MATERIAL_CREATE_FAILURE: {
        draft.st_searchMaterialCreateLoading = false;
        draft.st_searchMaterialCreateDone = false;
        draft.st_searchMaterialCreateError = action.error;
        break;
      }
      /////////////////////////////////////////////////////// MATERIAL DELETE

      case SEARCH_MATERIAL_DELETE_REQUEST: {
        draft.st_searchMaterialDeleteLoading = true;
        draft.st_searchMaterialDeleteDone = null;
        draft.st_searchMaterialDeleteError = false;
        break;
      }
      case SEARCH_MATERIAL_DELETE_SUCCESS: {
        draft.st_searchMaterialDeleteLoading = false;
        draft.st_searchMaterialDeleteDone = true;
        break;
      }
      case SEARCH_MATERIAL_DELETE_FAILURE: {
        draft.st_searchMaterialDeleteLoading = false;
        draft.st_searchMaterialDeleteDone = false;
        draft.st_searchMaterialDeleteError = action.error;
        break;
      }
      ///////////////////////////////////////////////////////

      ///////////////////////////////////////////////////////
      ///////////////////////////////////////////////////////
      ///////////////////////////////////////////////////////

      case SEARCH_RECIPE_MODAL_TOGGLE: {
        draft.recipeModal = !draft.recipeModal;
        break;
      }
      ///////////////////////////////////////////////////////

      case SEARCH_MATERIAL_MODAL_TOGGLE: {
        draft.materialModal = !draft.materialModal;
        break;
      }

      default:
        break;
    }
  });

export default reducer;
