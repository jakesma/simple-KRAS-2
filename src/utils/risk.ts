import { HazardItem } from '../types';

export type RiskLevel = HazardItem['riskLevel'];

export const RISK_LEVEL_LABELS: Record<RiskLevel, string> = {
  High: '상',
  Medium: '중',
  Low: '하'
};

export const requiresRiskReduction = (level: RiskLevel) => level !== 'Low';

export const getRiskLevelFromScore = (score: number): RiskLevel =>
  score >= 16 ? 'High' : score >= 9 ? 'Medium' : 'Low';

export const getLegacyRiskValues = (level: RiskLevel) => {
  const value = level === 'High' ? 4 : level === 'Medium' ? 3 : 2;
  return { likelihood: value, severity: value, score: value * value };
};