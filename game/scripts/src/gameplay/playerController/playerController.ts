import { Player } from './player';

const array: CDOTAPlayerController[] = [];

export class playerController {
    static getAllPlayers(): CDOTAPlayerController[] {
        return array;
    }

    static addPlayer(player: CDOTAPlayerController) {
        array.push(player);
    }

    static getPlayer(player: PlayerID): CDOTAPlayerController | undefined {
        return PlayerResource.GetPlayer(player);
    }
}
