import { cfgInvestment } from '../global/global';
import { eAttribute, Player } from '../playerController/player';

export enum eErrorMessage {
    noCost = '资源不足,升级失败',
    noFind = '配置表数据不存在',
    max = '已达到最大等级',
}

export class investmentController {
    private _player: Player;
    private _current: Map<string, number>;
    constructor(player: CDOTAPlayerController) {
        this._player = Player.getPlayer(player);
        this._current = new Map();
    }

    getLevel(id: number): number {
        const cfg = cfgInvestment.find(e => e.id == tostring(id));

        if (!cfg) return 0;

        if (!this._current.has(cfg.key)) this._current.set(cfg.key, 0);

        return this._current.get(cfg.key);
    }

    addLevel(id: number, level: number = 1) {
        const cfg = cfgInvestment.find(e => e.id == tostring(id));

        if (!cfg) {
            print(eErrorMessage.noFind);
            return;
        }

        const cur = this.getLevel(id);

        if (cur >= cfg.max) {
            print(eErrorMessage.max, '---当前等级---', cur, '---最大等级---', cfg.max);
            return;
        }

        const cost = cfg.cost + cur * cfg.increase;

        if (this._player.getAttribute(eAttribute.currentGold) <= cost - 1) {
            print(eErrorMessage.noCost, '---本次需要消耗资源--', cost, '----当前玩家资源---', this._player.getAttribute(eAttribute.currentGold));
            return;
        }

        this._player.addAttribute(eAttribute.currentGold, -cost);
        this._current.set(cfg.key, this.getLevel(id) + level);
        GameRules.XNetTable.SetPlayerTableValue(this._player.getPlayerId(), 'investment', cfg.key, this._current.get(cfg.key));
    }
}

export const strInvestmentKey = 'investmentController';
