import { Singleton } from '../../core/singleton/singleton';
import { utils } from '../../core/utils/utils';
import { Character } from '../character/character';
import { eventEmitterBase } from '../eventEmitterBase/eventEmitterBase';
import { cfgHeroList } from '../global/global';
import { investmentController, strInvestmentKey } from '../investmentController/investmentController';
import { abilityMarket } from '../marketController/abililtyMarket';
import { itemMarket } from '../marketController/itemMarket';
import { eMarketType } from '../marketController/marketBase';
import { Player } from '../playerController/player';
import { playerController } from '../playerController/playerController';
import { roundController } from '../roundController/roundController';

interface emiiter {}

export namespace heroController {
    const rule = [
        { property: 1, count: 1 },
        { property: 2, count: 1 },
        { property: 3, count: 1 },
    ];

    export class controller extends eventEmitterBase<emiiter> {
        private heroCount: number;
        private playerHeroList: Map<CDOTAPlayerController, number[]>;
        private freshCount: Map<CDOTAPlayerController, number>;

        constructor() {
            super();

            this.heroCount = 0;
            this.playerHeroList = new Map();
            this.freshCount = new Map();
        }

        fresh(player: CDOTAPlayerController, cost: number = 0) {
            const count = this.freshCount.get(player) ?? 0;
            if (count <= 0) return;

            this.freshCount.set(player, count - cost);

            const array = this.randomHeroList();
            this.playerHeroList.set(player, array);
            CustomGameEventManager.Send_ServerToPlayer(player, 'server_to_client_player_hero_list', { ids: array });
            CustomGameEventManager.Send_ServerToPlayer(player, 'server_to_client_player_free_fresh_list', { count: this.freshCount.get(player) });
        }

        start(players: CDOTAPlayerController[]) {
            players.forEach(e => {
                this.freshCount.set(e, 1);
                this.fresh(e);
            });
        }

        selectHero(player: CDOTAPlayerController, heroID: number) {
            const array = this.playerHeroList.get(player);
            if (array.includes(heroID)) {
                new Character({
                    create_unit: {
                        name: cfgHeroList[tostring(heroID)].key,
                        point: Vector(-320, -300, 0),
                        find_clear: false,
                        owner: player,
                    },
                    is_main: true,
                });

                this.playerSelectEventHandler(player);
            }
        }

        randomHeroList(): number[] {
            const val: number[] = [];
            const temp = utils.kvToArray(cfgHeroList);

            for (let i = 0; i < rule.length; i++) {
                let allWeight = 0;
                let curWeight = 0;
                let count = 0;
                const temp2 = temp.filter(e => e.property == rule[i].property);

                for (let j = 0; j < temp2.length; j++) {
                    const e = temp2[j];
                    allWeight += e.weight;
                }
                const curRandom = RandomInt(1, allWeight);
                for (let v = 0; v < temp2.length; v++) {
                    curWeight += temp2[v].weight;
                    if (curWeight >= curRandom && count < rule[i].count) {
                        count++;
                        val.push(tonumber(temp2[v].id));
                    }
                }
            }

            return val;
        }

        // 注册事件 并且当所有玩家选择英雄后触发
        playerSelectEventHandler(player: CDOTAPlayerController) {
            this.heroCount++;

            const playerInstance = Player.getPlayer(player);
            if (!playerInstance.object.has(eMarketType.market)) {
                playerInstance.object.set(eMarketType.market, new itemMarket(player, eMarketType.market));
            }

            if (!playerInstance.object.has(eMarketType.ability)) {
                playerInstance.object.set(eMarketType.ability, new abilityMarket(player, eMarketType.ability));
            }

            if (!playerInstance.object.has(strInvestmentKey)) {
                playerInstance.object.set(strInvestmentKey, new investmentController(player));
            }

            if (this.heroCount >= playerController.getAllPlayers().length) {
                roundController.instance().ready();
            }
        }
    }

    export function instance() {
        return Singleton.Get<controller>('heroController', controller);
    }
}
