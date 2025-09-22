import { EventEmitter } from "../../core/eventEmit/eventEmit";
import { Singleton } from "../../core/singleton/singleton";

interface emitter {
    'onDefeat': { controller: gameController.controller },
    'onVictory': { controller: gameController.controller }
}

export namespace gameController {
    export enum eStatus {
        init,
        runing,
        victory,
        defeat
    }

    export class controller {
        private _status: eStatus = eStatus.init // 当前游戏状态
        private _emit: EventEmitter<emitter> = new EventEmitter()

        public set status(v: eStatus) {
            this._status = v;
        }

        public get status(): eStatus {
            return this._status
        }

        public get event(): EventEmitter<emitter> {
            return this._emit
        }
    }

    export function instance() {
        return Singleton.Get<controller>('gameController', controller)
    }

    instance().event.on('onDefeat', (e) => {
        instance().status = eStatus.defeat
        print('游戏失败')
    })

    instance().event.on('onVictory', (e) => {
        instance().status = eStatus.victory
        print('游戏胜利')
    })
}
