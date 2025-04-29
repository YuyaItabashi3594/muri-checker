const parseHitObjects = (fileContent: string) => {
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

const groupByTime = (hitObjects: {x: number, time: number}[]) => {
  // timeごとにグループ化
  const map = new Map<number, number[]>()
  for (const obj of hitObjects) {
    if (!map.has(obj.time)) map.set(obj.time, [])
    map.get(obj.time)!.push(obj.x)
  }
  return map
}

const formatTime = (ms: number): string => {
  const minutes = Math.floor(ms / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  const millis = ms % 1000
  return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}:${String(millis).padStart(3, '0')}`
}

export const checkMuriSaras = (fileContent: string): string[] => {
  const columnCount = 16
  const hitObjects = parseHitObjects(fileContent)
  const timeMap = groupByTime(hitObjects)
  const result: string[] = []

  for (const [time, xs] of timeMap.entries()) {
    if (xs.length < 2) continue
    // 各xからcolumnを計算
    const columns = xs.map(x => Math.floor(x * columnCount / 512))
    // 判定
    const has0 = columns.includes(0)
    const has4to7 = columns.some(c => [4,5,6,7].includes(c))
    const has15 = columns.includes(15)
    const has8to11 = columns.some(c => [8,9,10,11].includes(c))
    if ((has0 && has4to7) || (has15 && has8to11)) {
      result.push(formatTime(time))
    }
  }
  return result
}