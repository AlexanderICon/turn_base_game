import { FC, useEffect, useMemo, useState } from "react";
import { PanelAttributes } from "react-panorama-x";
import ListPanel from "../common/listPanel";
import ItemButton from "../common/itemButton";
import MoneyLabel from "../common/moneyLabel";
import TButton from "../common/textButton";
import { ShopCard } from "./base_shop_panel";
import useToggle from "../../hooks/useToggle";
import { useXNetTableEvent, useXNetTableKey } from "../../hooks/useXNetTable";
import { MarketConfig } from "../../ui_table/marketTable";
import { utils } from "../../utils/util";



const EquipShop:FC<PanelAttributes> = (props) =>{
    const [visible,toggleVisible,setVisible] = useToggle(props.visible);
    const [sellList,setSellList] = useState(new Array); 
    const [shopLv,setShopLv] = useState(1)

    const shopData = useXNetTableKey('market_base','item',{list:[]})

    useEffect(() =>{
        const dataList = shopData.list
        const dataArray = Object.entries(dataList).map((dt,idx) =>{
            return {id:dt[1]}
        })
        setSellList(dataArray)
    },[shopData])
    useEffect(() =>{
            if(props.visible!=undefined){
                setVisible(props.visible);
            }else{
                setVisible(false)
            }
    },[props.visible])

    function renderShopList(idx:number,dt:any){
        const itemData = MarketConfig.GetItemData(dt.id);
        return <ShopCard
            sell_item={dt.id}
            item_type="Market_Item"
        >   
        </ShopCard>
    }

    function refreshShop(){
        GameEvents.SendCustomGameEventToServer('client_market_fresh',{tag:'market'})
    }
    function upgradeShop(){
        GameEvents.SendCustomGameEventToServer('client_market_level_up',{tag:'market'})
    }

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
                    horizontalAlign:'left',
                    verticalAlign:'top',
                    height:'95%',
                    width:'75%',
                }}
                listArray={sellList}
                renderFunction={renderShopList}
                id='EquipShopList'
            >
            </ListPanel>
            
            <Panel
            style={{
                    horizontalAlign:'right',
                    flowChildren:'down',
                    fontSize:'24px',
                    width:'130px',
                    height:'40%',
                }}
        >
            <Label 
                text={`商店等级：${shopLv}`}
            ></Label>
                <TButton
                text={'升级商店'}
                style={{
                    fontSize:'24px',
                    width:'130px',
                    height:'40px',
                }}
                onactivate={upgradeShop}
                ></TButton>
                <MoneyLabel
                    style={{
                        width:'95%',
                        height:'35px'
                    }}
                    money_type="current_gold"
                    money_num={0}
                ></MoneyLabel>
            </Panel>

            <Panel
                style={{
                    y:'50%',
                    horizontalAlign:'right',
                    flowChildren:'down',
                    fontSize:'24px',
                    width:'130px',
                    height:'40%',
                }}
            >
                <TButton
                text={'刷新'}
                style={{
                    fontSize:'24px',
                    width:'130px',
                    height:'40px',
                }}
                onactivate={refreshShop}
            ></TButton>
                <MoneyLabel
                    style={{
                        width:'95%',
                        height:'35px'
                    }}
                    money_type="current_gold"
                    money_num={0}
                ></MoneyLabel>
            </Panel>
            

        </Panel>
       

    </Panel>)
}

export default EquipShop
