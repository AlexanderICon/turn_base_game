import { FC, useState } from "react";
import { PanelAttributes } from "react-panorama-x";

interface MoneyLabelAttribute{
    money_num?:number,
    money_type?:string,
}

const MoneyLabel:FC<PanelAttributes & MoneyLabelAttribute> = (props) =>{
    const {
        ...otherProps
    } = props;
    
    const [moneyNum,setMoneyNum] = useState(props?.money_num);
    const [moneyType,setMoneyType] = useState(props?.money_type);

    return(<Panel
        {...otherProps}
    >
        <Label text={moneyNum}
            style={{
                width:'70%',
                height:'80%',
                fontSize:`24px`,
                textAlign:'center',
                verticalAlign:'center',
            }}
        ></Label>
        <Image 
            // className={'square'}
            src="file://{images}/custom_game/ulti_achieved.png"
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