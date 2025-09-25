import { FC, useEffect, useMemo, useState } from "react";
import { PanelAttributes } from "react-panorama-x";
import ListPanel from "../common/listPanel";
import { ShopCard } from "./base_shop_panel";
import TButton from "../common/textButton";
import useToggle from "../../hooks/useToggle";
import classNames from "classnames";
import MoneyLabel from "../common/moneyLabel";


const SkillShopPanel:FC<PanelAttributes> = (props) =>{
    const [visible,toggleVisible,setVisible] = useToggle(props.visible);
    const [sellList,setSellList] = useState(new Array);
    const [shopLv,setShopLv] = useState(1)

    

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
        {/* <Button style={{
            horizontalAlign:'right',
            width:`60px`,
            height:`60px`,
            backgroundColor:'#ff0000'
        }} onactivate={toggleVisible}></Button> */}

        <Label text={'技能商店'} style={{
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
                    horizontalAlign:'left',
                    height:'95%',
                    width:'75%',
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

export default SkillShopPanel
