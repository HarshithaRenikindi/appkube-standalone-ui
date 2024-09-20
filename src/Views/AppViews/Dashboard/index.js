import React, { Component } from "react";
import SpendAnalytics from "./SpendAnalytics";
import CostAnalysis from "./CostAnalysis";
import SLAMetrics from "./SlaMetrics";
import ProcessCentral from "./ProcessCentral";
import Planet from "assets/img/dashboard/planet2.png";
import { Box, List, ListItem,Typography,Grid ,Breadcrumbs,Link} from "@mui/material";
import { v4 } from "uuid";

class Dashboard extends Component {
  tabMapping = [
    {
      name: "Spend Analytics",
      dataKey: "spend",
    },
    {
      name: "Cost Analysis",
      dataKey: "cost",
    },
    // {
    //   name: "SLA Metrics",
    //   dataKey: "metrics",
    // },
    // {
    //   name: "Process Central",
    //   dataKey: "process",
    // },
  ];
  constructor(props) {
    super(props);
    this.state = {
      activeTab: 0,
    };
  }
  setActiveTab = (activeTab) => {
    this.setState({ activeTab });
  };

  render() {
    const { activeTab } = this.state;
    return (
      <Box className="dashboard-container">
        <Box className="dashboard-bg-image">
          <Box className="dashboard-inner">
            <Box className="dashboard-image">
              <img src={Planet} alt="Planet" />
            </Box>
          </Box>
        </Box>
        {/* <Box sx={{marginTop:10}}>
        <Typography variant="h4">Dashboard</Typography>

        <Typography variant="body2 ">Total Spends</Typography>
              <Typography variant="h4">$150</Typography>
              </Box> */}


   

    <Box sx={{marginTop: 10}}>
    <Typography variant="h4">Dashboard</Typography>

    <Box display="flex" alignItems="center">
    <Typography variant="h6" sx={{ marginRight: 2, color: "black", fontWeight: "bold" }}>
    Total Spends
</Typography>
<Breadcrumbs aria-label="breadcrumb" style={{ fontSize: '0.75rem' }}>
    <Link underline="hover" color="inherit" href="/">
        Home
    </Link>
</Breadcrumbs>

    </Box>
    <Box display="flex" alignItems="center">
    <Typography variant="h4">$150</Typography>
    </Box>


</Box>

        <Box className="services-panel-tabs">
         
          <Box className="tabs-head">
          

           
            <List>
              {this.tabMapping.map((tabData, index) => {
                return (
                  <ListItem
                    key={v4()}
                    className={index === activeTab ? "active" : ""}
                    onClick={() => this.setActiveTab(index)}
                  >
                    
                    {tabData.name}
                    
                  </ListItem>
                );
              })}
            </List>
          </Box>
          <Box className="tabs-content">
            <div style={{ display: activeTab === 0 ? "block" : "none" }}>
              <SpendAnalytics />
            </div>
            <div style={{ display: activeTab === 1 ? "block" : "none" }}>
              <CostAnalysis />
            </div>
            <div style={{ display: activeTab === 2 ? "block" : "none" }}>
              <SLAMetrics />
            </div>
            <div style={{ display: activeTab === 3 ? "block" : "none" }}>
              <ProcessCentral />
            </div>
          </Box>
        </Box>
      </Box>
    );
  }
}

export default Dashboard;
