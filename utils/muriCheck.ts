import { parseHitObjects, groupByTime, formatTime, parseLongNotes } from './common'

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

export const checkMuriLN = (fileContent: string): string[] => {
  const columnCount = 16
  const result: string[] = []
  
  // 通常ノーツの取得（既存の関数を利用）
  const notes = parseHitObjects(fileContent)
  const timeMap = groupByTime(notes)
  
  // LNの取得
  const longNotes = parseLongNotes(fileContent)
  
  for (const ln of longNotes) {
    // LNが4-7または8-11に配置されているかチェック
    const isLNInDangerZone = 
      ([4,5,6,7].includes(ln.column) || [8,9,10,11].includes(ln.column))
    
    if (!isLNInDangerZone) continue
    
    // LNの開始時間から終了時間までの間に降ってくるノーツをチェック
    let hasMuri = false
    for (const [time, xs] of timeMap.entries()) {
      if (time < ln.startTime || time > ln.endTime) continue
      
      const columns = xs.map(x => Math.floor(x * columnCount / 512))
      
      // LNが4-7にある場合は0列をチェック
      if ([4,5,6,7].includes(ln.column) && columns.includes(0)) {
        hasMuri = true
        break
      }
      
      // LNが8-11にある場合は15列をチェック
      if ([8,9,10,11].includes(ln.column) && columns.includes(15)) {
        hasMuri = true
        break
      }
    }
    
    if (hasMuri) {
      result.push(`${formatTime(ln.startTime)} - ${formatTime(ln.endTime)}`)
    }
  }
  
  return result
}