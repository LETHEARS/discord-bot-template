<template>
    <dashboard-layout :isLoaded="isLoaded" @save="onSubmit" :showSaveCard="showSaveCard"
        :title="$t('Dashboard.Essantials.Welcome.title')" :description="$t('Dashboard.Essantials.Welcome.description')">
        <BaseToggleCard @toggle="isActive = !isActive" :isOpen="isActive"
            :title="$t('Dashboard.Essantials.Welcome.CheckCard.title')"
            :description="$t('Dashboard.Essantials.Welcome.CheckCard.description')" />

        <BaseCard :isOpen="isActive">
            <ChannelsDropdown :title="$t('Dashboard.Essantials.Welcome.Dropdown.ChannelDropdown.title')"
                :description="$t('Dashboard.Essantials.Welcome.Dropdown.ChannelDropdown.description')"
                @select="onChangeChannel" @show="showChannelsDropdown = !showChannelsDropdown"
                :isOpen="showChannelsDropdown" :channels="currentGuild.channels"
                :selectedChannel="state.channel_id == 'select' ? 'select' : currentGuild.channels?.find((channel: any) => channel.id == state.channel_id)" />
        </BaseCard>
    </dashboard-layout>
</template>

<script setup lang="ts">
import { BaseToggleCard, BaseCard } from "../components/ui/Card";
import { ChannelsDropdown } from "../components/shared/Dropdown";
import imports from "../utils/imports";
import eventListenerMixin from "../plugins/eventListenerMixin";

const { route, store, ref, computed, reactive, watchEffect, watch } =
    imports();

const currentGuild = computed(() => {
    const guilds = store.getters._getGuilds.added;
    return (
        guilds?.filter((guild: any) => guild.id == route.params.id)[0] ??
        ({} as any)
    );
});

const state = reactive({
    channel_id:
        currentGuild.value.channels?.find(
            (channel: any) =>
                channel.id == currentGuild.value.states?.essantials?.welcome?.channel_id
        )?.id ?? "select",
});

const onChangeChannel = (channel_id: string) => {
    showSaveCard.value = !showSaveCard.value;
    state.channel_id = channel_id;
};

const isActive = ref(
    currentGuild.value.states?.essantials?.welcome?.isActive ?? false
);
const showSaveCard = ref(false);
const showChannelsDropdown = ref(false);
const isLoaded = ref(true);

watch(currentGuild, (val) => {
    (isActive.value = val.states?.essantials?.welcome?.isActive ?? false),
        (state.channel_id =
            val.channels?.find(
                (channel: any) =>
                    channel.id ==
                    currentGuild.value.states?.essantials?.welcome?.channel_id
            )?.id ?? "select");
});

watchEffect(() => {
    showSaveCard.value =
        isActive.value !==
        (currentGuild.value.states?.essantials?.welcome?.isActive ?? false) ||
        state.channel_id !==
        (currentGuild.value.channels?.find(
            (channel: any) =>
                channel.id ==
                currentGuild.value.states?.essantials?.welcome?.channel_id
        )?.id ?? "select");
});

const onSubmit = () => {
    isLoaded.value = false;
    store.dispatch("saveGuildState", {
        guild_id: route.params.id as string,
        data: {
            isActive: isActive.value,
            channel_id: state.channel_id,
            type: "essantials.welcome",
        }
    }).then((res) => {
        if (!res.data.success) return (isLoaded.value = true);
        Object.assign(currentGuild.value.states.essantials.welcome, {
            isActive: isActive.value,
            channel_id: state.channel_id,
        });

        isLoaded.value = true;
    })
};

eventListenerMixin.click([
    { id: "ChannelsDropdown", ref: showChannelsDropdown },
]);
</script>
