
import { EventEmitter } from "../../core/eventEmit/eventEmit";
import { Singleton } from "../../core/singleton/singleton"

import { BaseAbility, BaseModifier, registerModifier } from "../../utils/dota_ts_adapter"

import { playerController } from "../playerController/playerController";
import { AttriKey, CharacterAttribute } from "../tableClass/characterAttribute";

const AttriDefine = CharacterAttribute.GetDefine()

declare const enum ExtraDamageType{
    PHYSICAL = 0, //物理
    LIGHT = 1, //光耀
    DARK = 2, //暗影
    ICE = 3, //冰霜
    FIRE = 4, //火焰
    LIGHTNING = 5, //雷电
    NATURE = 6, //自然
}

const DamageTextColor = {
    White:Vector(255,255,255),

}

export interface DamageEvents{
    'damage_start': { damage:DamageObj } //伤害开始 可以阻止伤害发生
    //'damage_start': { damage:DamageObj }
    'damage_prepare': { damage:DamageObj } //造成伤害前
    'damage_effect': { damage:DamageObj } //伤害效果
    'damage_finish': { damage:DamageObj } //伤害结束
}

interface DamageParams{
    damage:number,
    attacker:CDOTA_BaseNPC,
    victim:CDOTA_BaseNPC,
    ability?:CDOTABaseAbility|undefined,
    damage_type:DamageTypes,
}
export namespace damageManager {
    class DamageManager {
        private event_emit:EventEmitter<DamageEvents> = new EventEmitter()
        private _has_init = false
        public init(){
            if(this._has_init) return
            print("伤害管理器初始化")
            const game: CDOTABaseGameMode = GameRules.GetGameModeEntity();
            //game.ClearDamageFilter()
            
            game.SetDamageFilter((dmgFilterEvent) => {
                //print('伤害修改Filter',dmgFilterEvent.damage)
                const attacker = EntIndexToHScript(dmgFilterEvent.entindex_attacker_const) as CDOTA_BaseNPC
                const victim = EntIndexToHScript(dmgFilterEvent.entindex_victim_const) as CDOTA_BaseNPC
                let ability;
                if(dmgFilterEvent.entindex_inflictor_const){
                    ability = EntIndexToHScript(dmgFilterEvent.entindex_victim_const) as CDOTABaseAbility
                }
                
                const dmgObj = new DamageObj({
                    attacker:attacker,
                    victim:victim,
                    ability:ability,
                    damage:dmgFilterEvent.damage,
                    damage_type:dmgFilterEvent.damagetype_const,
                })

                const dmgRes = this.deal_damage(dmgObj)
                dmgFilterEvent.damage = dmgObj.damage;
                //print('造成伤害是否成功',dmgRes,dmgObj.damage)
                return dmgRes
            }, game)
            
            this._has_init = true;
        }
        
        constructor() {
            
        }
        public get event(): EventEmitter<DamageEvents>{
            return this.event_emit;
        }

