import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import { useXNetTableEvent } from "../hooks/useXNetTable";
import { DOTAScenePanelAttributes, PanelAttributes, useGameEvent } from "react-panorama-x";
import TButton from "./common/textButton";
import ListPanel from "./common/listPanel";
import useToggle from "../hooks/useToggle";


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

const LoginPanel:FC = () => {
    const [errorVisible,showError] = useState(false);
    const [visible,toggleShow,setShow] = useToggle(true)
    const [heroList,setHeroList] = useState(new Array)

    function exitGame(){
        Game.Disconnect()
    }
    //useXNetTableEvent
    useGameEvent('s2c_custom_event',(event) => {
        console.log('dota2服务端事件消息')
        console.log(event.event_key)
        console.log(event.event_data?.value_string)
        console.log(event.event_data?.value_number)
        if (event.event_key === 'login_event'){
            const newList = new Array()
            for(const[k,v] of Object.entries(event.event_data)){
                newList.push({name:v})
            }
            setHeroList(newList)
        }
        if (event.event_data?.value_string === 'error'){
            console.log('显示错误面板')
            showError(true);
            return
            //Game.Disconnect()
        }
        if (event.event_key === 'choose_finish'){
            setShow(false)
            //Game.Disconnect()
        }
    })
    useXNetTableEvent('test_table','test_key',(data) => {
        console.log('xNet服务端事件消息')
        console.log(data.data_1)
        console.log(data.data_2)
        console.log(data.data_3)
    })

    if (!visible) return(null);

    return(<Panel
        id='LoginPanel'
        visible={visible}
        className="NormalPanel"
        style={{zIndex:1000}}
    >
        <Panel
            visible={errorVisible}
            className="NormalPanel"
            style={{zIndex:100,width:`100%`,height:`100%`}}
        >
            <Label 
            text={'加载失败'}
            style={{
                fontSize:'48px',
                textAlign:`center`,
                height:`15%`,
                width:`40%`,
                horizontalAlign:'center',
                verticalAlign:'center',
            }}
            ></Label>
            <TButton
                className="NormalButton"
                text='退出游戏'
                fontStyle={{fontSize:'34px'}}
                style={{
                    width:`200px`,
                    height:`80px`,
                    horizontalAlign:'center',
                    verticalAlign:'center',
                }}
                onactivate={exitGame}
            >
                {/* <Label text='退出游戏' className="ButtonText"></Label> */}
            </TButton>
        </Panel>


        <Panel 
            id="CharacterChoosePanel"
            style={{width:`100%`,height:`100%`}}
            onactivate={toggleShow}
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
        </Panel>
    </Panel>)
}

export default LoginPanel