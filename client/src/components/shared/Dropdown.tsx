import { defineComponent } from "vue";
import imports from "../../utils/imports";
import { ArrowIcon, AddIcon } from "../ui/Icon";
import { BaseButton } from "../ui/Base";
import { Dropdown, DropdownButton, DropdownTitle } from "../ui/Dropdown";
import { availableLanguages } from "../../plugins/i18next";
import { Spinner } from "./Loader";
import classNames from "classnames";
import eventListenerMixin from "../../plugins/eventListenerMixin";

const ProfileDropdown = defineComponent({
  name: "ProfileDropdown",
  setup() {
    const { reactive, store, computed, onMounted, onUnmounted } = imports();

    const showDropdown = reactive({
      profileDropdown: false,
      languageDropdown: false,
    });

    const user = computed(() => {
      return store.getters._getUser;
    });

    const avatarURL = computed(() => {
      if (user.value?.avatar) {
        return `https://cdn.discordapp.com/avatars/${user.value.id}/${user.value.avatar}.png`;
      } else {
        const discriminator = user.value?.discriminator || "0";
        const uri_char = parseInt(discriminator.slice(-1), 10) % 5;
        return `https://cdn.discordapp.com/embed/avatars/${uri_char}.png`;
      }
    });

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const profileDropdownElement = document.getElementById("ProfileDropdown");
      if (!profileDropdownElement?.contains(target)) {
        if (showDropdown.profileDropdown) {
          if (showDropdown.languageDropdown) {
            showDropdown.languageDropdown = false;
          } else {
            showDropdown.profileDropdown = false;
          }
        }
      }
    };

    onMounted(() => {
      document.addEventListener("click", handleClickOutside);
    });

    onUnmounted(() => {
      document.removeEventListener("click", handleClickOutside);
    });

    return {
      showDropdown,
      avatarURL,
      user,
      store,
    };
  },

  render() {
    const { VITE_DISCORD_SUPPORT_SERVER, VITE_DISCORD_OAUTH2_URL } = import.meta
      .env;
    const { showDropdown, $t, $i18next, avatarURL, user, store } = this;

    if (!store._isLogin) {
      return (
        <BaseButton redirect={VITE_DISCORD_OAUTH2_URL}>
          {$t("Dropdown.ProfileDropdown.Button.login")}
        </BaseButton>
      );
    }

    return (
      <div id="ProfileDropdown" class="relative">
        {/**Open Profile Dropdown */}
        <button
          class="flex items-center lg:gap-x-1 text-black dark:text-gray-100 font-poppins-regular text-base"
          onClick={() => {
            showDropdown.profileDropdown = !showDropdown.profileDropdown;
            showDropdown.languageDropdown = false;
          }}
        >
          <img v-lazy={avatarURL} class="w-8 h-8 rounded-full" alt="Avatar" />
          <span class="transition-all max-lg:hidden ml-1">
            {user.global_name}
          </span>
          <ArrowIcon
            isActive={
              showDropdown.profileDropdown || showDropdown.languageDropdown
            }
          />
        </button>

        {/**Profile Dropdown */}
        <Dropdown
          className="right-0 z-20 w-[228px] py-1.5"
          isOpen={
            showDropdown.profileDropdown && !showDropdown.languageDropdown
          }
        >
          <DropdownTitle>{import.meta.env.VITE_PROJECT_TITLE}</DropdownTitle>
          <DropdownButton>test</DropdownButton>
          <DropdownTitle>
            {$t("Dropdown.ProfileDropdown.Title.server")}
          </DropdownTitle>
          <DropdownButton to="/my-servers">
            {$t("Dropdown.ProfileDropdown.Button.servers")}
          </DropdownButton>
          <DropdownTitle>
            {$t("Dropdown.ProfileDropdown.Title.payment")}
          </DropdownTitle>
          <DropdownButton to="/billing">
            {$t("Dropdown.ProfileDropdown.Button.billing")}
          </DropdownButton>
          <DropdownTitle>
            {$t("Dropdown.ProfileDropdown.Title.settings")}
          </DropdownTitle>
          <DropdownButton
            onClick={() => {
              const currentTheme =
                localStorage.getItem("theme")?.toLowerCase() ?? "dark";
              const classList = document.documentElement.classList;
              if (/dark/.test(currentTheme)) {
                localStorage.setItem("theme", "light");
                classList.remove("dark");
                classList.add("light");
              } else {
                localStorage.setItem("theme", "dark");
                classList.add("dark");
                classList.remove("light");
              }
            }}
          >
            {$t("Dropdown.ProfileDropdown.Button.theme")}
          </DropdownButton>
          <DropdownButton
            onClick={() =>
              (showDropdown.languageDropdown = !showDropdown.languageDropdown)
            }
          >
            {$t("Dropdown.ProfileDropdown.Button.language")}
          </DropdownButton>
          <DropdownButton redirect={VITE_DISCORD_SUPPORT_SERVER}>
            {$t("Dropdown.ProfileDropdown.Button.support")}
          </DropdownButton>
          <DropdownButton to="/logout">
            {$t("Dropdown.ProfileDropdown.Button.logout")}
          </DropdownButton>
        </Dropdown>

        {/**Language Dropdwon */}
        <Dropdown isOpen={showDropdown.languageDropdown}>
          {availableLanguages.map((language) => (
            <DropdownButton
              onClick={() => {
                $i18next.changeLanguage(language.lng);
                localStorage.setItem("lng", language.lng);
                showDropdown.languageDropdown = false;
              }}
            >
              {language.name}
            </DropdownButton>
          ))}
        </Dropdown>
      </div>
    );
  },
});