        private damage_mul_and_div(damageObj:DamageObj){
            let damage = damageObj.damage;
            if(damageObj.is_attack){ //普攻伤害加成
                const mulDt = damageObj.getMulData('attack_damage')
                damage = (damage+mulDt[0]) * (1+mulDt[1]*0.01)
            }else{
                const mulDt = damageObj.getMulData('skill_damage')
                damage = (damage+mulDt[0]) * (1+mulDt[1]*0.01)
            }

            //元素伤害类型
            let elementType:AttriKey
            switch(damageObj.ex_damage_type){
                case ExtraDamageType.PHYSICAL:{
                    elementType = 'physical_damage';
                    break;
                }
                case ExtraDamageType.DARK:{
                    elementType = 'dark_damage';
                    break
                }
                case ExtraDamageType.FIRE:{
                    elementType = 'fire_damage'
                    break
                }
                case ExtraDamageType.ICE:{
                    elementType = 'ice_damage'
                    break
                }
                case ExtraDamageType.LIGHT:{
                    elementType = 'light_damage'
                    break
                }
                case ExtraDamageType.LIGHTNING:{
                    elementType = 'lightning_damage'
                    break
                }
                case ExtraDamageType.NATURE:{
                    elementType = 'nature_damage'
                    break
                }
            }
            const mulDtElement = damageObj.getMulData(elementType)
            damage = (damage+mulDtElement[0]) * (1+mulDtElement[1]*0.01)
            
            const mulDtAll = damageObj.getMulData('all_damage')
            damage = (damage+mulDtAll[0]) * (1+mulDtAll[1]*0.01)

            if(damageObj.is_attack){ // 额外普攻伤害%加成
                const mulDt = damageObj.getMulData('ex_attack_damage')
                damage = (damage) * (1+mulDt[1]*0.01)
            }else{
                const mulDt = damageObj.getMulData('ex_skill_damage')
                damage = (damage) * (1+mulDt[1]*0.01)
            }
            const mulDtExAll = damageObj.getMulData('ex_all_damage')
            damage = damage * (1+mulDtExAll[1]*0.01)

            //全能属性增伤
            const power = damageObj.getSourceAttribute('power_base');
            damage = damage * (1 + power[2] * 0.01)

            if(damageObj.isCrit()){ //该伤害暴击了
                const critDmg = damageObj.getSourceAttribute('crit_damage');
                damage = damage * (1+critDmg[2] * 0.01)
            }
            //print('伤害增幅 ',damageObj.damage,damage)
            damageObj.damage = damage;
        }

        private PopupDamage(damageObj:DamageObj){
            let colorVector = Vector(255,255,255)
            if (damageObj.damage <=0) return
            switch(damageObj.ex_damage_type){
                case ExtraDamageType.PHYSICAL:{
                    colorVector = Vector(255,255,255)
                    break
                }
                case ExtraDamageType.DARK:{
                    colorVector = Vector(0,0,0)
                    break
                }
                case ExtraDamageType.FIRE:{
                    colorVector = Vector(220,20,60)
                    break
                }
                case ExtraDamageType.ICE:{
                    colorVector = Vector(30,144,255)
                    break
                }
                case ExtraDamageType.LIGHT:{
                    colorVector = Vector(250,250,210)
                    break
                }
                case ExtraDamageType.LIGHTNING:{
                    colorVector = Vector(240,230,140)
                    break
                }
                case ExtraDamageType.NATURE:{
                    colorVector = Vector(152,251,152)
                    break
                }
                default:{
                    break
                }
            }

            if(damageObj.isCrit()){
                PopupCriticalDamageColored(damageObj.target,damageObj.damage,colorVector)
            }else{
                PopupDamageColored(damageObj.target,damageObj.damage,colorVector)
            }
        }

