<template>
  <div class="navbar">
    <button
      id="sidebar-toggle"
      class="header-button"
      :class="{ sidebarToggleOpen: categoryOpen === true }"
      :title="msg('toggleSidebar')"
      @click="sidebarToggle()"
      v-show="smallMode"
    >
      <img src="../../images/icons/menu.svg" draggable="false" />
    </button>
    <img src="../../images/icon-transparent.svg" class="logo" alt="Logo" draggable="false" />
    <h1>{{ msg("settings") }}</h1>
    <button
      @click="setTheme(!theme)"
      class="header-button header-end"
      :title="msg(theme ? 'switchDark' : 'switchLight')"
    >
      <img class="theme-switch" :src="themePath" draggable="false" />
    </button>
  </div>
  <div class="main">
    <div
      class="categories-block"
      v-click-outside="closesidebar"
      v-show="!isIframe"
      :class="{ closed: categoryOpen === false, smallMode: smallMode === true }"
    >
      <category-selector v-for="category of categories" :key="category.id" :category="category"></category-selector>

      <a class="category" style="margin-top: auto" :href="sidebarUrls.contributors" target="_blank">
        <img src="../../images/icons/users.svg" draggable="false" />
        <span>{{ msg("credits") }} <img src="../../images/icons/popout.svg" draggable="false" /></span>
      </a>
      <a class="category" href="https://scratchaddons.com/translate" target="_blank">
        <img src="../../images/icons/translate.svg" draggable="false" />
        <span>{{ msg("translate") }} <img src="../../images/icons/popout.svg" draggable="false" /></span>
      </a>
      <a class="category" :href="sidebarUrls.feedback" target="_blank">
        <img src="../../images/icons/comment.svg" draggable="false" />
        <span>{{ msg("feedback") }} <img src="../../images/icons/popout.svg" draggable="false" /></span>
      </a>
      <button class="category" style="margin-top: 12px; margin-bottom: 14px" @click="openMoreSettings()">
        <img src="../../images/icons/wrench.svg" draggable="false" />
        <span>{{ msg("moreSettings") }}</span>
      </button>
    </div>
    <button
      v-show="!isIframe && smallMode === false"
      class="categories-shrink"
      @click="sidebarToggle()"
      :title="msg('toggleSidebar')"
    >
      <img
        src="../../images/icons/left-arrow.svg"
        :class="{ flipped: categoryOpen === (direction() === 'rtl') }"
        draggable="false"
      />
    </button>

    <!-- This is the main menu, where the searchbar and the addon items are located -->
    <div class="addons-block">
      <div class="addons-block-header">
        <div v-if="!isIframe" class="category-header-title">
          <div v-if="relatedAddonsOpen" class="related-addons-header">
            <button class="arrow-button" :title="msg('back')" @click="backRelatedAddon()">
              <img src="../../images/icons/left-arrow.svg" draggable="false" />
            </button>
            <span>{{ msg("relatedTo", relatedToAddonName) }}</span>
          </div>
          <span v-else>{{ selectedCategoryName }}</span>
        </div>
        <div class="search-box" v-if="!relatedAddonsOpen" :class="{ smallMode: smallMode === true }">
          <input type="text" id="searchBox" :placeholder="searchMsg" v-model="searchInputReal" autofocus />
          <button disabled v-if="searchInput === ''">
            <img src="../../images/icons/search.svg" class="search-icon" />
          </button>
          <button v-else @click="clearAndFocusSearch()">
            <img src="../../images/icons/x.svg" class="search-icon" />
          </button>
        </div>
      </div>

      <div class="addons-container" :class="{ placeholder: !loaded }">
        <p v-if="searchInput && hasNoResults" id="search-not-found">{{ msg("searchNotFound") }}</p>
        <template v-if="relatedAddonsOpen">
          <addon-body
            v-for="addonManifest of relatedAddons"
            :key="addonManifest._addonId"
            :visible="true"
            :addon="addonManifest"
            group-id="enabled"
            :group-expanded="true"
          ></addon-body>
        </template>
        <template v-else>
          <div v-for="addon of addonList" :key="addon.manifest._addonId">
            <div
              id="iframe-fullscreen-suggestion"
              v-if="isIframe && addon.headerAbove && (hasNoResults || addon.group.id === 'enabled')"
              v-show="searchInput === ''"
            >
              <span>{{ msg("exploreAllAddons", [addonAmt]) }}</span>
              <button class="large-button" @click="openFullSettings()">{{ msg("openFullSettings") }}</button>
            </div>
            <addon-group-header
              v-if="addon.headerAbove"
              :group="addon.group"
              :shown-count="groupShownCount(addon.group)"
              :margin-above="groupMarginAbove(addon.group)"
            ></addon-group-header>
            <addon-body
              :visible="addon.matchesSearch && addon.matchesCategory"
              :addon="addon.manifest"
              :group-id="addon.group.id"
              :group-expanded="addon.group.expanded"
            ></addon-body>
          </div>
        </template>
      </div>
    </div>
  </div>
  <modal class="more-settings" :is-open.sync="moreSettingsOpen" :title="msg('moreSettings')" ref="moreSettings">
    <div class="addon-block settings-block">
      <div class="addon-body">
        <div class="addon-topbar">
          <img src="../../images/icons/theme.svg" class="icon-type addon-icon" draggable="false" />
          <span class="addon-name-and-tags">{{ msg("scratchAddonsTheme") }}</span>
        </div>
        <div class="addon-settings">
          <span class="addon-description-full">{{ msg("scratchAddonsThemeDescription") }}</span>
          <div class="addon-setting">
            <div class="filter-selector">
              <div class="filter-text">{{ msg("theme") }}</div>
              <div class="filter-options" role="radiogroup">
                <div>
                  <input
                    type="radio"
                    name="theme-selector"
                    id="theme-select-light"
                    :checked="theme === true"
                    @change="setTheme(true)"
                  />
                  <label for="theme-select-light" class="filter-option">{{ msg("light") }}</label>
                </div>
                <div>
                  <input
                    type="radio"
                    name="theme-selector"
                    id="theme-select-dark"
                    :checked="theme === false"
                    @change="setTheme(false)"
                  />
                  <label for="theme-select-dark" class="filter-option">{{ msg("dark") }}</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="addon-body">
        <div class="addon-topbar">
          <img
            src="../../images/icons/import-export.svg"
            class="icon-type addon-icon"
            :class="{ dark: theme === false }"
            draggable="false"
          />
          <span class="addon-name-and-tags">{{ msg("exportAndImportSettings") }}</span>
        </div>
        <div class="addon-settings">
          <span class="addon-description-full">{{ msg("exportAndImportSettingsDescription") }}</span>
          <span class="addon-description-full">{{ msg("useBrowserSync") }}</span>
          <div class="addon-setting export-actions">
            <div class="export-actions-group">
              <button class="large-button" @click="exportSettings()">{{ msg("export") }}</button>
              <button class="large-button" @click="importSettings()">{{ msg("import") }}</button>
              <button class="large-button hidden-button" id="confirmImport">{{ msg("confirmImport") }}</button>
            </div>
            <div class="export-actions-group">
              <button class="large-button" @click="viewSettings()">{{ msg("viewSettings") }}</button>
            </div>
          </div>
        </div>
      </div>
      <div class="addon-body">
        <div class="addon-topbar">
          <img src="../../images/icons/translate.svg" class="icon-type addon-icon" draggable="false" />
          <span class="addon-name-and-tags">{{ msg("language") }}</span>
        </div>
        <div class="addon-settings">
          <div class="addon-setting" style="margin-top: 0">
            <input
              type="checkbox"
              class="switch"
              v-model="forceEnglishSetting"
              style="margin-inline-start: 0; margin-inline-end: 8px"
            />
            <span>Show addon names and descriptions in English</span>
            <div class="badge red">{{ msg("beta") }}</div>
            <button
              class="large-button"
              id="applyLanguageSettingsButton"
              v-show="forceEnglishSetting !== null && forceEnglishSetting !== this.forceEnglishSettingInitial"
              @click="applyLanguageSettings()"
              style="margin-inline-start: 16px"
            >
              {{ msg("applySettings") }}
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <p>
        {{ msg("extensionName") }}
        <a
          href="https://scratchaddons.com/changelog"
          :href="sidebarUrls.changelog"
          title="{{ msg('changelog') }}"
          target="_blank"
        >
          v{{ version }}</a
        >
      </p>
      <p>
        <a
          href="./licenses.html?libraries=icu-message-formatter,vue,color-picker-web-component,comlink,Sora,fuse,idb,sortable,Roboto"
          target="_blank"
          >{{ msg("libraryCredits") }}</a
        >
      </p>
    </div>
  </modal>
  <div class="popup" v-show="showPopupModal">
    <div class="label">{{ msg("settingsPagePermission", addonToEnable ? addonToEnable.name : "") }}</div>
    <div>
      <button class="large-button" @click="openFullSettings()">{{ msg("openFullSettings") }}</button>
      <button class="large-button" @click="hidePopup()">{{ msg("skipOpenFullSettings") }}</button>
    </div>
  </div>
