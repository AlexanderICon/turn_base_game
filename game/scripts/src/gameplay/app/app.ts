import { Singleton } from "../../core/Singleton/Singleton"
import { gameController } from "../gameConroller/gameController"

export namespace app {
    export class App {
        constructor() {
            print('进入了游戏入口 开始游戏逻辑', IsServer())
        }
        // 再来一局
        private restart() {
            gameController.instance().status = gameController.eStatus.init
        }

        static instance() {
            return Singleton.Get<App>('appController', App)
        }
    }
}