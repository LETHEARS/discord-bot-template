import { defineComponent } from "vue";
import imports from "../utils/imports";
import classNames from "classnames";
import { AppHeader } from "../components/Header";

interface Guild {
  id: string;
  name: string;
  icon: string;
  isOwner: boolean;
}

const Guilds = defineComponent({
  name: "Guild",
  props: {
    guilds: {
      type: Array as () => Guild[],
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
    const { $t, $slots, guilds } = this;

    if (guilds.length <= 0)
      return (
        <>
          <div
            v-motion-slide-visible-once-bottom
            class="max-sm:w-dvw animate-pulse pointer-events-none"
          >
            <div class="flex flex-col justify-center items-center">
              <div class="w-[90%] sm:w-full lg:w-[262px] h-[152px] rounded-lg overflow-hidden relative">
                <div
                  class={classNames(
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
                  class={classNames(
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

    if (guilds?.length && guilds?.length > 0)
      return guilds.map((guild: any) => (
        <router-link
          v-motion-slide-visible-once-bottom
          to={`/dashboard/${guild.id}`}
          class="group max-sm:w-dvw"
        >
          <div class="flex flex-col justify-center items-center">
            <div class="w-[90%] sm:w-full lg:w-[262px] h-[152px] rounded-lg overflow-hidden relative">
              <div
                class={classNames(
                  "transition-all absolute inset-0 bg-cover blur-[10px] scale-125 opacity-60 dark:opacity-30 bg-center bg-black"
                )}
                style={this.getBackgroundImage(guild)}
              ></div>
            </div>
            <div
              class={classNames(
                "transition-all absolute w-20 h-20 bg-cover rounded-[50%] border-2 border-solid border-white bg-black"
              )}
              style={this.getBackgroundImage(guild)}
            ></div>
          </div>

          <div class="flex items-center justify-between max-sm:w-[90%] max-lg:w-full m-auto mt-2">
            <p class="transition-all flex flex-col items-start text-black dark:text-gray-100">
              <span class="font-poppins-bold font-bold text-base">
                {guild.name.length > 20
                  ? guild.name.slice(0, 20) + "..."
                  : guild.name}
              </span>
              <span class="font-poppins-regular text-sm opacity-50">
                {$t(
                  `MyServers.Permissions.${guild.owner ? "owner" : "admin"}`
                )}
              </span>
            </p>
            {$slots.default ? $slots.default() : null}
          </div>
        </router-link>
      ));
  },
});

const MyServers = defineComponent({
  name: "MyServers",
  setup() {
    const { store, computed } = imports();

    const added = computed(() => store?.getters?._getGuilds?.added ?? []);
    const notAdded = computed(() => store?.getters?._getGuilds?.notAdded ?? []);

    return { added, notAdded };
  },
  render() {
    const { $t, added, notAdded } = this;

    return (
      <div class="transition-all duration-700 flex flex-col items-center mb-20 mt-20 lg:mt-32 w-full">
        <AppHeader />
        <h1 class="transition-all flex justify-center mb-6 lg:mb-12 font-poppins-bold text-3xl lg:text-4xl text-black dark:text-gray-100">
          {$t("MyServers.title")}
        </h1>

        {added == null && notAdded == null ? (
          <p
            v-motion-slide-visible-once-bottom
            class="flex justify-center font-poppins-100 text-lg text-black dark:text-gray-100"
          >
            {$t("MyServers.errorMessage")}
          </p>
        ) : (
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-10 max-sm:w-full max-lg:w-[90%]">
            <Guilds guilds={added as any}>
              <div class="flex items-center transition-all px-4 py-2.5 font-poppins-regular rounded-lg text-base bg-teal-500 bg-opacity-40 group-hover:bg-opacity-50 dark:bg-teal-950 dark:group-hover:bg-opacity-70 text-black dark:text-gray-100">
                {$t("MyServers.Button.go")}
              </div>
            </Guilds>
            <Guilds guilds={notAdded as any}>
              <div class="flex items-center transition-all px-4 py-2.5 font-poppins-regular rounded-lg text-base bg-gray-400 bg-opacity-20 dark:bg-opacity-10 dark:group-hover:bg-opacity-20 group-hover:bg-opacity-30 text-black dark:text-gray-100">
                {$t("MyServers.Button.add")}
              </div>
            </Guilds>
          </div>
        )}
      </div>
    );
  },
});

export default MyServers;
