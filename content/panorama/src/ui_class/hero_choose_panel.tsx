import { FC, useEffect, useRef, useState } from "react";
import { PanelAttributes, useGameEvent } from "react-panorama-x";
import ListPanel from "./common/listPanel";

interface CharacterCardProps {
    hero_name:string,
    //chooseCharacter:() =>{}
}

const CharacterCard:FC<CharacterCardProps & PanelAttributes> = (props) =>{
    const {
        hero_name = props.hero_name ? props.hero_name : 'npc_dota_hero_antimage',
        ...otherProps
    } = props;

    const scenePnl = useRef(null)

    function chooseCharacter(){
        GameEvents.SendCustomGameEventToServer('c2s_login_event',{event_key : '选择角色'+hero_name,event_data:{
            choose_hero:hero_name
        }})
    }

    useEffect(() =>{
        const scePnl = scenePnl.current
        if(scePnl){
            const pnl = scePnl as ScenePanel
            pnl.SetUnit(hero_name,'',false)
        }
    },[])

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
    const [visible,setVisible] = useState(false)

    useGameEvent('s2c_custom_event',(event) => {
        if (event.event_key === 'login_event'){
            const newList = new Array()
            for(const[k,v] of Object.entries(event.event_data)){
                newList.push({name:v})
            }
            setHeroList(newList)
        }
    })

    if(!visible) return (null)

    return(<Panel 
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
                        hero_name={dt.name}
                    >
                    </CharacterCard>
                }}
                style={{
                    y:`20%`,
                    width:`80%`,
                    height:`40%`,
                    horizontalAlign:`center`,
                }}
            >

            </ListPanel>
        </Panel>)
}

export default HeroChoosePanel