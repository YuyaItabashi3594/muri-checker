import type { LongNote } from '@/types/longNote'

export const parseHitObjects = (fileContent: string) => {
  // [HitObjects]以降を抽出
  const hitObjectsSection = fileContent.split('[HitObjects]')[1]
  if (!hitObjectsSection) return []
  const lines = hitObjectsSection.trim().split('\n')
  // LN以外（type=1,5など128未満）を抽出
  return lines
    .map(line => line.split(','))
    .filter(parts => parts.length >= 5 && (parseInt(parts[3]) & 128) === 0)
    .map(parts => ({
      x: parseInt(parts[0]),
      time: parseInt(parts[2])
    }))
}

export const parseLongNotes = (fileContent: string): LongNote[] => {
  const hitObjectsSection = fileContent.split('[HitObjects]')[1]
  if (!hitObjectsSection) return []
  const lines = hitObjectsSection.trim().split('\n')
  
  // LNのみ（type=128）を抽出
  return lines
    .map(line => line.split(','))
    .filter(parts => parts.length >= 6 && (parseInt(parts[3]) & 128) === 128)
    .map(parts => ({
      x: parseInt(parts[0]),
      startTime: parseInt(parts[2]),
      endTime: parseInt(parts[5].split(':')[0]),
      column: Math.floor(parseInt(parts[0]) * 16 / 512)
    }))
}

export const groupByTime = (hitObjects: {x: number, time: number}[]) => {
  // timeごとにグループ化
  const map = new Map<number, number[]>()
  for (const obj of hitObjects) {
    if (!map.has(obj.time)) map.set(obj.time, [])
    map.get(obj.time)!.push(obj.x)
  }
  return map
}

export const formatTime = (ms: number): string => {
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  const millis = ms % 1000
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(millis).padStart(3, '0')}`
}