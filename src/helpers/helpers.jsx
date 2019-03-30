const max = (a, b) => {
  return a > b ? a : b;
};

// this helper function is a pure function which calculates the commission based on the params
export const calculateCommission = (
  cost,
  commissionPct,
  surcharge,
  minCommission
) => {
  return max(cost * commissionPct + surcharge, minCommission);
};

// this creates a random percentage from 1 - 5% which will be used to add noise to the currency rate data for demo purposes
export const getRandomAdjustment = () => {
  let oneOrTwo = Math.floor(Math.random() * 5) + 1;
  return oneOrTwo / 100;
};
