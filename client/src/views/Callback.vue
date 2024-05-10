<template>
    <Loading />
</template>

<script setup lang="ts">
import imports from "../utils/imports";
import { Loading } from "../components/shared/Loader";

const { getReq, route, router, store, onMounted } = imports();

onMounted(async () => {
    getReq(`/callback?code=${route.query.code}`)
        .then((res) => {
            localStorage.setItem(
                "user_data",
                JSON.stringify({
                    ...JSON.parse(localStorage.getItem("user_data") ?? ""),
                    access_token: res.data.access_token,
                })
            );
            store.initGuild();
            store._isLogin = true;
            store.getters._getUser = res.data;
            router.push("/my-servers");
        })
        .catch(() => {
            router.push("/logout");
        });
});
</script>
