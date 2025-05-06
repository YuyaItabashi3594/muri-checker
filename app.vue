<script setup lang="ts">
import { useOsuFileStore } from "@/stores/osuFile";
const osuFileStore = useOsuFileStore();

const isWrong = ref(false);

onMounted(() => {
  osuFileStore.clearFile()
})

function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  if (input.files && input.files.length > 0) {
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      osuFileStore.setFile(e.target?.result as string, file.name);
      isWrong.value = !osuFileStore.is16kMania;
      console.log(osuFileStore.is16kMania);
    };
    reader.readAsText(file);
  }
}
</script>

<template>
  <div
    class="flex flex-col items-center justify-center gap-4 text-white"
  >
    <HeroTitle />
    <p class="text-center">Select a 14K2S mania osu! file</p>
    <input type="file" @change="onFileChange" accept=".osu" />
    <div v-if="isWrong" class="text-red-500 text-2xl font-bold">
      This is not a 16k mania map
    </div>
    <div class="flex flex-col items-center justify-center gap-4">
      <Muri />
      <Rinsetsu />
    </div>
  </div>
</template>

<style>
body {
  background-color: #1e1e1e;
}
</style>
