import { FC, useMemo, useState } from "react";
import { PanelAttributes } from "react-panorama-x";
import ListPanel from "../common/listPanel";
import { ShopCard } from "./base_shop_panel";
import TButton from "../common/textButton";


const InvestmentShopPanel:FC<PanelAttributes> = (props) =>{

    const [sellList,setSellList] = useState(new Array);

    useMemo(() =>{
        setSellList([1,2,3,4])
    },[])

    return (<Panel
        className="NormalPanel"
        visible={props.visible}
        style={{
            width:'800px',
            height:'500px',
            horizontalAlign:'center',
            verticalAlign:'center',
        }}
    >
        <Label text={'投资商店'} style={{
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

export default InvestmentShopPanel