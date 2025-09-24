import { FC, useState } from "react";
import { PanelAttributes, useGameEvent } from "react-panorama-x";
import { useInterval } from "../hooks/useInterval";


const TopInfoPanel:FC<PanelAttributes> = (props) =>{
    const [countDown,setCountDown] = useState(120)
    const [roundNum,setRound] = useState(1)

    useInterval(() =>{
        if(countDown > 0){ //倒计时

            setCountDown(countDown - 1)
        }
    },1000)

    

    return(<Panel
        className="TopInfoPanel"
    >
        <Label text={`回合${roundNum}`}
            style={{
                fontSize:`30px`,
                horizontalAlign:'center',
            }}
        ></Label>
        <Label text={'准备阶段'}
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