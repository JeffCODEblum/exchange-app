/*
These actions are used to initialize and update our currency data as well as buy and sell currencies
*/

export const addCurrency = currencyData => dispatch => {
  dispatch({
    type: "ADD_CURRENCY",
    payload: { currencyData }
  });
};

export const setBuyRate = data => dispatch => {
  dispatch({
    type: "SET_BUY_RATE",
    code: data.code,
    payload: data.rate
  });
};

export const setSellRate = data => dispatch => {
  dispatch({
    type: "SET_SELL_RATE",
    code: data.code,
    payload: data.rate,
    commission: data.commission
  });
};

export const buyCurrency = data => dispatch => {
  dispatch({
    type: "BUY_CURRENCY",
    code: data.code,
    payload: data.amount,
    commission: data.commission
  });
};

export const sellCurrency = data => dispatch => {
  dispatch({
    type: "SELL_CURRENCY",
    code: data.code,
    payload: data.amount,
    commission: data.commission
  });
};
