import { Singleton } from '../../core/singleton/singleton';
import { difficultyController } from '../difficultyController/difficultyController';
import { eventEmitterBase } from '../eventEmitterBase/eventEmitterBase';
import { gameController } from '../gameConroller/gameController';
import { cfgGlobal } from '../global/global';
import { eAttribute, Player } from '../playerController/player';
import { playerController } from '../playerController/playerController';

import * as round from '../../json/roundConfig.json';

type round = {
    challengTime: number;
    monsterId: number;
};

export namespace roundController {
    enum state {
        ready,
        start,
        finish,
    }

    interface emitter {}

    export class controller extends eventEmitterBase<emitter> {
        private _round: number = 0;
        private _state: state = state.ready;
        private _monsterArray: CDOTA_BaseNPC[] = [];
        private _challengTimerKey: string = '';

        private getCurrentRoundConfig(): round {
            return (
                round[(this._round + 1).toString()] ?? { challengTime: cfgGlobal.defaultChallengTime, monsterId: cfgGlobal.defaultMonsterChallengId }
            );
        }

        // 准备阶段
        ready() {
            // todo : 如果是最大波次,那么直接进入胜利
            if (this._round >= difficultyController.instance().max) {
                this._state = state.finish;
                gameController.instance().victory();
                return;
            }

            this._state = state.ready;

            // 进入准备状态
            let curInterval: number = cfgGlobal.defaultRoundTime;

            if (this._challengTimerKey.length > 0) {
                Timers.RemoveTimer(this._challengTimerKey);
                this._challengTimerKey = '';
            }

            Timers.CreateTimer(1, () => {
                curInterval--;

                if (curInterval <= 0) {
                    this.start();
                    return null;
                }

                return 1;
            });
        }

        // 结算玩家资源
        private settlePlayerResource() {
            playerController.getAllPlayers().forEach(e => {
                const player = Player.getPlayer(e);
                Player.settleAttribute(
                    e,
                    eAttribute.currentGold,
                    player.getAttribute(eAttribute.roundGold),
                    player.getAttribute(eAttribute.goldRate)
                );

                Player.settleAttribute(
                    e,
                    eAttribute.currentWood,
                    player.getAttribute(eAttribute.roundWood),
                    player.getAttribute(eAttribute.woodRate)
                );
            });
        }

        private movePlayerToPoint(point: Vector[]) {
            playerController.getAllPlayers().forEach(player => {});
        }

        // 开始阶段
        private start() {
            this._state = state.start;
            print('开始阶段');

            // todo :所有玩家英雄移动到副本点

            Timers.CreateTimer(3, () => {
                this.createMonster();
                return null;
            });
        }

        private createMonster() {
            const cfg = this.getCurrentRoundConfig();

            this._monsterArray = [];

            // 开启一个计时器
            let currentChallengInterval = cfg.challengTime;

            this._challengTimerKey = Timers.CreateTimer(1, () => {
                currentChallengInterval--;

                if (currentChallengInterval <= 0) {
                    // todo : 开始进入游戏惩罚阶段
                    this.nextRound();
                    return null;
                }

                return 1;
            });
        }

        nextRound() {
            this._round++;
            print('进入下一回合');

            this.settlePlayerResource();
            this.ready();
        }

        removeMonster(unit: CDOTA_BaseNPC) {
            if (!this._monsterArray.includes(unit)) return;

            this._monsterArray.splice(this._monsterArray.indexOf(unit), 1);

            if (this._monsterArray.length <= 0) {
                // todo : 所有玩家英雄移动回出生点
                this.nextRound();
            }
        }
    }

    export function instance() {
        return Singleton.Get<controller>('roundController', controller);
    }
}
