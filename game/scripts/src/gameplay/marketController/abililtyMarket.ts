import { itemMarket } from './itemMarket';
import { itemMarketBase } from './marketBase';

export class abilityMarket extends itemMarketBase {
    onRandomSuccess(): void {
        GameRules.XNetTable.SetPlayerTableValue(this.player.GetPlayerID(), 'market_base', 'ability', { list: this._list });
    }
}
