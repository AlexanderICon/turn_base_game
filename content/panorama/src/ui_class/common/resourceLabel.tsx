import { FC, useEffect, useState } from "react";
import {  PanelAttributes } from "react-panorama-x";
import { useXNetTableKey } from "../../hooks/useXNetTable";
import MoneyLabel from "./moneyLabel";



interface ResourceAttribute{
    resource_type:string
}

const ResourceLabel:FC<PanelAttributes & ResourceAttribute> = (props) =>{
    const {
        resource_type,
        ...otherprops
    } = props;

    const [showMoney,setShowMoney] = useState(0)
    const resourceNum = useXNetTableKey('player_resource',resource_type,0);

    return(<MoneyLabel
        money_type={resource_type}
        money_num={resourceNum}
        {...otherprops}
        >
    </MoneyLabel>)
}

export default ResourceLabel
