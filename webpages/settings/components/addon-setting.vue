<template>
  <div
    v-show="show"
    class="addon-setting"
    :class="{
      'boolean-setting': setting.type === 'boolean',
      'number-setting': setting.type === 'integer' || setting.type === 'positive_integer',
    }"
  >
    <div class="setting-label-container">
      <div class="setting-label" v-html="settingsName(addon)"></div>
      <div v-if="setting.description" :class="{ tooltip: addon._enabled }" :tabindex="addon._enabled ? '0' : '-1'">
        <img src="../../../images/icons/help.svg" class="icon-type setting-help-icon" />
        <span class="tooltiptext tooltiptexttop">{{ setting.description }}</span>
      </div>
      <addon-tag v-if="isNewOption" tag="new"></addon-tag>
    </div>
    <template v-if="noResetDropdown">
      <div v-if="setting.type === 'table'" class="setting-table">
        <div class="setting-table-list" v-sortable="{ update: updateTable, enabled: addon._enabled, id: addon.id }">
          <div class="setting-table-row" v-for="(row, i) of addonSettings[setting.id]">
            <div class="setting-table-options">
              <button
                :disabled="!addon._enabled"
                class="addon-buttons"
                @click="deleteTableRow(i)"
                :title="msg('deleteRow')"
              >
                <img class="icon-type" src="../../../images/icons/close.svg" />
              </button>
              <button :disabled="!addon._enabled" class="addon-buttons handle">
                <img class="icon-type" src="../../../images/icons/drag.svg" />
              </button>
            </div>
            <div class="setting-table-row-settings">
              <addon-setting
                v-for="(val, id) of row"
                :addon="addon"
                :group-id="groupId"
                :setting="getTableSetting(id)"
                :setting-path="settingPath.concat([i, id])"
                :addon-settings="row"
              ></addon-setting>
            </div>
          </div>
        </div>
        <div class="addon-split-button setting-table-dropdown dropdown-parent">
          <button
            :disabled="!addon._enabled"
            class="addon-buttons addon-split-button-button"
            @click="addTableRow()"
            :title="msg('addRow')"
          >
            <img class="icon-type" src="../../../images/icons/plus.svg" draggable="false" />
          </button>
          <dropdown
            button-class="addon-buttons addon-split-button-dropdown"
            :disabled="!addon._enabled"
            :button-title="msg('addPresetRow')"
            align-start="true"
          >
            <li tabindex="0" role="menuitem" v-for="preset of setting.presets" @click="addTableRow(preset.values)">
              {{ preset.name }}
            </li>
          </dropdown>
        </div>
      </div>
      <input
        v-if="setting.type === 'boolean'"
        type="checkbox"
        class="switch blue"
        v-model="addonSettings[setting.id]"
        @change="updateSettings()"
        :disabled="!addon._enabled"
      />
      <div v-if="setting.type === 'select'" class="filter-options" role="radiogroup">
        <div v-for="option of setting.potentialValues">
          <input
            type="radio"
            :name="selectName"
            :id="selectOptionId(option)"
            :value="option.id"
            :disabled="!addon._enabled"
            v-model="addonSettings[setting.id]"
            @change="updateSettings()"
          />
          <label class="filter-option" :for="selectOptionId(option)">{{ option.name }}</label>
        </div>
      </div>
    </template>
    <div v-else class="setting-input-container" :class="{ 'full-radius': tableChild }">
      <template v-if="setting.type === 'positive_integer'">
        <input
          type="number"
          class="setting-input number"
          v-model="addonSettings[setting.id]"
          @change="checkValidity($event) || updateSettings()"
          :disabled="!addon._enabled"
          min="0"
          number
        />
      </template>
      <template v-if="setting.type === 'integer'">
        <input
          type="number"
          class="setting-input number"
          v-model="addonSettings[setting.id]"
          @change="checkValidity($event) || updateSettings()"
          :disabled="!addon._enabled"
          :min="setting.min"
          :max="setting.max"
          number
        />
      </template>
      <template v-if="setting.type === 'string' || setting.type === 'untranslated'"
        ><input
          type="text"
          class="setting-input string"
          v-model="addonSettings[setting.id]"
          @change="checkValidity($event) || updateSettings()"
          :disabled="!addon._enabled"
          :placeholder="setting.default"
          :maxlength="setting.max || 100"
          :minlength="setting.min || 0"
          :required="!!setting.min"
        />
      </template>
      <template v-if="setting.type === 'color'">
        <picker
          :value="addonSettings[setting.id] || setting.default"
          :setting="setting"
          :addon="addon"
          :addon-settings="addonSettings"
          :no_alpha="!setting.allowTransparency"
          :disabled="!addon._enabled"
          v-click-outside="closePickers"
        ></picker
      ></template>
      <template v-if="showResetDropdown"
        ><reset-dropdown
          :addon="addon"
          :addon-settings="addonSettings"
          :setting="setting"
          :disabled="!addon._enabled"
          :presets="addon.presets"
        ></reset-dropdown
      ></template>
      <template v-if="!tableChild && !showResetDropdown"
        ><button
          type="button"
          class="large-button clear-button"
          :disabled="!addon._enabled"
          :title="msg('reset')"
          @click="updateOption(setting.default || '')"
        >
          <img src="../../../images/icons/undo.svg" class="icon-type" draggable="false" /></button
      ></template>
    </div>
  </div>
