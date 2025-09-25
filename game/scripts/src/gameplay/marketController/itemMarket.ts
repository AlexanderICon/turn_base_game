import { eAttribute, Player } from '../playerController/player';
import { eMarketType, market } from './marketBase';

export class itemMarket extends market {
    private player: CDOTAPlayerController;

    constructor(player: CDOTAPlayerController) {
        super(eMarketType.market);
        this.player = player;
    }

    upFilter(): boolean {
        print(Player.getPlayer(this.player).getAttribute(eAttribute.currentGold));
        return true;
    }

    onUpSuccess(): void {
        print('升级成功--', this._level);
    }

    onRandomSuccess(): void {
        throw new Error('Method not implemented.');
    }

    random(level: number): number[] {
        throw new Error('Method not implemented.');
    }
}
