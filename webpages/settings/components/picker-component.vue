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
import { getCurrentInstance, onMounted, ref, watch } from "vue";
import bus from "../lib/eventbus";

const props = defineProps(["value", "addon", "setting", "no_alpha", "disabled"]);

const instance = getCurrentInstance();
const root = instance.proxy.$root;
const parent = instance.proxy.$parent;
const load = ref(false);
const isOpen = ref(false);
const color = ref(props.value);

watch(
  () => props.value,
  (newVal) => {
    color.value = newVal;
  }
);

onMounted(() => {
  bus.$on("close-pickers", (except) => {
    if (isOpen.value && instance.proxy !== except) {
      close(false);
    }
  });
});

function open() {
  if (!load.value) return;
  isOpen.value = true;
  root.closePickers({ isTrusted: true }, instance.proxy, {
    callCloseDropdowns: false,
  });
  root.closeDropdowns({ isTrusted: true });
}

function close(callBus = true) {
  isOpen.value = false;
  if (callBus) bus.$emit("close-pickers", instance.proxy);
}

function onColorChange(newColor) {
  const hex = props.no_alpha ? newColor.hex : newColor.hex8;
  color.value = hex;

  if (props.value !== color.value) {
    parent.addonSettings[props.setting.id] = color.value;
    parent.updateSettings(props.addon, {
      wait: 250,
      settingId: props.setting.id,
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
