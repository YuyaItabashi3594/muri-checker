<script setup lang="ts">
import { useOsuFileStore } from '@/stores/osuFile'
import { checkMuriSaras } from '@/utils/muriCheck'
const osuFileStore = useOsuFileStore()

const muriSaras = ref<string[]>([])

watch(() => osuFileStore.fileContent, () => {
  muriSaras.value = checkMuriSaras(osuFileStore.fileContent)
})

</script>

<template>
  <div>
    <h1>Muri Checker</h1>
    <div v-if="osuFileStore.is16kMania">
    <div v-if="muriSaras.length > 0">
      <p>
        Muri saras found!!!!!
      </p>
      <div v-for="muriSara in muriSaras" :key="muriSara">
        <NuxtLink :to="`osu://edit/${muriSara}`">{{ muriSara }}</NuxtLink>
      </div>
    </div>
    <div v-else>
      <p>
        No muri saras found
      </p>
      </div>
    </div>
    <div v-else>
      <p>
        Wait for the map to be loaded
      </p>
    </div>
  </div>
</template>


