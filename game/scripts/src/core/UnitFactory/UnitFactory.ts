export class UnitFactory {
    static spawnUnit(unit_kv: string, point: Vector, npcOwner: CBaseEntity | undefined, entityOwner: CBaseEntity | undefined, team: DotaTeam, callback: (unit: CDOTA_BaseNPC) => void, count: number = 1) {
        if (count >= 5) {
            // 防止卡顿

            for (let i = 0; i < count; i++) {
                CreateUnitByNameAsync(unit_kv, point, true, npcOwner, entityOwner, team, (e) => { callback(e) })
            }

        } else {
            callback(CreateUnitByName(unit_kv, point, true, npcOwner, entityOwner, team))
        }
    }
}