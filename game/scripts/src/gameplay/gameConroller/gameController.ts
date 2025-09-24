import { Singleton } from '../../core/singleton/singleton';
import { eventEmitterBase } from '../eventEmitterBase/eventEmitterBase';
import { playerController } from '../playerController/playerController';

export namespace gameController {
    export enum eStatus {
        init,
        runing,
        victory,
        defeat,
    }

    interface emitter {
        onDefeat: {};
        onVictory: {};
    }

    class controller extends eventEmitterBase<emitter> {
        private _status: eStatus = eStatus.init; // 当前游戏状态

        constructor() {
            super();
        }

        public set status(v: eStatus) {
            this._status = v;
        }

        public get status(): eStatus {
            return this._status;
        }

        defeat() {
            this._status = eStatus.defeat;
        }

        victory() {
            this._status = eStatus.victory;

            //todo : 游戏胜利 开始结算游戏数据
        }

        selectEvent() {
            const player = playerController.getAllPlayers().sort((a, b) => a.GetPlayerID() - b.GetPlayerID())[0];
            // todo: 玩家选择难度
        }

        start() {
            this._status = eStatus.runing;

            // 注册事件
            this.emitter.on('onDefeat', this.defeat);
            this.emitter.on('onVictory', this.victory);

            this.selectEvent();
        }
    }

    export function instance() {
        return Singleton.Get<controller>('gameController', controller);
    }
}
