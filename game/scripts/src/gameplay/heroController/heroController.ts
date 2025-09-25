import { Singleton } from '../../core/singleton/singleton';
import { Character } from '../character/character';
import { eventEmitterBase } from '../eventEmitterBase/eventEmitterBase';
import { cfgHeroList } from '../global/global';
import { playerController } from '../playerController/playerController';
import { roundController } from '../roundController/roundController';

interface emiiter {}

export namespace heroController {
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

        fresh(player: CDOTAPlayerController) {
            const count = this.freshCount.get(player) ?? 0;
            if (count <= 0) return;

            this.freshCount.set(player, count - 1);

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

                this.playerSelectEventHandler();
            }
        }

        private randomHeroList(): number[] {
            return [];
        }

        // 注册事件 并且当所有玩家选择英雄后触发
        playerSelectEventHandler() {
            this.heroCount++;

            if (this.heroCount >= playerController.getAllPlayers().length) {
                roundController.instance().ready();
            }
        }
    }

    export function instance() {
        return Singleton.Get<controller>('heroController', controller);
    }
}