</template>

<script setup>
import downloadBlob from "../../libraries/common/cs/download-blob.js";
import getDirection from "../public/rtl-list.js";
import Fuse from "../../libraries/thirdparty/cs/fuse.esm.min.js";
import tags from "./data/tags.js";
import addonGroupsData from "./data/addon-groups.js";
import categories from "./data/categories.js";
import exampleManifest from "./data/example-manifest.js";
import fuseOptions from "./data/fuse-options.js";
import globalTheme from "../../libraries/common/global-theme.js";
import { deserializeSettings, serializeSettings } from "./settings-utils.js";
import { isFirefox } from "../../libraries/common/cs/detect-browser.js";
import bus from "./lib/eventbus";
import { computed, onMounted, reactive, ref, watch } from "vue";

import AddonBody from "./components/addon-body.vue";
import AddonGroupHeader from "./components/addon-group-header.vue";
import CategorySelector from "./components/category-selector.vue";
import Modal from "./components/modal.vue";

const MORE_SETTINGS_HASH = "#moresettings";
const ADDON_HASH_PREFIX = "#addon-";

let isIframe = false;
if (window.parent !== window) {
  // We're in a popup!
  document.body.classList.add("iframe");
  isIframe = true;
}

let fuse;

const { theme: initialTheme, setGlobalTheme } = await globalTheme();

