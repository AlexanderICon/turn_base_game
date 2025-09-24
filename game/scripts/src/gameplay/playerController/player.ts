const map = new Map<CDOTAPlayerController, Player>();

export enum eAttribute {
    currentGold, // 金币
    currentWood, // 木材
    goldRate, // 金币产量
    woodRate, // 木材产量
    roundGold, // 每回合结算金币
    roundWood, // 每回合结算木材
}

export class Player {
    static getPlayer(player: CDOTAPlayerController): Player {
        if (!map.has(player)) {
            map.set(player, new Player(player));
        }

        return map.get(player);
    }

    static remove(player: CDOTAPlayerController) {
        map.delete(player);
    }

    static settleAttribute(player: CDOTAPlayerController, attr: eAttribute, amount: number, rate: number = 0) {
        this.getPlayer(player).addAttribute(attr, amount * (1 + rate));
    }

    private _player: CDOTAPlayerController;
    private _attribute: Map<eAttribute, number> = new Map();

    constructor(player: CDOTAPlayerController) {
        this._player = player;

        map.set(player, this);
    }

    getAttribute(attr: eAttribute): number {
        return this._attribute.has(attr) ? this._attribute.get(attr) : 0;
    }

    addAttribute(attr: eAttribute, amount: number) {
        this._attribute.set(attr, this.getAttribute(attr) + amount);
    }
}
