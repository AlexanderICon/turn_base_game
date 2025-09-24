import { Singleton } from '../../core/singleton/singleton';
import { eventEmitterBase } from '../eventEmitterBase/eventEmitterBase';
import { playerController } from '../playerController/playerController';
import { roundController } from '../roundController/roundController';

interface emiiter {}

export namespace heroController {
    export class controller extends eventEmitterBase<emiiter> {
        private heroCount: number;

        constructor() {
            super();
        }

        start(players: CDOTAPlayerController[]) {
            players.forEach(e => {});
        }

        private randomHeroList(): string[] {
            return [];
        }

        // 注册事件 并且当所有玩家选择英雄后触发
        playerSelectEventHandler() {
            this.heroCount++;

            if (this.heroCount >= playerController.getAllPlayers().length) {
                roundController.instance().ready();
            }
        }
    }

    export function instance() {
        return Singleton.Get<controller>('heroController', controller);
    }
}
