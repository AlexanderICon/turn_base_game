import { FC, useEffect, useMemo, useRef, useState } from "react";
import { PanelAttributes } from "react-panorama-x";
import ListPanel from "../common/listPanel";
import { ShopCard } from "./base_shop_panel";
import TButton from "../common/textButton";
import useToggle from "../../hooks/useToggle";
import MoneyLabel from "../common/moneyLabel";
import ItemButton from "../common/itemButton";

interface InvestShopAttribute {
    invest_type:string
}

const InvsetShopCard:FC<PanelAttributes & InvestShopAttribute> = (props) =>{
    const {
        invest_type,
        ...otherprops
    } = props
    const self = useRef(null)
    // useEffect(() =>{
    //     if(self.current){
    //         const curSelf = self.current as Panel;
    //         const data = curSelf.Data<TestData>()
    //         data.name = '赋值'
    //         console.log('测试数据打印',curSelf,data);
    //     }
    // },[])
    const [curInvest,setCurInvest] = useState(0)
    const [maxInvest,setMaxInvest] = useState(0)

    return<Panel
        {...otherprops}
        className="EquipShopCard"
        style={{
            flowChildren:'down',
            width:`120px`,
            height:`330px`,
        }}
    >
        <ItemButton
            itemName="test_weapon"
        >
        </ItemButton>
        <MoneyLabel
            money_num={60}
            style={{
                width:'90%',
                height:'40px',
            }}
        ></MoneyLabel>
        <Label
            text={`${curInvest}/${maxInvest}`}
            style={{
                fontSize:'24px',
                textAlign:'center',
            }}
        >
        </Label>
        <TButton
            text={'购买'}
            style={{
                width:'90%',
                height:'40px',
            }}
        >
        </TButton>
    </Panel>
}

const InvestmentShopPanel:FC<PanelAttributes> = (props) =>{
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
                    return <InvsetShopCard
                        invest_type=""
                    >

                    </InvsetShopCard>
                }}
                id='EquipShopList'
                // childHeight="100px"
                // childWidth="100px"
            >
            </ListPanel>
            {/* <TButton
                text={'刷新'}
                style={{
                    horizontalAlign:'center',
                    verticalAlign:'bottom',
                    fontSize:'24px',
                    width:'130px',
                    height:'40px',
                }}
            ></TButton> */}
        </Panel>
       

    </Panel>)
}

export default InvestmentShopPanel