            /**
                * deal_damage
            damage:DamageObj :number    */
        public deal_damage(damageObj:DamageObj):boolean {
            let damage = 0;
            const damageType = damageObj.damage_type;
            const baseDamage = damageObj.damage; //applyDamage 传入
            const attack = damageObj.getSourceAttribute('attack')[2];
            const targetDef = damageObj.getTargetAttribute('defence')[2]

            const sourceLv = damageObj.getSourceAttribute('level')[2];
            const targetLV = damageObj.getTargetAttribute('level')[2]

            const levelRate = 100

            const atkHit = damageObj.getSourceAttribute('hit_base')[2]/levelRate;
            const defDodge = damageObj.getTargetAttribute('dodge_base')[2]/levelRate;
            const hitPercent = 100 - defDodge + atkHit;

            const is_hit = hitPercent>(Math.random() * 100) //伤害被闪避
            damageObj.setDodge(!is_hit)
            if(!is_hit) return false;

            const techRate = damageObj.getSourceAttribute('technique_base')[2]/levelRate;
            const is_tech = techRate>(Math.random() * 100) // 伤害触发技巧
            damageObj.setTech(is_tech);

            if(damageObj.is_attack){ //普攻
                //print('攻击伤害',damageObj.damage_type)
                // if(damageType === DamageTypes.ABILITY_DEFINED){ //伤害类型是自定义，传入的伤害都会是0
                //     damage = attack
                // }else if(damageType === (DamageTypes.PHYSICAL||DamageTypes.MAGICAL||DamageTypes.PURE)){ //伤害类型是dota原生3种类型，传入的伤害有效
                //     damage = baseDamage;
                // }
                damage = attack
                
                //普攻伤害加上额外普攻伤害与额外所有伤害的基础值
                damage = damage + damageObj.getSourceAttribute('ex_attack_damage')[0] + damageObj.getSourceAttribute('ex_all_damage')[0]

                
            }else{ //技能
                if(damageType === DamageTypes.ABILITY_DEFINED){ //伤害类型自定义，通过技能对象获取伤害值
                    
                }else{ //伤害类型固定
                    damage = baseDamage
                }

                //普攻伤害加上额外技能伤害与额外所有伤害的基础值
                damage = damage + damageObj.getSourceAttribute('ex_skill_damage')[0] + damageObj.getSourceAttribute('ex_all_damage')[0]

            }
            if(!damageObj.isTech()){ //未触发技巧，基础伤害减去目标防御
                damage = damage - targetDef;
                if (damage<0){ //攻击未破防
                    damage = 0
                }
            }
            
           

            damageObj.damage = damage;
            this.event_emit.emit('damage_start',{ damage:damageObj })
            if(damageObj.isPrevent() || damageObj.isDodge()){ //被阻止或被闪避
                return false;
            }
            damageObj.prevent = () =>{};//移除阻止方法

            const critRate = 5 + damageObj.getSourceAttribute('crit_base')[2]/levelRate;
            const countCritRate = damageObj.getTargetAttribute('crit_tenacity_base')[2]/levelRate;
            const isCrit = (critRate-countCritRate) > (math.random() * 100)
            damageObj.setCrit(isCrit);

            this.event_emit.emit('damage_prepare',{ damage:damageObj })
            this.damage_mul_and_div(damageObj);

            this.PopupDamage(damageObj);
           
            this.event_emit.emit('damage_effect',{ damage:damageObj })


            this.event_emit.emit('damage_finish',{ damage:damageObj })
            return true 
        }

    }
    // export function instance() {
    //     return Singleton.Get<DamageManager>('damageManager', DamageManager)
    // }

    export const key = 'damageManager'

    export const instance = () => { return Singleton.Get<DamageManager>(key, DamageManager)}
}



// ListenToGameEvent('entity_hurt',(event) =>{
//     // print('实体受伤事件')
//     // print(event.entindex_attacker)
//     // print(event.damage)
//     // print(event.entindex_killed)
//     // print(event.entindex_inflictor)
// },undefined)

function damageMulFilter(damageObj:DamageObj,mulType:AttriKey):boolean{
    let canMul = false
    const tpData = AttriDefine[mulType];
    if(tpData.Type != 2){ //非增伤类别不允许增伤
        return canMul;
    }
    switch(mulType){
        case 'all_damage':{
            canMul = true
            break;
        }
        case 'physical_damage':{
            if(damageObj.damage_type === DamageTypes.PHYSICAL){
                canMul = true;
            }
            break
        }
        case 'attack_damage':case'ex_attack_damage':{
            if(damageObj.is_attack){
                canMul = true;
            }
            break
        }
        case 'skill_damage':case'ex_skill_damage':{
            if(!damageObj.is_attack){
                canMul = true;
            }
            break
        }
        case 'physical_damage':{
            if(damageObj.ex_damage_type === ExtraDamageType.PHYSICAL){
                canMul = true;
            } 
            break
        }
        case 'light_damage':{
            if(damageObj.ex_damage_type === ExtraDamageType.LIGHT){
                canMul = true;
            }
            break
        }
        case 'dark_damage':{
            if(damageObj.ex_damage_type === ExtraDamageType.DARK){
                canMul = true;
            }
            break
        }
        case 'ice_damage':{
            if(damageObj.ex_damage_type === ExtraDamageType.ICE){
                canMul = true;
            }
            break
        }
        case 'fire_damage':{
            if(damageObj.ex_damage_type === ExtraDamageType.FIRE){
                canMul = true;
            }
            break
        }
        case 'lightning_damage':{
            if(damageObj.ex_damage_type === ExtraDamageType.LIGHTNING){
                canMul = true;
            }
            break
        }
        case 'nature_damage':{
            if(damageObj.ex_damage_type === ExtraDamageType.NATURE){
                canMul = true;
            }
            break
        }
        default:{
            
        }
    }
    return canMul
}

