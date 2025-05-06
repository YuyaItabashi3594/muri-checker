<script setup lang="ts">
import { useOsuFileStore } from "@/stores/osuFile";
import { checkRinsetsuSaras, checkRinsetsuLN } from "@/utils/rinsetsuCheck";

const osuFileStore = useOsuFileStore();

const rinsetsuSaras = ref<string[]>([]);
const rinsetsuSarasLN = ref<string[]>([]);

watch(
  () => osuFileStore.fileContent,
  () => {
    rinsetsuSaras.value = checkRinsetsuSaras(osuFileStore.fileContent);
    rinsetsuSarasLN.value = checkRinsetsuLN(osuFileStore.fileContent);
  }
);
</script>

<template>
  <div class="rounded border border-gray-700 p-4">
    <h1 class="text-2xl font-bold text-center mb-4">Rinsetsu Checker</h1>
    <div v-if="osuFileStore.is16kMania">
      <div v-if="rinsetsuSaras.length > 0 || rinsetsuSarasLN.length > 0">
        <div class="rounded-lg bg-gray-800 p-4 w-[600px]">
          <p class="text-yellow-400 text-center mb-4"><Icon name="mdi:alert" /> Rinsetsu saras are found!</p>
          <div
            v-if="rinsetsuSaras.length > 0"
            v-for="rinsetsuSara in rinsetsuSaras"
            :key="rinsetsuSara"
            class="mb-4"
          >
            <NuxtLink :to="`osu://edit/${rinsetsuSara}`"><span class="rounded-lg bg-gray-700 hover:bg-gray-600 transition-all duration-150 p-2">{{ rinsetsuSara }}</span></NuxtLink>
          </div>
          <div
            v-if="rinsetsuSarasLN.length > 0"
            v-for="rinsetsuSaraLN in rinsetsuSarasLN"
            :key="rinsetsuSaraLN"
            class="mb-4"
          >
            <NuxtLink :to="`osu://edit/${rinsetsuSaraLN}`"><span class="rounded-lg bg-gray-700 hover:bg-gray-600 transition-all duration-150 p-2">{{ rinsetsuSaraLN }}</span></NuxtLink>
          </div>
        </div>
      </div>
      <div v-else class="w-[600px] bg-green-900 p-4 rounded-lg">
        <p class="text-center"><Icon name="mdi:check" /> No rinsetsu saras found!</p>
      </div>
    </div>
    <div v-else>
      <p>Wait for the map to be loaded</p>
    </div>
  </div>
</template>