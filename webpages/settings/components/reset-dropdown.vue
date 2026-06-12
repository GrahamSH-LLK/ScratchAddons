<template>
  <div class="setting-dropdown dropdown-parent">
    <dropdown button-class="large-button clear-button" :disabled="disabled" :button-title="msg('resetTo')">
      <li tabindex="0" role="menuitem" @click="resetToDefault">
        <span v-if="setting.type === 'color'" class="color-preview"
          ><span :style="{ backgroundColor: setting.default }"></span
        ></span>
        <span>{{ msg("default") }}</span>
        <span v-if="setting.type !== 'color'" class="text-preview">{{ setting.default }}</span>
      </li>
      <template v-for="preset in presets">
        <li
          tabindex="0"
          role="menuitem"
          v-if="
            preset.values.hasOwnProperty(setting.id) && setting.type === 'color'
              ? preset.values[setting.id].toLowerCase() != setting.default.toLowerCase()
              : preset.values[setting.id] !== setting.default
          "
          @click="resetToPreset(preset)"
        >
          <span v-if="setting.type === 'color'" class="color-preview"
            ><span :style="{ backgroundColor: preset.values[setting.id] }"></span
          ></span>
          <span>{{ preset.name }}</span>
          <span v-if="setting.type !== 'color'" class="text-preview">{{ preset.values[setting.id] }}</span>
        </li>
      </template>
    </dropdown>
  </div>
</template>

<script setup>
import Dropdown from "./dropdown.vue";
import { useSettingsStore } from "../stores/settings.js";

const props = defineProps(["addon", "addon-settings", "disabled", "setting", "settingPath", "presets"]);

const settingsStore = useSettingsStore();
const resetToDefault = () => {
  settingsStore.resetAddonSetting(props.addon, props.setting, props.settingPath);
};
const resetToPreset = (preset) => {
  settingsStore.setAddonSetting(props.addon, props.settingPath, preset.values[props.setting.id], {
    persist: true,
    settingId: props.settingPath[0],
  });
};
const msg = (...params) => settingsStore.msg(...params);
</script>
