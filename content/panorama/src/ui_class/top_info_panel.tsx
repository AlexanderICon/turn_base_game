import { FC, useCallback, useEffect, useState } from "react";
import { PanelAttributes, useGameEvent, useNetTableKey, useNetTableValues } from "react-panorama-x";
import { useInterval } from "../hooks/useInterval";


const TopInfoPanel:FC<PanelAttributes> = (props) =>{
    const [countDown,setCountDown] = useState(120)
    const [roundNum,setRound] = useState(1)
    const [stateStr,setStateStr] = useState('准备阶段')

    const serverRoundNum = useNetTableKey('server_round_ready','round');
    const serverRoundTime = useNetTableKey('server_round_ready','ready_time');
    const serverRoundState = useNetTableKey('server_round_ready','state');
    // const serverRoundData = useNetTableValues('server_round_ready')

    // useInterval(() =>{
    //     if(countDown > 0){ //倒计时
    //         setCountDown(countDown - 1)
    //     }
    // },1000)
    useEffect(() =>{
        if(serverRoundTime!=undefined){
            setCountDown(serverRoundTime.time);
        }
    },[serverRoundTime])
    useEffect(() =>{
        if(serverRoundNum!=undefined){
            setRound(serverRoundNum.round);
        }
    },[serverRoundNum])
    useEffect(() =>{
        if(serverRoundState!=undefined){
            switch(serverRoundState.state){
                case 0:{
                    setStateStr('准备阶段');
                    break;
                }
                case 1:{
                     setStateStr('战斗阶段');
                    break   
                }
                case 2:{
                     setStateStr('游戏结束');
                    break
                }
                default:{
                    setStateStr('准备阶段');
                    break;
                }
            }
            
        }
       
    },[serverRoundState])

    return(<Panel
        className="TopInfoPanel"
    >
        <Label text={`回合${roundNum}`}
            style={{
                fontSize:`30px`,
                horizontalAlign:'center',
            }}
        ></Label>
        <Label text={stateStr}
            style={{
                y:'30%',
                fontSize:`30px`,
                horizontalAlign:'center',
            }}
        ></Label>
        <Label 
            text={`倒计时：${countDown}`}
            style={{
                verticalAlign:'bottom',
                fontSize:`30px`,
                horizontalAlign:'center',
            }}
        ></Label>

    </Panel>)
}

export default TopInfoPanel