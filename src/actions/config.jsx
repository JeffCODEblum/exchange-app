/*
These actions are used to edit the config settings from the admin page.
*/

export const setRefreshRate = refreshRate => dispatch => {
  dispatch({
    type: "SET_REFRESH_RATE",
    payload: refreshRate
  });
};

export const setCommissionPct = commissionPct => dispatch => {
  dispatch({
    type: "SET_COMMISSION_PCT",
    payload: commissionPct
  });
};

export const setSurcharge = surcharge => dispatch => {
  dispatch({
    type: "SET_SURCHARGE",
    payload: surcharge
  });
};

export const setMinCommission = minCommission => dispatch => {
  dispatch({
    type: "SET_MIN_COMMISSION",
    payload: minCommission
  });
};

export const setMarginPct = marginPct => dispatch => {
  dispatch({
    type: "SET_MARGIN_PCT",
    payload: marginPct
  });
};
