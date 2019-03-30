import React, { Component } from "react";
import Modal from "react-bootstrap4-modal";
import "./home.css";
import { connect } from "react-redux";
import { buyCurrency, sellCurrency } from "../actions/currencies";
import { config } from "../config";
import { calculateCommission } from "../helpers/helpers";

class Home extends Component {
  constructor(props) {
    super(props);

    // the state contains all the data for the view and for buying or selling a currency
    this.state = {
      buyCurrency: "",
      shouldShowBuyModal: false,
      buyAmount: 0,
      buyRate: 0,
      buyCommission: 0,
      buySubtotal: 0,
      buyTotal: 0,
      sellCurrency: "",
      shouldShowSellModal: false,
      sellAmount: 0,
      sellRate: 0,
      sellCommission: 0,
      sellSubtotal: 0,
      sellTotal: 0
    };
  }
  render() {
    let date = new Date(this.props.lastUpdateTime.lastUpdateTime);
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-around",
          alignItems: "space-around",
          marginTop: 150
        }}
      >
        <div className="row">
          <div className="col-sm-12">
            {/* here we display the last currency update time, home currency, and home currency holdings. If the currency update is disabled, we display a warning*/}
            {this.props.config.refreshRate > 0 ? (
              <div>
                Exchange rates shown as per {date.toUTCString()}. You have{" "}
                {this.props.currencies.map(item =>
                  item.currencyData.code === config.homeCurrency
                    ? item.currencyData.holdings.toFixed(2) + " "
                    : ""
                )}
                {config.homeCurrency} left.
              </div>
            ) : (
              <div style={{ color: "red" }}>
                Exchange Rate Refresh is Disabled
              </div>
            )}
          </div>
        </div>
        {/* This is the foreign currency table */}
        <div className="row" style={{ marginTop: 50 }}>
          <table className="table table-striped table-condensed">
            <thead>
              <tr>
                <th>Currency</th>
                <th>Buy</th>
                <th>Sell</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {this.props.currencies.map(item =>
                item.currencyData.code !== config.homeCurrency ? (
                  <tr key={item.currencyData.code}>
                    <td>{item.currencyData.code}</td>
                    <td
                      onClick={() => this.initiateBuy(item.currencyData.code)}
                    >
                      {item.currencyData.buyRate}
                    </td>
                    <td
                      onClick={() => this.initiateSell(item.currencyData.code)}
                    >
                      {item.currencyData.sellRate}
                    </td>
                    <td
                      style={{
                        color:
                          item.currencyData.holdings <
                          this.props.config.lowThreshold
                            ? "red"
                            : "black"
                      }}
                    >
                      {item.currencyData.holdings}
                    </td>
                  </tr>
                ) : null
              )}
            </tbody>
          </table>
        </div>

        {/* this is the modal for buying currency */}
        <Modal
          visible={this.state.shouldShowBuyModal}
          onClickBackdrop={this.modalBackdropClicked}
        >
          <div className="modal-header">
            <h5 className="modal-title">Buy {this.state.buyCurrency} </h5>
          </div>
          <div className="modal-body">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                paddingTop: 5,
                paddingBottom: 5
              }}
            >
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">
                    {this.state.buyCurrency}
                  </span>
                </div>
                <input
                  type="text"
                  className="form-control"
                  value={this.state.buyAmount}
                  onChange={this.handleBuyAmountChange}
                />
                <div className="input-group-append">
                  <span className="input-group-text">.00</span>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingTop: 5,
                  paddingBottom: 5
                }}
              >
                <div>
                  <b>Exchange Rate</b>
                </div>
                <div>{this.state.buyRate}</div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingTop: 5,
                  paddingBottom: 5
                }}
              >
                <div>
                  <b>Subtotal</b>
                </div>
                <div>{this.state.buySubtotal}</div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingTop: 5,
                  paddingBottom: 5
                }}
              >
                <div>
                  <b>Commission</b>
                </div>
                <div>{this.state.buyCommission}</div>
              </div>
              <div
                style={{
                  borderBottom: "solid 2px #222222",
                  width: "100%",
                  paddingTop: 5
                }}
              />
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingTop: 10,
                  paddingBottom: 5
                }}
              >
                <div>
                  <b>Total</b>
                </div>
                <div>{this.state.buyTotal}</div>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn"
              onClick={this.modalBackdropClicked}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn"
              style={{ backgroundColor: "#ffe500" }}
              onClick={this.commitBuy}
            >
              Buy
            </button>
          </div>
        </Modal>

        {/* This is the modal for selling currency */}
        <Modal
          visible={this.state.shouldShowSellModal}
          onClickBackdrop={this.modalBackdropClicked}
        >
          <div className="modal-header">
            <h5 className="modal-title">Sell {this.state.sellCurrency} </h5>
          </div>
          <div className="modal-body">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "flex-start",
                paddingTop: 5,
                paddingBottom: 5
              }}
            >
              <div className="input-group">
                <div className="input-group-prepend">
                  <span className="input-group-text">
                    {this.state.sellCurrency}
                  </span>
                </div>
                <input
                  type="number"
                  className="form-control"
                  value={this.state.sellAmount}
                  onChange={this.handleSellAmountChange}
                />
                <div className="input-group-append">
                  <span className="input-group-text">.00</span>
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingTop: 5,
                  paddingBottom: 5
                }}
              >
                <div>
                  <b>Exchange Rate</b>
                </div>
                <div>{this.state.sellRate}</div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingTop: 5,
                  paddingBottom: 5
                }}
              >
                <div>
                  <b>Subtotal</b>
                </div>
                <div>{this.state.sellSubtotal}</div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  paddingTop: 5,
                  paddingBottom: 5
                }}
              >
                <div>
                  <b>Commission</b>
                </div>
                <div>{this.state.sellCommission}</div>
              </div>
            </div>
            <div
              style={{
                borderBottom: "solid 2px #222222",
                width: "100%",
                paddingTop: 5
              }}
            />
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                paddingTop: 10,
                paddingBottom: 5
              }}
            >
              <div>
                <b>Sell Price</b>
              </div>
              <div>{this.state.sellTotal}</div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn"
              onClick={this.modalBackdropClicked}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn"
              style={{ backgroundColor: "#ffe500" }}
              onClick={this.commitSell}
            >
              Sell
            </button>
          </div>
        </Modal>
      </div>
    );
  }

  // this is the change handler for the buy amount. It calculates the subtotal, comission, and total any time the curreny buy amount is changed and then updates the component state.
  handleBuyAmountChange = e => {
    e.target.value = parseInt(e.target.value) || 0;
    const subtotal = parseFloat(
      (e.target.value * this.state.buyRate).toFixed(2)
    );
    let commission = calculateCommission(
      subtotal,
      this.props.config.commissionPct,
      this.props.config.surcharge,
      this.props.config.minCommission
    );
    commission = parseFloat(commission.toFixed(2));
    const total = parseFloat((subtotal + commission).toFixed(2));
    this.setState({
      ...this.state,
      buyAmount: e.target.value,
      buySubtotal: subtotal,
      buyCommission: commission,
      buyTotal: total
    });
  };

  // This initiates the buy process by setting the buy rate and desired currency in the state and opening the modal
  initiateBuy = code => {
    let buyRate = this.props.currencies.filter(item =>
      item.currencyData.code === code ? item.currencyData.buyRate : ""
    );
    buyRate = buyRate[0].currencyData.buyRate;
    this.setState({
      ...this.state,
      shouldShowBuyModal: true,
      buyCurrency: code,
      buyRate
    });
  };

  // This commits the buy by calling the action creator, it also checks that there is enough of desired currency to complete the transaction
  commitBuy = () => {
    let holdings = this.props.currencies.filter(
      item => item.currencyData.code === this.state.buyCurrency
    );
    holdings = holdings[0].currencyData.holdings;
    if (holdings >= this.state.buyAmount) {
      this.buyCurrency({
        code: this.state.buyCurrency,
        amount: this.state.buyAmount,
        commission: this.state.buyCommission
      });
    } else {
      alert("Insufficient Stock");
    }
    this.toggleBuyModal();
  };

  // this opens or closes the buy modal
  toggleBuyModal = () => {
    this.setState({
      ...this.state,
      shouldShowBuyModal: !this.state.shouldShowBuyModal
    });
  };

  // this is the change handler for the sell amount. It calculates the subtotal, comission, and total any time the curreny sell amount is changed and then updates the component state.
  handleSellAmountChange = e => {
    const subtotal = parseFloat(
      (e.target.value * this.state.sellRate).toFixed(2)
    );
    const commission = parseFloat(
      calculateCommission(
        subtotal,
        this.props.config.commissionPct,
        this.props.config.surcharge,
        this.props.config.minCommission
      ).toFixed(2)
    );
    const total = parseFloat((subtotal - commission).toFixed(2));
    this.setState({
      ...this.state,
      sellAmount: e.target.value,
      sellSubtotal: subtotal,
      sellCommission: commission,
      sellTotal: total
    });
  };

  // This initiates the sell process by setting the sell rate and desired currency in the state and opening the modal
  initiateSell = code => {
    let sellRate = this.props.currencies.filter(item =>
      item.currencyData.code === code ? item.currencyData.sellRate : ""
    );
    sellRate = sellRate[0].currencyData.sellRate;
    this.setState({
      ...this.state,
      shouldShowSellModal: true,
      sellCurrency: code,
      sellRate
    });
  };

  // This commits the sell by calling the action creator, it also checks that there is enough of the home currency to complete the transaction
  commitSell = () => {
    let holdings = this.props.currencies.filter(
      item => item.currencyData.code === config.homeCurrency
    );
    holdings = holdings[0].currencyData.holdings;
    if (holdings >= this.state.sellTotal) {
      this.sellCurrency({
        code: this.state.sellCurrency,
        amount: this.state.sellAmount,
        commission: this.state.sellCommission
      });
    } else {
      alert("Insufficient Funds");
    }
    this.toggleSellModal();
  };

  // this opens or closes the sell modal
  toggleSellModal = () => {
    this.setState({
      ...this.state,
      shouldShowSellModal: !this.state.shouldShowSellModal
    });
  };

  // this lifecycle hook is used to update all the buy/sell information in the event that currency rates are updated while a transaction is in process
  componentDidUpdate = (prevProps, prevState) => {
    // detect if currency rates have been updated
    if (prevProps.currencies !== this.props.currencies) {
      // detect if there is a buy in process
      if (this.state.buyCurrency) {
        // find the new buy rate
        let matches = this.props.currencies.filter(item =>
          item.currencyData.code === this.state.buyCurrency
            ? item.currencyData.buyRate
            : ""
        );
        if (matches.length > 0) {
          // update the buy rate here
          const newBuyRate = matches[0].currencyData.buyRate;
          // calculate update the subtotal, commission, and total
          let subtotal = parseFloat(
            (this.state.buyAmount * newBuyRate).toFixed(2)
          );
          let commission = calculateCommission(
            subtotal,
            this.props.config.commissionPct,
            this.props.config.surcharge,
            this.props.config.minCommission
          );
          commission = parseFloat(commission.toFixed(2));
          let total = parseFloat((subtotal + commission).toFixed(2));
          this.setState({
            ...this.state,
            buyRate: newBuyRate,
            buySubtotal: subtotal,
            buyCommission: commission,
            buyTotal: total
          });
        }
      }

      // detect if there is a sell transaction in process
      if (this.state.sellCurrency) {
        // find the new sell rate
        let matches = this.props.currencies.filter(item =>
          item.currencyData.code === this.state.sellCurrency
            ? item.currencyData.sellRate
            : ""
        );
        if (matches.length > 0) {
          // update the sell rate here
          const newSellRate = matches[0].currencyData.sellRate;
          // calculate and update the new subtotal, commission, and total
          let subtotal = parseFloat(
            (this.state.sellAmount * newSellRate).toFixed(2)
          );
          let commission = calculateCommission(
            subtotal,
            this.props.config.commissionPct,
            this.props.config.surcharge,
            this.props.config.minCommission
          );
          commission = parseFloat(commission.toFixed(2));
          let total = parseFloat((subtotal + commission).toFixed(2));
          this.setState({
            ...this.state,
            sellRate: newSellRate,
            sellSubtotal: subtotal,
            sellCommission: commission,
            sellTotal: total
          });
        }
      }
    }
  };

  buyCurrency = data => {
    this.props.buyCurrency(data);
  };

  sellCurrency = data => {
    this.props.sellCurrency(data);
  };

  // close the modals and reset the inputs
  modalBackdropClicked = () => {
    this.setState({
      buyCurrency: "",
      shouldShowBuyModal: false,
      buyAmount: 0,
      buyRate: 0,
      buyCommission: 0,
      buySubtotal: 0,
      buyTotal: 0,
      sellCurrency: "",
      shouldShowSellModal: false,
      sellAmount: 0,
      sellRate: 0,
      sellCommission: 0,
      sellSubtotal: 0,
      sellTotal: 0
    });
  };
}

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => ({
  buyCurrency: data => dispatch(buyCurrency(data)),
  sellCurrency: data => dispatch(sellCurrency(data))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
