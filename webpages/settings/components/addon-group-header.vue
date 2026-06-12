<template>
  <div class="addon-group" v-show="shouldShow" @click="toggle" :class="{ 'margin-above': marginAbove }">
    <button class="arrow-button" :title="msg(group.expanded ? 'collapse' : 'expand')">
      <img src="../../../images/icons/expand.svg" :class="{ reverted: group.expanded }" draggable="false" />
    </button>
    {{ group.name }} ({{ shownCount }})
  </div>
</template>

<style>
.addon-group.margin-above {
  margin-top: 20px;
}

.addon-group {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin: 0px 11px;
  padding: 0px 10px;
  user-select: none;
}

.addon-group::after {
  content: "";
  border-top: 1px solid var(--content-separator);
  width: 100px;
  margin-inline-start: 20px;
  margin-inline-end: 5px;
  flex: 1;
}

@media (max-width: 700px) {
  .addon-group {
    padding-inline: 6px;
  }

  .addon-group > img {
    margin-inline-end: 5px;
  }
}
</style>

<script setup>
import { computed, getCurrentInstance } from "vue";

const props = defineProps(["group", "shownCount", "marginAbove"]);

const root = getCurrentInstance().proxy.$root;
const shouldShow = computed(() => root.searchInput === "" && props.shownCount > 0);
const manifestsById = computed(() => root.manifestsById);
const toggle = () => {
  props.group.expanded = !props.group.expanded;
};
const msg = (...params) => root.msg(...params);
</script>
