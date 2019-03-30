import React, { Component } from "react";
import "./admin.css";
import { connect } from "react-redux";
import { library } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCog } from "@fortawesome/free-solid-svg-icons";

import {
  setRefreshRate,
  setCommissionPct,
  setSurcharge,
  setMinCommission,
  setMarginPct
} from "../actions/config";
library.add(faCog);

class Admin extends Component {
  constructor(props) {
    super(props);

    // the state contains all the user-adjustable config options
    this.state = {
      refreshRate: this.props.config.refreshRate,
      commissionPct: this.props.config.commissionPct,
      surcharge: this.props.config.surcharge,
      minCommission: this.props.config.minCommission,
      marginPct: this.props.config.marginPct
    };
  }
  render() {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "center",
          marginTop: 150
        }}
      >
        <div className="row">
          <div className="col-sm-12">
            <div style={{ fontSize: "1.3em" }}>
              <FontAwesomeIcon icon="cog" />
              Settings
            </div>
          </div>
        </div>

        <div className="row">
          <div
            className="col-sm-12"
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-start",
              alignItems: "center"
            }}
          >
            <div>Refresh currency exchange rates every</div>
            <div>
              <input
                className="form-control"
                value={this.state.refreshRate}
                onChange={this.handleRefreshRateChange}
                type="number"
                style={{ maxWidth: 100 }}
              />
            </div>
            <div>seconds.</div>
          </div>
        </div>

        <div className="row" style={{ width: "100%", paddingTop: 10 }}>
          <div
            className="col-sm-12"
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "space-between"
            }}
          >
            <div>Commission</div>
            <div>
              <input
                className="form-control"
                value={this.state.commissionPct}
                step="0.01"
                onChange={this.handleCommissionPctChange}
                type="number"
              />
            </div>
          </div>
        </div>

        <div className="row" style={{ width: "100%", paddingTop: 10 }}>
          <div
            className="col-sm-12"
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <div>Surcharge</div>
            <div>
              <input
                className="form-control"
                value={this.state.surcharge}
                onChange={this.handleSurchargeChange}
                type="number"
              />
            </div>
          </div>
        </div>

        <div className="row" style={{ width: "100%", paddingTop: 10 }}>
          <div
            className="col-sm-12"
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <div>Minimum Commission</div>
            <div>
              <input
                className="form-control"
                value={this.state.minCommission}
                onChange={this.handleMinCommissionChange}
                type="number"
              />
            </div>
          </div>
        </div>

        <div className="row" style={{ width: "100%", paddingTop: 10 }}>
          <div
            className="col-sm-12"
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center"
            }}
          >
            <div>Buy/sell rate margin</div>
            <div>
              <input
                className="form-control"
                value={this.state.marginPct}
                step="0.01"
                onChange={this.handleMarginPctChange}
                type="number"
              />
            </div>
          </div>
        </div>

        <div className="row" style={{ width: "100%", paddingTop: 10 }}>
          <div
            className="col-sm-12"
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "flex-end",
              alignItems: "center"
            }}
          >
            <button
              type="button"
              className="btn"
              style={{ backgroundColor: "#ffe500" }}
              onClick={this.update}
            >
              Update
            </button>
          </div>
        </div>
      </div>
    );
  }

  // these are the change handlers for the input fields
  handleCommissionPctChange = e => {
    this.setState({ ...this.state, commissionPct: e.target.value });
  };

  handleSurchargeChange = e => {
    this.setState({ ...this.state, surcharge: e.target.value });
  };

  handleMinCommissionChange = e => {
    this.setState({ ...this.state, minCommission: e.target.value });
  };

  handleMarginPctChange = e => {
    this.setState({ ...this.state, marginPct: e.target.value });
  };

  handleRefreshRateChange = e => {
    this.setState({ ...this.state, refreshRate: e.target.value });
  };

  // this is the click handler for the update button which commits the changes
  update = () => {
    this.setRefreshRate(parseFloat(this.state.refreshRate));
    this.setCommissionPct(parseFloat(this.state.commissionPct));
    this.setSurcharge(parseFloat(this.state.surcharge));
    this.setMinCommission(parseFloat(this.state.minCommission));
    this.setMarginPct(parseFloat(this.state.marginPct));
  };

  setRefreshRate = data => {
    this.props.setRefreshRate(data);
  };

  setCommissionPct = data => {
    this.props.setCommissionPct(data);
  };

  setSurcharge = data => {
    this.props.setSurcharge(data);
  };

  setMinCommission = data => {
    this.props.setMinCommission(data);
  };

  setMarginPct = data => {
    this.props.setMarginPct(data);
  };
}

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => ({
  setRefreshRate: data => dispatch(setRefreshRate(data)),
  setCommissionPct: data => dispatch(setCommissionPct(data)),
  setSurcharge: data => dispatch(setSurcharge(data)),
  setMinCommission: data => dispatch(setMinCommission(data)),
  setMarginPct: data => dispatch(setMarginPct(data))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Admin);
