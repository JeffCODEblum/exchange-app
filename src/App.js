import React, { Component } from "react";
import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import axios from "axios";
import Home from "./home/home";
import Admin from "./admin/admin";
import { connect } from "react-redux";
import { addCurrency } from "./actions/currencies";
import { setBuyRate } from "./actions/currencies";
import { setSellRate } from "./actions/currencies";
import { setLastUpdateTime } from "./actions/lastUpdateTime";
import { config } from "./config";
import { NavLink } from "react-router-dom";
import { getRandomAdjustment } from "./helpers/helpers";

import Background from "./bg-image.png";
import Logo from "./logo.png";

class App extends Component {
  render() {
    return (
      <div
        className="App container-fluid"
        style={{
          backgroundImage: `url(${Background})`,
          backgroundRepeat: "no-repeat",
          backgroundSize: "100% 220px"
        }}
      >
        <div className="container" style={{ maxWidth: 800, paddingTop: 20 }}>
          <Router>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: "100%"
              }}
            >
              <div style={{ fontSize: "1.5em" }}>
                Airport Currency Exchange Office
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "flex-end",
                  alignItems: "center"
                }}
              >
                <NavLink
                  exact
                  to="/"
                  activeClassName="is-active"
                  style={{
                    padding: "10px",
                    color: "black",
                    textDecoration: "none"
                  }}
                >
                  Home
                </NavLink>
                <NavLink
                  to="/admin"
                  activeClassName="is-active"
                  style={{
                    padding: "10px",
                    color: "black",
                    textDecoration: "none"
                  }}
                >
                  Admin
                </NavLink>
                <img src={Logo} style={{ width: 70, height: 70 }} />
              </div>
            </div>

            <Route exact path="/" component={Home} />
            <Route exact path="/admin" component={Admin} />
          </Router>
        </div>
      </div>
    );
  }

  componentDidMount = () => {
    this.initializeHoldings();
    this.updateRates();
  };

  // construct the currencies store using the list of currencies in the config file
  initializeHoldings = () => {
    this.addCurrency({
      code: config.homeCurrency,
      holdings: config.homeInitialBalance
    });

    config.foreignCurrencies.map(item => {
      this.addCurrency({
        code: item, // currency code e.g. USD
        holdings: config.foreignInitialBalance, // amount we have in stock
        buyRate: 1, // buy exchange rate
        sellRate: 1 // sell exchange rate
      });
      return 1;
    });
  };

  // fetch the exchange rates from the api and update the currency store
  updateRates = () => {
    this.setLastUpdateTime(Date.now());
    axios
      .get(
        "http://www.apilayer.net/api/live?access_key=173fc8ddb04ea62d0148c9c2a8b15ce3&currencies=" +
          config.foreignCurrencies.join(",")
      )
      .then(res => {
        // format the response data into an array
        let formattedData = [];
        for (let key in res.data.quotes) {
          formattedData.push({
            code: key.slice(3, 6),
            rate: res.data.quotes[key]
          });
        }

        // this value will be used to randomize the rates to add more noise to the data (demo purposes)
        let randomAdjustment = getRandomAdjustment();

        // call the setters for each currency in the store
        formattedData.map(item => {
          this.setBuyRate({
            code: item.code,
            rate: item.rate + item.rate * randomAdjustment
          });
          this.setSellRate({
            code: item.code,
            rate:
              item.rate +
              item.rate * randomAdjustment * this.props.config.marginPct
          });
          return 1;
        });
      });

    // call the update again after the interval specified in the config store
    if (this.props.config.refreshRate) {
      setTimeout(this.updateRates, 1000 * this.props.config.refreshRate);
    }
  };

  simpleAction = event => {
    this.props.simpleAction();
  };

  addCurrency = currencyData => {
    this.props.addCurrency(currencyData);
  };

  setBuyRate = data => {
    this.props.setBuyRate(data);
  };

  setSellRate = data => {
    this.props.setSellRate(data);
  };

  setLastUpdateTime = data => {
    this.props.setLastUpdateTime(data);
  };
}

const mapStateToProps = state => ({
  ...state
});

const mapDispatchToProps = dispatch => ({
  addCurrency: currencyData => dispatch(addCurrency(currencyData)),
  setBuyRate: data => dispatch(setBuyRate(data)),
  setSellRate: data => dispatch(setSellRate(data)),
  setLastUpdateTime: data => dispatch(setLastUpdateTime(data))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(App);
