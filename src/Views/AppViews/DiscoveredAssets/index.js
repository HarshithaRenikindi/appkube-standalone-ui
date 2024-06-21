import React, { Component } from "react";
import { Box, Button } from "@mui/material";
import DiscoveredAssetsComponent from "./DiscoveredAssetsComponent";
import NonLTEAssets from "./NonLTEAssets";
import TaggedAssets from "./TaggedAssets";
import UntaggedAssets from "./UntaggedAssets";
import TabsMenu from "Views/AppViews/Environments/EnvironmentList/TabsMenu";
import { v4 } from "uuid";
import { navigateRouter } from "Utils/Navigate/navigateRouter";
import { connect } from "react-redux";
import { clearDiscoveredAssetsFilters } from "Redux/DiscoveredAssets/DiscoveredAssetsSlice";

class DiscoveredAssets extends Component {
  tabMapping = [
    {
      name: "Discovered Assets",
    },
    {
      name: "Tagged Assets",
    },
    {
      name: "Untagged Assets",
    },
    {
      name: "Non LTE Assets",
    },
  ];
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 0,
    };
  }

  setActiveTab = (activeTab) => {
    this.props.clearDiscoveredAssetsFilters();
    this.setState({ activeTab });
  };

  // Render active component
  renderActiveTabComponent = () => {
    const { activeTab } = this.state;
    return activeTab === 0 ? (
      <DiscoveredAssetsComponent />
    ) : activeTab === 1 ? (
      <TaggedAssets />
    ) : activeTab === 2 ? (
      <UntaggedAssets />
    ) : activeTab === 3 ? (
      <NonLTEAssets />
    ) : (
      <></>
    );
  };

  render() {
    const { activeTab } = this.state;
    return (
      <Box className="discovered-assets-container environment-container">
        <Box className="assets-heading">
          <h3 className="m-b-0">ASSETS MANAGEMENT</h3>
        </Box>
        <Box className="global-services-fliter p-0">
          <Box className="heading">Discovered Assets</Box>
        </Box>
        <Box className="services-panel-tabs">
          <Box className="tabs-head width-100 d-block text-center">
            <TabsMenu
              tabs={this.tabMapping}
              setActiveTab={this.setActiveTab}
              activeTab={activeTab}
              breakWidth={767}
              key={v4()}
            />
          </Box>
          <Box className="tabs-content">{this.renderActiveTabComponent()}</Box>
        </Box>
      </Box>
    );
  }
}

function mapStateToProps(state) {
  const { discoveredAssetsFilters } = state.discoveredAssets;

  return { discoveredAssetsFilters };
}

const mapDispatchToProps = { clearDiscoveredAssetsFilters };
export default connect(
  mapStateToProps,
  mapDispatchToProps
)(navigateRouter(DiscoveredAssets));
