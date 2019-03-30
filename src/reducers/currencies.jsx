import { config } from "../config";

export default (state = [], action) => {
  switch (action.type) {
    case "ADD_CURRENCY":
      return [...state, action.payload];
    case "SET_BUY_RATE":
      return state.map(item =>
        item.currencyData.code === action.code
          ? {
              currencyData: {
                ...item.currencyData,
                buyRate: parseFloat(action.payload.toFixed(4))
              }
            }
          : item
      );
    case "SET_SELL_RATE":
      return state.map(item =>
        item.currencyData.code === action.code
          ? {
              currencyData: {
                ...item.currencyData,
                sellRate: parseFloat(action.payload.toFixed(4))
              }
            }
          : item
      );
    case "BUY_CURRENCY":
      let buyRate = state.filter(
        item => item.currencyData.code === action.code
      )[0].currencyData.buyRate;
      let cost = action.payload * buyRate;
      let buyCommission = action.commission;
      return state
        .map(item =>
          item.currencyData.code === action.code
            ? {
                currencyData: {
                  ...item.currencyData,
                  holdings:
                    item.currencyData.holdings - parseFloat(action.payload)
                }
              }
            : item
        )
        .map(item =>
          item.currencyData.code === config.homeCurrency
            ? {
                currencyData: {
                  ...item.currencyData,
                  holdings:
                    item.currencyData.holdings +
                    parseFloat(cost) +
                    parseFloat(buyCommission)
                }
              }
            : item
        );
    case "SELL_CURRENCY":
      let sellRate = state.filter(
        item => item.currencyData.code === action.code
      )[0].currencyData.sellRate;
      let price = action.payload * sellRate;
      let sellCommission = action.commission;
      return state
        .map(item =>
          item.currencyData.code === action.code
            ? {
                currencyData: {
                  ...item.currencyData,
                  holdings:
                    parseFloat(item.currencyData.holdings) +
                    parseFloat(action.payload)
                }
              }
            : item
        )
        .map(item =>
          item.currencyData.code === config.homeCurrency
            ? {
                currencyData: {
                  ...item.currencyData,
                  holdings:
                    parseFloat(item.currencyData.holdings) -
                    (parseFloat(price) - parseFloat(sellCommission))
                }
              }
            : item
        );
    default:
      return state;
  }
};
