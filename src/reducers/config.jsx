import { config } from "../config";

export default (
  state = {
    refreshRate: config.refreshRate,
    commissionPct: config.commissionPct,
    surcharge: config.surcharge,
    minCommission: config.minCommission,
    marginPct: config.marginPct
  },
  action
) => {
  switch (action.type) {
    case "SET_REFRESH_RATE":
      return { ...state, refreshRate: action.payload };
    case "SET_COMMISSION_PCT":
      return { ...state, commissionPct: action.payload };
    case "SET_SURCHARGE":
      return { ...state, surcharge: action.payload };
    case "SET_MIN_COMMISSION":
      return { ...state, minCommission: action.payload };
    case "SET_MARGIN_PCT":
      return { ...state, marginPct: action.payload };
    default:
      return state;
  }
};
