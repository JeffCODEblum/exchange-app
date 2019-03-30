import { combineReducers } from "redux";
import currencies from "./currencies";
import lastUpdateTime from "./lastUpdateTime";
import config from "./config";
export default combineReducers({
  currencies,
  lastUpdateTime,
  config
});
