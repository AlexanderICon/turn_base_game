import { FC, useState } from "react";
import { PanelAttributes } from "react-panorama-x";
import ItemButton from "../common/itemButton";
import MoneyLabel from "../common/moneyLabel";
import TButton from "../common/textButton";

interface ShopCardAttribute {
    item_type?:string,
    sell_item?:string,
    sell_price?:[string,number],
    state?:number,
}

const ShopCard:FC<PanelAttributes & ShopCardAttribute> = (props) =>{
    const {
        item_type,
        sell_item,
        sell_price,
        ...otherprops
    } = props
    const [sellItem,setSellItem] = useState('');

    return(<Panel
        {...otherprops}
        className="EquipShopCard"
        style={{
            width:`120px`,
            height:`330px`,
        }}
    >
        <ItemButton
            imgType={item_type}
            itemName={sell_item}
        >
        </ItemButton>
        <MoneyLabel
            money_num={60}
            style={{
                width:'90%',
                height:'40px',
            }}
        ></MoneyLabel>
        <TButton
            text={'购买'}
            style={{
                width:'90%',
                height:'40px',
            }}
        >
        </TButton>
    </Panel>)
}

interface ShopPanelAttribute {
    title?:string,
}

const ShopPanel:FC<PanelAttributes> = (props) =>{

    return(<Panel>

    </Panel>)
}

export {
    ShopCard,
    ShopPanel
}
