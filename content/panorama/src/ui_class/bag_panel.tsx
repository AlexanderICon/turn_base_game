import { FC, useEffect, useMemo, useState } from "react";
import { onXNetTableEvent, useXNetTableEvent, useXNetTableKey } from "../hooks/useXNetTable";
import { CharacterAttributeTable } from "../ui_table/characterAttribute";
import { PanelAttributes, useNetTableValues } from "react-panorama-x";
import ListPanel from "./common/listPanel";
import ItemButton from "./common/itemButton";
import useToggle from "../hooks/useToggle";
import DraggableWindow from "../utils/draggable_window";


const BagPanel:FC<PanelAttributes> = (props) =>{

    const playerId = Game.GetLocalPlayerID()
    const [visible,toggleVisible,setVisible] = useToggle(props.visible)

    const [bagList,setBagList] = useState(new Array);

    const heroList = useNetTableValues('hero_list')

    useMemo(() =>{
         setBagList([1,2,3,4,5,6,7])
    },[])
    useEffect(() =>{
        if(props.visible!=undefined){
            setVisible(props.visible);
        }else{
            setVisible(false)
        }
    },[props.visible])

    // function clickItem(pnl:Panel){
    //     console.log(pnl.Data.apply);
    // }
    //console.log('测试初始显示',visible,props.visible)
    return(<Panel 
        {...props}
        visible={visible}
        className="BagPanel"
        style={{
            verticalAlign:`center`,
            horizontalAlign:`center`,
        }}
    >
        <Button className="CloseBtn" onactivate={toggleVisible}
        ></Button>

        <Label text={'背包'}
            style={{
                y:`10px`,
                textAlign:`center`,
                horizontalAlign:'center',
                height:`60px`,
                width:`300px`,
                fontSize:`30px`,
            }}
        ></Label>
        <Panel
            id='player_equip_panel'
            className="PlayerEquipPanel"
            style={{
            }}
        >
            <Button
                className="EquipSlot1"
                on-ui-DragEnter={() => {
                    console.log('测试拖动进入')
                }}
            ></Button>
            <Button
                className="EquipSlot2"
            ></Button>
            <Button
                className="EquipSlot3"
            ></Button>
            <Button
                className="EquipSlot4"
            ></Button>
            <Button
                className="EquipSlot5"
            ></Button>
            <Button
                className="EquipSlot6"
            ></Button>
            {/* <Button
                className="EquipSlot7"
            ></Button>
            <Button
                className="EquipSlot8"
            ></Button>
            <Button
                className="EquipSlot9"
            ></Button> */}
        </Panel>
        <ListPanel 
            id='BagList'
            className="BagListPanel"
            listArray={bagList}
            renderFunction={(idx,dt) =>{
                return <ItemButton
                    itemName="test_armor"
                    draggable={true}
                    on-ui-DragStart={() =>{
                        console.log('测试拖动')
                    }}
                >
                </ItemButton>
                // return <DraggableWindow
                //     title="测试"
                //     children={[]}
                // ></DraggableWindow>
            }}
            style={{
                horizontalAlign:'right',
                verticalAlign:'bottom',
            }}
        ></ListPanel>
    </Panel>)
}

export default BagPanel