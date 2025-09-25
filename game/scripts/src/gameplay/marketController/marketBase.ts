import { cfgGlobal } from '../global/global';

export enum eMarketType {
    market = 'market',
    ability = 'ability',
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

    setPause() {
        this._pause = !this._pause;
    }

    upLevel() {
        if (this._level >= this.getMaxLevel() || !this.upFilter()) return;

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
