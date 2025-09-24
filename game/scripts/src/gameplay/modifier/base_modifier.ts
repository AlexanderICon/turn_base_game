import { BaseModifier, registerModifier } from "../../utils/dota_ts_adapter";
import { DamageEvents, damageManager } from "../damage/damageManager";

type BuffParams= {
    duration?:number,
}

//定一个有伤害事件注册管理的Modifier类
export class BuffModifier extends BaseModifier{
    private _dmg_trg_functions:Array<[string,Function]> = new Array
    private _has_remove_trg:Map<number,boolean> = new Map
    
    public registerDamageEvent(eventKey : keyof DamageEvents,func){
        const dmgMgr = damageManager.instance()
        
        dmgMgr.event.on(eventKey,func)
        this._dmg_trg_functions.push([eventKey,func])
        return this._dmg_trg_functions.length-1 //返回这个所在的索引
    }
    public cancelDamageEvent(idx:number){
        if(this._dmg_trg_functions[idx] && !this._has_remove_trg.has(idx)){
            const v = this._dmg_trg_functions[idx]
            const dmgMgr = damageManager.instance()
            const eventKey = v[0] as keyof DamageEvents
            dmgMgr.event.off(eventKey,v[1] as ()=>{});
            this._has_remove_trg.set(idx,true)
        }
    }

    OnCreated(params: BuffParams): void {
        if(params.duration){
            this.SetDuration(params.duration,true)
        }
    }

    OnDestroy(): void {
        this._dmg_trg_functions.forEach((v,idx) => {
            const dmgMgr = damageManager.instance()
            const eventKey = v[0] as keyof DamageEvents
            dmgMgr.event.off(eventKey,v[1] as ()=>{});
        })
        this._has_remove_trg.clear()
        this._dmg_trg_functions = null;
    }
}

@registerModifier()
export class modifier_test_damage1 extends BuffModifier { 
    //private _trg_functions:Array<[string,Function]> = new Array
    private idx;
    override OnCreated(params: object): void {
        super.OnCreated(params);
        const afunc = (e) =>{
            const dmgObj = e.damage;
            print('监听伤害开始时事件',dmgObj.damage);
        }
        // this._trg_functions.push(['damage_start',afunc])
        const bfunc = (e) =>{
            print('增伤测试')
            if (e.damage.isSource(this.GetParent())){
                e.damage.mul('all_damage',30,30) //测试全伤害 +30 +30%
            }
            
        }
        // this._trg_functions.push(['damage_prepare',bfunc])
        const cfunc = (e) =>{
            print('第三个测试事件注册')
        }
        this.registerDamageEvent('damage_start',afunc)
        this.idx = this.registerDamageEvent('damage_prepare',bfunc)
        print('测试索引',this.idx)
        this.registerDamageEvent('damage_prepare',cfunc)
        // this._trg_functions.push(['damage_prepare',cfunc])
        // dmgMgr.event.on('damage_start',afunc)
        // dmgMgr.event.on('damage_prepare',bfunc)
        // dmgMgr.event.on('damage_prepare',cfunc)
        this.StartIntervalThink(15)
        // this.SetDuration(20,true)
    }
    OnIntervalThink(): void {
        print('中途解除一个监听')
        this.cancelDamageEvent(this.idx);
        this.StartIntervalThink(-1)
    }

    // override OnDestroy(): void {
    //     super.OnDestroy()
    //     print('modifier结束')
    //     // this._trg_functions.forEach((v,idx) => {
    //     //     const dmgMgr = damageManager.instance()
    //     //     const eventKey = v[0] as keyof DamageEvents
    //     //     dmgMgr.event.off(eventKey,v[1] as ()=>{});
    //     // })
    // }

    IsHidden(): boolean {
        return false
    }

    override GetModifierSpellAmplify_Percentage(event: ModifierAttackEvent): number {
        
         if (!IsServer()) return 0;
        print('技能扩大伤害百分比增加',event.damage_type)
        if(event.inflictor && event.inflictor.GetName() === 'test_hidden_1'){
            
            print('自定义伤害类型增伤 100',event.damage,event.inflictor.GetName())
            return 100
        }
        return 100
    }

    override OnDamageCalculated(event: ModifierAttackEvent): void {
        print('伤害计算？',event.damage,event.original_damage)
    }

    override GetModifierTotalDamageOutgoing_Percentage(event: ModifierAttackEvent): number {
        if (!IsServer()) return 0;
        print('全伤害百分比增加',event.damage_type)
        if(event.inflictor && event.inflictor.GetName() === 'test_hidden_1'){
            
            print('自定义伤害类型增伤 100',event.damage,event.inflictor.GetName())
            return 100
        }
        return 0
    }

    override DeclareFunctions(): modifierfunction[] {
        return [
            ModifierFunction.TOTALDAMAGEOUTGOING_PERCENTAGE,
            ModifierFunction.PHYSICALDAMAGEOUTGOING_PERCENTAGE,
            ModifierFunction.SPELL_AMPLIFY_PERCENTAGE,
            //ModifierFunction.ON_ATTACK_LANDED,
            //ModifierFunction.ON_TAKEDAMAGE,
        ]
    }
}


@registerModifier()
export class modifier_test_damage2 extends BaseModifier { 
    override OnCreated(params: object): void {
        print('测试伤害修改2')
        
    }

    override GetModifierTotalDamageOutgoing_Percentage(event: ModifierAttackEvent): number {
        if (!IsServer()) return 0;
        print('全伤害百分比增加',event.damage_type)
        if(event.inflictor && event.inflictor.GetName() === 'test_hidden_1'){
            
            print('自定义伤害类型增伤 100',event.damage,event.inflictor.GetName())
            return 100
        }
        return 0
    }

    override DeclareFunctions(): modifierfunction[] {
        return [
            ModifierFunction.TOTALDAMAGEOUTGOING_PERCENTAGE,
            //ModifierFunction.ON_ATTACK_LANDED,
            //ModifierFunction.ON_TAKEDAMAGE,
        ]
    }
}