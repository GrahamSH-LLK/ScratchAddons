import { defineStore } from "pinia";

import addonGroupsData from "../data/addon-groups.js";
import categories from "../data/categories.js";

export const useSettingsStore = defineStore("settings", {
  state: () => ({
    smallMode: false,
    devMode: false,
    theme: false,
    forceEnglishSetting: null,
    forceEnglishSettingInitial: null,
    relatedAddonsOpen: false,
    relatedToAddonName: null,
    relatedAddons: [],
    relatedAddonsHistory: [],
    categoryOpen: true,
    loaded: false,
    manifests: [],
    manifestsById: {},
    selectedCategory: "all",
    previousCategory: "all",
    searchInput: "",
    searchInputReal: "",
    addonSettings: {},
    addonToEnable: null,
    showPopupModal: false,
    addonGroups: [],
    categories,
    browserLevelPermissions: [],
    grantedOptionalPermissions: [],
    addonListObjs: [],
    searchMsg: "",
    sidebarUrls: {},
  }),
  actions: {
    initialize({ browserLevelPermissions, initialTheme, isIframe, searchMsg, sidebarUrls }) {
      this.browserLevelPermissions = browserLevelPermissions;
      this.theme = initialTheme;
      this.searchMsg = searchMsg;
      this.sidebarUrls = sidebarUrls;
      this.addonGroups = addonGroupsData.filter((group) => (isIframe ? group.iframeShow : group.fullscreenShow));
    },
  },
});
