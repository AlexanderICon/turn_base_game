import { FC, useEffect, useMemo, useState } from "react";
import { PanelAttributes } from "react-panorama-x";
import ListPanel from "../common/listPanel";
import ItemButton from "../common/itemButton";
import MoneyLabel from "../common/moneyLabel";
import TButton from "../common/textButton";
import { ShopCard } from "./base_shop_panel";
import useToggle from "../../hooks/useToggle";



const EquipShop:FC<PanelAttributes> = (props) =>{
    const [visible,toggleVisible,setVisible] = useToggle(props.visible);
    const [sellList,setSellList] = useState(new Array); 

    useMemo(() =>{
        setSellList([1,2,3,4])
    },[])
    useEffect(() =>{
            if(props.visible!=undefined){
                setVisible(props.visible);
            }else{
                setVisible(false)
            }
    },[props.visible])

    return (<Panel
        className="NormalPanel"
        visible={visible}
        style={{
            width:'800px',
            height:'500px',
            horizontalAlign:'center',
            verticalAlign:'center',
        }}
    >

        <Button className="CloseBtn" onactivate={toggleVisible}
        ></Button>
        <Label text={'装备商店'} style={{
            horizontalAlign:'center',
            width:`60%`,
            height:`40px`,
            fontSize:'36px',
            textAlign:'center',
        }}></Label>
        <Panel
            style={{
                horizontalAlign:'center',
                width:`90%`,
                height:`90%`,
                y:`40px`,
            }}
        >
            <ListPanel
                style={{
                    verticalAlign:'top',
                    height:'85%',
                }}
                listArray={sellList}
                renderFunction={(idx,dt) =>{
                    return <ShopCard

                    >

                    </ShopCard>
                }}
                id='EquipShopList'
            >
            </ListPanel>
            <TButton
                text={'刷新'}
                style={{
                    horizontalAlign:'center',
                    verticalAlign:'bottom',
                    fontSize:'24px',
                    width:'130px',
                    height:'40px',
                }}
            ></TButton>
        </Panel>
       

    </Panel>)
}

export default EquipShop
