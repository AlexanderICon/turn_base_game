import React, { FC, useCallback, useEffect, useRef, useState } from "react";
import { useXNetTableEvent } from "../hooks/useXNetTable";
import { DOTAScenePanelAttributes, PanelAttributes, useGameEvent } from "react-panorama-x";
import TButton from "./common/textButton";
import ListPanel from "./common/listPanel";
import useToggle from "../hooks/useToggle";

const LoginPanel:FC = () => {
    const [errorVisible,showError] = useState(false);
    const [visible,toggleShow,setShow] = useToggle(true)

    function exitGame(){
        Game.Disconnect()
    }
    //useXNetTableEvent
    useGameEvent('s2c_custom_event',(event) => {
        // if (event.event_key === 'login_event'){
        //     const newList = new Array()
        //     for(const[k,v] of Object.entries(event.event_data)){
        //         newList.push({name:v})
        //     }
        //     setHeroList(newList)
        // }
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

    if (!visible) return(null);

    return(<Panel
        id='LoginPanel'
        visible={visible}
        className="NormalPanel"
        style={{zIndex:1000}}
        onactivate={toggleShow}
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
    </Panel>)
}

export default LoginPanel