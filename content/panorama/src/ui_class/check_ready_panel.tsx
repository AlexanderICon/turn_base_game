import { FC, useMemo, useState } from "react";
import { PanelAttributes, render } from "react-panorama-x";
import TButton from "./common/textButton"
import ListPanel from "./common/listPanel";

const CheckReadyPanel:FC<PanelAttributes> = (props) => {
    const [readyStateList,setReadyState] = useState(new Array)
    const [readyTxt,setReadyTxt] = useState('准备');

    useMemo(() =>{
        setReadyState([1,2,3,4])
    },[])

    function sendReadyMessage(){

    }

    return(<Panel
        style={{
            x:`-100px`,
            y:'100px',
            horizontalAlign:'right',
            width:'280px',
            height:`140px`,
            flowChildren:'down',
        }}
    >
        <Label 
            text={'准备状态'}
            style={{
                horizontalAlign:'center',
            }}
        ></Label>

        <ListPanel
            style={{
                width:'95%',
                height:'80px',
            }}
            id='ReadyStateList'
            listArray={readyStateList}
            childHeight="60px"
            childWidth="60px"
            renderFunction={(idx,dt) => {
                return <Panel>

                </Panel>
            }}  
        ></ListPanel>

        <TButton
            style={{
                width:'100px',
                height:'40px',
                horizontalAlign:'center',
            }}
            text={readyTxt}
            onactivate={sendReadyMessage}
        ></TButton>
    </Panel>)
}

export default CheckReadyPanel