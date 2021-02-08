import {createStore, applyMiddleware} from 'redux';
import { composeWithDevTools } from "redux-devtools-extension";
import { thunk } from "redux-thunk";
import { rootReducers } from "./reducers";

const inititalState = {};

const middleware = [thunk];

const store = createStore(
    rootReducer,
    inititalState,
    composeWithDevTools(applyMiddleware(...middleware))
);

export default store;