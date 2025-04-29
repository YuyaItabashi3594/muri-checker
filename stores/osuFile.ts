import { defineStore } from 'pinia'

export const useOsuFileStore = defineStore('osuFile', {
  state: () => ({
    fileContent: '' as string,
    fileName: '' as string,
  }),
  getters: {
    is16kMania(state): boolean {
      const modeMatch = state.fileContent.match(/Mode:\s*3/)
      const csMatch = state.fileContent.match(/CircleSize:\s*16/)
      return !!modeMatch && !!csMatch
    }
  },
  actions: {
    setFile(content: string, name: string) {
      this.fileContent = content
      this.fileName = name
    },
    clearFile() {
      this.fileContent = ''
      this.fileName = ''
    }
  }
})