</template>

<style>
.addon-setting {
  margin: 10px;
  margin-inline-end: 20px;
  min-height: 32px;
  display: flex;
  align-items: center;
  position: relative;
}
.setting-help-icon {
  margin-inline-start: 8px;
  width: 18px;
  height: 18px;
}
.setting-input {
  color: var(--content-text);
  background: var(--input-background);
  border: 1px solid var(--control-border);
  height: 32px;
  box-sizing: border-box;
  padding: 0 12px;
  border-radius: 4px 0 0 4px;
  font-family: inherit;
  font-size: 14px;
  transition: 0.2s ease;
  transition-property: box-shadow, border;
}
[dir="rtl"] .setting-input {
  border-radius: 0 4px 4px 0;
}
.full-radius .setting-input {
  border-radius: 4px;
}
.setting-input:focus-visible {
  outline: none;
  border-color: var(--orange);
  box-shadow: var(--input-focus-shadow);
}

.setting-input.number {
  max-width: 150px;
  border-radius: 16px 0 0 16px;
}
[dir="rtl"] .setting-input.number {
  border-radius: 0 16px 16px 0;
}
.full-radius .setting-input.number {
  border-radius: 16px;
}

.setting-input-container {
  display: flex;
  align-items: center;
}

.setting-label-container {
  display: flex;
  align-items: center;
  width: 200px;
  margin-inline-end: 10px;
}

.setting-label {
  text-transform: uppercase;
  color: var(--label-text);
  font-weight: 500;
  min-width: 70px;
}