// REMINDER: update similar code at /background/imports/util.js
const browserLevelPermissions = ["notifications"];
if (isFirefox()) {
  if (typeof Clipboard.prototype.write !== "function") {
    // Firefox 109-126 only
    browserLevelPermissions.push("clipboardWrite");
  }
}
const grantedOptionalPermissions = ref([]);
const updateGrantedPermissions = () =>
  chrome.permissions.getAll(({ permissions }) => {
    grantedOptionalPermissions.value = permissions.filter((p) => browserLevelPermissions.includes(p));
  });
updateGrantedPermissions();
chrome.permissions.onAdded?.addListener(updateGrantedPermissions);
chrome.permissions.onRemoved?.addListener(updateGrantedPermissions);

const smallMode = ref(false);
const devMode = ref(false);
const theme = ref(initialTheme);
const forceEnglishSetting = ref(null);
const forceEnglishSettingInitial = ref(null);
const relatedAddonsOpen = ref(false);
const relatedToAddonName = ref(null);
const relatedAddons = reactive([]);
const relatedAddonsHistory = reactive([]);
const categoryOpen = ref(true);
const loaded = ref(false);
const manifests = ref([]);
const manifestsById = reactive({});
const selectedCategory = ref("all");
const previousCategory = ref("all");
const searchInput = ref("");
const searchInputReal = ref("");
const addonSettings = ref({});
const addonToEnable = ref(null);
const showPopupModal = ref(false);
const addonGroups = reactive(addonGroupsData.filter((g) => (isIframe ? g.iframeShow : g.fullscreenShow)));
const searchMsg = msg("search");
const addonListObjs = ref([]);
const sidebarUrls = reactive(
  (() => {
    const uiLanguage = chrome.i18n.getUILanguage();
    const localeSlash = uiLanguage.startsWith("en") ? "" : `${uiLanguage.split("-")[0]}/`;
    const version = chrome.runtime.getManifest().version;
    const versionName = chrome.runtime.getManifest().version_name;
    const utm = `utm_source=extension&utm_medium=settingspage&utm_campaign=v${version}`;
    return {
      contributors: `https://scratchaddons.com/${localeSlash}credits?${utm}`,
      feedback: `https://scratchaddons.com/${localeSlash}feedback/?ext_version=${versionName}&${utm}`,
      changelog: `https://scratchaddons.com/${localeSlash}changelog?${utm}`,
    };
  })()
);

