<template>
  <div class="color-container" @click="open" @mouseover="load = true">
    <button
      :style="{ 'background-color': color }"
      class="setting-input color"
      :class="{ 'action-disabled': !addon._enabled, open: isOpen }"
      :disabled="disabled"
    ></button>

    <div v-if="load" v-show="isOpen" class="picker-popup">
      <Chrome v-model:modelValue="color" :disable-alpha="no_alpha" @update:modelValue="onColorChange" />
    </div>
  </div>
</template>

<script setup>
import { Chrome } from "@lk77/vue3-color";
import { getCurrentInstance, ref, watch } from "vue";
import { useSettingsStore } from "../stores/settings.js";

const props = defineProps(["value", "addon", "setting", "settingPath", "no_alpha", "disabled", "addon-settings"]);

const instance = getCurrentInstance();
const pickerId = instance.uid;
const settingsStore = useSettingsStore();
const load = ref(false);
const isOpen = ref(false);
const color = ref(props.value);

watch(
  () => props.value,
  (newVal) => {
    color.value = newVal;
  }
);

watch(
  () => settingsStore.closePickersSignal,
  () => {
    if (isOpen.value && settingsStore.closePickersExceptId !== pickerId) {
      close(false);
    }
  }
);

function open() {
  if (!load.value) return;
  isOpen.value = true;
  settingsStore.closePickers({ isTrusted: true }, pickerId, {
    callCloseDropdowns: false,
  });
  settingsStore.closeDropdowns({ isTrusted: true });
}

function close(callBus = true) {
  isOpen.value = false;
  if (callBus) settingsStore.closePickers(null, pickerId, { callCloseDropdowns: false });
}

function onColorChange(newColor) {
  const hex = props.no_alpha ? newColor.hex : newColor.hex8;
  color.value = hex;

  if (props.value !== color.value) {
    settingsStore.setAddonSetting(props.addon, props.settingPath, color.value, {
      persist: true,
      wait: 250,
      settingId: props.settingPath[0],
    });
  }
}
</script>

<style>
.color-container {
  position: relative;
}

.picker-popup {
  z-index: 2;
  position: absolute;
  top: calc(100% - 1px);
  left: 0;
  border: 1px solid var(--control-border);
}

.picker-popup .vc-chrome-body,
.picker-popup .vc-chrome-fields .vc-input__input {
  background-color: var(--button-background);
  font-family: Roboto, sans-serif;
}

.picker-popup .vc-chrome-fields .vc-input__input,
.picker-popup .vc-chrome-fields .vc-input__label {
  color: var(--content-text);
}

.picker-popup .vc-chrome-fields .vc-input__input {
  box-shadow: inset 0 0 0 1px var(--content-border);
}

.picker-popup .vc-chrome-toggle-icon {
  filter: var(--content-icon-filter);
}

.picker-popup .vc-chrome-toggle-icon-highlight {
  background: var(--hover-highlight);
}
</style>