const GuildsDropdown = defineComponent({
  name: "GuildsDropdown",
  setup() {
    const { ref, store, computed } = imports();

    const showGuildsDropdown = ref(false);

    const added = computed(() => {
      return store.getters._getGuilds.added ?? [];
    });

    const toggleOpen = () =>
      (showGuildsDropdown.value = !showGuildsDropdown.value);

    eventListenerMixin.click([
      { id: "GuildsDropdown", ref: showGuildsDropdown },
    ]);

    return {
      showGuildsDropdown,
      toggleOpen,
      added,
      store,
    };
  },
  props: { currentGuild: { type: Object, required: true } },
  render() {
    const { showGuildsDropdown, currentGuild, toggleOpen, added } = this;

    if (!currentGuild?.id || added.length < 0) {
      return (
        <button class="flex justify-between py-3 px-4 w-full overflow-hidden text-black dark:text-gray-100 bg-gray-100 dark:bg-dark-200 rounded-lg transition-all border border-solid dark:border-dark-100 pointer-events-none">
          <Spinner className="w-6 h-6" />
          <ArrowIcon isActive={showGuildsDropdown} />
        </button>
      );
    }

    return (
      <div class="relative w-full" id="GuildsDropdown">
        <button
          onClick={toggleOpen}
          class={classNames(
            "transition-all flex justify-between w-full py-3 px-4 rounded-lg border border-solid text-black dark:text-gray-100 bg-gray-100 dark:bg-dark-200 dark:border-dark-100",
            showGuildsDropdown
              ? "ring-opacity-30 ring-[4px] ring-teal-700"
              : "dark:hover:border-opacity-60 md:hover:border-teal-400"
          )}
        >
          <div class="flex items-center gap-x-2">
            <img
              alt="currentGuild"
              v-lazy={
                currentGuild.icon
                  ? `https://cdn.discordapp.com/icons/${currentGuild.id}/${currentGuild.icon}.webp`
                  : `https://cdn.discordapp.com/embed/avatars/2.png`
              }
              class="w-6 h-6 rounded-full"
            />
            <p class="transition-all font-poppins-bold text-black dark:text-gray-100 overflow-hidden text-base">
              {currentGuild.name}
            </p>
          </div>

          <ArrowIcon
            className="transition-all text-black dark:text-gray-100"
            isActive={showGuildsDropdown}
          />
        </button>

        <Dropdown
          isOpen={showGuildsDropdown}
          className="w-full max-md:mb-6 max-lg:mb-3 lg:mb-6 z-50 overflow-auto p-2 max-h-[320px]"
        >
          {added.map((guild) => (
            <router-link
              to={`/dashboard/${guild.id}`}
              class={classNames(
                "flex items-center w-full gap-x-3 p-2 rounded-lg transition hover:bg-opacity-10 dark:hover:bg-opacity-5 text-base text-black dark:text-gray-100 hover:bg-gray-400",
                currentGuild.id == guild.id
                  ? "bg-gray-400 bg-opacity-20 dark:bg-opacity-10"
                  : ""
              )}
            >
              <img
                v-lazy={
                  guild?.icon
                    ? `https://cdn.discordapp.com/icons/${guild.id}/${guild.icon}.webp`
                    : `https://cdn.discordapp.com/embed/avatars/2.png`
                }
                class="w-6 h-6 rounded-full"
              />
              <p class="text-black dark:text-gray-100 font-poppins-bold text-base">
                {guild.name.length > 20
                  ? guild.name.slice(0, 20) + "..."
                  : guild.name}
              </p>
            </router-link>
          ))}
          <div class="h-[2px] bg-gray-400 opacity-20 rounded-full w-full my-2"></div>
          <router-link
            to="/my-servers"
            class="transition-all flex items-center font-poppins-regular p-1.5 gap-x-4 text-sm w-full text-black dark:text-gray-100 hover:text-green-600 dark:hover:text-green-400"
          >
            <AddIcon />
            {this.$t("Dropdown.GuildsDropdown.Button.add")}
          </router-link>
        </Dropdown>
      </div>
    );
  },
});

