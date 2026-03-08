/**
 * Nahrazuje obyčejné mezery za nedělitelné (nbsp) po českých předložkách a spojkách,
 * aby nezůstávaly na konci řádku při responzivním zalamování.
 */
const NBSP = '\u00A0';

const PREPOSITIONS_SINGLE = ['a', 'i', 'k', 'o', 's', 'u', 'v', 'z'];
const PREPOSITIONS_DOUBLE = ['do', 'na', 'od', 'po', 'pro', 'při', 'za'];
const CONJUNCTIONS = ['ale', 'ani', 'že', 'aby', 'nebo', 'což', 'když', 'proto', 'totiž', 'také', 'jenže'];

export function fixCzechTypography(text: string): string {
  if (!text || typeof text !== 'string') return text;

  let result = text;

  // Jednopísmenné předložky – musí být celé slovo (word boundary), case-insensitive
  for (const p of PREPOSITIONS_SINGLE) {
    const re = new RegExp(`\\b(${p})\\s+`, 'gi');
    result = result.replace(re, `$1${NBSP}`);
  }

  // Dvoupísmenné předložky
  for (const p of PREPOSITIONS_DOUBLE) {
    const re = new RegExp(`\\b(${p})\\s+`, 'gi');
    result = result.replace(re, `$1${NBSP}`);
  }

  // Spojky
  for (const c of CONJUNCTIONS) {
    const re = new RegExp(`\\b(${c})\\s+`, 'gi');
    result = result.replace(re, `$1${NBSP}`);
  }

  // Čísla + jednotky (Kč, CZK) – nedělitelná mezera před měnou (podporuje i anglický formát 15,000 CZK)
  result = result.replace(/(\d[\d\s,]*) +([Kk]č|CZK)/g, `$1${NBSP}$2`);

  // Čísla + až, do – nedělitelná mezera
  result = result.replace(/(\d[\d\s]*) +(až|do)\b/g, `$1${NBSP}$2`);

  // Čísla + běžná slova po čísle (kola, kol, kolo, %)
  result = result.replace(/(\d[\d\s]*) +(kola|kol|kolo|%|let|měsíců|dnů)\b/g, `$1${NBSP}$2`);

  return result;
}
