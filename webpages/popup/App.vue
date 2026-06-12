<template>
  <div id="header">
    <div id="title">
      <img src="../../images/icon-transparent.svg" id="logo" alt="Logo" draggable="false" />
      <span id="title-text">
        {{ msg("extensionName") }}
        <a id="version" :href="changelogLink" target="_blank" title="{{ msg('changelog') }}">v{{ version }}</a>
      </span>
    </div>
    <a href="#" class="header-button" @click="openSettingsPage()">
      <img src="../../images/icons/settings.svg" id="settings-icon" title="{{ msg('settings') }}" draggable="false" />
    </a>
  </div>
  <div id="popup-bar">
    <button
      v-for="popup of popups"
      class="popup-name"
      :class="{ sel: currentPopup === popup }"
      @click="setPopup(popup)"
    >
      <img v-if="popup.icon" :src="popup.icon" class="popup-icon" draggable="false" />
      <a class="popup-title">{{ popup.name }}</a>
      <span v-if="popup.fullscreen" class="popout" @click="openInNewTab(popup)">
        <img
          src="../../images/icons/popout.svg"
          class="popout-img"
          title="{{ msg('openInNewTab') }}"
          draggable="false"
        />
      </span>
    </button>
  </div>
  <iframe
    v-for="popup in popupsWithIframes"
    v-show="currentPopup === popup"
    :src="iframeSrc(popup._addonId)"
    :key="popup._addonId"
  ></iframe>
</template>

<script setup>
import globalTheme from "../../libraries/common/global-theme.js";
import { computed, onMounted, ref } from "vue";

globalTheme();

function calculatePopupSize() {
  /* For mobile or when there isn't enough space for the full popup size */
  if (!window.innerWidth || !window.innerHeight) {
    setTimeout(calculatePopupSize, 0);
    return;
  }
  document.documentElement.style.setProperty("--width", `${window.innerWidth}px`);
  document.documentElement.style.setProperty("--height", `${window.innerHeight}px`);
  document.body.classList.remove("loading");
}

window.addEventListener("load", () => setTimeout(calculatePopupSize, 0));

const popups = ref([]);
const currentPopup = ref(null);
const popupsWithIframes = ref([]);

const msg = (message, ...params) => chrome.i18n.getMessage(message, ...params);
const closePopup = () => {
  setTimeout(() => window.close(), 100);
};
const openSettingsPage = () => {
  chrome.runtime.openOptionsPage();
  closePopup();
};
const setPopup = (popup) => {
  if (currentPopup.value !== popup) {
    currentPopup.value = popup;
    chrome.storage.local.set({
      lastSelectedPopup: popup._addonId,
    });
    if (!popupsWithIframes.value.includes(popup)) popupsWithIframes.value.push(popup);
    setTimeout(() => document.querySelector("iframe:not([style='display: none;'])").focus(), 0);
  }
};
const openInNewTab = (popup) => {
  chrome.tabs.create({
    url: `../../popups/${popup._addonId}/popup.html`,
  });
  closePopup();
};
const iframeSrc = (addonId) => popups.value.find((addon) => addon._addonId === addonId).html;

const changelogLink = computed(() => {
  const uiLanguage = chrome.i18n.getUILanguage();
  const localeSlash = uiLanguage.startsWith("en") ? "" : `${uiLanguage.split("-")[0]}/`;
  const utm = `utm_source=extension&utm_medium=popup&utm_campaign=v${chrome.runtime.getManifest().version}`;
  return `https://scratchaddons.com/${localeSlash}changelog/?${utm}#v${chrome.runtime.getManifest().version}`;
});
const version = computed(() => {
  const prerelease = chrome.runtime.getManifest().version_name.includes("-prerelease");
  const ver = chrome.runtime.getManifest().version;
  return prerelease ? ver + "-pre" : ver;
});

onMounted(() => {
  let manifests = null;
  // If order unspecified, addon goes first. All new popups should be added here.
  const TAB_ORDER = ["__settings__", "scratch-messaging", "cloud-games"];

  chrome.runtime.sendMessage("getSettingsInfo", (res) => {
    manifests = res.manifests;
    let popupObjects = Object.keys(res.addonsEnabled)
      .filter((addonId) => res.addonsEnabled[addonId] === true)
      .map((addonId) => manifests.find((addon) => addon.addonId === addonId))
      // Note an enabled addon might not exist anymore!
      .filter((findManifest) => findManifest !== undefined)
      .filter(({ manifest }) => manifest.popup)
      .map(
        ({ addonId, manifest }) =>
          (manifest.popup._addonId = addonId) &&
          Object.assign(manifest.popup, {
            html: `../../popups/${addonId}/popup.html`,
          })
      );
    popupObjects.push({
      name: chrome.i18n.getMessage("quickSettings"),
      icon: "../../images/icons/wrench.svg",
      html: "./settings.html",
      _addonId: "__settings__",
    });
    popupObjects = popupObjects.sort(
      ({ _addonId: addonIdB }, { _addonId: addonIdA }) => TAB_ORDER.indexOf(addonIdB) - TAB_ORDER.indexOf(addonIdA)
    );
    popups.value = popupObjects;
    chrome.storage.local.get("lastSelectedPopup", ({ lastSelectedPopup }) => {
      let id = -1;
      if (typeof lastSelectedPopup === "string") {
        id = popups.value.findIndex((popup) => popup._addonId === lastSelectedPopup);
      }
      if (id !== -1) setPopup(popups.value[id]);
      else setPopup(popups.value.find((p) => p._addonId === "__settings__"));
    });
  });

  // Dynamic Popups
  chrome.runtime.onMessage.addListener((request) => {
    if (request.changeEnabledState) {
      const { addonId, newState } = request.changeEnabledState;
      const { manifest } = manifests.find((addon) => addon.addonId === addonId);
      if (!manifest.popup) return;
      if (newState === true) {
        manifest.popup._addonId = addonId;
        Object.assign(manifest.popup, {
          html: `../../popups/${addonId}/popup.html`,
        });

        popups.value.push(manifest.popup);
        popups.value = popups.value.sort(
          ({ _addonId: addonIdB }, { _addonId: addonIdA }) => TAB_ORDER.indexOf(addonIdB) - TAB_ORDER.indexOf(addonIdA)
        );
      } else {
        let removeIndex = popupsWithIframes.value.findIndex((popup) => popup._addonId === addonId);
        if (removeIndex !== -1) popupsWithIframes.value.splice(removeIndex, 1);
        removeIndex = popups.value.findIndex((popup) => popup._addonId === addonId);
        popups.value.splice(removeIndex, 1);
        if (!popups.value.includes(currentPopup.value)) {
          setPopup(popups.value[0]); // set to default popup if current popup is no longer available
        }
      }
    }
  });

  chrome.runtime.sendMessage("checkPermissions");
});
</script>
