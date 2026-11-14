/** True when the job offers every selected accommodation (empty selection matches all). */
export function matchesAllNeeds(job: { accommodations: string[] }, selectedNeeds: string[]): boolean {
  if (!selectedNeeds.length) return true;
  const offered = new Set((job.accommodations ?? []).map(String));
  return selectedNeeds.every((need) => offered.has(need));
}