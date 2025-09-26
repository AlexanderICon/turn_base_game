import { utils, weightCfg } from '../../core/utils/utils';
import { cfgGlobal, cfgMarketItem, cfgMarketResource } from '../global/global';
import { eAttribute, Player } from '../playerController/player';

export enum eMarketType {
    market = 'market',
    ability = 'ability',
}

export enum eErrorMessage {
    noResource = '升级失败,资源不足',
    noEnoughArrayLength = '获取配置表失败',
    noEnoughCount = '配置表数据不足',
}

type marketItem = {
    key: string;
    name: string;
    icon: string;
    level: number;
    tag: string;
} & weightCfg;

export abstract class market {
    protected _list: number[];
    protected _level: number;
    protected _tag: eMarketType;
    protected _pause: boolean;
    protected _count: number;

    constructor(e: eMarketType) {
        this._list = [];
        this._level = 0;
        this._tag = e;
        this._pause = false;
        this._count = 4;
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

    protected getResourceCfg() {
        const array = utils.kvToArray(cfgMarketResource);
        return array.filter(e => e.tag == this._tag);
    }

    protected getContentCfg(level: number) {
        switch (this._tag) {
            case eMarketType.market:
                return utils.kvToArray<marketItem>(cfgMarketItem).filter(e => e.tag == eMarketType.market && level >= e.level);
            case eMarketType.ability:
                return utils.kvToArray<marketItem>(cfgMarketItem).filter(e => e.tag == eMarketType.ability && level >= e.level);
        }
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
        this.random();
    }

    abstract upFilter(): boolean;

    abstract onUpSuccess(): void; // 成功升级时触发
    abstract onRandomSuccess(): void; // 成功刷新时触发
    abstract random(level?: number): number[]; // 刷新数据
}

export class itemMarketBase extends market {
    protected player: CDOTAPlayerController;

    constructor(player: CDOTAPlayerController, tag: eMarketType) {
        super(tag);
        this.player = player;
    }

    upFilter(): boolean {
        const cfg = this.getResourceCfg();

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

    random(level?: number): number[] {
        const cur = level ? level + 1 : this._level + 1;
        const cfgArray = this.getContentCfg(cur);
        if (cfgArray.length <= 0) {
            print(eErrorMessage.noEnoughArrayLength);
            return;
        }

        if (cfgArray.length <= this._count - 1) {
            print(eErrorMessage.noEnoughCount);
            return;
        }

        const list: number[] = [];
        while (list.length <= this._count - 1) {
            const val = utils.getRandomByWeight(cfgArray);

            if (!list.includes(tonumber(val.id))) {
                list.push(tonumber(val.id));
            }
        }

        this._list = list;
        this.onRandomSuccess();
        return list;
    }
}
