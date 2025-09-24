import { difficultyController } from '../difficultyController/difficultyController';
import { heroController } from '../heroController/heroController';
import { playerController } from '../playerController/playerController';

CustomGameEventManager.RegisterListener('player_select_hero_by_index', (userId, e) => {
    // todo : 给单位创建英雄
    heroController.instance().playerSelectEventHandler();
});

CustomGameEventManager.RegisterListener('game_event_select_difficulty', (userId, e) => {
    difficultyController.instance().current = e.difficulty;
    heroController.instance().start(playerController.getAllPlayers());
    print('服务端的收到消息,当前难度:', e.difficulty);
});
