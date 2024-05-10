import { defineComponent } from "vue";
import { Leftside, LeftsideButton, LeftsideCategory } from "./ui/Leftside";
import Logo from "../assets/images/logo.png";
import { GuildsDropdown } from "./shared/Dropdown";
import { CategoryIcon, HelloIcon } from "./ui/Icon";
import imports from "../utils/imports";

const DashboardLeftside = defineComponent({
  name: "DashboardLeftside",
  props: {
    isOpen: Boolean,
    currentGuild: {
      type: Object,
      required: true,
    },
  },
  setup() {
    const { reactive } = imports();

    const category = reactive({
      essantials: true,
    });

    return { category };
  },
  emits: ["showLeftside"],
  render() {
    const { $t, $emit, isOpen, currentGuild, category } = this;

    return (
      <Leftside
        id="DashboardLeftside"
        required={true}
        isOpen={isOpen}
        direction="left"
        class="max-md:w-full md:w-[300px] items-center z-[998]"
      >
        <div class="transition-all flex w-[95%] md:w-[90%] group max-lg:justify-start lg:justify-center items-center py-3 lg:py-6 gap-x-3">
          <button
            onClick={() => $emit("showLeftside")}
            class="lg:hidden z-[999] pointer-events-auto"
          >
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="text-black dark:text-gray-100 opacity-80"
            >
              <path
                d="M20 12H9m0 0l4.588 4M9 12l4.588-4M4.75 4.75v14.5"
                stroke="currentColor"
                data-stroke="main"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              ></path>
            </svg>
          </button>

          <router-link
            to="/"
            class="flex items-center gap-x-2 group pointer-events-none"
          >
            <img
              v-lazy={Logo}
              class="transition-all w-8 group-hover:-rotate-12"
              alt="P4B"
            />
            <h1 class="transition-all text-2xl relative font-poppins-bold opacity-90 hover:opacity-100 text-dark-100 dark:text-gray-100">
              <div class="absolute ml-3 bg-gray-100 w-6 h-6 blur-3xl"></div>
              {import.meta.env.VITE_PROJECT_TITLE}
            </h1>
          </router-link>
        </div>

        <div class="transition-all flex flex-col items-start w-[95%] md:w-[90%] max-lg:pt-2">
          <GuildsDropdown currentGuild={currentGuild} class="mb-2" />
          <LeftsideButton path="/test" to="/dashboard/:id">
            <CategoryIcon />
            {$t("Dashboard.Leftside.Button.dashboard")}
          </LeftsideButton>

          <LeftsideCategory
            onClick={() => (category.essantials = !category.essantials)}
            isOpen={category.essantials}
          >
            {$t("Dashboard.Leftside.Category.essantials")}
          </LeftsideCategory>

          {category.essantials && (
            <LeftsideButton
              isActive={
                currentGuild.states?.essantials?.welcome?.isActive || false
              }
              path="/dashboard/:id/welcome"
              to="/dashboard/:id/welcome"
            >
              <HelloIcon />
              {$t("Dashboard.Leftside.Button.Essantials.welcome")}
            </LeftsideButton>
          )}
        </div>
      </Leftside>
    );
  },
});

export { DashboardLeftside };
