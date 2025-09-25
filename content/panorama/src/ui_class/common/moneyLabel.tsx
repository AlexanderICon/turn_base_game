import { FC, useEffect, useState } from "react";
import { PanelAttributes } from "react-panorama-x";

type ResourceImage = {
    [key:string]:string
}

const resourceImages:ResourceImage = {
    ['current_gold'] : 'resource/gold.png',
    ['current_wood'] : 'resource/wood.png',
}

interface MoneyLabelAttribute{
    money_num?:number,
    money_type?:string,
}

const MoneyLabel:FC<PanelAttributes & MoneyLabelAttribute> = (props) =>{
    const {
        ...otherProps
    } = props;
    
    const [resourceImg,setResourceImg] = useState('')
    const [moneyNum,setMoneyNum] = useState(props?.money_num);
    const [moneyType,setMoneyType] = useState(props?.money_type);

    useEffect(() =>{
        if(props.money_type && resourceImages[props.money_type]){
            setResourceImg(resourceImages[props.money_type])
        }
    },[props.money_type])
    useEffect(()=>{
        if(props.money_num){
            setMoneyNum(props.money_num);
        }
    },[props.money_num])

    return(<Panel
        {...otherProps}
    >
        <Label text={moneyNum}
            style={{
                width:'70%',
                height:'24px',
                fontSize:`24px`,
                textAlign:'center',
                verticalAlign:'center',
                
            }}
        ></Label>
        <Image 
            // className={'square'}
            src={"file://{images}/"+resourceImg}
            style={{
                height:'40px',
                width:'40px',
                verticalAlign:'center',
                horizontalAlign:'right',
            }}
        ></Image>
    </Panel>)
}

export default MoneyLabel