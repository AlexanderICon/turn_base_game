import { Debug } from './Debug';
import { GameConfig } from './GameConfig';
import { XNetTable } from '../utils/xnet-table';
import { app } from '../gameplay/app/app';
import { playerController } from '../gameplay/playerController/playerController';

declare global {
    interface CDOTAGameRules {
        // 声明所有的GameRules模块，这个主要是为了方便其他地方的引用（保证单例模式）
        XNetTable: XNetTable;
    }
}

ListenToGameEvent(
    'player_connect_full',
    event => {
        const player = playerController.getPlayer(event.PlayerID);
        if (!player) return;
        playerController.addPlayer(player); // 添加玩家统一管理
    },
    null
);

/**
 * 监听游戏状态变化
 * 9(场景设置)->2(自定义游戏设置)->3(玩家选择英雄)->10(进入游戏)->4(英雄创建/选择)->5(游戏正式开始)
 */
ListenToGameEvent(
    'dota_game_state_change',
    event => {
        print('dota_game_state_change', event.new_state);

        if (event.new_state == GameState.STRATEGY_TIME && IsServer()) {
            app.App.instance(); // 这里作为游戏入口 只能在服务端运行
        }
    },
    undefined
);

/**
 * 这个方法会在game_mode实体生成之后调用，且仅调用一次
 * 因此在这里作为单例模式使用
 **/
export function ActivateModules() {
    if (GameRules.XNetTable == null) {
        // 初始化所有的GameRules模块
        GameRules.XNetTable = new XNetTable();
        // 如果某个模块不需要在其他地方使用，那么直接在这里使用即可
        new GameConfig();
        // 初始化测试模块xD
        new Debug();
    }
}
