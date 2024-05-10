import { defineComponent, ref, computed, watch } from "vue";
import classNames from "classnames";
import { DashboardHeader } from "../components/Header";
import { DashboardLeftside } from "../components/Leftside";
import imports from "../utils/imports";
import eventListenerMixin from "../plugins/eventListenerMixin";
import { SaveCard } from "../components/ui/Card";

export default defineComponent({
  name: "Dashboard",
  props: {
    title: {
      type: String,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    className: {
      type: String,
      required: false,
    },
    showSaveCard: {
      type: Boolean,
      default: false,
    },
    isLoaded: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["toggle", "save"],
  setup() {
    const showLeftside = ref(false);
    const { store, router, route } = imports();

    const currentGuild = computed(() => {
      const guilds = store.getters._getGuilds.added;
      return (
        guilds?.filter((guild: any) => guild.id == route.params.id)[0] ??
        ({} as any)
      );
    });

    watch(currentGuild, (newVal) => {
      if (!newVal?.id) router.push("/my-servers");
    });

    eventListenerMixin.click([{ id: "DashboardLeftside", ref: showLeftside }]);

    return {
      showLeftside,
      currentGuild,
    };
  },
  render() {
    return (
      <>
        <DashboardHeader
          onShowLeftside={() => (this.showLeftside = !this.showLeftside)}
        />
        <div
          v-motion-slide-visible-once-right
          class={classNames("lg:ml-[300px] max-lg:pt-20 lg:pt-32 py-20")}
        >
          {this.$props.title && this.$props.description && (
            <div
              class={classNames(
                "transition-all duration-300 flex flex-col m-auto w-[95%] lg:w-[90%] mb-6 gap-y-2",
                this.showLeftside ? "opacity-60" : "opacity-100"
              )}
            >
              <h1 class="transition-all text-black dark:text-gray-100 font-poppins-bold text-2xl opacity-90">
                {this.$props.title}
              </h1>
              <p class="transition-all text-black dark:text-gray-100 font-poppins-regular opacity-60 text-sm">
                {this.$props.description}
              </p>
            </div>
          )}
          <div
            class={classNames(
              "transition-all duration-300 flex flex-col items-center mt-2",
              this.$props.className,
              this.showLeftside ? "opacity-60" : "opacity-100"
            )}
          >
            {this.$slots.default?.()}
          </div>
        </div>
        <DashboardLeftside
          currentGuild={this.currentGuild}
          isOpen={this.showLeftside}
          onShowLeftside={() => (this.showLeftside = !this.showLeftside)}
        />

        <div class="flex flex-col items-center lg:ml-[300px]">
          <SaveCard
            isOpen={this.showSaveCard}
            onSave={() => this.$emit("save")}
            isLoaded={this.isLoaded}
          />
        </div>
      </>
    );
  },
});
