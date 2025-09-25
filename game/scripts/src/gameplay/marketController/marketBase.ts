import { utils } from '../../core/utils/utils';
import { cfgGlobal, cfgMarketResource } from '../global/global';
import { eAttribute, Player } from '../playerController/player';

export enum eMarketType {
    market = 'market',
    ability = 'ability',
}

export enum eErrorMessage {
    noResource = '升级失败,资源不足',
    noEnoughArrayLength = '获取配置表失败',
}

export abstract class market {
    protected _list: number[];
    protected _level: number;
    protected _tag: eMarketType;
    protected _pause: boolean;

    constructor(e: eMarketType) {
        this._list = [];
        this._level = 0;
        this._tag = e;
        this._pause = false;
    }

    protected getMaxLevel(): number {
        let max = 10;

        switch (this._tag) {
            case eMarketType.market:
                max = cfgGlobal.marketMaxItem;
                break;
            case eMarketType.ability:
                max = cfgGlobal.marketMaxAbility;
                break;
        }

        return max;
    }

    protected getResource(key: string) {
        switch (key) {
            case 'gold':
                return eAttribute.currentGold;
            case 'lumber':
                return eAttribute.currentWood;
        }
    }

    protected getCfg() {
        const array = utils.kvToArray(cfgMarketResource);
        return array.filter(e => e.tag == this._tag);
    }

    setPause() {
        this._pause = !this._pause;
    }

    upLevel() {
        if (this._level >= this.getMaxLevel()) return;

        if (!this.upFilter()) return;

        this._level += 1;

        this.onUpSuccess();
    }

    // 回合结束时触发
    onRoundFinish() {
        if (this._pause) return;

        this._list = this.random(this._level);
        this.onRandomSuccess();
    }

    abstract upFilter(): boolean;

    abstract onUpSuccess(): void; // 成功升级时触发
    abstract onRandomSuccess(): void; // 成功刷新时触发
    abstract random(level: number): number[]; // 刷新数据
}

export class itemMarketBase extends market {
    protected player: CDOTAPlayerController;

    constructor(player: CDOTAPlayerController, tag: eMarketType) {
        super(tag);
        this.player = player;
    }

    upFilter(): boolean {
        const cfg = this.getCfg();

        if (cfg.length <= 0) {
            print(eErrorMessage.noEnoughArrayLength);
            return;
        }

        const data = cfg.find(e => e.level == this._level + 1);

        const resource = data ? data.resource : 'gold';
        const cost = data ? data.val : -1;
        const curResource = Player.getPlayer(this.player).getAttribute(this.getResource(resource));

        if (curResource <= cost - 1) {
            print(eErrorMessage.noResource);
            return;
        }

        Player.getPlayer(this.player).addAttribute(this.getResource(resource), -cost);
        return true;
    }

    onUpSuccess(): void {}

    onRandomSuccess(): void {}

    random(level: number): number[] {
        return [];
    }
}
