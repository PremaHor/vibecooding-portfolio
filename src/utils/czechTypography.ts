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

  return result;
}
