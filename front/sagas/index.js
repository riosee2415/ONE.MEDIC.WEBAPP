import { all, fork } from "redux-saga/effects";
import bannerSaga from "./banner";
import userSaga from "./user";
import popupSaga from "./popup";
import companySaga from "./company";
import noticeSage from "./notice";
import gallerySage from "./gallery";
import questionSage from "./question";
import accept from "./accept";
import seoSaga from "./seo";
import editSaga from "./editor";
import prescriptionSaga from "./prescription";
import discountSaga from "./discount";
import materialSaga from "./material";
import paymentRequestSaga from "./paymentRequest";
import prescriptionPaymentRequestSaga from "./prescriptionPaymentRequest";
import addressSaga from "./address";
import searchSaga from "./search";
import prescriptionPriceSaga from "./prescriptionPrice";
import userRequestSaga from "./userRequest";
import wishSaga from "./wish";

//
import axios from "axios";
import backURL from "../config/config";

axios.defaults.baseURL = backURL;
axios.defaults.withCredentials = true;

export default function* rootSaga() {
  yield all([
    fork(bannerSaga),
    fork(userSaga),
    fork(popupSaga),
    fork(companySaga),
    fork(noticeSage),
    fork(gallerySage),
    fork(questionSage),
    fork(accept),
    fork(seoSaga),
    fork(editSaga),
    fork(prescriptionSaga),
    fork(discountSaga),
    fork(materialSaga),
    fork(paymentRequestSaga),
    fork(prescriptionPaymentRequestSaga),
    fork(addressSaga),
    fork(searchSaga),
    fork(prescriptionPriceSaga),
    fork(userRequestSaga),
    fork(wishSaga),
  ]);
}
