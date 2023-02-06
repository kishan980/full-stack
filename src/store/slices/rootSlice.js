import {combineReducers} from "redux";
import filesReducer from  './filesSlice'
import userReducer from "./userSlice";
import resultsReducer from "./resultsSlice";
import signInReducer from "./signInSlice";
import orderReducer from "./orderSlice";
import collectionReducer from "./collectionSlice";
import checkoutStripeReducer from "./checkoutStripeSlice";
import cartReducer from "./cartSlice";
import whiteHeaderReducer from "./whiteHeader";
import navColorReducer from "./navColorSlice";
import houseReducer from "./houseSlice";
import contactReducer from "./contactSlice";

export default combineReducers({
  files: filesReducer,
  user: userReducer,
  results: resultsReducer,
  signIn: signInReducer,
  whiteHeader: whiteHeaderReducer,
  collection: collectionReducer,
  order: orderReducer,
  cart: cartReducer,
  navColor: navColorReducer,
  checkoutStripe: checkoutStripeReducer,
  house: houseReducer,
  contact:contactReducer
});
