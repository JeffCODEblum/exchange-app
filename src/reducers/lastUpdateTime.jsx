export default (state = 0, action) => {
  switch (action.type) {
    case "SET_LAST_UPDATE_TIME":
      return action.payload;
    default:
      return state;
  }
};
