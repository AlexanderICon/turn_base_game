import { difficultyController } from '../difficultyController/difficultyController';
import { heroController } from '../heroController/heroController';
import { eMarketType } from '../marketController/marketBase';
import { Player } from '../playerController/player';
import { playerController } from '../playerController/playerController';

CustomGameEventManager.RegisterListener('client_select_difficulty_event', (userId, e) => {
    difficultyController.instance().current = e.difficulty;
    heroController.instance().start(playerController.getAllPlayers());
    CustomNetTables.SetTableValue('server_difficulty', 'current', { current: e.difficulty });
    print('服务端的收到消息,当前难度:', e.difficulty);
});

CustomGameEventManager.RegisterListener('client_player_select_hero_by_id', (userId, e) => {
    heroController.instance().selectHero(playerController.getPlayer(e.PlayerID), e.id);
});

CustomGameEventManager.RegisterListener('client_fresh_player_select_hero_list', (userId, e) => {
    heroController.instance().fresh(playerController.getPlayer(e.PlayerID), 1);
});

CustomGameEventManager.RegisterListener('client_market_level_up', (_, e) => {
    switch (e.tag) {
        case 'ability':
            Player.getPlayer(playerController.getPlayer(e.PlayerID)).market.get(eMarketType.ability)?.upLevel();
            break;
        case 'market':
            Player.getPlayer(playerController.getPlayer(e.PlayerID)).market.get(eMarketType.market)?.upLevel();
            break;
    }
});

CustomGameEventManager.RegisterListener('client_market_fresh', (_, e) => {
    switch (e.tag) {
        case 'market':
            Player.getPlayer(playerController.getPlayer(e.PlayerID)).market.get(eMarketType.market)?.random();
            break;
        case 'ability':
            Player.getPlayer(playerController.getPlayer(e.PlayerID)).market.get(eMarketType.ability)?.random();
            break;
    }
});
