import { FC, useEffect, useRef, useState } from "react";
import TButton from "./common/textButton";
import BagPanel from "./bag_panel";
import PlayerAttriPanel from "./player_attri_panel";
import EquipShop from "./shopPanel/equip_shop_panel";
import SkillShopPanel from "./shopPanel/skill_shop_panel";
import InvestmentShopPanel from "./shopPanel/investment_shop_panel";
import TopInfoPanel from "./top_info_panel";
import CheckReadyPanel from "./check_ready_panel";
import ResourceLabel from "./common/resourceLabel";

const MainPanel:FC = () =>{
    const bagRef = useRef(null)
    const [bagShow,setBagShow] = useState(false);
    const [playerInfoShow,setPlayerShow] = useState(false);
    const [equipShopShow,setEquipShopShow] = useState(false);
    const [skillShopShow,setSkillShopShow] = useState(false);
    const [investShopShow,setInvestShopShow] = useState(false);

    const panelType = {
        ['bag']:setBagShow,
        ['player']:setPlayerShow,
        ['equipShop']:setEquipShopShow,
        ['skillShop']:setSkillShopShow,
        ['investShop']:setInvestShopShow,
    }

    function openPanel(type:string){
        for(const [k,v] of Object.entries(panelType)){
            if(k === type){
                v(true)
            }else{
                v(false)
            }
        }
    }
    useEffect(() =>{

    },[])

    return(<>
        <BagPanel
            visible={bagShow}
        ></BagPanel>
        <PlayerAttriPanel
            visible={playerInfoShow}
        >
        </PlayerAttriPanel>
        <EquipShop
            visible={equipShopShow}
        ></EquipShop>
        <SkillShopPanel
            visible={skillShopShow}
        ></SkillShopPanel>
        <InvestmentShopPanel
            visible={investShopShow}
        ></InvestmentShopPanel>
        <Panel
            style={{
                x:`5%`,
                y:`25%`,
                width:`100px`,
                height:`400px`,
                flowChildren:'down',

                backgroundColor:'#2f3536ff'
            }}
        >
            <Label
                text={'商店'}
                style={{
                    textAlign:'center',
                    width:`90%`,
                    height:'40px',
                    fontSize:'28px'
                }}
            ></Label>
            <Panel
            style={{
                verticalAlign:'bottom',
                width:`95%`,
                height:`320px`,
                flowChildren:'down',
            }}
            children={[
                <TButton
                key='equip'
            text={'装备'}
            fontStyle={{
                fontSize:`40px`,
            }}
            onactivate={() => {
                openPanel('equipShop')
            }}
            style={{
                x:`5%`,
                y:`10%`,
                width:`150px`,
                height:`60px`,
            }}
            
        ></TButton>,
            <TButton
                key='ability'
                text={'技能'}
                fontStyle={{
                fontSize:`40px`,
                }}
            style={{
                x:`5%`,
                y:`30%`,
                width:`150px`,
                height:`60px`,
            }}
            onactivate={() => {
                openPanel('skillShop')
            }}
            >
                
            </TButton>
            ,
             <TButton
             key='investment'
            text={'投资'}
            fontStyle={{
                fontSize:`40px`,
            }}
            style={{
                x:`5%`,
                y:`30%`,
                width:`150px`,
                height:`60px`,
            }}

            onactivate={() => {
                openPanel('investShop')
            }}
        ></TButton>
            ]}
        ></Panel>
        </Panel>
        

        
        <TButton
            text={'背包'}
            fontStyle={{
                fontSize:`40px`,
            }}
            style={{
                x:`5%`,
                y:`-5%`,
                width:`150px`,
                height:`100px`,
                verticalAlign:"bottom",
            }}
            onactivate={() => {
                openPanel('bag')
            }}
        ></TButton>
       
        <TButton
            text={'人物'}
            fontStyle={{
                fontSize:`40px`,
            }}
            style={{
                x:`15%`,
                y:`-5%`,
                width:`150px`,
                height:`100px`,
                verticalAlign:"bottom",
            }}
            onactivate={() => {
                openPanel('player')
            }}
        ></TButton>

        <TopInfoPanel></TopInfoPanel>
        {/* <CheckReadyPanel></CheckReadyPanel> */}
        <ResourceLabel
            style={{
                backgroundColor:'#000000',
                horizontalAlign:'right',
                width:`140px`,
                height:`60px`,
                y:`5%`,
                x:'-5%'
            }}
            resource_type="current_gold"
        ></ResourceLabel>
         <ResourceLabel
            style={{
                backgroundColor:'#000000',
                horizontalAlign:'right',
                width:`140px`,
                height:`60px`,
                y:`5%`,
                x:'-15%'
            }}
            resource_type="current_wood"
        ></ResourceLabel>

    </>)
}

export default MainPanel