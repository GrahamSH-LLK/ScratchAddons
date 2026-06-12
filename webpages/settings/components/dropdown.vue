<template>
  <div v-click-outside="closeDropdowns" @keydown="handleKeys">
    <button
      aria-haspopup="true"
      :aria-expanded="isOpen ? 'true' : 'false'"
      :class="['dropdown-btn', buttonClass, { open: isOpen }]"
      :disabled="disabled"
      :title="buttonTitle"
      ref="button"
      @click="toggle"
    >
      <img src="../../../images/icons/expand.svg" class="icon-type" draggable="false" />
    </button>
    <ul class="dropdown-list" :class="{ 'align-start': alignStart }" @click="listClick" role="menu" ref="list">
      <slot></slot>
    </ul>
  </div>
</template>

<style>
.dropdown-parent {
  position: relative;
}

.dropdown-list {
  position: absolute;
  top: calc(100% - 1px);
  right: 0;
  margin: 0;
  padding: 6px 0;
  display: none;
  z-index: 3;
  border-radius: 4px;
  border-top-right-radius: 0;
  background: var(--button-background);
  color: var(--content-text);
  border: 1px solid var(--control-border);
}

.dropdown-btn.open + ul {
  display: block;
}

.dropdown-list li {
  padding: 6px 12px;
  list-style: none;
  white-space: nowrap;
  text-align: start;
  transition: 0.2s ease;
  user-select: none;
}

.dropdown-list li:hover {
  background: var(--button-hover-background);
}

.dropdown-list.align-start {
  right: auto;
  left: 0;
  border-radius: 4px;
  border-top-left-radius: 0;
}

[dir="rtl"] .dropdown-list.align-start {
  left: auto;
  right: 0;
  border-top-left-radius: 4px;
  border-top-right-radius: 0;
}
</style>

<script setup>
import bus from "../lib/eventbus";
import { computed, getCurrentInstance, onMounted, ref } from "vue";

defineProps(["buttonClass", "buttonTitle", "disabled", "alignStart"]);

const instance = getCurrentInstance();
const root = instance.proxy.$root;
const isOpen = ref(false);
const shiftAmountsByKey = {
  ArrowUp: -1,
  ArrowDown: 1,
  ArrowLeft: -1,
  ArrowRight: 1,
  Home: -Infinity,
  End: Infinity,
};
const items = computed(() => Array.from(instance.proxy.$refs.list.children));
const toggle = () => {
  isOpen.value = !isOpen.value;
  root.closePickers({ isTrusted: true }, null, {
    callCloseDropdowns: false,
  });
  root.closeDropdowns({ isTrusted: true }, instance.proxy); // close other dropdowns
  if (isOpen.value) {
    instance.proxy.$nextTick(() => {
      instance.proxy.$refs.list.firstElementChild.focus();
    });
  }
};
const listClick = (e) => {
  if (e.target.closest("li")) {
    root.closeDropdowns();
  }
};
const handleKeys = (e) => {
  const element = instance.proxy.$refs.list;
  if (e.ctrlKey || e.metaKey || e.altKey) return;
  if (e.key === "Tab") {
    instance.proxy.$refs.button.focus(); // then let the default behavior of tab take over
    root.closeDropdowns();
  } else if (document.activeElement.tagName === "LI" && e.key === "Enter") {
    document.activeElement.click();
  } else {
    const shiftBy = shiftAmountsByKey[e.key];
    if (shiftBy) e.preventDefault();
    else return;

    const oldFocusIndex = items.value.indexOf(document.activeElement);
    const adjustedFocusIndex = oldFocusIndex + shiftBy;
    const newFocusIndex = Math.min(Math.max(adjustedFocusIndex, 0), element.childElementCount - 1);
    const targetElement = element.children[newFocusIndex];
    targetElement.focus();
  }
};
const closeDropdowns = (...params) => root.closeDropdowns(...params);

onMounted(() => {
  bus.$on("close-dropdowns", (except) => {
    if (isOpen.value && except !== instance.proxy) {
      isOpen.value = false;
    }
  });
});
</script>