const themePath = computed(() => (theme.value ? "../../images/icons/moon.svg" : "../../images/icons/theme.svg"));
const addonList = computed(() => {
  if (!searchInput.value) {
    addonListObjs.value.forEach((obj) => {
      // Hide addons from _iframeSearch pseudogroup when not searching (popup)
      if (obj.group.id === "_iframeSearch") obj.matchesSearch = false;
      else obj.matchesSearch = true;
    });
    return addonListObjs.value.sort((b, a) => b.naturalIndex - a.naturalIndex);
  }

  if (!fuse) return [];
  const addonListObjects = Object.values(
    addonListObjs.value.reduce((acc, cur) => {
      if (
        !acc[cur.manifest._addonId] ||
        (acc[cur.manifest._addonId] && cur.group.id !== "featuredNew" && cur.group.id !== "new")
      ) {
        acc[cur.manifest._addonId] = cur;
      }
      return acc;
    }, Object.create(null))
  );
  const fuseSearch = fuse.search(searchInput.value).sort((a, b) => {
    // Sort very good matches at the top no matter what
    if ((a.score < 0.1) ^ (b.score < 0.1)) return a.score < 0.1 ? -1 : 1;
    // Enabled addons at top
    else return b.item._enabled - a.item._enabled;
  });
  const results = fuseSearch.map((result) =>
    addonListObjects.find((obj) => obj.manifest._addonId === result.item._addonId)
  );
  for (const obj of addonListObjects) obj.matchesSearch = results.includes(obj);
  return addonListObjects.sort((b, a) => results.indexOf(b) - results.indexOf(a));
});
const hasNoResults = computed(() => !addonList.value.some((addon) => addon.matchesSearch && addon.matchesCategory));
const version = computed(() => chrome.runtime.getManifest().version);
const versionName = computed(() => chrome.runtime.getManifest().version_name);
const addonAmt = computed(
  () => `${Math.floor(manifests.value.filter((addon) => !addon.tags.includes("easterEgg")).length / 5) * 5}+`
);
const selectedCategoryName = computed(
  () => categories.find((category) => category.id === selectedCategory.value)?.name
);

