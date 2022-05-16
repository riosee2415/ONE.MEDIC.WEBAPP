import produce from "../util/produce";

export const initailState = {
  searchRecipe: null,

  //
  st_searchRecipeListLoading: false,
  st_searchRecipeListDone: false,
  st_searchRecipeListError: false,
};

export const SEARCH_RECIPE_LIST_REQUEST = "SEARCH_RECIPE_LIST_REQUEST";
export const SEARCH_RECIPE_LIST_SUCCESS = "SEARCH_RECIPE_LIST_SUCCESS";
export const SEARCH_RECIPE_LIST_FAILURE = "SEARCH_RECIPE_LIST_FAILURE";

const reducer = (state = initailState, action) =>
  produce(state, (draft) => {
    switch (action.type) {
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
      ///////////////////////////////////////////////////////

      default:
        break;
    }
  });

export default reducer;
