import { FC, useContext, useEffect, useMemo, useState } from "react";
import useToggle from "../hooks/useToggle";
import { EventEmitter } from "events";
import ListPanel from "./common/listPanel";
import { useGameEvent, useNetTableValues } from "react-panorama-x";
import TButton from "./common/textButton";

const DifficultChoosePanel:FC = () => {
    const [visible,toggleVisble,setVisible] = useToggle(false)
    const [diffArray,setDiffArray] = useState(new Array);

    useMemo(() =>{
        setDiffArray([1,2,3,4])
    },[])

    useGameEvent('s2c_custom_event',(event) => {
        if(event.event_key === 'login_success'){
            setVisible(true);
        }
    },[])

    const diffValue = useNetTableValues('custom_net_table_1')

    useEffect(() =>{
        setVisible(true)
        setDiffArray([1,2,3])
    },[diffValue])

    function chooseDiff(){
        GameEvents.SendCustomGameEventToServer('c2s_difficult_event',{event_key : 'choose_difficult',event_data:{
            level:1
        }})
    }

    if(!visible) return null
    return (<Panel
        className="NormalPanel"
        visible = {visible}
        onactivate={toggleVisble}
    >
        <Panel
            style={{
                width:'30%',
                height:'65%',
                verticalAlign:`center`,
                horizontalAlign:`center`,
                backgroundColor:`#ffffff`
            }}
        >
            <ListPanel
                id='choose_diffcult_list'
                listArray={diffArray}
                childWidth={`80%`}
                childHeight={`100px`}
                style={{
                    width:`90%`,
                    height:`90%`,
                    verticalAlign:'center',
                    horizontalAlign:'center',
                }}
                renderFunction={(idx,dt) => {
                    return <TButton
                        style={{
                            width:`100%`,
                            height:`100%`,
                        }}
                        text={'难度'+idx}
                        onactivate={() => {
                            GameEvents.SendCustomGameEventToServer('c2s_difficult_event',{event_key : 'choose_difficult',event_data:{
                                level:(idx+1)
                            }})
                        }}
                    >

                    </TButton>
                }}
            >

            </ListPanel>
        </Panel>
        <TButton
            text={'确认'}
        >
            
        </TButton>


    </Panel>)
}

export default DifficultChoosePanel