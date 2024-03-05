import React, { Component } from "react";
import {
  Box,
  Button,
  Grid,
  List,
  ListItem,
  TableContainer,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Checkbox,
  IconButton,
} from "@mui/material";
import ChartWebLayerIcon from "assets/img/assetmanager/chart-web-layer-icon.png";
import ChartAppLayerIcon from "assets/img/assetmanager/chart-app-layer-icon.png";
import DataServiceSvgrepo from "assets/img/assetmanager/data-service-svgrepo.png";
import bottomArrow from "assets/img/assetmanager/bottom-arrow.png";
import RightArrow from "assets/img/assetmanager/right-arrow.png";
import deployed1 from "assets/img/bimapping/deployed1.png";

import Aws from "assets/img/aws.png";
import { v4 } from "uuid";
import LoadBalancer from "../Soa/components/LoadBalancer";
import Ingress from "../Soa/components/Ingress";
import Service from "../Soa/components/Service";
import AppTopology from "../Soa/components/AppTopology";
import LoadBalancerIcon from "assets/img/bimapping/load-balancer-icon.png";
import IngressIcon from "assets/img/bimapping/ingress-icon.png";
import ServiceIcon from "assets/img/bimapping/service-icon.png";
import StarIcon from "assets/img/bimapping/star-icon.png";
import TitleIconWithInfoOfCard from "Components/TitleIconWithInfoOfCard";
import VerticalTitleAndIconOfCard from "Components/VerticalTitleAndIconOfCard";
import {
  getBiServicesFromProductCategory,
  getCloudServices,
  getInstancesServices,
} from "Redux/BIMapping/BIMappingThunk";
import {
  PRODUCT_CATEGORY_ENUM,
  SERVICES_CATEGORY_OF_THREE_TIER_ENUM,
  ADD_PRODUCT_ENUMS,
} from "Utils";
import { navigateRouter } from "Utils/Navigate/navigateRouter";
import { connect } from "react-redux";
import status from "Redux/Constants/CommonDS";
import Loader from "Components/Loader";
import { APP_PREFIX_PATH } from "Configs/AppConfig";
import ManagementInfo from "../Soa/components/ManagementInfo";
import ConfigInfo from "../Soa/components/ConfigInfo";
import CommonTooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import { setProductIntoDepartment } from "Redux/BIMapping/BIMappingSlice";
import { List as ListFromVirtualized } from "react-virtualized";
import InstanceListCards from "../Components/InstanceListCards";

const HtmlTooltip = styled(({ className, ...props }) => (
  <CommonTooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: "#ffffffff",
  },
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: "#ffffffff",
    color: "rgba(0, 0, 0, 0.87)",
    maxWidth: 200,
    fontSize: theme.typography.pxToRem(12),
    border: "1px solid #dadde9",
  },
}));

let serviceTableData = [
  {
    name: "MockDB",
    port: 80,
  },
  {
    name: "DummyWebServer",
    port: 443,
  },
  {
    name: "SimulatedQueue",
    port: 443,
  },
  {
    name: "PseudoAnalytics",
    port: 21,
  },
  {
    name: "PhantomCache",
    port: 53,
  },
];

class Tier extends Component {
  tabMapping = [
    {
      image: LoadBalancerIcon,
      name: "Load Balancer",
      dataKey: "loadbalancer",
      type: ["loadbalancer"],
    },
    {
      image: IngressIcon,
      name: "Ingress",
      dataKey: "ingress",
      type: ["ingress"],
    },
    {
      image: ServiceIcon,
      name: "Service",
      dataKey: "service",
      type: ["service"],
    },
    {
      image: StarIcon,
      name: "App Topology",
      dataKey: "apptopology",
      type: ["apptopology"],
    },
  ];
  tabMappingECS = [
    {
      name: "Management Info",
      dataKey: "managementinfo",
      type: ["managementinfo"],
    },
    {
      name: "Config Info",
      dataKey: "configinfo",
      type: ["configinfo"],
    },
  ];
  showManagementInfoTab = [
    ADD_PRODUCT_ENUMS.EC2,
    ADD_PRODUCT_ENUMS.EKS,
    ADD_PRODUCT_ENUMS.ECS,
    ADD_PRODUCT_ENUMS.LAMBDA,
    ADD_PRODUCT_ENUMS.S3,
  ];
  constructor(props) {
    super(props);
    this.state = {
      currentActiveNode: "",
      activeLayer: "",
      isSelectNginxOpen: false,
      isSelectSpringBootOpen: false,
      isSelectMySQLOpen: false,
      isSelectRedisOpen: false,
      cloudServices: [],
      savedData: [],
      selectedLayer: {
        web: "",
        app: "",
        data: "",
        aux: "",
      },
      isShowDepolyedSection: false,
      selectedInstance: -1,
      selectedDeployedInstance: "",
      selectedService: [],
      savedLayer: {
        web: false,
        app: false,
        data: false,
        aux: false,
      },
      dropDownLayersData: {
        webLayer: [],
        appLayer: [],
        dataLayer: [],
        auxLayer: [],
      },
      activeTabEks: 0,
      instancesServices: [],
      cloudElementType: "",
      activeTabEcs: 0,
      clickConfigInfoIdAddEntry: "",
      clickManInfoIdAddEntry: "",
      cloudName: "",
      editStatus: false,
    };
  }