.setting-dropdown .clear-button.open {
  border-bottom-right-radius: 0;
  background: var(--button-hover-background);
}
[dir="rtl"] .setting-dropdown .clear-button.open {
  border-bottom-left-radius: 0;
}
.iframe .setting-dropdown .clear-button.open {
  border-bottom-right-radius: 4px;
}
.iframe[dir="rtl"] .setting-dropdown .clear-button.open {
  border-bottom-left-radius: 4px;
}
.iframe .setting-dropdown ul {
  right: auto;
  left: -100px;
  border-top-right-radius: 4px;
}
[dir="rtl"] .setting-dropdown ul {
  right: auto;
  left: 0;
  border-top-right-radius: 4px;
  border-top-left-radius: 0;
}
.iframe[dir="rtl"] .setting-dropdown ul {
  left: auto;
  right: -100px;
  border-top-left-radius: 4px;
}
.setting-dropdown li > * {
  vertical-align: middle;
}
.setting-dropdown .color-preview {
  display: inline-block;
  width: 18px;
  height: 18px;
  margin-inline-end: 8px;
  border-radius: 5px;
  background: linear-gradient(45deg, #777 25%, transparent 25%), linear-gradient(-45deg, #777 25%, transparent 25%),
    linear-gradient(45deg, transparent 75%, #777 75%), linear-gradient(-45deg, transparent 75%, #777 75%);
  background-color: white;
  background-size: 6px 6px;
  background-position:
    0 0,
    0 3px,
    3px -3px,
    -3px 0px;
}
.setting-dropdown .color-preview span {
  display: inline-block;
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  border-radius: 4px;
  border: 1px solid var(--control-border);
}
.setting-dropdown .text-preview {
  margin-left: 12px;
  color: var(--label-text);
  font-weight: 500;
}

.setting-table {
  display: flex;
  flex-direction: column;
}
.setting-table-list {
  display: flex;
  flex-direction: column;
}
.setting-table-row {
  display: flex;
  margin: 10px 0px;
}
.setting-table-row-settings {
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding-bottom: 10px;
  background: var(--navigation-background);
  border-radius: 10px;
}
.setting-table-row-settings .addon-setting {
  margin-inline-end: 10px;
  margin-bottom: 0;
  flex-wrap: wrap;
}
.setting-table-options {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.setting-table-dropdown {
  align-self: flex-start;
}

@media (max-width: 700px) {
  .setting-label-container {
    width: auto;
    margin-bottom: 5px;
    max-width: calc(100% - 66px); /* prevent setting description tooltip from overflowing */
  }
  .setting-label-container:not(:has(.tooltip)) {
    max-width: none;
  }
  .setting-input {
    flex-shrink: 0;
  }
}
</style>

<script setup>
import Sortable from "sortablejs";
import bus from "../lib/eventbus";
import { computed } from "vue";
import { useSettingsStore } from "../stores/settings.js";

import AddonTag from "./addon-tag.vue";
import Dropdown from "./dropdown.vue";
import Picker from "./picker-component.vue";
import ResetDropdown from "./reset-dropdown.vue";

const props = defineProps(["addon", "groupId", "setting", "settingPath", "addon-settings"]);

const settingsStore = useSettingsStore();

const noResetDropdown = computed(() => ["table", "boolean", "select"].includes(props.setting.type));
const tableChild = computed(() => props.settingPath.length > 1);
const selectName = computed(() => `${props.groupId}-${props.addon._addonId}-${props.settingPath.join("-")}`);
const show = computed(() => {
  if (!props.setting.if) return true;

  if (props.setting.if.addonEnabled) {
    const arr = Array.isArray(props.setting.if.addonEnabled)
      ? props.setting.if.addonEnabled
      : [props.setting.if.addonEnabled];
    if (arr.some((addon) => settingsStore.manifestsById[addon]._enabled === true)) return true;
  }

  if (props.setting.if.settings) {
    const anyMatches = Object.keys(props.setting.if.settings).some((settingName) => {
      const arr = Array.isArray(props.setting.if.settings[settingName])
        ? props.setting.if.settings[settingName]
        : [props.setting.if.settings[settingName]];
      return arr.some(
        (possibleValue) =>
          props.addonSettings[settingName] === possibleValue ||
          settingsStore.addonSettings[props.addon._addonId]?.[settingName] === possibleValue
      );
    });
    if (anyMatches === true) return true;
  }

  return false;
});
const showResetDropdown = computed(
  () =>
    !tableChild.value &&
    props.addon.presets &&
    props.addon.presets.some(
      (preset) =>
        Object.prototype.hasOwnProperty.call(preset.values, props.setting.id) &&
        (props.setting.type === "color"
          ? preset.values[props.setting.id].toLowerCase() !== props.setting.default.toLowerCase()
          : preset.values[props.setting.id] !== props.setting.default)
    )
);
const isNewOption = computed(() => {
  if (!props.addon.latestUpdate) return false;

  const [extMajor, extMinor, _] = chrome.runtime.getManifest().version.split(".");
  const [addonMajor, addonMinor, __] = props.addon.latestUpdate.version.split(".");
  if (!(extMajor === addonMajor && extMinor === addonMinor)) return false;

  if (props.addon.latestUpdate.newSettings && props.addon.latestUpdate.newSettings.includes(props.setting.id))
    return true;
  else return false;
});
const updateSettings = (...params) => {
  if (!params[0]) params[0] = props.addon;
  settingsStore.updateSettings(...params);
};
const updateTable = (event) => {
  let list = props.addonSettings[props.setting.id];
  list.splice(event.newIndex, 0, list.splice(event.oldIndex, 1)[0]);
  updateSettings();
};
const settingsName = (addon) => {
  const name = props.setting.name;
  const regex = /([\\]*)(@|#)([a-zA-Z0-9.\-\/_]*)/g;
  return name.replace(regex, (icon) => {
    if (icon[0] === "\\") {
      return icon.slice(1);
    }
    if (icon[0] === "@") {
      return `<img class="inline-icon" src="../../images/icons/${icon.split("@")[1]}" draggable="false"/>`;
    }
    if (icon[0] === "#") {
      return `<img class="inline-icon" src="../../addons/${addon._addonId}/${
        icon.split("#")[1]
      }" draggable="false"/>`;
    }
  });
};
const selectOptionId = (option) => `${selectName.value}-${option.id}`;
const checkValidity = (event) => {
  let input = event.target;
  if (!input.validity.valid) props.addonSettings[props.setting.id] = props.setting.default;
};
const getTableSetting = (id) => props.setting.row.find((setting) => setting.id === id);
const deleteTableRow = (i) => {
  props.addonSettings[props.setting.id].splice(i, 1);
  updateSettings();
};
const addTableRow = (items = {}) => {
  const settings = Object.assign(
    {},
    props.setting.row.reduce((acc, cur) => {
      acc[cur.id] = cur.default;
      return acc;
    }, {}),
    items
  );
  props.addonSettings[props.setting.id].push(settings);
  updateSettings();
};
const msg = (...params) => settingsStore.msg(...params);
const updateOption = (newValue) => {
  props.addonSettings[props.setting.id] = newValue;
  updateSettings();
};
const closePickers = (...params) => settingsStore.closePickers(...params);

const vSortable = {
  mounted: (el, binding) => {
    const sortable = new Sortable(el, {
      handle: ".handle",
      animation: 300,
      onUpdate: binding.value.update,
      disabled: !binding.value.enabled,
    });
    bus.$on(`toggle-addon-request-${binding.value.id}`, (state) => {
      sortable.option("disabled", !state);
    });
  },
};
</script>
