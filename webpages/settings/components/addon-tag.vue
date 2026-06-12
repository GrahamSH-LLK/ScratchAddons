<template>
  <div
    class="badge"
    v-if="shouldShow"
    :tabindex="tagInfo.tooltipText ? 0 : -1"
    :class="{
      tooltip: tagInfo.tooltipText,
      blue: tagInfo.color === 'blue',
      yellow: tagInfo.color === 'yellow',
      red: tagInfo.color === 'red',
      darkred: tagInfo.color === 'darkred',
      green: tagInfo.color === 'green',
      darkgreen: tagInfo.color === 'darkgreen',
      lightblue: tagInfo.color === 'lightblue',
      purple: tagInfo.color === 'purple',
    }"
  >
    {{ tagName }}
    <span v-if="tagInfo.tooltipText" class="tooltiptext tooltiptexttop">{{ tagTooltip }}</span>
  </div>
</template>

<script setup>
import { computed, getCurrentInstance } from "vue";
import tags from "../data/tags.js";

const props = defineProps(["tag"]);

const isIframe = window.parent !== window;
const root = getCurrentInstance().proxy.$root;
const tagInfo = computed(() => tags.find((tag) => tag.matchName === props.tag));
const shouldShow = computed(() => {
  if (isIframe) return tagInfo.value && tagInfo.value.iframeAlwaysShow;
  return tagInfo.value && (!tagInfo.value.addonTabShow || tagInfo.value.addonTabShow[root.selectedCategory]);
});
const tagName = computed(() => chrome.i18n.getMessage(tagInfo.value.name));
const tagTooltip = computed(() => chrome.i18n.getMessage(tagInfo.value.tooltipText));
</script>
