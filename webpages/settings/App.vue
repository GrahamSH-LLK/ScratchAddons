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
              v-show="forceEnglishSetting !== null && forceEnglishSetting !== forceEnglishSettingInitial"
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
import { deserializeSettings, serializeSettings } from "./settings-utils.js";
import { isFirefox } from "../../libraries/common/cs/detect-browser.js";
import { storeToRefs } from "pinia";
import { computed, onMounted, ref, watch } from "vue";
import { useSettingsStore } from "./stores/settings.js";

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

// REMINDER: update similar code at /background/imports/util.js
const browserLevelPermissions = ["notifications"];
if (isFirefox()) {
  if (typeof Clipboard.prototype.write !== "function") {
    // Firefox 109-126 only
    browserLevelPermissions.push("clipboardWrite");
  }
}

const settingsStore = useSettingsStore();
settingsStore.initialize({
  browserLevelPermissions,
  isIframe,
  searchMsg: msg("search"),
  sidebarUrls: (() => {
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
  })(),
});

const {
  addonListObjs,
  addonSettings,
  addonAmt,
  addonList,
  addonToEnable,
  categoryOpen,
  devMode,
  forceEnglishSetting,
  forceEnglishSettingInitial,
  grantedOptionalPermissions,
  hasNoResults,
  loaded,
  manifests,
  previousCategory,
  relatedAddonsOpen,
  relatedToAddonName,
  searchInput,
  searchInputReal,
  selectedCategory,
  selectedCategoryName,
  showPopupModal,
  smallMode,
  theme,
  version,
} = storeToRefs(settingsStore);
const addonGroups = settingsStore.addonGroups;
const categories = settingsStore.categories;
const relatedAddons = settingsStore.relatedAddons;
const relatedAddonsHistory = settingsStore.relatedAddonsHistory;
const sidebarUrls = settingsStore.sidebarUrls;
const manifestsById = settingsStore.manifestsById;
const searchMsg = settingsStore.searchMsg;

const updateGrantedPermissions = () =>
  chrome.permissions.getAll(({ permissions }) => {
    grantedOptionalPermissions.value = permissions.filter((p) => browserLevelPermissions.includes(p));
  });
updateGrantedPermissions();
chrome.permissions.onAdded?.addListener(updateGrantedPermissions);
chrome.permissions.onRemoved?.addListener(updateGrantedPermissions);

const themePath = computed(() => (theme.value ? "../../images/icons/moon.svg" : "../../images/icons/theme.svg"));

function openMoreSettings() {
  closePickers();
  moreSettings.value.openModal();
  if (smallMode.value) {
    sidebarToggle();
  }
  location.hash = "";
}
function backRelatedAddon() {
  const addon = relatedAddonsHistory.pop();
  if (relatedAddonsHistory.length === 0) {
    relatedAddonsOpen.value = false;
    selectedCategory.value = previousCategory.value;
  } else {
    settingsStore.openRelatedAddons(relatedAddonsHistory.at(-1), false);
  }
  settingsStore.blinkAddon(addon._addonId);
}
function sidebarToggle() {
  categoryOpen.value = !categoryOpen.value;
}
function msg(message, ...params) {
  return settingsStore.msg(message, ...params);
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
  settingsStore.setTheme(mode);
}
function closePickers(e, leaveOpen, { callCloseDropdowns = true } = {}) {
  settingsStore.closePickers(e, leaveOpen, { callCloseDropdowns });
}
function closeDropdowns(e, leaveOpen) {
  settingsStore.closeDropdowns(e, leaveOpen);
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
  settingsStore.updateCategoryMatches();
});
watch(forceEnglishSetting, (newValue, oldValue) => {
  if (oldValue !== null) chrome.storage.local.set({ forceEnglish: forceEnglishSetting.value });
});

const moreSettings = ref(null);

onMounted(() => {
  settingsStore.loadGlobalTheme();

  // Autofocus search bar in iframe mode for both browsers
  // autofocus attribute only works in Chrome for us, so
  // we also manually focus on Firefox, even in fullscreen
  if (isIframe || isFirefox()) setTimeout(() => document.getElementById("searchBox")?.focus(), 0);

  settingsStore.loadPlaceholderAddons();
  settingsStore.loadForceEnglishSetting();

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
  settingsStore.loadSettingsInfo({ isIframe }).then(() => {
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
        settingsStore.blinkAddon(addonId);
      }
    }, 0);
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
