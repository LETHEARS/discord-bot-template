import imports from "../utils/imports";
import { Loading } from "../components/shared/Loader";
import { defineComponent } from "vue";

export default defineComponent({
  setup() {
    const { router, store } = imports();

    store._isLogin = false;
    store.getters._getUser = null;
    store.getters._getGuilds = { added: null, notAdded: null };

    const userData = JSON.parse(localStorage.getItem("user_data") ?? "{}");
    delete userData?.access_token;

    localStorage.setItem("user_data", JSON.stringify(userData));

    router.push("/");
  },
  render() {
    return <Loading />;
  },
});
