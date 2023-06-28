import React, { Component } from "react";
import Aws from "assets/img/aws.png";
import { CSVLink } from "react-csv";
import { Link } from "react-router-dom";
import Microsoftazure from "assets/img/microsoftazure.png";
import config from "views/app-views/config";
import GoogleCloud from "assets/img/google-cloud.png";
import Kubernetes from "assets/img/kubernetes.png";
import { Box, Grid, List, ListItem } from "@mui/material";
import { APP_PREFIX_PATH } from "configs/AppConfig";
import Button from "@mui/material/Button";

const headers = [
  { label: "Service Name", key: "name" },
  { label: "Product", key: "product_count" },
  { label: "App Service", key: "app_count" },
  { label: "Data Service", key: "data_count" },
];
const LOGOS = {
  aws: Aws,
  azure: Microsoftazure,
  gcp: GoogleCloud,
  kubernetes: Kubernetes,
};
class CommonFilterViewSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showRecentFilter: false,
      showSelectFilter: false,
      showServiceViewFilter: false,
      accountList: [],
      ...props.data,
    };
  }
  componentDidMount() {
    // this.getAccountList();
  }

  getAccountList = () => {
    fetch(config.GET_ENVIRONMENTS)
      .then((response) => response.json())
      .then((data) => {
        const commonData = {};
        const accounts = {};
        data.forEach((account) => {
          accounts[account.cloud] = accounts[account.cloud] || [];
          accounts[account.cloud].push(account);
          commonData[account.cloud] = commonData[account.cloud]
            ? commonData[account.cloud]
            : {
              totalBill: 0,
            };
          commonData[account.cloud].totalBill += account.totalBilling || 0;
        });
        this.setState({
          accountList: accounts,
        });
      });
  };

  renderAccountList = () => {
    return Object.keys(this.props.accountList).map((key) => {
      return this.props.accountList[key].map((account, innerKey) => {
        return (
          <ListItem key={innerKey}>
            <Link
              to={`${APP_PREFIX_PATH}/environments/environmentlist?accountId=${account.accountId}&cloudName=${account.cloud}`}
              onClick={() => {
                this.setState({ showServiceViewFilter: false });
                this.props.updateAccountId(account.accountId);
                localStorage.setItem("serviceName", account.cloud);
              }}
            >
              <span>
                <img
                  src={LOGOS[account.cloud.toLowerCase()]}
                  alt={account.cloud}
                />
              </span>
              <p>({account.accountId})</p>
            </Link>
          </ListItem>
        );
      });
    });
  };

  componentDidUpdate = async (prevState, prevProps) => {
    if (
      this.props.data.vpcsDetails !== null &&
      this.props.data.vpcsDetails !== this.state.vpcsDetails
    ) {
      this.setState({ vpcsDetails: this.props.data.vpcsDetails });
    }
  };

  setLocalRecentService = (account) => {
    let recentEnv = JSON.parse(localStorage.getItem("recentEnv"));
    let isDuplicate = false;

    if (recentEnv !== null) {
      recentEnv.map((item, index) => {
        if (item.accountId === account.accountId) {
          isDuplicate = true;
          arrayMove(recentEnv, index, 0);
        }
      });
    }

    function arrayMove(arr, fromIndex, toIndex) {
      var element = arr[fromIndex];
      arr.splice(fromIndex, 1);
      arr.splice(toIndex, 0, element);
      localStorage.setItem("recentEnv", JSON.stringify(arr));
    }

    if (localStorage.getItem("recentEnv") === null) {
      let newItem = [
        { accountType: account.cloud, accountId: account.accountId },
      ];
      localStorage.setItem("recentEnv", JSON.stringify(newItem));
    } else if (recentEnv.length > 2 && isDuplicate === false) {
      recentEnv.pop();
      let newItem = {
        accountType: account.cloud,
        accountId: account.accountId,
      };
      recentEnv.unshift(newItem);
      localStorage.setItem("recentEnv", JSON.stringify(recentEnv));
    } else if (isDuplicate === false) {
      let newItem = {
        accountType: account.cloud,
        accountId: account.accountId,
      };
      recentEnv.push(newItem);
      localStorage.setItem("recentEnv", JSON.stringify(recentEnv));
    }
  };

  render() {
    const { showSelectFilter, showServiceViewFilter, showRecentFilter } = this.state;
    return (
      <Box sx={{ width: "100%" }}>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          <Grid item xs={6}>
            <Box className="environment-fliter">
              <Box
                className="fliter-toggel"
                onClick={() =>
                  this.setState({
                    showSelectFilter: !showSelectFilter,
                  })
                }
              >
                <i className="fas fa-filter fillter-icon"></i>
                Select and fillter
                <i className="fas fa-caret-down arrow-icon"></i>
              </Box>
              <Box
                className={
                  showSelectFilter === true
                    ? "fliter-collapse active"
                    : "fliter-collapse"
                }
              >
                <Box className="search-bar">
                  <input type="text" placeholder="Search...." />
                </Box>
                <List>
                  <ListItem>
                    <input
                      type="checkbox"
                      onChange={() => this.handleChecked()}
                    />
                    OU
                  </ListItem>
                  <ListItem>
                    <input
                      type="checkbox"
                      onChange={() => this.handleChecked()}
                    />
                    Status
                  </ListItem>
                  <ListItem>
                    <input
                      type="checkbox"
                      onChange={() => this.handleChecked()}
                    />
                    No of Assets
                  </ListItem>
                  <ListItem>
                    <input
                      type="checkbox"
                      onChange={() => this.handleChecked()}
                    />
                    Logs
                  </ListItem>
                  <ListItem>
                    <input
                      type="checkbox"
                      onChange={() => this.handleChecked()}
                    />
                    Performance & Availability
                  </ListItem>
                </List>
              </Box>
              <div
                className={
                  showSelectFilter === true
                    ? "fliters-collapse-bg active"
                    : "fliters-collapse-bg"
                }
                onClick={() =>
                  this.setState({
                    showSelectFilter: !showSelectFilter,
                  })
                }
              />
            </Box>
            <Box className="environment-fliter">
              <Box
                className="fliter-toggel"
                onClick={() =>
                  this.setState({
                    showServiceViewFilter: !showServiceViewFilter,
                  })
                }
              >
                <i className="far fa-eye fillter-icon"></i>
                Service View
                <i className="fas fa-caret-down arrow-icon"></i>
              </Box>
              <Box
                className={
                  showServiceViewFilter === true
                    ? "fliter-collapse recent-collapse active"
                    : "fliter-collapse"
                }
              >
                <List>
                  {this.props.accountList &&
                    Object.keys(this.props.accountList).length ? (
                    this.renderAccountList()
                  ) : (
                    <></>
                  )}
                </List>
              </Box>
              <div
                className={
                  showServiceViewFilter === true
                    ? "fliters-collapse-bg active"
                    : "fliters-collapse-bg"
                }
                onClick={() =>
                  this.setState({
                    showServiceViewFilter: !showServiceViewFilter,
                  })
                }
              />
            </Box>
          </Grid>
          <Grid item xs={6}>
            <Box className="d-inline-block width-100 text-right">
              {JSON.parse(localStorage.getItem("recentEnv")) !== null && (
                <Box className="environment-fliter">
                  <Box
                    className="fliter-toggel"
                    onClick={() =>
                      this.setState({
                        showRecentFilter: !showRecentFilter,
                      })
                    }
                  >
                    <i className="far fa-clock fillter-icon"></i>
                    Recent
                    <i className="fas fa-caret-down arrow-icon"></i>
                  </Box>
                  <Box
                    className={
                      showRecentFilter === true
                        ? "fliter-collapse recent-collapse active"
                        : "fliter-collapse"
                    }
                  >
                    <List>
                      {JSON.parse(localStorage.getItem("recentEnv"))?.map(
                        (item) => {
                          return (
                            <ListItem>
                              <Link
                                to={`${APP_PREFIX_PATH}/environments/environmentlist?accountId=${item.accountId}&cloudName=${item.accountType}`}
                                onClick={() => {
                                  this.setLocalRecentService(item);
                                  this.props.updateCurrentAccountId(
                                    item.accountId
                                  );
                                }}
                              >
                                <span>
                                  <img
                                    src={
                                      item.accountType === "aws"
                                        ? LOGOS.aws
                                        : item.accountType === "gcp"
                                          ? LOGOS.gcp
                                          : LOGOS.azure
                                    }
                                    alt={item.accountType}
                                  />
                                </span>
                                <p>({item.accountId})</p>
                              </Link>
                            </ListItem>
                          );
                        }
                      )}
                    </List>
                  </Box>
                  <div
                    className={
                      showRecentFilter === true
                        ? "fliters-collapse-bg active"
                        : "fliters-collapse-bg"
                    }
                    onClick={() =>
                      this.setState({
                        showRecentFilter: !showRecentFilter,
                      })
                    }
                  />
                </Box>
              )}

              {this.state.vpcsDetails && this.state.vpcsDetails.length ? (
                <CSVLink
                  data={this.state.vpcsDetails}
                  headers={headers}
                  filename={"vpcs.csv"}
                  target="_blank"
                >
                  <Button
                    className="primary-btn min-width-inherit"
                    variant="contained"
                  >
                    <i className="fas fa-external-link-square-alt p-r-10"></i>
                    Export
                  </Button>
                </CSVLink>
              ) : (
                <></>
              )}

              <Box className="search-box">
                <Box className="form-group search-control-group m-b-0">
                  <input
                    type="text"
                    className="input-group-text"
                    placeholder="Search"
                    onChange={(e) => {
                      this.props.handleSearch(e.target.value);
                    }}
                  />
                  <button className="search-btn">
                    <i className="fa fa-search" />
                  </button>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Box>
    );
  }
}

export default CommonFilterViewSearch;
