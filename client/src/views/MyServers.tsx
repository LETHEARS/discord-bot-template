import { cn } from "../lib/utilts";
import { defineComponent, h } from "vue";
import imports from "../utils/imports";
import { AppHeader } from "../components/Header";

interface Guild {
  id: string;
  name: string;
  icon: string;
  owner: boolean;
}

const Preloader = defineComponent({
  render() {
    return h(
      <>
        <div
          v-motion-slide-visible-once-bottom
          class="max-sm:w-dvw animate-pulse pointer-events-none"
        >
          <div class="flex flex-col justify-center items-center">
            <div class="w-[90%] sm:w-full lg:w-[262px] h-[152px] rounded-lg overflow-hidden relative">
              <div
                class={cn(
                  "transition-all absolute inset-0 opacity-60 bg-black dark:bg-white"
                )}
              ></div>
            </div>
          </div>

          <div class="flex items-center justify-between max-sm:w-[90%] max-lg:w-full m-auto mt-2">
            <p class="flex flex-col items-start gap-y-2">
              <span class="transition-all rounded-md w-32 h-5 opacity-80 bg-black dark:bg-white"></span>
              <span class="transition-all rounded-md w-20 h-2.5 opacity-60 bg-black dark:bg-white"></span>
            </p>
            <div class="transition-all w-20 h-10 bg-black dark:bg-white rounded-md opacity-80 dark:opacity-40"></div>
          </div>
        </div>
        <div
          v-motion-slide-visible-once-bottom
          class="max-sm:w-dvw animate-pulse pointer-events-none"
        >
          <div class="flex flex-col justify-center items-center">
            <div class="w-[90%] sm:w-full lg:w-[262px] h-[152px] rounded-lg overflow-hidden relative">
              <div
                class={cn(
                  "transition-all absolute inset-0 opacity-60 bg-black dark:bg-white"
                )}
              ></div>
            </div>
          </div>

          <div class="flex items-center justify-between max-sm:w-[90%] max-lg:w-full m-auto mt-2">
            <p class="flex flex-col items-start gap-y-2">
              <span class="transition-all rounded-md w-32 h-5 opacity-80 bg-black dark:bg-white"></span>
              <span class="transition-all rounded-md w-20 h-2.5 opacity-60 bg-black dark:bg-white"></span>
            </p>
            <div class="transition-all w-20 h-10 bg-black dark:bg-white rounded-md opacity-80 dark:opacity-40"></div>
          </div>
        </div>
        <div
          v-motion-slide-visible-once-bottom
          class="max-sm:w-dvw animate-pulse pointer-events-none"
        >
          <div class="flex flex-col justify-center items-center">
            <div class="w-[90%] sm:w-full lg:w-[262px] h-[152px] rounded-lg overflow-hidden relative">
              <div
                class={cn(
                  "transition-all absolute inset-0 opacity-60 bg-black dark:bg-white"
                )}
              ></div>
            </div>
          </div>

          <div class="flex items-center justify-between max-sm:w-[90%] max-lg:w-full m-auto mt-2">
            <p class="flex flex-col items-start gap-y-2">
              <span class="transition-all rounded-md w-32 h-5 opacity-80 bg-black dark:bg-white"></span>
              <span class="transition-all rounded-md w-20 h-2.5 opacity-60 bg-black dark:bg-white"></span>
            </p>
            <div class="transition-all w-20 h-10 bg-black dark:bg-white rounded-md opacity-80 dark:opacity-40"></div>
          </div>
        </div>
      </>
    );
  },
});

const Guild = defineComponent({
  props: {
    guild: {
      type: Object as () => Guild,
      required: true,
    },
  },
  methods: {
    getBackgroundImage(guild: Guild) {
      return `background-image: url(${
        guild.icon
          ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp`
          : `https://cdn.discordapp.com/embed/avatars/2.png`
      })`;
    },
  },
  render() {
    const { $t, $slots, guild } = this;

    return (
      <div v-motion-slide-visible-once-bottom class="max-sm:w-dvw">
        <div class="flex flex-col justify-center items-center">
          <div class="w-[90%] sm:w-full lg:w-[262px] h-[152px] rounded-lg overflow-hidden relative">
            <div
              class={cn(
                "transition-all absolute inset-0 bg-cover blur-[10px] scale-125 opacity-60 dark:opacity-30 bg-center bg-black"
              )}
              style={this.getBackgroundImage(guild)}
            ></div>
          </div>
          <div
            class={cn(
              "transition-all absolute w-20 h-20 bg-cover rounded-[50%] border-2 border-solid border-white bg-black"
            )}
            style={this.getBackgroundImage(guild)}
          ></div>
        </div>

        <div class="flex items-center justify-between max-sm:w-[90%] max-lg:w-full m-auto mt-2">
          <p class="transition-all flex flex-col items-start text-black dark:text-gray-100">
            <span class="font-poppins-bold font-bold text-base">
              {guild.name.length > 18
                ? guild.name.slice(0, 18) + "..."
                : guild.name}
            </span>
            <span class="font-poppins-regular text-sm opacity-50">
              {$t(`MyServers.Permissions.${guild.owner ? "owner" : "admin"}`)}
            </span>
          </p>
          {$slots.default ? $slots.default() : null}
        </div>
      </div>
    );
  },
});

export default defineComponent({
  setup() {
    const { store, computed } = imports();

    const added = computed(() => store?.getters?._getGuilds?.added ?? []);
    const notAdded = computed(() => store?.getters?._getGuilds?.notAdded ?? []);

    return { added, notAdded };
  },
  render() {
    const { $t, added, notAdded } = this;
    const { VITE_DISCORD_INVITE_URL } = import.meta.env;

    return (
      <div class="transition-all duration-700 flex flex-col items-center mb-20 mt-20 lg:mt-32 w-full">
        <AppHeader />
        <h1 class="transition-all text-center flex justify-center mb-6 lg:mb-12 font-poppins-bold text-3xl lg:text-4xl text-black dark:text-gray-100">
          {$t("MyServers.title")}
        </h1>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-10 max-sm:w-full max-lg:w-[90%]">
          {added.length <= 0 && notAdded.length <= 0 ? (
            <Preloader />
          ) : (
            <>
              {added.map((guild) => (
                <Guild guild={guild as any}>
                  <router-link
                    to={`/dashboard/${guild.id}`}
                    class="flex items-center transition-all px-6 py-2.5 font-poppins-regular rounded-lg text-base bg-blue-500 hover:bg-blue-600 text-gray-100"
                  >
                    {$t("MyServers.Button.go")}
                  </router-link>
                </Guild>
              ))}
              {notAdded.map((guild) => (
                <Guild guild={guild as any}>
                  <button
                    onClick={() =>
                      (location.href = VITE_DISCORD_INVITE_URL + guild.id)
                    }
                    class="flex items-center transition-all px-6 py-2.5 font-poppins-regular rounded-lg text-base bg-gray-400 bg-opacity-20 dark:bg-opacity-10 dark:ghover:bg-opacity-20 hover:bg-opacity-30 text-black dark:text-gray-100"
                  >
                    {$t("MyServers.Button.add")}
                  </button>
                </Guild>
              ))}
            </>
          )}
        </div>
      </div>
    );
  },
});
