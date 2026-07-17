import type { FismaSystemType } from '@/types'

/**
 * Reshape a FismaSystemType[] into the {id: {acronym, name}} map the
 * Assign Systems picker consumes. Exported so the map-build logic can be
 * unit tested against the same fixtures the UserTable fetch test uses,
 * without having to drive the DataGrid + modal chain end to end.
 *
 * Also filters out decommissioned entries defensively - the unparameterized
 * /fismasystems endpoint returns active systems only by contract, but a
 * belt-and-suspenders check here keeps the picker correct if that contract
 * ever changes upstream. The picker only ever offers assignable systems.
 *
 * @param systems - Systems returned by GET /fismasystems (active by contract).
 * @returns A map keyed by fismasystemid with a display-ready label pair.
 */
export function buildFismaSystemsMap(
  systems: FismaSystemType[] | null | undefined
): Record<number, { name: string; acronym: string }> {
  const map: Record<number, { name: string; acronym: string }> = {}
  for (const obj of systems ?? []) {
    if (obj.decommissioned) continue
    map[obj.fismasystemid] = {
      name: obj.fismasubsystem
        ? obj.fismaname + ' - ' + obj.fismasubsystem
        : obj.fismaname,
      acronym: obj.fismaacronym,
    }
  }
  return map
}