class DamageObj{
    private origin_damage:number;
    private current_damage:number;
    private damage_source:CDOTA_BaseNPC;
    private damage_target:CDOTA_BaseNPC;
    private damage_skill:CDOTABaseAbility;

    private source_modifier:modifier_character_damage
    private target_modifier:modifier_character_damage

    private _base_damage_type:DamageTypes;
    private _ex_damage_type:ExtraDamageType;

    private _is_attack:boolean = true;

    private source_attribute:Map<AttriKey,[number,number,number]> = new Map()
    private target_attribute:Map<AttriKey,[number,number,number]> = new Map()

    private _damage_mul:Map<AttriKey,Array<[number,number]>> = new Map()

    private _success = true; //伤害是否能成功造成

    private _is_crit = false //伤害是否暴击
    private _is_dodge = false //伤害是否被闪避
    private _is_tech = false //伤害是否触发技巧

    constructor(params:DamageParams){
        this.origin_damage = params.damage;
        this.current_damage = params.damage;
        this.damage_source = params.attacker;
        this.damage_target = params.victim;
        this.damage_skill = params.ability;

        this._base_damage_type = params.damage_type;

        const attributeTab = AttriDefine;

        this.source_modifier = (this.damage_source.FindModifierByName(modifier_character_damage.name)) as modifier_character_damage
        this.target_modifier = (this.damage_target.FindModifierByName(modifier_character_damage.name)) as modifier_character_damage

        for(const[k,v] of Object.entries(attributeTab)){ //快照记录造成伤害时刻的双方属性
            this.source_attribute.set(k as AttriKey,this.source_modifier.getAttributeAll(k as AttriKey))
            this.target_attribute.set(k as AttriKey,this.target_modifier.getAttributeAll(k as AttriKey))
        }
        if(this._base_damage_type === DamageTypes.PHYSICAL){
            this._ex_damage_type = ExtraDamageType.PHYSICAL;
        }
        if(params.ability){
            this._is_attack = false;
        }
    }

    public isSource(unit:CDOTA_BaseNPC):boolean{ //判定一个单位是否是该伤害的来源
        return unit === this.damage_source
    }
    public isTarget(unit:CDOTA_BaseNPC):boolean{ //判定一个单位是否是该伤害的目标
        return unit === this.damage_target
    }

    public get damage(){
        return this.current_damage;
    }
    public set damage(dmg:number){
        this.current_damage = dmg;
    }
    public get target(){
        return this.damage_target
    }
    public get source(){
        return this.damage_source
    }
    public get is_attack(){ //获取该伤害是否为普攻
        return this._is_attack
    }
    public get damage_type(){ //获取基本伤害类型
        return this._base_damage_type
    }
    public get ex_damage_type(){ //获取额外伤害类型(元素伤害类型)
        return this._ex_damage_type
    }
    public getSourceAttribute(k:AttriKey):[number,number,number]{
        return this.source_attribute.get(k);
    }
    public getTargetAttribute(k:AttriKey):[number,number,number]{
        return this.target_attribute.get(k);
    }
    public prevent(){ //设置伤害已被阻止
        this._success = false;
    }
    public isPrevent():boolean{ //获取伤害是否已被阻止
        return !this._success
    }
    public setTech(is:boolean){
        this._is_tech = is;
    }
    public isTech():boolean{
        return this._is_tech;
    }
    public setDodge(is:boolean){
        this._is_dodge = is;
    }
    public isDodge():boolean{
        return this._is_dodge;
    }
    public setCrit(is:boolean){
        this._is_crit = is;
    }
    public isCrit():boolean{
        return this._is_crit;
    }

