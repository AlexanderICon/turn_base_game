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

const TestDrag:FC = () =>{
    const positionRef = useRef({ x: 500, y: 500 });
    const dragStartXRef = useRef(0);
    const dragStartYRef = useRef(0);
    const parentRef = useRef<Panel | null>(null);

    const handleDragStart = (panel: Panel, dragPanel: any) => {
        const parent = panel as Panel;
        parent.style.opacity = '0.5';
        const cursorPosition = GameUI.GetCursorPosition();
        parentRef.current = panel.GetParent();
        // 记录鼠标初始位置
        dragStartXRef.current = cursorPosition[0];
        dragStartYRef.current = cursorPosition[1];
        positionRef.current = panel.GetPositionWithinWindow();
        // @ts-ignore
    
        dragPanel.displayPanel = parent;
    };
    const handleDragEnd = (panel: Panel, dragPanel: Panel) => {
        const parent = panel as Panel;
        const cursorPosition = GameUI.GetCursorPosition();
        parent.style.opacity = '0.8';
        // 结束时的鼠标位置
        const offsetX = cursorPosition[0];
        const offsetY = cursorPosition[1];

        // 计算鼠标移动的距离
        const deltaX = offsetX - dragStartXRef.current;
        const deltaY = offsetY - dragStartYRef.current;

        const newX = positionRef.current.x + deltaX;
        const newY = positionRef.current.y + deltaY;

        positionRef.current = { x: newX, y: newY };
        // 设置面板位置
        const ry = Game.GetScreenHeight() / 1080;

        //重新设置父面板
        if (parentRef.current) {
            parent.SetParent(parentRef.current);
        }
        parent.style.x = `${newX / ry}px`;
        parent.style.y = `${newY / ry}px`;
    };

    return(<Button
        style={{
                backgroundColor:'#ffffff',
                // horizontalAlign:'center',
                // verticalAlign:'center',
                x:'500px',
                y:'500px',
                height:'60px',
                width:'60px',
                zIndex:600,
            }}
            on-ui-DragStart={handleDragStart}
            on-ui-DragEnd={handleDragEnd}
            draggable={true}
    >
        
    </Button>)
}

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
        ></PlayerAttriPanel>
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

        <TestDrag></TestDrag>
    </>)
}

export default MainPanel