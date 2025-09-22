export enum eAIStatus {
    idle,
    fight,
    movingOrigin
}

export interface iAI {
    think: number // 思考时间
    range: number // 搜索范围
    enmity: Map<CDOTA_BaseNPC, number> // 敌意值
    status: eAIStatus
    attackRange: number // 如果距离超出了这个范围 那么怪物会回到出生点
    origin: Vector
    onUpdate(): number // 返回-1 停止ai
}

export class C_DOTA_NPC_BASE_AI implements iAI {
    status: eAIStatus = eAIStatus.idle
    range: number = 600
    enmity: Map<CDOTA_BaseNPC, number> = new Map()
    think: number = 1
    attackRange: number = 800
    origin: Vector

    private searchTarget?: CDOTA_BaseNPC
    private target: CDOTA_BaseNPC

    constructor(target: CDOTA_BaseNPC) {
        this.target = target
        this.origin = this.target.GetOrigin()

        this.target.SetContextThink('AIThink', () => {
            return this.onUpdate()
        }, this.think)
    }

    protected search() {
        // 搜索附近的敌对单位
        const origin = this.target.GetOrigin()
        const units = FindUnitsInRadius(this.target.GetTeam(), origin, this.target, this.range, UnitTargetTeam.ENEMY, UnitTargetType.ALL, UnitTargetFlags.NO_INVIS, FindOrder.CLOSEST, false)

        if (units.length >= 1) {
            this.status = eAIStatus.fight
            this.searchTarget = units[0]
        }
    }

    protected attackTo() {
        if (!this.searchTarget) {
            this.clear()
            return
        }

        this.target.MoveToTargetToAttack(this.searchTarget)

        const distance = this.searchTarget.GetRangeToUnit(this.target)
        if (distance > this.attackRange) {
            this.clear()
            this.back()
        }
    }

    private movingOrigin() {
        const distance = (this.target.GetAbsOrigin() - this.origin) as Vector

        if (math.abs(distance.Length2D()) <= 0) {
            this.status = eAIStatus.idle
        }
    }

    protected back() {
        this.status = eAIStatus.movingOrigin
        this.target.MoveToPosition(this.origin)

        this.backEvent()
    }

    protected clear() {
        this.status = eAIStatus.idle
        this.searchTarget = void 0
    }

    protected backEvent() {
    }

    onUpdate(): number {
        if (!this.target.IsAlive()) return -1

        switch (this.status) {
            case eAIStatus.idle:
                this.search()
                break
            case eAIStatus.fight:
                this.attackTo()
                break
            case eAIStatus.movingOrigin:
                this.movingOrigin()
                break
        }

        return this.think
    }

}