import { HYDRATE } from "next-redux-wrapper";
import { combineReducers } from "redux";
import user from "./user";
import banner from "./banner";
import popup from "./popup";
import company from "./company";
import notice from "./notice";
import gallery from "./gallery";
import question from "./question";
import accept from "./accept";
import seo from "./seo";
import editor from "./editor";
import prescription from "./prescription";
import discount from "./discount";
import material from "./material";
import paymentRequest from "./paymentRequest";
import address from "./address";
import prescriptionPaymentRequest from "./prescriptionPaymentRequest";
import search from "./search";

const rootReducer = (state, action) => {
  switch (action.type) {
    case HYDRATE:
      console.log("HYDRATE", action);
      return action.payload;
    default:
      {
        const combinedReducer = combineReducers({
          user,
          banner,
          popup,
          company,
          notice,
          gallery,
          question,
          accept,
          seo,
          editor,
          prescription,
          discount,
          material,
          paymentRequest,
          prescriptionPaymentRequest,
          address,
          search,
        });
        return combinedReducer(state, action);
      }
      ㅂ;
  }
};

export default rootReducer;
