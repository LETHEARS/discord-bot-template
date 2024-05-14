import { createApp } from "vue";

import "./assets/globals.css";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import VueLazyLoad from "vue3-lazyload";
import { MotionPlugin } from "@vueuse/motion";
import i18n from "./plugins/i18n/index.ts";
import theme from "./plugins/theme/index.ts";
import { AppContainer, DashboardContainer } from "./components/Container.tsx";

const app = createApp(App);

app.component("appContainer", AppContainer);
app.component("dashboardContainer", DashboardContainer);

app.use(i18n);
app.use(theme);
app.use(router);
app.use(MotionPlugin);
app.use(createPinia());
app.use(VueLazyLoad, {});

app.mount("#root");
