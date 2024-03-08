import React, { Component } from "react";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Box, Button } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { v4 } from "uuid";
import AssetsMainFilterModal from "../Components/AssetsMainFilterModal";
import FilterPopup from "Views/AppViews/DiscoveredAssets/Components/FilterPopup";
import { count } from "d3";

class AssetsFilterSection extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAssetsMainFilterModal: false,
      noOfRow: 0,
      currentWidthRange: window.innerWidth,
      showFilterPopup: false,
    };
  }

  componentDidMount() {
    this.handleResizeFun();
    window.addEventListener("resize", this.handleResizeFun, true);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleResizeFun);
  }

  handleResizeFun = () => {
    const width = window.innerWidth;
    let noOfRow;

    if (width > 1400) {
      noOfRow = 5;
    } else if (width >= 1290 && width < 1400) {
      noOfRow = 4;
    } else if (width >= 1100 && width < 1290) {
      noOfRow = 3;
    } else if (width >= 882 && width < 1100) {
      noOfRow = 2;
    } else if (width >= 660 && width < 882) {
      noOfRow = 1;
    } else {
      noOfRow = 0;
    }
    this.setState({ noOfRow });
  };
  togglePopup = () => {
    this.setState({
      showAssetsMainFilterModal: !this.state.showAssetsMainFilterModal,
    });
  };

  toggleFilterPopup = () => {
    this.setState({
      showFilterPopup: !this.state.showFilterPopup,
    });
  };

  //  Render applied filters
  renderAppliedFilters = () => {
    let filterData = this.props.data;
    let { noOfRow } = this.state;

    return (
      <Box className="add-filters">
        {filterData?.length ? (
          <>
            {filterData.slice(0, noOfRow).map((filter, index) => {
              return (
                <Box className="filter-box" key={v4()}>
                  <Box className="d-flex  align-items-center m-r-3">
                    <label>{filter.name} &#58; </label>
                    <span> {filter.value} </span>
                  </Box>
                  <CloseIcon
                    fontSize="inherit"
                    className="close-btn"
                    onClick={() => this.onClickCloseIcon(index)}
                  />
                </Box>
              );
            })}
            {filterData.length > noOfRow ? (
              this.renderNextCountForRemainingfilter(
                filterData.length - noOfRow
              )
            ) : (
              <></>
            )}
          </>
        ) : (
          <></>
        )}
      </Box>
    );
  };

  onClickCloseIcon = (id) => {
    try {
      this.props.onClickCloseIcon(id);
    } catch (e) {
      console.error(e);
    }
  };

  onClickClearFilter = () => {
    try {
      this.props.onClickClearFilter();
    } catch (e) {
      console.error(e);
    }
  };

  renderNextCountForRemainingfilter = (count) => {
    return (
      <Box
        className="filter-box"
        onClick={() => {
          this.setState({
            showFilterPopup: true,
          });
        }}
      >
        <Box className="d-flex  align-items-center m-r-3">
          <label>More &#58; </label> <span> +{count} </span>
        </Box>
      </Box>
    );
  };

  render() {
    const { showAssetsMainFilterModal, showFilterPopup, noOfRow } = this.state;
    let filterData = this.props.data;
    return (
      <Box className="head-top-section">
        <Button
          onClick={this.togglePopup}
          className="primary-outline-btn min-width m-r-3"
          variant="outlined"
        >
          Filters
        </Button>
        {this.renderAppliedFilters()}

        <Box
          className="clear-filter-box"
          onClick={() => this.onClickClearFilter()}
        >
          <label>Clear Filter</label>
          <DeleteForeverIcon fontSize="inherit" className="delete-btn" />
        </Box>
        {showAssetsMainFilterModal ? (
          <AssetsMainFilterModal
            showModal={showAssetsMainFilterModal}
            togglePopup={this.togglePopup}
          />
        ) : (
          <></>
        )}

        {showFilterPopup ? (
          <FilterPopup
            showModal={showFilterPopup}
            togglePopup={this.toggleFilterPopup}
            data={filterData.slice(noOfRow)}
            onClickCloseIcon={(id) => this.props.onClickCloseIcon(id)}
          />
        ) : (
          <></>
        )}
      </Box>
    );
  }
}

export default AssetsFilterSection;