    //增幅伤害
    public mul(tp:AttriKey,consNum:number,perNum:number){
        if (!damageMulFilter(this,tp)) return; //增伤类型判定未通过 
        if(!this._damage_mul.get(tp)){
            this._damage_mul.set(tp,new Array);
        }
        const mulList = this._damage_mul.get(tp)
        mulList.push([consNum,perNum]);
    }
    public getMulData(tp:AttriKey):[number,number]{
        let mulData:[number,number]
        mulData = [0,0]
        const mulArray = this._damage_mul.get(tp);
        if(mulArray){
            mulArray.forEach((value) =>{
                mulData[0] = mulData[0] + value[0];
                mulData[1] = mulData[1] + value[1];
            })
        }
        return mulData;
    }
}

// 人物属性记录用modifier
export enum GetAttributeType {
    final,
    base,
    percent,
    all,
}
@registerModifier()
export class modifier_character_damage extends BaseModifier {
    private attribute: Map<AttriKey, number> = new Map;
    private percent_attribute: Map<AttriKey, number> = new Map;
    
    private _add_hp = 1000
    // override GetModifierOverrideAttackDamage(): number {
    //     return 0
    // }
    override GetModifierExtraHealthBonus(){
        return this._add_hp
    }

    override GetModifierHealthBonus(): number {
        return 0
    }

    override OnCreated(params: object): void {
        const unit = this.GetParent()
        if (!IsServer()) return;
        const attributes = CharacterAttribute.GetData(unit.GetName());
        // const testTab = DOTAGameManager.GetHeroDataByName_Script(unit.GetName())
      
        // print(testTab,'测试单位创建',unit.GetUnitName(),unit.GetModelName(),unit.GetClassname(),unit.GetName(),'|')
        // print(dump(testTab))
        if(attributes){
            for(const[k,v] of Object.entries(AttriDefine)){
                const key = k as AttriKey
                let value = 0
                let pValue = 0
                if(attributes[key]){
                    const tvalue = attributes[key]
                    let vTab = [0,0]
                    if(typeof tvalue === "number"){
                        vTab[0] = tvalue
                    }else{
                        vTab[0] = tvalue[1]
                        vTab[1] = tvalue[2]
                    }
                    value = tonumber(vTab[0])?tonumber(vTab[0]):0
                    pValue = tonumber(vTab[1])?tonumber(vTab[1]):0
                }
                this.attribute.set(key,value);
                this.percent_attribute.set(key,pValue);
                switch(key){
                    case "hp_max":{
                        // unit.SetBaseMaxHealth(value>0?value:1000)
                        // unit.SetMaxHealth(value>0?value:1000)
                        // unit.SetHealth(value>0?value:1000)
                        this._add_hp = (value>0?value:1000)
                        //CustomNetTables.SetTableValue('health_sync',)
                        break
                    }
                    case 'attack':{
                        unit.SetBaseDamageMin(value>0?value:0)
                        unit.SetBaseDamageMax(value>0?value:0)
                        break
                    }
                    // case 'crit_base':{
                    //     print('测试暴击打印')
                    //     print(value,pValue)
                    //     break
                    // }
                }
                //unit.Attribute_SetFloatValue(k,value);
                // print('角色建立初始化3',k,v);
            }
            unit.SetMaxMana(1)
            print('测试',unit.GetName())
        }else{ //没配置的初始化基础赋值0
            const defaultAt = AttriDefine;
            for(const[k,v] of Object.entries(defaultAt)){
                this.attribute.set(k as AttriKey,0);
                this.percent_attribute.set(k as AttriKey,0);
                // print('角色建立初始化3',k,v);
            }
            unit.SetMaxMana(1)
        }
    }

