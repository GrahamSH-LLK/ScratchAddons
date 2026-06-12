<template>
  <div class="navbar">
    <a href="./settings.html"
      ><img src="../../images/icon-transparent.svg" class="logo header-button" alt="Logo" draggable="false"
    /></a>
    <h1>{{ msg("permissions") }}</h1>
  </div>
  <div class="main">
    <div class="permissions-block">
      <h2>{{ msg("enablePermissionsTitle") }}</h2>
      <p>{{ msg("enablePermissionsDescription") }}</p>
    </div>
    <div class="permissions-steps">
      <div>
        <button id="permissionsBtn" class="large-button">{{ msg("enableButton") }}</button>
        <p>{{ msg("enableButtonDescription") }}</p>
      </div>
      <div>
        <img alt="{{ msg('permissionsScreenAlt') }}" id="screenshot" v-bind:src="screenshotPath" />
        <p>{{ msg("clickAllowDescription") }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import globalTheme from "../../libraries/common/global-theme.js";
import { onMounted, ref } from "vue";

const screenshotPath = ref("../../images/screenshots/permissions-dark.png");
const msg = (message, ...param) => chrome.i18n.getMessage(message, ...param);

onMounted(() => {
  globalTheme().then(({ theme }) => {
    if (theme) {
      screenshotPath.value = "../../images/screenshots/permissions-light.png";
    }
  });

  document.title = chrome.i18n.getMessage("permissionsTitle");

  document.getElementById("permissionsBtn").addEventListener("click", async () => {
    const manifest = chrome.runtime.getManifest();
    const origins = manifest.host_permissions.filter((url) => url.startsWith("https://"));

    const granted = await chrome.permissions.request({ origins });
    if (granted) {
      return chrome.runtime.reload();
    }
    alert(chrome.i18n.getMessage("permissionsDenied"));
  });
});
</script>