function openMoreSettings() {
  closePickers();
  moreSettings.value.openModal();
  if (smallMode.value) {
    sidebarToggle();
  }
  location.hash = "";
}
function openRelatedAddons(addonManifest, log = true) {
  relatedToAddonName.value = addonManifest.name;
  relatedAddons.length = 0;
  if (relatedAddonsHistory.length === 0) {
    previousCategory.value = selectedCategory.value;
    selectedCategory.value = "all";
    relatedAddonsOpen.value = true;
  }
  if (log) relatedAddonsHistory.push(addonManifest);
  for (const relatedManifest of addonManifest._relatedAddons) {
    relatedAddons.push(relatedManifest);
  }
}
function backRelatedAddon() {
  const addon = relatedAddonsHistory.pop();
  if (relatedAddonsHistory.length === 0) {
    relatedAddonsOpen.value = false;
    selectedCategory.value = previousCategory.value;
  } else {
    openRelatedAddons(relatedAddonsHistory.at(-1), false);
  }
  blinkAddon(addon._addonId);
}
function blinkAddon(addonId) {
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
}
function sidebarToggle() {
  categoryOpen.value = !categoryOpen.value;
}
function msg(message, ...params) {
  return chrome.i18n.getMessage(message, ...params);
}
function direction() {
  return getDirection(chrome.i18n.getUILanguage());
}
function clearSearch() {
  searchInputReal.value = "";
}
function clearAndFocusSearch() {
  clearSearch();
  document.querySelector("#searchBox").focus();
}
function setTheme(mode) {
  setGlobalTheme(mode);
  theme.value = mode;
}
function updateSettings(addon, { wait = 0, settingId = null } = {}) {
  const value = settingId && addonSettings.value[addon._addonId][settingId];
  setTimeout(() => {
    if (!settingId || addonSettings.value[addon._addonId][settingId] === value) {
      chrome.runtime.sendMessage({
        changeAddonSettings: { addonId: addon._addonId, newSettings: addonSettings.value[addon._addonId] },
      });
      console.log("Updated", addonSettings.value[addon._addonId]);
    }
  }, wait);
}
function closePickers(e, leaveOpen, { callCloseDropdowns = true } = {}) {
  bus.$emit("close-pickers", leaveOpen);
  if (callCloseDropdowns) closeDropdowns();
}
function closeDropdowns(e, leaveOpen) {
  bus.$emit("close-dropdowns", leaveOpen);
}
function exportSettings() {
  serializeSettings().then((serialized) => {
    const blob = new Blob([serialized], { type: "application/json" });
    downloadBlob("scratch-addons-settings.json", blob);
  });
  // See also unsupported-browser.js
}
function viewSettings() {
  const openedWindow = window.open("about:blank");
  serializeSettings().then((serialized) => {
    const blob = new Blob([serialized], { type: "text/plain" });
    openedWindow.location.replace(URL.createObjectURL(blob));
  });
  // See also unsupported-browser.js
}
function importSettings() {
  const inputElem = Object.assign(document.createElement("input"), {
    hidden: true,
    type: "file",
    accept: "application/json",
  });
  inputElem.addEventListener(
    "change",
    async () => {
      const file = inputElem.files[0];
      if (!file) {
        inputElem.remove();
        alert(chrome.i18n.getMessage("fileNotSelected"));
        return;
      }
      const text = await file.text();
      inputElem.remove();
      const confirmElem = document.getElementById("confirmImport");
      try {
        await deserializeSettings(text, manifests.value, confirmElem, { browserLevelPermissions });
      } catch (e) {
        console.warn("Error when importing settings:", e);
        confirmElem.classList.add("hidden-button");
        alert(chrome.i18n.getMessage("importFailed"));
        return;
      }
      alert(chrome.i18n.getMessage("importSuccess"));
      chrome.runtime.reload();
    },
    { once: true }
  );
  document.body.appendChild(inputElem);
  inputElem.click();
}
function applyLanguageSettings() {
  alert(chrome.i18n.getMessage("importSuccess"));
  chrome.runtime.reload();
}
function openFullSettings() {
  window.open(
    `${chrome.runtime.getURL("webpages/settings/index.html")}${ADDON_HASH_PREFIX}${
      addonToEnable.value && addonToEnable.value._addonId
    }`
  );
  setTimeout(() => window.parent.close(), 100);
}
function hidePopup() {
  document.querySelector(".popup").style.animation = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ? "closePopup 0.35s 1"
    : "closePopup 0.6s 1";
  document.querySelector(".popup").addEventListener(
    "animationend",
    () => {
      showPopupModal.value = false;
    },
    { once: true }
  );
}
function groupShownCount(group) {
  if (group.id === "_iframeSearch") return -1;
  return addonListObjs.value.filter((addon) => addon.group === group && addon.matchesSearch && addon.matchesCategory)
    .length;
}
function groupMarginAbove(group) {
  const firstVisibleGroup = addonGroups.find((group) => groupShownCount(group) > 0);
  return group !== firstVisibleGroup;
}
function closesidebar(event) {
  if (event?.target?.closest("#sidebar-toggle")) return;
  if (categoryOpen.value && smallMode.value) {
    sidebarToggle();
  }
}
function resizeEvent() {
  if (window.innerWidth < 1100) {
    smallMode.value = true;
    categoryOpen.value = false;
  } else if (smallMode.value !== false) {
    smallMode.value = false;
    categoryOpen.value = true;
  }
}

watch(searchInputReal, (newValue) => {
  if (newValue === "") return (searchInput.value = newValue);
  setTimeout(() => {
    if (searchInputReal.value === newValue) searchInput.value = newValue;
  }, 150);
});
watch(selectedCategory, (newValue) => {
  addonListObjs.value.forEach((obj) => {
    const shouldHideAsEasterEgg =
      obj.manifest._categories[0] === "easterEgg" && newValue !== "easterEgg" && obj.manifest._wasEverEnabled === false;
    obj.matchesCategory = !shouldHideAsEasterEgg && (newValue === "all" || obj.manifest._categories.includes(newValue));
  });
  if (newValue === "forums") addonGroups.find((group) => group.id === "forums").expanded = true;
});
watch(forceEnglishSetting, (newValue, oldValue) => {
  if (oldValue !== null) chrome.storage.local.set({ forceEnglish: forceEnglishSetting.value });
});

