import produce from "../util/produce";

export const initailState = {
  // VALUE
  searchRecipe: null,

  // MODAL
  recipeModal: false,

  // RECIPE LIST
  st_searchRecipeListLoading: false,
  st_searchRecipeListDone: false,
  st_searchRecipeListError: false,

  // RECIPE CREATE
  st_searchRecipeCreateLoading: false,
  st_searchRecipeCreateDone: false,
  st_searchRecipeCreateError: false,
};

export const SEARCH_RECIPE_LIST_REQUEST = "SEARCH_RECIPE_LIST_REQUEST";
export const SEARCH_RECIPE_LIST_SUCCESS = "SEARCH_RECIPE_LIST_SUCCESS";
export const SEARCH_RECIPE_LIST_FAILURE = "SEARCH_RECIPE_LIST_FAILURE";

export const SEARCH_RECIPE_CREATE_REQUEST = "SEARCH_RECIPE_CREATE_REQUEST";
export const SEARCH_RECIPE_CREATE_SUCCESS = "SEARCH_RECIPE_CREATE_SUCCESS";
export const SEARCH_RECIPE_CREATE_FAILURE = "SEARCH_RECIPE_CREATE_FAILURE";

export const SEARCH_RECIPE_MODAL_TOGGLE = "SEARCH_RECIPE_MODAL_TOGGLE";

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
      ///////////////////////////////////////////////////////

      ///////////////////////////////////////////////////////
      ///////////////////////////////////////////////////////
      ///////////////////////////////////////////////////////

      case SEARCH_RECIPE_MODAL_TOGGLE: {
        draft.recipeModal = !draft.recipeModal;
        break;
      }

      default:
        break;
    }
  });

export default reducer;
