import { defineStore } from "pinia";

import globalTheme from "../../../libraries/common/global-theme.js";
import Fuse from "../../../libraries/thirdparty/cs/fuse.esm.min.js";
import addonGroupsData from "../data/addon-groups.js";
import categories from "../data/categories.js";
import exampleManifest from "../data/example-manifest.js";
import fuseOptions from "../data/fuse-options.js";
import tags from "../data/tags.js";
import bus from "../lib/eventbus.js";

let applyGlobalTheme = null;

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
    fuse: null,
    searchMsg: "",
    sidebarUrls: {},
  }),
  getters: {
    version() {
      return chrome.runtime.getManifest().version;
    },
    versionName() {
      return chrome.runtime.getManifest().version_name;
    },
    addonAmt(state) {
      return `${Math.floor(state.manifests.filter((addon) => !addon.tags.includes("easterEgg")).length / 5) * 5}+`;
    },
    selectedCategoryName(state) {
      return state.categories.find((category) => category.id === state.selectedCategory)?.name;
    },
    addonList(state) {
      if (!state.searchInput) {
        state.addonListObjs.forEach((obj) => {
          // Hide addons from _iframeSearch pseudogroup when not searching (popup)
          if (obj.group.id === "_iframeSearch") obj.matchesSearch = false;
          else obj.matchesSearch = true;
        });
        return state.addonListObjs.sort((b, a) => b.naturalIndex - a.naturalIndex);
      }

      if (!state.fuse) return [];
      const addonListObjs = Object.values(
        state.addonListObjs.reduce((acc, cur) => {
          if (
            !acc[cur.manifest._addonId] ||
            (acc[cur.manifest._addonId] && cur.group.id !== "featuredNew" && cur.group.id !== "new")
          ) {
            acc[cur.manifest._addonId] = cur;
          }
          return acc;
        }, Object.create(null))
      );
      const fuseSearch = state.fuse.search(state.searchInput).sort((a, b) => {
        // Sort very good matches at the top no matter what
        if ((a.score < 0.1) ^ (b.score < 0.1)) return a.score < 0.1 ? -1 : 1;
        // Enabled addons at top
        else return b.item._enabled - a.item._enabled;
      });
      const results = fuseSearch.map((result) =>
        addonListObjs.find((obj) => obj.manifest._addonId === result.item._addonId)
      );
      for (const obj of addonListObjs) obj.matchesSearch = results.includes(obj);
      return addonListObjs.sort((b, a) => results.indexOf(b) - results.indexOf(a));
    },
    hasNoResults() {
      return !this.addonList.some((addon) => addon.matchesSearch && addon.matchesCategory);
    },
  },
  actions: {
    initialize({ browserLevelPermissions, isIframe, searchMsg, sidebarUrls }) {
      this.browserLevelPermissions = browserLevelPermissions;
      this.searchMsg = searchMsg;
      this.sidebarUrls = sidebarUrls;
      this.addonGroups = addonGroupsData
        .filter((group) => (isIframe ? group.iframeShow : group.fullscreenShow))
        .map((group) => ({ ...group, addonIds: [...group.addonIds] }));
    },
    async loadGlobalTheme() {
      const { theme, setGlobalTheme } = await globalTheme();
      this.theme = theme;
      applyGlobalTheme = setGlobalTheme;
    },
    setTheme(mode) {
      applyGlobalTheme?.(mode);
      this.theme = mode;
    },
    loadPlaceholderAddons() {
      const exampleAddonListItem = {
        // Need to specify all used properties for reactivity!
        group: this.addonGroups[0],
        manifest: JSON.parse(JSON.stringify(exampleManifest)),
        matchesSearch: true,
        matchesCategory: true,
        naturalIndex: -1,
        headerAbove: false,
        footerBelow: false,
        duplicate: false,
      };

      setTimeout(() => {
        if (!this.loaded) {
          this.addonListObjs = Array(25)
            .fill("")
            .map(() => JSON.parse(JSON.stringify(exampleAddonListItem)));
        }
      }, 0);
    },
    loadForceEnglishSetting() {
      chrome.storage.local.get("forceEnglish", ({ forceEnglish }) => {
        this.forceEnglishSettingInitial = forceEnglish;
        this.forceEnglishSetting = forceEnglish;
      });
    },
    async getRunningAddons(manifests, addonsEnabled) {
      return new Promise((resolve) => {
        chrome.tabs.query({ currentWindow: true, active: true }, (tabs) => {
          if (!tabs[0].id) return;
          chrome.tabs.sendMessage(tabs[0].id, "getRunningAddons", { frameId: 0 }, (res) => {
            // Just so we don't get any errors in the console if we don't get any response from a non scratch tab.
            void chrome.runtime.lastError;
            const addonsCurrentlyOnTab = res ? [...res.userscripts, ...res.userstyles] : [];
            const addonsPreviouslyOnTab = res ? res.disabledDynamicAddons : [];
            resolve({ addonsCurrentlyOnTab, addonsPreviouslyOnTab });
          });
        });
      });
    },
    async loadSettingsInfo({ isIframe }) {
      return new Promise((resolve) => {
        chrome.runtime.sendMessage("getSettingsInfo", async ({ manifests, addonsEnabled, addonSettings }) => {
          this.addonSettings = addonSettings;
          const cleanManifests = [];
          let iframeData;
          if (isIframe) {
            iframeData = await this.getRunningAddons(manifests, addonsEnabled);
          }
          const deepClone = (obj) => JSON.parse(JSON.stringify(obj));
          for (const { manifest, addonId } of manifests) {
            manifest._categories = [];
            manifest._categories[0] = manifest.tags.includes("popup")
              ? "popup"
              : manifest.tags.includes("easterEgg")
                ? "easterEgg"
                : manifest.tags.includes("theme")
                  ? "theme"
                  : manifest.tags.includes("community")
                    ? "community"
                    : manifest.tags.includes("player")
                      ? "player"
                      : "editor";

            const addCategoryIfTag = (arr) => {
              let count = 0;
              for (const objOrString of arr) {
                const tagName = typeof objOrString === "object" ? objOrString.tag : objOrString;
                const categoryName = typeof objOrString === "object" ? objOrString.category : tagName;
                if (manifest.tags.includes(tagName)) {
                  manifest._categories.push(categoryName);
                  count++;
                }
              }
              return count;
            };
            if (manifest._categories[0] === "theme") {
              // All themes should have either the "editor", "community" or "player" tag
              addCategoryIfTag([
                {
                  tag: "editor",
                  category: "themesForEditor",
                },
              ]) ||
                addCategoryIfTag([
                  {
                    tag: "community",
                    category: "themesForWebsite",
                  },
                ]) ||
                addCategoryIfTag([
                  {
                    tag: "player",
                    category: "themesForPlayer",
                  },
                ]);
            } else if (manifest._categories[0] === "editor") {
              const addedCategories = addCategoryIfTag(["codeEditor", "costumeEditor"]);
              if (addedCategories === 0) manifest._categories.push("editorOthers");
            } else if (manifest._categories[0] === "community") {
              const addedCategories = addCategoryIfTag(["profiles", "projectPage", "forums"]);
              if (addedCategories === 0) manifest._categories.push("communityOthers");
            }

            // Exception: show cat-blocks after konami code, even tho
            // it's categorized as an editor addon, not as easterEgg
            if (addonId === "cat-blocks") manifest._categories.push("easterEgg");

            manifest._icon = manifest._categories[0];

            manifest._enabled = addonsEnabled[addonId];
            manifest._wasEverEnabled = manifest._enabled;
            manifest._addonId = addonId;
            manifest._groups = [];

            if (manifest.versionAdded) {
              const [extMajor, extMinor, _] = this.version.split(".");
              const [addonMajor, addonMinor, __] = manifest.versionAdded.split(".");
              if (extMajor === addonMajor && extMinor === addonMinor) {
                manifest.tags.push("new");
                manifest._groups.push(
                  manifest.tags.includes("recommended") || manifest.tags.includes("featured") ? "featuredNew" : "new"
                );
              }
            }

            if (manifest.latestUpdate) {
              const [extMajor, extMinor, _] = this.version.split(".");
              const [addonMajor, addonMinor, __] = manifest.latestUpdate.version.split(".");
              if (extMajor === addonMajor && extMinor === addonMinor) {
                manifest.tags.push(manifest.latestUpdate.newSettings?.length ? "updatedWithSettings" : "updated");
                manifest._groups.push(manifest.latestUpdate.isMajor ? "featuredNew" : "new");
              }
            }

            // Sort tags to preserve consistent order
            const order = tags.map((obj) => obj.matchName);
            manifest.tags.sort((b, a) => order.indexOf(b) - order.indexOf(a));

            // Iframe only
            if (iframeData?.addonsCurrentlyOnTab.includes(addonId)) manifest._groups.push("runningOnTab");
            else if (iframeData?.addonsPreviouslyOnTab.includes(addonId)) manifest._groups.push("recentlyUsed");

            if (manifest._enabled) manifest._groups.push("enabled");
            else {
              // Addon is disabled
              if (manifest.tags.includes("recommended")) manifest._groups.push("recommended");
              else if (manifest.tags.includes("featured")) manifest._groups.push("featured");
              else if (manifest.tags.includes("beta") || manifest.tags.includes("danger")) manifest._groups.push("beta");
              else if (manifest.tags.includes("forums")) manifest._groups.push("forums");
              else manifest._groups.push("others");
            }

            for (const groupId of manifest._groups) {
              this.addonGroups.find((g) => g.id === groupId)?.addonIds.push(manifest._addonId);
            }
            cleanManifests.push(deepClone(manifest));
          }

          for (const { manifest } of manifests) {
            if (manifest.relatedAddons) {
              manifest._relatedAddons = manifest.relatedAddons.map(
                (relatedAddonId) =>
                  manifests.find(({ addonId }) => addonId === relatedAddonId)?.manifest ??
                  console.warn(
                    "Invalid related addon:",
                    relatedAddonId,
                    "found on addon manifest of:",
                    manifest._addonId
                  )
              );
            }
          }

          // Manifest objects will now be owned by Vue
          for (const key of Object.keys(this.manifestsById)) delete this.manifestsById[key];
          for (const { manifest } of manifests) {
            this.manifestsById[manifest._addonId] = manifest;
          }
          this.manifests = manifests.map(({ manifest }) => manifest);

          this.fuse = new Fuse(cleanManifests, fuseOptions);

          const checkTag = (tagOrTags, manifestA, manifestB) => {
            const tags = Array.isArray(tagOrTags) ? tagOrTags : [tagOrTags];
            const aHasTag = tags.some((tag) => manifestA.tags.includes(tag));
            const bHasTag = tags.some((tag) => manifestB.tags.includes(tag));
            if (aHasTag ^ bHasTag) {
              // If only one has the tag
              return bHasTag - aHasTag;
            } else if (aHasTag && bHasTag) return manifestA.name.localeCompare(manifestB.name);
            else return null;
          };
          const order = [["danger", "beta"], "editor", "player", "community", "popup"];

          this.addonGroups.forEach((group) => {
            group.addonIds = group.addonIds
              .map((id) => this.manifestsById[id])
              .sort((manifestA, manifestB) => {
                for (const tag of group.customOrder || order) {
                  const val = checkTag(tag, manifestA, manifestB);
                  if (val !== null) return val;
                }
                return 0; // just to suppress linter
              })
              .map((addon) => addon._addonId);
          });

          if (isIframe) {
            const addonsInGroups = [];
            for (const group of this.addonGroups) group.addonIds.forEach((addonId) => addonsInGroups.push(addonId));
            const searchGroup = this.addonGroups.find((group) => group.id === "_iframeSearch");
            searchGroup.addonIds = Object.keys(this.manifestsById).filter(
              (addonId) => addonsInGroups.indexOf(addonId) === -1
            );
          }

          let naturalIndex = 0; // Index when not searching
          for (const group of this.addonGroups) {
            group.addonIds.forEach((addonId, groupIndex) => {
              const cachedObj = this.addonListObjs.find((o) => o.manifest._addonId === "example");
              const obj = cachedObj || {};
              // Some addons might be twice in the list, such as in "new" and "enabled"
              // Before setting manifest, check whether this object will be a duplicate.
              obj.duplicate = Boolean(this.addonListObjs.find((addon) => addon.manifest._addonId === addonId));
              obj.manifest = this.manifestsById[addonId];
              obj.group = group;
              obj.matchesSearch = false; // Later set to true by this.addonList if needed
              const shouldHideAsEasterEgg =
                obj.manifest._categories[0] === "easterEgg" && obj.manifest._enabled === false;
              obj.matchesCategory = !shouldHideAsEasterEgg;
              obj.naturalIndex = naturalIndex;
              obj.headerAbove = groupIndex === 0;
              obj.footerBelow = groupIndex === group.addonIds.length - 1;
              if (!cachedObj) this.addonListObjs.push(obj);
              naturalIndex++;
            });
          }
          // Remove unused remaining cached objects. Can only happen in iframe mode
          this.addonListObjs = this.addonListObjs.filter((o) => o.manifest._addonId !== "example");

          this.loaded = true;

          let binaryNum = "";
          manifests.forEach(({ addonId }) => (binaryNum += addonsEnabled[addonId] === true ? "1" : "0"));
          const addonsEnabledBase36 = BigInt(`0b${binaryNum}`).toString(36);
          this.sidebarUrls.feedback += `#_${addonsEnabledBase36}`;
          resolve();
        });
      });
    },
    updateCategoryMatches() {
      this.addonListObjs.forEach((obj) => {
        const shouldHideAsEasterEgg =
          obj.manifest._categories[0] === "easterEgg" &&
          this.selectedCategory !== "easterEgg" &&
          obj.manifest._wasEverEnabled === false;
        obj.matchesCategory =
          !shouldHideAsEasterEgg &&
          (this.selectedCategory === "all" || obj.manifest._categories.includes(this.selectedCategory));
      });
      if (this.selectedCategory === "forums") this.addonGroups.find((group) => group.id === "forums").expanded = true;
    },
    msg(message, ...params) {
      return chrome.i18n.getMessage(message, ...params);
    },
    updateSettings(addon, { wait = 0, settingId = null } = {}) {
      const value = settingId && this.addonSettings[addon._addonId][settingId];
      setTimeout(() => {
        if (!settingId || this.addonSettings[addon._addonId][settingId] === value) {
          chrome.runtime.sendMessage({
            changeAddonSettings: { addonId: addon._addonId, newSettings: this.addonSettings[addon._addonId] },
          });
          console.log("Updated", this.addonSettings[addon._addonId]);
        }
      }, wait);
    },
    closePickers(e, leaveOpen, { callCloseDropdowns = true } = {}) {
      bus.$emit("close-pickers", leaveOpen);
      if (callCloseDropdowns) this.closeDropdowns();
    },
    closeDropdowns(e, leaveOpen) {
      bus.$emit("close-dropdowns", leaveOpen);
    },
    openRelatedAddons(addonManifest, log = true) {
      this.relatedToAddonName = addonManifest.name;
      this.relatedAddons.length = 0;
      if (this.relatedAddonsHistory.length === 0) {
        this.previousCategory = this.selectedCategory;
        this.selectedCategory = "all";
        this.relatedAddonsOpen = true;
      }
      if (log) this.relatedAddonsHistory.push(addonManifest);
      for (const relatedManifest of addonManifest._relatedAddons) {
        this.relatedAddons.push(relatedManifest);
      }
    },
    blinkAddon(addonId) {
      setTimeout(() => {
        const addonElem = document.getElementById("addon-" + addonId);
        if (!addonElem) return;
        addonElem.scrollIntoView();
        // Browsers sometimes ignore :target for the elements dynamically appended.
        // Use CSS class to initiate the blink animation.
        addonElem.classList.add("addon-blink");
        // 2s (animation length) + 1ms
        setTimeout(() => addonElem.classList.remove("addon-blink"), 2001);
      }, 0);
    },
  },
});