  componentDidMount = () => {
    window.addEventListener("load", this.redirectPage);
    this.props.getCloudServices();
    this.props.getBiServicesFromProductCategory({
      productCategory: PRODUCT_CATEGORY_ENUM.THREE_TIER,
    });
    this.previousDataView();
  };

  previousDataView = () => {
    let { createProductFormData } = this.props;

    if (createProductFormData["3_tierData"]) {
      try {
        let { savedLayer, savedData, selectedLayer } =
          createProductFormData["3_tierData"];
        this.setState({
          savedLayer: JSON.parse(JSON.stringify(savedLayer)),
          savedData: JSON.parse(JSON.stringify(savedData)),
          selectedLayer: JSON.parse(JSON.stringify(selectedLayer)),
        });
      } catch (error) {
        console.log(error);
      }
    }
  };

  componentWillUnmount() {
    window.removeEventListener("load", this.redirectPage);
  }

  redirectPage = () => {
    let { name } = this.getUrlDetails();
    this.props.navigate(`${APP_PREFIX_PATH}/bim/add-product/${name}`);
  };

  componentDidUpdate(prevProps, prevState) {
    if (
      prevProps.biServicesFromProductCategory.status !==
        this.props.biServicesFromProductCategory.status &&
      this.props.biServicesFromProductCategory.status === status.SUCCESS &&
      this.props.biServicesFromProductCategory?.data
    ) {
      let data = this.props.biServicesFromProductCategory?.data || [];
      this.manipulateLayersData(data);
    }

    if (
      prevProps.cloudServices.status !== this.props.cloudServices.status &&
      this.props.cloudServices.status === status.SUCCESS &&
      this.props.cloudServices?.data
    ) {
      let cloudServices = this.props.cloudServices?.data || [];
      this.setState({ cloudServices });
    }

    if (
      prevProps.instancesServices.status !==
        this.props.instancesServices.status &&
      this.props.instancesServices.status === status.SUCCESS &&
      this.props.instancesServices?.data
    ) {
      let instancesServices = this.props.instancesServices?.data || [];
      this.setState({ instancesServices });
    }
  }

  manipulateLayersData = (data) => {
    let {
      dropDownLayersData: { webLayer, appLayer, auxLayer, dataLayer },
    } = this.state;
    let SERVICES_CATEGORY = SERVICES_CATEGORY_OF_THREE_TIER_ENUM;
    webLayer = [];
    appLayer = [];
    auxLayer = [];
    dataLayer = [];
    data.forEach((service) => {
      if (service.serviceCategory === SERVICES_CATEGORY.WEB) {
        webLayer.push(service);
      } else if (service.serviceCategory === SERVICES_CATEGORY.APP) {
        appLayer.push(service);
      } else if (service.serviceCategory === SERVICES_CATEGORY.DATA) {
        dataLayer.push(service);
      } else if (service.serviceCategory === SERVICES_CATEGORY.AUX) {
        auxLayer.push(service);
      }
    });

    this.setState({
      dropDownLayersData: { webLayer, appLayer, auxLayer, dataLayer },
    });
  };

  toggleWebLayer = () => {
    let { savedLayer } = this.state;
    if (!savedLayer.web) {
      this.setState({
        isSelectNginxOpen: !this.state.isSelectNginxOpen,
      });
    }
  };

  toggleAppLayer = () => {
    let { savedLayer } = this.state;

    if (savedLayer.web && !savedLayer.app) {
      this.setState({
        isSelectSpringBootOpen: !this.state.isSelectSpringBootOpen,
      });
    }
  };