    override IsHidden(){
        return true;
    }

    override IsPurgable(): boolean {
        return false;
    }



    override OnAttackLanded(event: ModifierAttackEvent): void {
        if (!IsServer()) return;
        const unit = this.GetParent()
        if (unit!=event.attacker) return;
        const target = event.target
        // Timers.CreateTimer(0.5,() =>{
        //     const dmg = ApplyDamage({
        //     attacker:unit,
        //     victim:target,
        //     damage:0,
        //     damage_type:DamageTypes.ALL,
        //     //ability:unit.FindAbilityByName('test_hidden_1')
        // })
        // // const dmg2 = ApplyDamage({
        // //     attacker:unit,
        // //     victim:target,
        // //     damage:this.getAttribute('haste_base'),
        // //     damage_type:DamageTypes.PHYSICAL,
        // // })
        // print('攻击附加伤害',dmg)
        // }
    // )
        
    }

    // override GetModifierIgnorePhysicalArmor(event: ModifierAttackEvent): number {
    //     return 0
    // }
    private caculateLevelRate(value){
        let percentTrans;
        const lv = this.getAttribute('level');
        percentTrans = value * (lv/(lv+100))
        return percentTrans
    }
    
    // override GetModifierTotalDamageOutgoing_Percentage(event: ModifierAttackEvent): number {
    //     if (!IsServer()) return 0;
    //     print('全伤害百分比增加',event.damage_type)
    //     if(event.inflictor && event.inflictor.GetName() === 'test_hidden_1'){
            
    //         print('自定义伤害类型增伤 100',event.damage,event.inflictor.GetName())
    //         return 100
    //     }
    //     return 0
    // }

    public getAttributeAll(attriName:AttriKey):[number,number,number]{
        const bValue = this.getAttribute(attriName,GetAttributeType.base)
        const pValue = this.getAttribute(attriName,GetAttributeType.percent)
        const fValue = this.getAttribute(attriName,GetAttributeType.final)
        return [bValue,pValue,fValue]
    }

    public getAttribute(attriName: AttriKey,valueType:GetAttributeType = GetAttributeType.final): number {
        let value: number = 0;
        const gtype = valueType?valueType:GetAttributeType.final;
        const attriDefine = AttriDefine[attriName]
       
        const pType = attriDefine.PercentType;

        switch(gtype){
            case GetAttributeType.base:{
                value = this.attribute.get(attriName)
                break
            }
            case GetAttributeType.percent:{
                value = this.percent_attribute.get(attriName)
                break
            }
            default :{
                const baseValue = this.attribute.get(attriName)
                let perValue = this.percent_attribute.get(attriName)

                if(pType === 1){
                    if(perValue < -100){
                        perValue = -100
                    }

                    value = baseValue * (1+perValue/100)
                }else if(pType === 2){
                    return this.caculateLevelRate(baseValue) + perValue
                }
                else{
                    return baseValue;
                }
                
            }
        }
        return value
    }

    public addAttribute(attriName: AttriKey,addValue:number,isPercent:boolean = false): boolean {
        let addSuc = true;
        if(isPercent){
            this.percent_attribute.set(attriName,this.percent_attribute.get(attriName) + addValue)
        }else{
            this.attribute.set(attriName,this.attribute.get(attriName) + addValue)
        }

        return addSuc
    }

    override DeclareFunctions(): modifierfunction[] {
        return [
            ModifierFunction.TOTALDAMAGEOUTGOING_PERCENTAGE,
            ModifierFunction.ON_ATTACK_LANDED,
            ModifierFunction.HEALTH_BONUS,
            ModifierFunction.EXTRA_HEALTH_BONUS,
            //ModifierFunction.ON_TAKEDAMAGE,
            // ModifierFunction.IGNORE_PHYSICAL_ARMOR,//无视护甲（走自定义伤害流程）
            // ModifierFunction.OVERRIDE_ATTACK_DAMAGE,
        ]
    }
}
