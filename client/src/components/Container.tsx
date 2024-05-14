import { cn } from "../lib/utilts";
import { SaveCard } from "./ui/card";
import imports from "../utils/imports";
import eventListenerMixin from "../mixins/eventListener";
import { DashboardLeftside } from "../components/Leftside";
import { defineComponent, ref, computed, watch } from "vue";
import { DashboardHeader, AppHeader } from "../components/Header";

export const AppContainer = defineComponent({
  props: {
    animation: {
      type: String,
      default: "left",
    },
  },
  render() {
    return (
      <>
        <AppHeader />
        <div class="transition-all duration-700 flex flex-col items-center mb-20 mt-16 lg:mt-20 w-full">
          <div v-motion-slide-visible-once-left>
            {this.$slots.default ? this.$slots.default() : null}
          </div>
        </div>
      </>
    );
  },
});

export const DashboardContainer = defineComponent({
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
    isSaveLoaded: {
      type: Boolean,
      default: true,
    },
  },
  emits: ["save"],
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
          class="lg:ml-[300px] max-lg:pt-20 lg:pt-32 py-20"
        >
          {this.$props.title && this.$props.description && (
            <div
              class={cn(
                "transition-all flex flex-col m-auto w-[95%] lg:w-[90%] mb-6 gap-y-2",
                this.showLeftside
                  ? "max-lg:opacity-60 max-lg:pointer-events-none max-lg:blur-sm"
                  : "opacity-100"
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
            class={cn(
              "transition-all flex flex-col items-center mt-2",
              this.showLeftside
                ? "max-lg:opacity-60 max-lg:pointer-events-none max-lg:blur-sm"
                : "opacity-100"
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
            isOpen={this.$props.showSaveCard}
            isSaveLoaded={this.$props.isSaveLoaded}
            onSave={() => this.$emit("save")}
          />
        </div>
      </>
    );
  },
});
