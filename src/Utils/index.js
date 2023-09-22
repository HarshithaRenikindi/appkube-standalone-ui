export const getCurrentUser = () => {
  const user = localStorage.getItem("currentUser");
  if (user) {
    return JSON.parse(user);
  }
  return null;
};

export const setCurrentUser = (user) => {
  if (user) {
    localStorage.setItem("currentUser", JSON.stringify(user));
  }
};

export const getCurrentOrgId = () => {
  return localStorage.getItem("currentOrgId");
};

export const getSavedUserName = () => {
  return localStorage.getItem("rememberUserName");
};

export const setCurrentOrgId = (id) => {
  return localStorage.setItem("currentOrgId", id);
};

export const getRecentVisitedEnvironments = () => {
  const recentEnvs = localStorage.getItem("recentEnv");
  if (recentEnvs) {
    return JSON.parse(recentEnvs);
  }
  return null;
};

export const setRecentVisitedEnvironments = (recentEnvs) => {
  if (recentEnvs) {
    localStorage.setItem("recentEnv", JSON.stringify(recentEnvs));
  }
};

export const cloudwiseSpendColor = {
  aws: "#ff9900",
  azure: "#0089d6",
  gcp: "#da4f44",
};

export const setCurrentOrgName = (name) => {
  return localStorage.setItem("currentOrgName", name);
};

export const getCurrentOrgName = () => {
  return localStorage.getItem("currentOrgName");
};

export const upperCaseLengthInStr = (string) => {
  let str = "" + string;
  return str.length - str.replace(/[A-Z]/g, "").length;
};

export const lowerCaseLengthInStr = (string) => {
  let str = "" + string;
  return str.length - str.replace(/[a-z]/g, "").length;
};
