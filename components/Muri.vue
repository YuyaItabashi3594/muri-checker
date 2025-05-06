<script setup lang="ts">
import { useOsuFileStore } from "@/stores/osuFile";
import { checkMuriSaras, checkMuriLN } from "@/utils/muriCheck";
const osuFileStore = useOsuFileStore();

const muriSaras = ref<string[]>([]);
const muriSarasLN = ref<string[]>([]);

watch(
  () => osuFileStore.fileContent,
  () => {
    muriSaras.value = checkMuriSaras(osuFileStore.fileContent);
    muriSarasLN.value = checkMuriLN(osuFileStore.fileContent);
  }
);
</script>

<template>
  <div class="rounded border border-gray-700 p-4">
    <h1 class="text-2xl font-bold text-center mb-4">Muri Checker</h1>
    <div v-if="osuFileStore.is16kMania">
      <div v-if="muriSaras.length > 0 || muriSarasLN.length > 0">
        <div class="rounded-lg bg-gray-800 p-4 w-[600px]">
          <p class="text-red-400 text-center mb-4"><Icon name="mdi:alert" /> Muri saras are found!</p>
          <div
            v-if="muriSaras.length > 0"
            v-for="muriSara in muriSaras"
            :key="muriSara"
            class="mb-4"
          >
            <NuxtLink :to="`osu://edit/${muriSara}`"><span class="rounded-lg bg-gray-700 hover:bg-gray-600 transition-all duration-150 p-2 ">{{ muriSara }}</span></NuxtLink>
          </div>
          <div
            v-if="muriSarasLN.length > 0"
            v-for="muriSaraLN in muriSarasLN"
            :key="muriSaraLN"
            class="mb-4"
          >
            <NuxtLink :to="`osu://edit/${muriSaraLN}`"><span class="rounded-lg bg-gray-700 hover:bg-gray-600 transition-all duration-150 p-2">{{ muriSaraLN }}</span></NuxtLink>
          </div>
        </div>
      </div>
      <div v-else class="w-[600px] bg-green-900 p-4 rounded-lg">
        <p class="text-center"><Icon name="mdi:check" /> No muri saras found!</p>
      </div>
    </div>
    <div v-else>
      <p>Wait for the map to be loaded</p>
    </div>
  </div>
</template>