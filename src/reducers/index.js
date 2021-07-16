import { combineReducers } from "redux";
import {
  CLEAR_USER,
  SET_CURRENT_CHANNEL,
  SET_PRIVATE_CHANNEL,
  SET_USER,
} from "../actions/types";

const initialUserState = {
  currentUser: null,
  isLoading: true,
};

const initialCurrentChannel = {
  currentChannel: null,
  isPrivateChannel: false,
};

const user_reducer = (state = initialUserState, action) => {
  switch (action.type) {
    case SET_USER:
      return {
        currentUser: action.payload.currentUser,
        isLoading: false,
      };
    case CLEAR_USER:
      return {
        ...state,
        isLoading: false,
      };
    default:
      return state;
  }
};

const channel_reducer = (state = initialCurrentChannel, action) => {
  switch (action.type) {
    case SET_CURRENT_CHANNEL:
      return {
        ...state,
        currentChannel: action.payload.currentChannel,
      };
    case SET_PRIVATE_CHANNEL:
      return {
        ...state,
        isPrivateChannel: action.payload.isPrivateChannel,
      };
    default:
      return state;
  }
};

const rootReducers = combineReducers({
  user: user_reducer,
  channel: channel_reducer,
});

export default rootReducers;
