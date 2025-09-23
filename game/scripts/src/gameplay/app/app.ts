import { Singleton } from "../../core/singleton/singleton"
import { XNetTable } from "../../utils/xnet-table"
import { gameController } from "../gameConroller/gameController"

export namespace app {
    export class App {
        constructor() {
            print('进入了游戏入口 开始游戏逻辑', IsServer())
            XNetTable
            CustomGameEventManager.Send_ServerToAllClients('s2c_custom_event',{event_key:'login_event',event_data : {1:'npc_dota_hero_antimage'}})
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