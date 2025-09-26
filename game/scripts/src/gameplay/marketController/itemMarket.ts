import { eErrorMessage, itemMarketBase, market } from './marketBase';

export class itemMarket extends itemMarketBase {
    onRandomSuccess(): void {
        GameRules.XNetTable.SetPlayerTableValue(this.player.GetPlayerID(), 'market_base', 'item', { list: this._list });
    }
}