const moreSettings = ref(null);

onMounted(() => {
  // Autofocus search bar in iframe mode for both browsers
  // autofocus attribute only works in Chrome for us, so
  // we also manually focus on Firefox, even in fullscreen
  if (isIframe || isFirefox()) setTimeout(() => document.getElementById("searchBox")?.focus(), 0);

  const exampleAddonListItem = {
    // Need to specify all used properties for reactivity!
    group: addonGroupsData[0],
    manifest: JSON.parse(JSON.stringify(exampleManifest)),
    matchesSearch: true,
    matchesCategory: true,
    naturalIndex: -1,
    headerAbove: false,
    footerBelow: false,
    duplicate: false,
  };

  setTimeout(() => {
    if (!loaded.value) {
      addonListObjs.value = Array(25)
        .fill("")
        .map(() => JSON.parse(JSON.stringify(exampleAddonListItem)));
    }
  }, 0);

  chrome.storage.local.get("forceEnglish", ({ forceEnglish }) => {
    forceEnglishSettingInitial.value = forceEnglish;
    forceEnglishSetting.value = forceEnglish;
  });

  window.addEventListener(
    "hashchange",
    () => {
      if (location.hash === MORE_SETTINGS_HASH) {
        openMoreSettings();
      } else if (location.hash.startsWith(ADDON_HASH_PREFIX)) {
        const addonId = location.hash.substring(ADDON_HASH_PREFIX.length);
        const groupWithAddon = addonGroups.find((group) => group.addonIds.includes(addonId));
        if (!groupWithAddon) return; //Don't run if hash is invalid
        const addon = manifestsById[addonId];

        groupWithAddon.expanded = true;
        selectedCategory.value = addon?.tags.includes("easterEgg") ? "easterEgg" : "all";
        clearSearch();
        setTimeout(() => document.getElementById("addon-" + addonId)?.scrollIntoView(), 0);
      }
    },
    { capture: false }
  );
  const getRunningAddons = (manifests, addonsEnabled) => {
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
  };

  chrome.runtime.sendMessage("getSettingsInfo", async ({ manifests: fetchedManifests, addonsEnabled, addonSettings: settings }) => {
    addonSettings.value = settings;
    const cleanManifests = [];
    let iframeData;
    if (isIframe) {
      iframeData = await getRunningAddons(fetchedManifests, addonsEnabled);
    }
    const deepClone = (obj) => JSON.parse(JSON.stringify(obj));
    for (const { manifest, addonId } of fetchedManifests) {
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
        const [extMajor, extMinor, _] = version.value.split(".");
        const [addonMajor, addonMinor, __] = manifest.versionAdded.split(".");
        if (extMajor === addonMajor && extMinor === addonMinor) {
          manifest.tags.push("new");
          manifest._groups.push(
            manifest.tags.includes("recommended") || manifest.tags.includes("featured") ? "featuredNew" : "new"
          );
        }
      }

      if (manifest.latestUpdate) {
        const [extMajor, extMinor, _] = version.value.split(".");
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
        addonGroups.find((g) => g.id === groupId)?.addonIds.push(manifest._addonId);
      }
      cleanManifests.push(deepClone(manifest));
    }

    for (const { manifest } of fetchedManifests) {
      if (manifest.relatedAddons) {
        manifest._relatedAddons = manifest.relatedAddons.map(
          (relatedAddonId) =>
            fetchedManifests.find(({ addonId }) => addonId === relatedAddonId)?.manifest ??
            console.warn("Invalid related addon:", relatedAddonId, "found on addon manifest of:", manifest._addonId)
        );
      }
    }

    // Manifest objects will now be owned by Vue
    for (const { manifest } of fetchedManifests) {
      manifestsById[manifest._addonId] = manifest;
    }
    manifests.value = fetchedManifests.map(({ manifest }) => manifest);

    fuse = new Fuse(cleanManifests, fuseOptions);

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

    addonGroups.forEach((group) => {
      group.addonIds = group.addonIds
        .map((id) => manifestsById[id])
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
      for (const group of addonGroups) group.addonIds.forEach((addonId) => addonsInGroups.push(addonId));
      const searchGroup = addonGroups.find((group) => group.id === "_iframeSearch");
      searchGroup.addonIds = Object.keys(manifestsById).filter((addonId) => addonsInGroups.indexOf(addonId) === -1);
    }

    let naturalIndex = 0; // Index when not searching
    for (const group of addonGroups) {
      group.addonIds.forEach((addonId, groupIndex) => {
        const cachedObj = addonListObjs.value.find((o) => o.manifest._addonId === "example");
        const obj = cachedObj || {};
        // Some addons might be twice in the list, such as in "new" and "enabled"
        // Before setting manifest, check whether this object will be a duplicate.
        obj.duplicate = Boolean(addonListObjs.value.find((addon) => addon.manifest._addonId === addonId));
        obj.manifest = manifestsById[addonId];
        obj.group = group;
        obj.matchesSearch = false; // Later set to true by addonList if needed
        const shouldHideAsEasterEgg = obj.manifest._categories[0] === "easterEgg" && obj.manifest._enabled === false;
        obj.matchesCategory = !shouldHideAsEasterEgg;
        obj.naturalIndex = naturalIndex;
        obj.headerAbove = groupIndex === 0;
        obj.footerBelow = groupIndex === group.addonIds.length - 1;
        if (!cachedObj) addonListObjs.value.push(obj);
        naturalIndex++;
      });
    }
    // Remove unused remaining cached objects. Can only happen in iframe mode
    addonListObjs.value = addonListObjs.value.filter((o) => o.manifest._addonId !== "example");

    loaded.value = true;
    setTimeout(() => {
      const hash = window.location.hash;
      if (location.hash === MORE_SETTINGS_HASH) {
        openMoreSettings();
      } else if (hash.startsWith(ADDON_HASH_PREFIX)) {
        const addonId = hash.substring(ADDON_HASH_PREFIX.length);
        const groupWithAddon = addonGroups.find((group) => group.addonIds.includes(addonId));
        if (!groupWithAddon) return;
        groupWithAddon.expanded = true;

        const addon = manifestsById[addonId];
        selectedCategory.value = addon?.tags.includes("easterEgg") ? "easterEgg" : "all";
        blinkAddon(addonId);
      }
    }, 0);

    let binaryNum = "";
    fetchedManifests.forEach(({ addonId }) => (binaryNum += addonsEnabled[addonId] === true ? "1" : "0"));
    const addonsEnabledBase36 = BigInt(`0b${binaryNum}`).toString(36);
    sidebarUrls.feedback += `#_${addonsEnabledBase36}`;
  });

  window.addEventListener("keydown", function (e) {
    if (e.ctrlKey && e.key === "f") {
      e.preventDefault();
      document.querySelector("#searchBox").focus();
    } else if (e.key === "Escape") {
      if (document.activeElement === document.querySelector("#searchBox")) {
        if (searchInputReal.value.length > 0) {
          // Escape is used to close extension popups, so we should only prevent it if there's input text to clear
          e.preventDefault();
          searchInputReal.value = "";
        }
      } else if (categoryOpen.value && smallMode.value) {
        categoryOpen.value = false;
      } else {
        closeDropdowns();
        closePickers();
      }
    }
  });

  document.title = chrome.i18n.getMessage("settingsTitle");
  window.onresize = resizeEvent;
  resizeEvent();

  chrome.management.getSelf((info) => {
    if (info.installType === "development") devMode.value = true;
  });

  // Konami code easter egg
  let cursor = 0;
  const KONAMI_CODE = [
    "arrowup",
    "arrowup",
    "arrowdown",
    "arrowdown",
    "arrowleft",
    "arrowright",
    "arrowleft",
    "arrowright",
    "b",
    "a",
  ];
  document.addEventListener("keydown", (e) => {
    cursor = e.key.toLowerCase() === KONAMI_CODE[cursor] ? cursor + 1 : 0;
    if (cursor === KONAMI_CODE.length) {
      selectedCategory.value = "easterEgg";
      setTimeout(() => (searchInputReal.value = ""), 0); // Allow konami code in autofocused search bar
    }
  });

  if (!isIframe) {
    chrome.runtime.sendMessage("checkPermissions");
  }
});
</script>
