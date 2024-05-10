<template>
  <Progress :value="store._isProgress" />
  <Loading v-if="store._isLoading" />
  <div v-else :class="classNames(
    'transition-all',
    store._isProgress >= 100
      ? 'opacity-100'
      : 'pointer-events-none opacity-60'
  )
    ">
    <RouterView />
  </div>
</template>

<script setup lang="ts">
import imports from "./utils/imports";
import { RouterView } from "vue-router";
import { Progress, Loading } from "./components/shared/Loader";
import classNames from "classnames";

const { store } = imports();

store._isProgress = 20;

store.initUser().then(() => {
  store._isProgress = 40;
  store._isLoading = false;
});

store.initGuild().then(() => {
  store._isProgress = 100;
});
</script>
