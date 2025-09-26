import { FC, useEffect, useMemo, useRef, useState } from "react";
import { PanelAttributes } from "react-panorama-x";
import ListPanel from "../common/listPanel";
import { ShopCard } from "./base_shop_panel";
import TButton from "../common/textButton";
import useToggle from "../../hooks/useToggle";
import MoneyLabel from "../common/moneyLabel";
import ItemButton from "../common/itemButton";
import { InvestConfig } from "../../ui_table/investConfig";
import { useXNetTableEvent } from "../../hooks/useXNetTable";

interface InvestShopAttribute {
    invest_id:string
}

const InvsetShopCard:FC<PanelAttributes & InvestShopAttribute> = (props) =>{
    const {
        invest_id,
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
    //const [investData,setInvestData] = useState<any>()
    const [investIcon,setInvestIcon] = useState('')
    const [investCost,setInvestCost] = useState(0)

    const investData = useRef<any>()
    const investKey = useRef<string>('')

    useEffect(() =>{
        investData.current = InvestConfig.GetData(invest_id)
        if(investData.current){
            const curData = investData.current
            setMaxInvest(curData.max)
            investKey.current = curData.key
            setInvestIcon(curData.icon)
        }
    },[invest_id])
    useEffect(() =>{
        if(investData.current){ 
            const curData = investData.current
            setInvestCost(curData.cost + curData.increase*curInvest)
        }
    },[curInvest])
    useXNetTableEvent('investment',investKey.current,(data)=>{
        setCurInvest(data);
    })

    function addInvest(){
        GameEvents.SendCustomGameEventToServer('client_investment_event',{id:parseInt(invest_id)})
    }

    return<Panel
        {...otherprops}
        className="EquipShopCard"
        style={{
            flowChildren:'down',
            width:`120px`,
            height:`330px`,
        }}
    >
        <Image
            style={{
                width:'60px',
                height:'60px',
                horizontalAlign:'center',
            }}
            src={`file://{images}/${investIcon}`}
        ></Image>
        <MoneyLabel
            money_num={investCost}
            money_type="current_gold"
            style={{
                width:'90%',
                height:'40px',
            }}
        ></MoneyLabel>
        <Label
            text={`${curInvest}/${maxInvest}`}
            style={{
                width:'100%',
                fontSize:'24px',
                textAlign:'center',
            }}
        >
        </Label>
        <TButton
            text={'投资'}
            style={{
                width:'90%',
                height:'40px',
            }}
            onactivate={addInvest}
        >
        </TButton>
    </Panel>
}

const InvestmentShopPanel:FC<PanelAttributes> = (props) =>{
    const [visible,toggleVisible,setVisible] = useToggle(props.visible);
    const [sellList,setSellList] = useState(new Array);

    useMemo(() =>{   
        InvestConfig.GetArray().map((value,idx)=>{
            console.log(value)
        })
        setSellList(InvestConfig.GetArray())
    },[])
    useEffect(() =>{
            if(props.visible!=undefined){
                setVisible(props.visible);
            }else{
                setVisible(false)
            }
    },[props.visible])

    function renderInvestList(idx:number,dt:any) {
        return <InvsetShopCard
            invest_id={dt.id}
        >
        </InvsetShopCard>
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
                renderFunction={renderInvestList}
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