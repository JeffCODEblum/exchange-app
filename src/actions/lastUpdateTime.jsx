/*
This action is used to maintain lastUpdateTime which is the time at which the currency rates were last updated from the api
*/

export const setLastUpdateTime = lastUpdateTime => dispatch => {
  dispatch({
    type: "SET_LAST_UPDATE_TIME",
    payload: { lastUpdateTime }
  });
};
