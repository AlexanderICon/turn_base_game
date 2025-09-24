import { EventEmitter } from "../../core/eventEmit/eventEmit";
import { crystal_nova_x, modifier_crystal_nova_x_debuff } from "../../examples/abilities/crystal_nova_x";
import { BaseModifier, registerModifier } from "../../utils/dota_ts_adapter";
import { modifier_test_damage1 } from "../modifier/base_modifier";
import { playerController } from "../playerController/playerController";
import { CharacterAttribute } from "../tableClass/characterAttribute"

declare type UnitCreateProps = {
    name:string,
    point:Vector,
    find_clear:boolean,
    owner:CDOTAPlayerController|undefined,
    teamId?:DotaTeam
}
export interface CharacterInitProps {
    create_unit:UnitCreateProps,
    is_main:boolean,
}
export class Character {
    private ownPlayer: CDOTAPlayerController
    private characterName: string

    private attribute: Map<string, number> = new Map;
    private percent_attribute: Map<string, number> = new Map;

    public unit: CDOTA_BaseNPC

    constructor(initProps:CharacterInitProps) {
      
        // this.attribute = new Map;
        // this.percent_attribute = new Map;

        const createProps:UnitCreateProps = initProps.create_unit
          print('角色建立初始化1',createProps.name);
        let cTeamId = DotaTeam.GOODGUYS
        let cOwner = createProps.owner
        if(createProps.teamId){
            cTeamId = createProps.teamId ;
        }else if(createProps.owner){
            this.ownPlayer = createProps.owner;
            cTeamId = this.ownPlayer.GetTeam()
        }
       
        this.characterName = createProps.name;

         if(initProps.is_main === true){ //主角色，切换控制，不用异步方法创建，用来保证创建成功
            //const cUnit = CreateUnitByName(createProps.name,createProps.point,createProps.find_clear,undefined,undefined,cTeamId)
            const cUnit = CreateHeroForPlayer(createProps.name,cOwner)
            if(!cUnit){
                error('主角色创建失败！ 单位名：'+createProps.name)
            }else{
                this.unit = cUnit;
                print('角色建立初始化2.1');
                const attributes = CharacterAttribute.GetData(createProps.name);
                if(attributes){
                    for(const[k,v] of Object.entries(attributes)){
                        this.attribute.set(k as string,v as number);
                        // print('角色建立初始化3',k,v);
                    }
                }
                
                cUnit.SetOwner(cOwner)
                cUnit.SetControllableByPlayer(this.ownPlayer.GetPlayerID(),false)
                this.ownPlayer.SetAssignedHeroEntity(cUnit);
                // const t1 = cUnit.AddNewModifier(cUnit,undefined,modifier_test_damage1.name,{ duration:20})

                
            }
        }else{
            CreateUnitByNameAsync(createProps.name,createProps.point,createProps.find_clear,undefined,undefined,cTeamId,(cUnit) => {
            print('角色建立初始化2'); 
            this.unit = cUnit;
            
            cUnit.SetOwner(createProps.owner)
        })
        }
        
       
    }
}

CustomGameEventManager.RegisterListener('c2s_login_event', (userId, event) => {
    print('客户端发来消息', userId);
    const player = playerController.getPlayer(event.PlayerID);

    const character = new Character({
        create_unit: {
            name: event.event_data.choose_hero,
            point: Vector(-320, -300, 0),
            find_clear: false,
            owner: player,
        },
        is_main: true,
    });
    //print(event.key,event.PlayerID,character)
    if (character.unit) {
        CustomGameEventManager.Send_ServerToPlayer(player, 's2c_custom_event', { event_key: 'choose_finish', event_data: {} });
    } else {
    }
   
    //new raidController.controller(10086, [player]).start();
    // CreateUnitByNameAsync('npc_dota_target_dummy', Vector(500, 300, 0), false, undefined, undefined, DotaTeam.BADGUYS, u => {
    //     print('靶子创建', u);
    // });
});

ListenToGameEvent('npc_spawned',event => {
    const unit = EntIndexToHScript(event.entindex) as CDOTA_BaseNPC
    if(unit.GetName() === 'npc_dota_hero_meepo'){
        unit.Destroy()
    }else{
        unit.AddNewModifier(unit,undefined,'modifier_character_damage',undefined)
    }
    
},undefined)
