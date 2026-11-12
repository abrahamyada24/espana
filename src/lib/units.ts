import { UNITS } from '../data/curriculum'
import type { Level } from '../types'
import { PASS_SCORE, type Progress } from './store'

export function isUnitUnlocked(unitId: string, p: Progress): boolean {
  if (p.settings.unlockAll) return true
  const i = UNITS.findIndex((u) => u.id === unitId)
  if (i <= 0) return true
  return (p.units[UNITS[i - 1].id] ?? 0) >= PASS_SCORE
}

export const isUnitPassed = (unitId: string, p: Progress) => (p.units[unitId] ?? 0) >= PASS_SCORE

export function nextUnit(p: Progress) {
  return UNITS.find((u) => !isUnitPassed(u.id, p)) ?? null
}

export const unitsOfLevel = (level: Level) => UNITS.filter((u) => u.level === level)

export function levelProgress(level: Level, p: Progress) {
  const units = unitsOfLevel(level)
  const passed = units.filter((u) => isUnitPassed(u.id, p)).length
  return { passed, total: units.length, testScore: p.units[`test-${level}`] ?? 0 }
}
