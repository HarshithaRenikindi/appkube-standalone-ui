import Aws from "assets/img/aws.png";
import Microsoftazure from "assets/img/microsoftazure.png";
import GoogleCloud from "assets/img/google-cloud.png";
import Kubernetes from "assets/img/kubernetes.png";

export const SERVICE_NAMES = {
  AWS: "Amazon web services",
  GCP: "Google Cloud Platform",
  AZURE: "AZURE",
};

export const LOGOS = {
  AWS: Aws,
  AZURE: Microsoftazure,
  GCP: GoogleCloud,
  KUBERNETES: Kubernetes,
};

export const SERVICE_TYPE = {
  BUSINESS: "BUSINESS",
  COMMON: "COMMON",
};

export const GRANULARITY_TYPE = {
  DAILY: "DAILY",
  WEEKLY: "WEEKLY",
  MONTHLY: "MONTHLY",
  QUARTERLY: "QUARTERLY",
  HALF_YEARLY: "HALF-YEARLY",
  YEARLY: "YEARLY",
};

export const REPORT_PAGE_TYPE = {
  SERVICE_NAMES: {
    TOTAL_LAST_MONT_SPEND: "Last #granularity# Spend",
    TOTAL_THIS_MONT_SPEND: "#granularity# to date spend",
    FORECASTED_SPEND: "Forecasted Spend",
    AVG_DAILY_SPEND: "Avg #granularity# Spend",
    LAST_MONTH_SPEND: "Last #granularity# Spend",
    MONTH_TO_DATE_SPEND: "#granularity# to date spend",
  },
  SPEND_OVERVIEW_SERVICE_CATEGORY: {
    COMPUTE: "COMPUTE",
    STORAGE: "STORAGE",
    DATABASE: "DATABASE",
    NETWORK: "NETWORK",
    OTHER: "OTHER",
  },
};

export const GRANULARITY_DROPDOWN_DATA = [
  {
    key: GRANULARITY_TYPE.DAILY.toLowerCase(),
    value: "Last Day",
  },
  {
    key: GRANULARITY_TYPE.WEEKLY.toLowerCase(),
    value: "Last Week",
  },
  {
    key: GRANULARITY_TYPE.MONTHLY.toLowerCase(),
    value: "Last Month",
  },
  {
    key: GRANULARITY_TYPE.QUARTERLY.toLowerCase(),
    value: "Last Quarter",
  },
  {
    key: GRANULARITY_TYPE.YEARLY.toLowerCase(),
    value: "Last Year",
  },
];

export const TENURE_TYPE = {
  CURRENT: "CURRENT",
  FORCAST: "FORCAST",
  PREVIOUS: "PREVIOUS",
};

export const SUMMARY_INSTANCE_TYPE = {
  PREVIOUS_TOTAL: "PREVIOUS_TOTAL",
  CURRENT_TOTAL: "CURRENT_TOTAL",
  PERCENTAGE: "PERCENTAGE",
};

export const BI_MAPPING_TYPE = {
  ORGANIZATION: "organization",
  DEPARTMENT: "department",
  PRODUCT: "product",
  PRODUCT_ENVS: "productEnvs",
  ELEMENT_TYPE: "elementType",
  ELEMENT_INSTANCE_TYPE: "elementInstanceType",
};
