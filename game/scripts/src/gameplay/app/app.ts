import { Singleton } from '../../core/singleton/singleton';
import { gameController } from '../gameConroller/gameController';
import { roundController } from '../roundController/roundController';

require('../serverManager/serverManager');
require('../../core/dump/dump');

export namespace app {
    export class App {
        constructor() {
            print('进入了游戏入口 开始游戏逻辑', IsServer());

            gameController.instance().start(); // 游戏开始
            // roundController.instance().ready();
        }
        // 再来一局
        private restart() {
            gameController.instance().status = gameController.eStatus.init;
        }

        static instance() {
            return Singleton.Get<App>('appController', App);
        }
        abc;
    }
}