  toggleDataLayer = () => {
    let { savedLayer } = this.state;

    if (!savedLayer.data && savedLayer.app) {
      this.setState({
        isSelectMySQLOpen: !this.state.isSelectMySQLOpen,
      });
    }
  };

  toggleAuxLayer = () => {
    let { savedLayer } = this.state;
    if (savedLayer.data && !savedLayer.aux) {
      this.setState({
        isSelectRedisOpen: !this.state.isSelectRedisOpen,
      });
    }
  };

  renderDeployedInstances = () => {
    let { cloudServices, selectedDeployedInstance } = this.state;
    let cloudStatus = this.props.cloudServices?.status;
    if (cloudStatus === status.IN_PROGRESS) {
      return this.renderLoder();
    } else {
      if (cloudServices?.length) {
        return cloudServices.map((instance) => {
          let deployInstances = {
            label: instance.elementType,
            image: instance.image || deployed1,
            active: instance.id === selectedDeployedInstance ? "active" : "",
          };
          return (
            <VerticalTitleAndIconOfCard
              data={deployInstances}
              onClickCard={(title) =>
                this.onClickDeployedCard(
                  instance.id,
                  instance.name,
                  instance.elementType
                )
              }
            />
          );
        });
      } else {
        return this.renderNoDataHtml("There are no data available.");
      }
    }
  };

  onClickDeployedCard = (selectedDeployedInstance, cloudName, elementType) => {
    this.props.getInstancesServices({ cloudName, elementType });
    this.setState({
      selectedDeployedInstance,
      selectedInstance: -1,
      activeTabEks: 0,
      cloudElementType: elementType,
      cloudName,
    });
  };

  renderSelectedInstance = () => {
    let { selectedInstance, instancesServices } = this.state;
    let instanceStatus = this.props.instancesServices?.status;

    if (instanceStatus === status.IN_PROGRESS) {
      return this.renderLoder();
    } else {
      if (instancesServices?.length) {
        let preparedData = instancesServices.map((instance, index) => {
          let data = [
            {
              backgroundColor: "#FFBA69",
              label: "ID",
              value: instance.instanceId,
              style: { borderBottom: "none" },
            },
            {
              backgroundColor: "#8676FF",
              label: "Name : ",
              value: instance.instanceName,
              style: { borderBottom: "none" },
            },
            {
              backgroundColor: "#FF2D2E",
              label: "VPC Id: ",
              value: instance.productEnclaveInstanceId,
              style: { borderBottom: "none" },
            },
          ];

          let instanceData = {
            image: Aws,
            title: instance.elementType,
            data,
            id: instance.id,
            active: selectedInstance === instance.id ? "active" : "",
            rowSeperatedByline: false,
            // style: { width: "150px", minHeight: "150px" },
          };
          return instanceData;
        });
        console.log(preparedData)
        return (
          <InstanceListCards
            cards={preparedData}
            onClickCard={(details) => this.onClickInstance(details.id)}
          />
        );
      } else {
        return this.renderNoDataHtml("There are no data available.");
      }
    }
  };

  renderSelectedInstanceWrapper = () => {
    let { selectedDeployedInstance, instancesServices } = this.state;

    return selectedDeployedInstance ? (
      <Box className="deployed-section m-t-4">
        <Box className="deployed-head">
          <h4 className="m-t-0">Select Instance</h4>
        </Box>
        <Box className="deployed-content">
          <Box className="instance-list-cards">
            {this.renderSelectedInstance()}
          </Box>
        </Box>
      </Box>
    ) : (
      <></>
    );
  };

  renderDeployedInstanceWrapper = () => {
    let { isShowDepolyedSection } = this.state;
    if (isShowDepolyedSection) {
      return (
        <Box className="deployed-section">
          <Box className="deployed-head">
            <h4 className="m-t-0">Deployed to</h4>
          </Box>
          <Box className="deployed-content">
            <Box className="deployed-cards">
              {this.renderDeployedInstances()}
            </Box>
          </Box>
        </Box>
      );
    }
  };

  onClickLayerDropDown = (key, value) => {
    let { selectedLayer } = this.state;
    selectedLayer[key] = value;

    this.setState({
      selectedLayer,
      isShowDepolyedSection: true,
      isSelectNginxOpen: false,
      isSelectSpringBootOpen: false,
      isSelectMySQLOpen: false,
      isSelectRedisOpen: false,
      selectedDeployedInstance: "",
      selectedInstance: -1,
      cloudElementType: "",
    });
  };

