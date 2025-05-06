import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useOsuFileStore = defineStore('osuFile', () => {
  const fileContent = ref('')
  const fileName = ref('')

  const is16kMania = computed(() => {
    const modeMatch = fileContent.value.match(/Mode:\s*3/)
    const csMatch = fileContent.value.match(/CircleSize:\s*16/)
    return !!modeMatch && !!csMatch
  })

  function setFile(content: string, name: string) {
    fileContent.value = content
    fileName.value = name
  }

  function clearFile() {
    fileContent.value = ''
    fileName.value = ''
  }

  return {
    fileContent,
    fileName,
    is16kMania,
    setFile,
    clearFile
  }
})