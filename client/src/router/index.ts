import { createRouter, createWebHistory, RouteComponent } from "vue-router";

const routes = [
    {
        name: "homepage",
        path: "/",
        component: (): Promise<RouteComponent> => import("../views/HomePage.vue"),
    },
    {
        name: "myServers",
        path: "/my-servers",
        component: (): Promise<RouteComponent> => import("../views/MyServers"),
    },
    {
        name: "dashboard",
        path: "/dashboard/:id",
        component: (): Promise<RouteComponent> => import("../views/Dashboard.vue"),
    },
    {
        name: "welcome",
        path: "/dashboard/:id/welcome",
        component: (): Promise<RouteComponent> => import("../views/Welcome.vue"),
    },
    {
        name: "logout",
        path: "/logout",
        component: (): Promise<RouteComponent> => import("../views/Logout.vue"),
    },
    {
        name: "callback",
        path: "/callback",
        component: (): Promise<RouteComponent> => import("../views/Callback.vue"),
    },
    { path: "/:pathMatch(.*)", redirect: "/" },
];
const router = createRouter({
    routes,
    history: createWebHistory(),
});

router.beforeEach(async (to, from, next) => {
    const { VITE_DISCORD_OAUTH2_URL, VITE_PROJECT_TITLE } = import.meta.env;
    const userData = JSON.parse(localStorage.getItem("user_data") ?? "{}");

    document.title = VITE_PROJECT_TITLE;

    const authReq = ["myServers", "dashboard", "welcome"];
    const authNotReq = ["homepage", "callback"];

    if (
        !userData?.access_token &&
        authReq.includes(to.name as string) &&
        !authNotReq.includes(to.name as string)
    )
        location.href = VITE_DISCORD_OAUTH2_URL;

    next();
});

export default router;