  // Handle check box
  handleCheckBox = (event) => {
    let { selectedService } = this.state;

    let { id, checked } = event.target;

    if (checked) {
      selectedService.push(+id);
    } else {
      selectedService = selectedService.filter((value) => value !== +id);
    }

    this.setState({ selectedService });
  };

  renderTableHead = () => {
    return (
      <TableHead>
        <TableRow>
          <TableCell align="center" component="th" scope="row">
            Servicename
          </TableCell>
          <TableCell align="center">Port Details</TableCell>
          <TableCell align="center">Department URL</TableCell>
        </TableRow>
      </TableHead>
    );
  };

  renderTableBody = () => {
    let { selectedService } = this.state;
    return (
      <TableBody>
        {serviceTableData.map((service, index) => {
          return (
            <TableRow>
              <TableCell align="left">
                <Checkbox
                  className="check-box"
                  size="small"
                  id={index}
                  onChange={this.handleCheckBox}
                  checked={selectedService.includes(index)}
                />
                <span
                  onClick={() =>
                    this.handleCheckBox({
                      target: {
                        id: index,
                        checked: !selectedService.includes(index),
                      },
                    })
                  }
                >
                  {service.name}
                </span>
              </TableCell>
              <TableCell align="center">{service.port}</TableCell>
              <TableCell align="center"></TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    );
  };

  onClickSave = () => {
    let {
      savedLayer,
      savedData,
      selectedInstance,
      selectedDeployedInstance,
      selectedService,
      isShowDepolyedSection,
      cloudElementType,
      cloudName,
      selectedLayer,
    } = this.state;
    let { createProductFormData } = this.props;
    let layerName = "";

    if (!savedLayer.web) {
      savedLayer.web = true;
      layerName = "web";
    } else if (!savedLayer.app) {
      savedLayer.app = true;
      layerName = "app";
    } else if (!savedLayer.data) {
      savedLayer.data = true;
      layerName = "data";
    } else if (!savedLayer.aux) {
      savedLayer.aux = true;
      layerName = "aux";
      this.props.navigate(`${APP_PREFIX_PATH}/bim`);
    }

    savedData.push({
      layerName,
      selectedInstance,
      selectedDeployedInstance,
      selectedService,
      cloudElementType,
      cloudName,
    });

    selectedInstance = -1;
    selectedDeployedInstance = "";
    selectedService = [];
    isShowDepolyedSection = false;

    this.setState({
      savedLayer,
      savedData,
      selectedInstance,
      selectedDeployedInstance,
      selectedService,
      isShowDepolyedSection,
    });
    let passData = JSON.parse(
      JSON.stringify({
        ...createProductFormData,
        "3_tierData": { savedLayer, savedData, selectedLayer },
        soaData: null,
      })
    );
    this.props.setProductIntoDepartment(passData);
  };

  setActiveTab = (id, isECS = 0) => {
    let { activeTabEcs, activeTabEks } = this.state;
    if (isECS) {
      activeTabEcs = id;
    } else {
      activeTabEks = id;
    }
    this.setState({ activeTabEcs, activeTabEks });
  };

  onClickInstance = (selectedInstance) => {
    this.setState({ selectedInstance, selectedService: [] });
  };

  // Render loder
  renderLoder = () => {
    return (
      <Box className="d-blck text-center w-100 h-100 m-r-auto m-l-auto ">
        <Loader className="align-item-center justify-center w-100 h-100" />
      </Box>
    );
  };

  renderNoDataHtml = (text) => {
    return (
      <Box className="group-loader  h-100  m-r-auto m-l-auto  p-t-20 p-b-20">
        <h5 className="m-t-0 m-b-0">{text}</h5>
      </Box>
    );
  };

  /** Get url details. */
  getUrlDetails() {
    let name = this.props.params.name;
    return { name };
  }

  onClickEditBtn = (layerName) => {
    let { savedData, savedLayer, isShowDepolyedSection } = this.state;

    let findSaveData = savedData.find((data) => data.layerName === layerName);

    if (findSaveData) {
      let {
        selectedInstance,
        selectedDeployedInstance,
        selectedService,
        cloudElementType: elementType,
        cloudName,
      } = findSaveData;
      this.props.getInstancesServices({ cloudName, elementType });

      Object.keys(savedLayer).forEach((key) => {
        if (layerName === key) {
          savedLayer[layerName] = false;
        } else {
          let previousEditData = savedData.find(
            (data) => data.layerName === key
          );
          if (previousEditData) {
            savedLayer[key] = true;
          }
        }
      });

      this.setState({
        selectedInstance,
        selectedDeployedInstance,
        selectedService,
        savedLayer,
        cloudElementType: elementType,
        isShowDepolyedSection: true,
      });
    }
  };

  render() {
    let {
      isSelectNginxOpen,
      isSelectSpringBootOpen,
      isSelectMySQLOpen,
      isSelectRedisOpen,
      selectedLayer,
      selectedInstance,
      selectedService,
      activeTabEks,
      dropDownLayersData,
      savedLayer,
      activeTabEcs,
      isShowDepolyedSection,
      clickConfigInfoIdAddEntry,
      clickManInfoIdAddEntry,
      cloudElementType,
    } = this.state;
    let { biServicesFromProductCategory, createProductFormData } = this.props;
    let { name } = this.getUrlDetails();
    let isShowManagementInfoTab = this.showManagementInfoTab.includes(
      cloudElementType?.toUpperCase()
    );
    let isSaveEnable =
      selectedService.length || activeTabEks === 3 || isShowManagementInfoTab;

    return (
      <Box className="bimapping-container">
        <Box className="list-heading">
          <h3>3 Tier</h3>
          <Box className="breadcrumbs">
            <ul>
              <li onClick={() => this.props.navigate("/app/bim")}>
                BI-Mapping
              </li>
              <li>
                <i className="fa-solid fa-chevron-right"></i>
              </li>
              <li
                onClick={() =>
                  this.props.navigate(`/app/bim/add-product/${name}`)
                }
              >
                Add Product
              </li>
              <li>
                <i className="fa-solid fa-chevron-right"></i>
              </li>
              <li className="active">Product Category</li>
            </ul>
          </Box>
        </Box>
        <Box className="tier-container">
          <Grid
            container
            rowSpacing={1}
            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
          >
            <Grid item xs={6}>
              <Box className="topology-panel">
                <Box className="topology-panel-body">
                  <h4 className="m-t-0 m-b-0">
                    {" "}
                    MODULE : {createProductFormData.moduleName}
                  </h4>
                  {biServicesFromProductCategory.status ===
                  status.IN_PROGRESS ? (
                    this.renderLoder()
                  ) : (
                    <Box className="topology-inner-content">
                      <Box className="content-left">
                        <List>
                          <ListItem>
                            <Box className="button-box">
                              <span>
                                <img src={ChartWebLayerIcon} alt="" />
                              </span>
                              <p>Web Layer</p>
                            </Box>
                            <span>
                              <img src={RightArrow} alt="" />
                            </span>
                          </ListItem>
                          <ListItem>
                            <Box className="button-box">
                              <span>
                                <img src={ChartAppLayerIcon} alt="" />
                              </span>
                              <p>App Layer</p>
                            </Box>
                            <span>
                              <img src={RightArrow} alt="" />
                            </span>
                          </ListItem>
                          <ListItem>
                            <Box className="button-box">
                              <span>
                                <img src={DataServiceSvgrepo} alt="" />
                              </span>
                              <p>Data Layer</p>
                            </Box>
                            <span>
                              <img src={RightArrow} alt="" />
                            </span>
                          </ListItem>
                          <ListItem>
                            <Box className="button-box">
                              <span>
                                <img src={DataServiceSvgrepo} alt="" />
                              </span>
                              <p>AUX Layer</p>
                            </Box>
                            <span>
                              <img src={RightArrow} alt="" />
                            </span>
                          </ListItem>
                        </List>
                      </Box>
                      <Box className="content-middle">
                        <List>
                          <ListItem>
                            <Box className="application-balancer">
                              <Button
                                className="secondary-btn min-width"
                                variant="contained"
                              >
                                SSL
                              </Button>
                              <Box className="balancer-boxs">
                                <Box className="balancer-box">
                                  <span>
                                    <img src={bottomArrow} alt="" />
                                  </span>
                                </Box>
                              </Box>
                            </Box>
                          </ListItem>
                          <ListItem>
                            <Box className="application-balancer">
                              <Box className="mapping-fliter">
                                <Box
                                  className="fliter-toggel"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    this.toggleWebLayer();
                                  }}
                                >
                                  {selectedLayer.web || "Select"}
                                  <i className="fa-solid fa-caret-down arrow-icon"></i>
                                </Box>
                                <Box
                                  className={
                                    isSelectNginxOpen
                                      ? "fliter-collapse active"
                                      : "fliter-collapse"
                                  }
                                >
                                  <List>
                                    {dropDownLayersData.webLayer.map(
                                      (layer) => (
                                        <ListItem
                                          key={v4()}
                                          className={`${
                                            selectedLayer.web === layer.name
                                              ? "active"
                                              : ""
                                          }`}
                                          onClick={() =>
                                            this.onClickLayerDropDown(
                                              "web",
                                              layer.name
                                            )
                                          }
                                        >
                                          <i className="fa-solid fa-circle-dot"></i>{" "}
                                          <HtmlTooltip
                                            className="table-tooltip"
                                            title={layer.name}
                                          >
                                            <p>{layer.name}</p>
                                          </HtmlTooltip>
                                        </ListItem>
                                      )
                                    )}
                                  </List>
                                </Box>
                                <div
                                  className={
                                    isSelectNginxOpen
                                      ? "fliters-collapse-bg active"
                                      : "fliters-collapse-bg"
                                  }
                                  onClick={(e) => {
                                    this.toggleWebLayer();
                                  }}
                                />
                              </Box>
                              <Box className="balancer-boxs">
                                <Box className="balancer-box">
                                  <span>
                                    <img src={bottomArrow} alt="" />
                                  </span>
                                </Box>
                              </Box>
                            </Box>
                          </ListItem>
                          <ListItem
                            className={`  ${
                              dropDownLayersData.appLayer.includes(
                                selectedLayer.app
                              )
                                ? "active"
                                : ""
                            }`}
                          >
                            <Box className="application-balancer">
                              <Box className="mapping-fliter">
                                <Box
                                  className="fliter-toggel"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    this.toggleAppLayer();
                                  }}
                                >
                                  {selectedLayer.app || "Select"}
                                  <i className="fa-solid fa-caret-down arrow-icon"></i>
                                </Box>
                                <Box
                                  className={
                                    isSelectSpringBootOpen
                                      ? "fliter-collapse active"
                                      : "fliter-collapse"
                                  }
                                >
                                  <List>
                                    {dropDownLayersData.appLayer.map(
                                      (layer) => (
                                        <ListItem
                                          key={v4()}
                                          onClick={() =>
                                            this.onClickLayerDropDown(
                                              "app",
                                              layer.name
                                            )
                                          }
                                          className={`${
                                            selectedLayer.app === layer.name
                                              ? "active"
                                              : ""
                                          }`}
                                        >
                                          <i className="fa-solid fa-circle-dot"></i>
                                          <HtmlTooltip
                                            className="table-tooltip"
                                            title={layer.name}
                                          >
                                            <p>{layer.name}</p>
                                          </HtmlTooltip>
                                        </ListItem>
                                      )
                                    )}
                                  </List>
                                </Box>
                                <div
                                  className={
                                    isSelectSpringBootOpen
                                      ? "fliters-collapse-bg active"
                                      : "fliters-collapse-bg"
                                  }
                                  onClick={(e) => {
                                    this.toggleAppLayer();
                                  }}
                                />
                              </Box>
                              <Box className="balancer-boxs">
                                <Box className="balancer-box">
                                  <span>
                                    <img src={bottomArrow} alt="" />
                                  </span>
                                </Box>
                              </Box>
                            </Box>
                          </ListItem>
                          <ListItem
                            className={`  ${
                              dropDownLayersData.dataLayer.includes(
                                selectedLayer.data
                              )
                                ? "active"
                                : ""
                            }`}
                          >
                            <Box className="application-balancer">
                              <Box className="mapping-fliter">
                                <Box
                                  className="fliter-toggel"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    this.toggleDataLayer();
                                  }}
                                >
                                  {selectedLayer.data || "Select"}
                                  <i className="fa-solid fa-caret-down arrow-icon"></i>
                                </Box>
                                <Box
                                  className={
                                    isSelectMySQLOpen
                                      ? "fliter-collapse active"
                                      : "fliter-collapse"
                                  }
                                >
                                  <List>
                                    {dropDownLayersData.dataLayer.map(
                                      (layer) => (
                                        <ListItem
                                          key={v4()}
                                          onClick={() =>
                                            this.onClickLayerDropDown(
                                              "data",
                                              layer.name
                                            )
                                          }
                                          className={`${
                                            selectedLayer.data === layer.name
                                              ? "active"
                                              : ""
                                          }`}
                                        >
                                          <i className="fa-solid fa-circle-dot"></i>
                                          <HtmlTooltip
                                            className="table-tooltip"
                                            title={layer.name}
                                          >
                                            <p>{layer.name}</p>
                                          </HtmlTooltip>
                                        </ListItem>
                                      )
                                    )}
                                  </List>
                                </Box>
                                <div
                                  className={
                                    isSelectMySQLOpen
                                      ? "fliters-collapse-bg active"
                                      : "fliters-collapse-bg"
                                  }
                                  onClick={(e) => {
                                    this.toggleDataLayer();
                                  }}
                                />
                              </Box>
                              <Box className="balancer-boxs">
                                <Box className="balancer-box">
                                  <span>
                                    <img src={bottomArrow} alt="" />
                                  </span>
                                </Box>
                              </Box>
                            </Box>
                          </ListItem>
                          <ListItem
                            className={`  ${
                              dropDownLayersData.auxLayer.includes(
                                selectedLayer.aux
                              )
                                ? "active"
                                : ""
                            }`}
                          >
                            <Box className="mapping-fliter">
                              <Box
                                className="fliter-toggel"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  this.toggleAuxLayer();
                                }}
                              >
                                {selectedLayer.aux || "Select"}
                                <i className="fa-solid fa-caret-down arrow-icon"></i>
                              </Box>
                              <Box
                                className={
                                  isSelectRedisOpen
                                    ? "fliter-collapse active"
                                    : "fliter-collapse"
                                }
                              >
                                <List>
                                  {dropDownLayersData.auxLayer.map((layer) => (
                                    <ListItem
                                      key={v4()}
                                      onClick={() =>
                                        this.onClickLayerDropDown(
                                          "aux",
                                          layer.name
                                        )
                                      }
                                      className={`${
                                        selectedLayer.aux === layer.name
                                          ? "active"
                                          : ""
                                      }`}
                                    >
                                      <i className="fa-solid fa-circle-dot"></i>
                                      <HtmlTooltip
                                        className="table-tooltip"
                                        title={layer.name}
                                      >
                                        <p>{layer.name}</p>
                                      </HtmlTooltip>
                                    </ListItem>
                                  ))}
                                </List>
                              </Box>
                              <div
                                className={
                                  isSelectRedisOpen
                                    ? "fliters-collapse-bg active"
                                    : "fliters-collapse-bg"
                                }
                                onClick={(e) => {
                                  this.toggleAuxLayer();
                                }}
                              />
                            </Box>
                          </ListItem>
                        </List>
                        <Box className="check-icons-box">
                          <List>
                            {Object.keys(selectedLayer).map((key) => {
                              return (
                                <ListItem>
                                  <Box
                                    className={`d-flex align-items-center edit-icons  ${
                                      this.state.editStatus
                                        ? "delete-icons"
                                        : ""
                                    }`}
                                  >
                                    {selectedLayer[key] !== "" &&
                                    savedLayer[key] ? (
                                      <>
                                        <IconButton className="check-icon">
                                          <i class="fas fa-check"></i>
                                        </IconButton>
                                        <IconButton
                                          className="edit-icon"
                                          onClick={() => {
                                            this.onClickEditBtn(key);
                                            this.setState({
                                              editStatus: true,
                                            });
                                          }}
                                        >
                                          <i class="fas fa-edit"></i>
                                        </IconButton>
                                      </>
                                    ) : (
                                      <></>
                                    )}
                                  </Box>
                                </ListItem>
                              );
                            })}
                          </List>
                        </Box>
                      </Box>
                    </Box>
                  )}
                </Box>
              </Box>
            </Grid>

            <Grid item xs={6}>
              {isShowDepolyedSection ? (
                <Box className="nginx-cards">
                  {this.renderDeployedInstanceWrapper()}
                  {this.renderSelectedInstanceWrapper()}
                </Box>
              ) : (
                <></>
              )}
            </Grid>
          </Grid>
          {selectedInstance >= 0 ? (
            cloudElementType?.toUpperCase() === ADD_PRODUCT_ENUMS.CDN ? (
              <Box className="nginx-section">
                <Box className="tabs">
                  <List className="tabs-menu">
                    {this.tabMapping.map((tabData, index) => {
                      return (
                        <ListItem
                          key={`ops-tab-${index}`}
                          className={index === activeTabEks ? "active" : ""}
                          onClick={() => this.setActiveTab(index)}
                        >
                          <Box className="m-r-2">
                            <img src={tabData.image} alt="" />
                          </Box>
                          {tabData.name}
                        </ListItem>
                      );
                    })}
                  </List>
                  <Box className="tabs-content">
                    {activeTabEks === 0 ? (
                      <LoadBalancer
                        setNextTab={(activeTabEks) => {
                          this.setState({ activeTabEks });
                        }}
                      />
                    ) : activeTabEks === 1 ? (
                      <Ingress
                        setNextTab={(activeTabEks) => {
                          this.setState({ activeTabEks });
                        }}
                      />
                    ) : activeTabEks === 2 ? (
                      <Service
                        setNextTab={(activeTabEks) => {
                          this.setState({ activeTabEks });
                        }}
                      />
                    ) : activeTabEks === 3 ? (
                      <AppTopology />
                    ) : (
                      <></>
                    )}
                  </Box>
                </Box>
              </Box>
            ) : isShowManagementInfoTab ? (
              <Box className="nginx-section">
                <Box className="tabs">
                  <List className="tabs-menu">
                    {this.tabMappingECS.map((tabData, index) => {
                      return (
                        <ListItem
                          key={`ops-tab-${index}`}
                          className={index === activeTabEcs ? "active" : ""}
                          onClick={() => this.setActiveTab(index, 1)}
                        >
                          <Box className="m-r-2">
                            <img src={tabData.image} alt="" />
                          </Box>
                          {tabData.name}
                        </ListItem>
                      );
                    })}
                  </List>
                  <Box className="tabs-content">
                    <ManagementInfo
                      setNextTab={(activeTabEcs) => {
                        this.setState({ activeTabEcs });
                      }}
                      onClickAddEntryBtn={clickManInfoIdAddEntry}
                      selectedCloudElement={cloudElementType?.toUpperCase()}
                      style={{ display: activeTabEcs === 0 ? "block" : "none" }}
                    />

                    <ConfigInfo
                      setNextTab={(activeTabEcs) => {
                        this.setState({ activeTabEcs });
                      }}
                      onClickAddEntryBtn={clickConfigInfoIdAddEntry}
                      style={{ display: activeTabEcs === 1 ? "block" : "none" }}
                    />
                  </Box>
                </Box>
              </Box>
            ) : (
              <>
                <Box className="tier-table-section m-t-4">
                  <TableContainer className="table">
                    <Table className="overview">
                      {this.renderTableHead()}
                      {this.renderTableBody()}
                    </Table>
                  </TableContainer>
                </Box>
              </>
            )
          ) : (
            <></>
          )}

          {selectedInstance >= 0 ? (
            <Box className="width-100 m-t-3">
              <Grid
                container
                rowSpacing={1}
                columnSpacing={{ xs: 1, sm: 2, md: 3 }}
              >
                <Grid item xs={4} alignItems={"flex-start"}>
                  {isShowManagementInfoTab ? (
                    <Button
                      className={` primary-btn min-width-inherit`}
                      variant="contained"
                      onClick={() => {
                        let {
                          clickConfigInfoIdAddEntry,
                          clickManInfoIdAddEntry,
                        } = this.state;

                        if (activeTabEcs === 0) {
                          clickManInfoIdAddEntry = v4();
                        } else {
                          clickConfigInfoIdAddEntry = v4();
                        }
                        this.setState({
                          clickConfigInfoIdAddEntry,
                          clickManInfoIdAddEntry,
                        });
                      }}
                    >
                      <i className="fa-sharp fa-solid fa-plus m-r-1"></i>
                      Add Entry
                    </Button>
                  ) : (
                    <></>
                  )}
                </Grid>
                <Grid item xs={4}>
                  <Box className="d-block text-center">
                    <Button
                      className={` ${
                        isSaveEnable ? "" : "info-btn"
                      } primary-btn min-width-inherit`}
                      variant="contained"
                      onClick={() =>
                        isSaveEnable ? this.onClickSave() : <></>
                      }
                    >
                      Save
                    </Button>
                  </Box>
                </Grid>
                <Grid item xs={4}></Grid>
              </Grid>
            </Box>
          ) : (
            <></>
          )}
        </Box>
      </Box>
    );
  }
}
function mapStateToProps(state) {
  const {
    biServicesFromProductCategory,
    createProductFormData,
    cloudServices,
    instancesServices,
  } = state.biMapping;
  return {
    biServicesFromProductCategory,
    createProductFormData,
    cloudServices,
    instancesServices,
  };
}

const mapDispatchToProps = {
  getBiServicesFromProductCategory,
  getCloudServices,
  getInstancesServices,
  setProductIntoDepartment,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(navigateRouter(Tier));
