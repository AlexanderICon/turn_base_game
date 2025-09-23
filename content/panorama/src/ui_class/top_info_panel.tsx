import { FC } from "react";
import { PanelAttributes, useGameEvent } from "react-panorama-x";


const TopInfoPanel:FC<PanelAttributes> = (props) =>{

    

    return(<Panel
        className="TopInfoPanel"
    >
        <Label text={'回合1'}
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
            text={'倒计时：120'}
            style={{
                verticalAlign:'bottom',
                fontSize:`30px`,
                horizontalAlign:'center',
            }}
        ></Label>

    </Panel>)
}

export default TopInfoPanel