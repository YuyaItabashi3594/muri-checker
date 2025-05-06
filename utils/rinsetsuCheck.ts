import { parseHitObjects, groupByTime, formatTime, parseLongNotes } from './common'

export const checkRinsetsuSaras = (fileContent: string): string[] => {
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
    const has1to3 = columns.some(c => [1,2,3].includes(c))
    const has15 = columns.includes(15)
    const has12to14 = columns.some(c => [12,13,14].includes(c))
    if ((has0 && has1to3) || (has15 && has12to14)) {
      result.push(formatTime(time))
    }
  }
  return result
}

export const checkRinsetsuLN = (fileContent: string): string[] => {
  const columnCount = 16
  const result: string[] = []
  
  // 通常ノーツの取得（既存の関数を利用）
  const notes = parseHitObjects(fileContent)
  const timeMap = groupByTime(notes)
  
  // LNの取得
  const longNotes = parseLongNotes(fileContent)
  
  for (const ln of longNotes) {
    // LNが4-7または8-11に配置されているかチェック
    const isLNInWarningZone = 
      ([1,2,3].includes(ln.column) || [12,13,14].includes(ln.column))
    
    if (!isLNInWarningZone) continue
    
    // LNの開始時間から終了時間までの間に降ってくるノーツをチェック
    let hasRinsetsu = false
    for (const [time, xs] of timeMap.entries()) {
      if (time < ln.startTime || time > ln.endTime) continue
      
      const columns = xs.map(x => Math.floor(x * columnCount / 512))
      
      // LNが1-3にある場合は0列をチェック
      if ([1,2,3].includes(ln.column) && columns.includes(0)) {
        hasRinsetsu = true
        break
      }
      
      // LNが12-14にある場合は15列をチェック
      if ([12,13,14].includes(ln.column) && columns.includes(15)) {
        hasRinsetsu = true
        break
      }
    }
    
    if (hasRinsetsu) {
      result.push(`${formatTime(ln.startTime)} - ${formatTime(ln.endTime)}`)
    }
  }
  
  return result
}