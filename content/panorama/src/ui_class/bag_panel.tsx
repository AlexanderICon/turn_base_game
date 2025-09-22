import { FC, useMemo, useState } from "react";
import { onXNetTableEvent, useXNetTableEvent, useXNetTableKey } from "../hooks/useXNetTable";
import { CharacterAttributeTable } from "../ui_table/characterAttribute";
import { PanelAttributes, useNetTableValues } from "react-panorama-x";
import ListPanel from "./common/listPanel";
import ItemButton from "./common/itemButton";


const BagPanel:FC<PanelAttributes> = (props) =>{
    const playerId = Game.GetLocalPlayerID()

    const [bagList,setBagList] = useState(new Array);

    const heroList = useNetTableValues('hero_list')

    useMemo(() =>{
         setBagList([1,2,3,4,5,6,7])
    },[])

    function clickItem(pnl:Panel){
        console.log(pnl.Data.apply);
    }

    return(<Panel 
        {...props}
        className="BagPanel"
        style={{
            verticalAlign:`center`,
            horizontalAlign:`center`,
        }}
    >
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
            <Button
                className="EquipSlot7"
            ></Button>
            <Button
                className="EquipSlot8"
            ></Button>
            <Button
                className="EquipSlot9"
            ></Button>
        </Panel>
        <ListPanel 
            id='BagList'
            className="BagListPanel"
            listArray={bagList}
            renderFunction={(idx,dt) =>{
                return <ItemButton
                    itemName="test_weapon"
                    onactivate={clickItem}
                >

                </ItemButton>
            }}
            style={{
                horizontalAlign:'right',
                verticalAlign:'bottom',
            }}
        ></ListPanel>
    </Panel>)
}

export default BagPanel