const ChannelsDropdown = defineComponent({
  name: "ChannelsDropdown",
  props: {
    id: { type: String, default: "ChannelsDropdown" },
    isOpen: { type: Boolean, default: false },
    title: { type: String, default: "" },
    description: { type: String, default: "" },
    channels: { type: Array, default: [] },
    selectedChannels: { type: [Array, String] },
    selectedChannel: { type: [String, Object] },
    maxSelectedChannels: { type: Number, default: 1 },
  },
  emits: ["show", "select"],
  render() {
    const {
      channels,
      title,
      description,
      selectedChannels,
      selectedChannel,
      isOpen,
    } = this;

    if (channels.length < 1) {
      return (
        <button class="flex justify-between py-3 px-4 w-full md:w-96 my-2 overflow-hidden text-black dark:text-gray-100 bg-gray-100 dark:bg-dark-200 rounded-lg transition-all border border-solid dark:border-dark-100 pointer-events-none">
          <Spinner className="w-5 h-5" />
          <ArrowIcon className="" isActive={isOpen} />
        </button>
      );
    }

    return (
      <>
        <div class="text-sm opacity-80 pl-1 font-poppins-regular text-black dark:text-gray-100">
          {title}
        </div>

        <div class="transition-all relative w-full md:w-96 my-2">
          <button
            id={this.id}
            onClick={() => this.$emit("show")}
            class={classNames(
              "transition-all group flex justify-between py-3 px-4 w-full rounded-lg border border-solid dark:hover:border-opacity-60 text-opacity-60 hover:text-opacity-100 dark:text-opacity-60 dark:hover:text-opacity-100 text-black dark:text-gray-100 bg-gray-100 dark:bg-dark-200 dark:border-dark-100",
              isOpen
                ? "ring-opacity-30 ring-[4px] ring-teal-700"
                : "dark:hover:border-opacity-60 md:hover:border-teal-400"
            )}
          >
            <div class="flex items-center gap-x-3">
              <AddIcon className="transition-all text-black dark:text-gray-100 opacity-60 group-hover:opacity-100" />
              {selectedChannel &&
                (selectedChannel == "select" ? (
                  <h1 class="transition-all font-poppins-regular text-black dark:text-gray-100 overflow-hidden text-sm opacity-80 group-hover:opacity-100">
                    {this.$t("Dropdown.ChannelsDropdown.Button.select")}
                  </h1>
                ) : (
                  <div class="transition-all font-poppins-regular text-black dark:text-gray-100 overflow-hidden text-sm opacity-80 group-hover:opacity-100">
                    {(selectedChannel as any).name}
                  </div>
                ))}

              {selectedChannels &&
                (selectedChannels == "select" ? (
                  <h1 class="transition-all font-poppins-regular text-black dark:text-gray-100 overflow-hidden text-sm opacity-80 group-hover:opacity-100">
                    {this.$t("Dropdown.ChannelsDropdown.Button.select")}
                  </h1>
                ) : (
                  <div>test</div>
                ))}
            </div>
            <ArrowIcon
              className="transition-all text-black dark:text-gray-100 opacity-60 group-hover:opacity-100"
              isActive={isOpen}
            />
          </button>

          <Dropdown
            isOpen={isOpen}
            className="w-full max-md:mb-6 max-lg:mb-3 lg:mb-6 z-50 overflow-auto p-2 max-h-[320px]"
          >
            {channels.map((channel: any) => (
              <DropdownButton
                className="w-[100%]"
                onClick={() => this.$emit("select", channel.id)}
              >
                {channel.name}
              </DropdownButton>
            ))}
          </Dropdown>
        </div>

        <div class="flex items-center text-xs opacity-60 max-w-96 pl-1 font-poppins-regular text-black dark:text-gray-100">
          {description}
        </div>
      </>
    );
  },
});

export { ProfileDropdown, GuildsDropdown, ChannelsDropdown };
