import { FC, useEffect, useRef, useState } from "react";
import TButton from "./common/textButton";
import BagPanel from "./bag_panel";
import PlayerAttriPanel from "./player_attri_panel";

const MainPanel:FC = () =>{
    const bagRef = useRef(null)
    const [bagShow,setBagShow] = useState(false);
    const [playerInfoShow,setPlayerShow] = useState(false);

    function openBagPanel(pnl:Panel){
        setBagShow(true);

        setPlayerShow(false);
    }
    function openPlayerPanel(pnl:Panel){
        setPlayerShow(true);

        setBagShow(false);
    }

    function openAdventurePanel(pnl:Panel){

        setBagShow(false)
        setPlayerShow(false)
    }

    useEffect(() =>{

    },[])

    return(<Panel
        className="root"
    >
        <BagPanel
            visible={bagShow}
        ></BagPanel>
        <PlayerAttriPanel
            visible={playerInfoShow}
        >

        </PlayerAttriPanel>
        <TButton
            text={'营地'}
            fontStyle={{
                fontSize:`40px`,
            }}
            style={{
                x:`5%`,
                y:`10%`,
                width:`150px`,
                height:`100px`,
            }}
            
        ></TButton>
        <TButton
            text={'背包'}
            fontStyle={{
                fontSize:`40px`,
            }}
            style={{
                x:`5%`,
                y:`20%`,
                width:`150px`,
                height:`100px`,
            }}
            onactivate={openBagPanel}
        ></TButton>
        <TButton
            text={'冒险'}
            fontStyle={{
                fontSize:`40px`,
            }}
            style={{
                x:`5%`,
                y:`30%`,
                width:`150px`,
                height:`100px`,
            }}

            onactivate={openAdventurePanel}
        ></TButton>
        <TButton
            text={'人物'}
            fontStyle={{
                fontSize:`40px`,
            }}
            style={{
                x:`5%`,
                y:`40%`,
                width:`150px`,
                height:`100px`,
            }}
            onactivate={openPlayerPanel}
        ></TButton>
    </Panel>)
}

export default MainPanel