import { FC, useEffect, useMemo, useRef, useState } from "react";
import { PanelAttributes, useGameEvent } from "react-panorama-x";
import ListPanel from "./common/listPanel";
import TButton from "./common/textButton";
import { HeroChooseConfig } from "../ui_table/heroChoose";


const LocalHeroList = {
    ['力量'] : ['npc_dota_hero_axe','npc_dota_hero_dragon_knight'],
    ['敏捷'] : ['npc_dota_hero_antimage','npc_dota_hero_juggernaut'],
    ['智力'] : ['npc_dota_hero_crystal_maiden','npc_dota_hero_lina'],
}

interface CharacterCardProps {
    choose_id:number,
    hero_name:string,
    //chooseCharacter:() =>{}
}

const CharacterCard:FC<CharacterCardProps & PanelAttributes> = (props) =>{
    const {
        choose_id,
        hero_name = props.hero_name ? props.hero_name : 'npc_dota_hero_antimage',
        onactivate,
        ...otherProps
    } = props;
    
    const scenePnl = useRef(null)

    function chooseCharacter(pnl:Panel){
        if(onactivate!=undefined){
            onactivate(pnl)
        }
        GameEvents.SendCustomGameEventToServer('client_player_select_hero_by_id',{id:choose_id})
    }

    useEffect(() =>{
        const scePnl = scenePnl.current
        if(scePnl){
            const pnl = scePnl as ScenePanel
            pnl.SetUnit(hero_name,'',false)
        }
    },[hero_name])

    return(<Panel
        {...otherProps}
        className="CharacterCard"
        onactivate={chooseCharacter}
    >
        <Label className="CardName" text={hero_name}></Label>
        <DOTAScenePanel 
            ref={scenePnl}
            className="CardShow"
            environment="full_body_right_side"
            >

            </DOTAScenePanel>
        <Label className="CardLevel" text={'等级：99'}></Label>
    </Panel>)
}

const HeroChoosePanel:FC<PanelAttributes> = (props) =>{
    const [heroList,setHeroList] = useState(new Array)
    const [visible,setVisible] = useState(true)
    const [freeRefresh,setFreeRefresh] = useState(0)

    // useGameEvent('s2c_custom_event',(event) => {
    //     if (event.event_key === 'login_event'){
    //         const newList = new Array()
    //         for(const[k,v] of Object.entries(event.event_data)){
    //             newList.push({name:v})
    //         }
    //         setHeroList(newList)
    //     }
    // })
    useGameEvent('server_to_client_player_hero_list',(data) =>{
        //const dataArray = new Array;
        const dataArray = data.ids as Array<number>
        const newArray = dataArray.map((value,idx) =>{
            const heroName = HeroChooseConfig.GetData(value.toString()).key
            return {name:heroName,id:value}
        })
    })

    function testRefresh(){
        const newList = new Array;
        const strArray = LocalHeroList['力量']
        newList.push({name:strArray[Math.floor(Math.random() * strArray.length)]})
        const agiArray = LocalHeroList['敏捷']
        newList.push({name:agiArray[Math.floor(Math.random() * agiArray.length)]})
        const intArray = LocalHeroList['智力']
        newList.push({name:intArray[Math.floor(Math.random() * intArray.length)]})
        setHeroList(newList)
        console.log('测试刷新',newList)
    }

    // useMemo(() => {
    //     testRefresh()
    // },[])

    function refreshHeroList(pnl:Panel){
        if(freeRefresh>0){
             GameEvents.SendCustomGameEventToServer('client_fresh_player_select_hero_list',{})
        }
    }

    if(!visible) return (null)

    return(<Panel 
            className="NormalPanel"
            id="CharacterChoosePanel"
            visible={visible}
            style={{width:`100%`,height:`100%`}}
            >
            <Label 
            text={'选择角色'}
            style={{
                fontSize:'30px',
                textAlign:`center`,
                y:`5%`,
                height:`10%`,
                width:`30%`,
                horizontalAlign:'center',
            }}
            ></Label>
            <ListPanel
                id='CharacterList'
                listArray={heroList}
                renderFunction={(idx,dt) => {
                    return <CharacterCard
                        choose_id={dt.id}
                        hero_name={dt.name}
                        onactivate={() => {
                            setVisible(false)
                            console.log('选择英雄')
                        }}
                    >
                    </CharacterCard>
                }}
                style={{
                    y:`0%`,
                    width:`80%`,
                    height:`40%`,
                    horizontalAlign:`center`,
                    //verticalAlign:'center',
                }}
            >

            </ListPanel>
            <TButton
                text={`刷新（${freeRefresh}）`}
                className="NormalButton"
                style={{
                    y:'-20%',
                    width:'180px',
                    height:'50px',
                    horizontalAlign:'center',
                    verticalAlign:'bottom',
                }}
                fontStyle={{
                    fontSize:'32px',
                }}
                onactivate={refreshHeroList}
            >
            </TButton>
        </Panel>)
}

export default HeroChoosePanel