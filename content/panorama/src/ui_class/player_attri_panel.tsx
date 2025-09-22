import { FC, useMemo, useState } from "react";
import { onXNetTableEvent, useXNetTableEvent, useXNetTableKey } from "../hooks/useXNetTable";
import { CharacterAttributeTable } from "../ui_table/characterAttribute";
import { PanelAttributes } from "react-panorama-x";
import ListPanel from "./common/listPanel";

const AttriDefine = CharacterAttributeTable.GetDefine()

interface PlayerInfo extends XNetTableDefinitions{
    
}

const AttributeLabel:FC<PanelAttributes> = (props) =>{

    return(<Panel>

    </Panel>)
}

const PlayerAttriPanel:FC<PanelAttributes> = (props) =>{

    const [attriList1,setAttriList1] = useState(new Array); //基础属性
    const [attriList2,setAttriList2] = useState(new Array); //伤害加成属性

    const playerId = Game.GetLocalPlayerID()
    console.log('本地玩家id',playerId)
    
    // useXNetTableKey(PlayerInfoKey[playerId],'test_key',(data) =>{
    //      console.log('xNet服务端事件消息3')
    //     console.log(data)
    // })

    useMemo(() =>{ //初始化属性表
        let newArray1 = new Array
        let newArray2 = new Array
        for(const[k,v] of Object.entries(AttriDefine)){
            if(!v.IsHidden){//非隐藏的属性
                if(v.Type === 1){ // 基础属性类别
                    newArray1.push([k,v])
                }else if(v.Type === 2){ // 伤害加成类别
                    newArray2.push([k,v])
                }

            }
            newArray1.sort((a,b) =>{
                const aD = a[1].SortIndex;
                const bD = b[1].SortIndex;
                return (aD - bD)
            })
            newArray2.sort((a,b) =>{
                const aD = a[1].SortIndex;
                const bD = b[1].SortIndex;
                return (aD - bD)
            })
        }
        
    },[])

    useXNetTableEvent('local_player_info','attribute',(data) =>{
        console.log('xNet服务端事件消息2')
        console.log(data)
        // const testAttri = CharacterAttributeTable.GetData('npc_dota_hero_phoenix')
        
        // for(const[k,v] of Object.entries(testAttri)){
        //     console.log('测试客户端读表打印',k,v)
        // }
    })

    return(<Panel
        {...props}
        className="NormalPanel"
        style={{
            width:'40%',
            height:'60%',
            verticalAlign:`center`,
            horizontalAlign:`center`,
        }}
    >
        <Label text={'人物属性'}
            style={{
                
                y:`10px`,
                textAlign:`center`,
                horizontalAlign:'center',
                height:`60px`,
                width:`300px`,
                fontSize:`30px`,
            }}
        ></Label>
        <Panel
            style={{
                overflow:'scroll',
                flowChildren:'down',
                backgroundColor:`#ffeeee`,
                y:'75px',
                width:`92%`,
                height:`85%`,
                horizontalAlign:'center',
            }}
        >
            <Label
                text={'基础属性'}
                style={{
                    textAlign:`center`,
                    backgroundColor:`#55ff11`,
                    fontSize:`35px`,
                    height:'40px',
                    width:`90%`,
                    horizontalAlign:'center'
                }}
            ></Label>
            <ListPanel
                id='base_attribute_list'
                style={{
                    height:`500px`,
                    width:`90%`,
                    horizontalAlign:'center'
                }}
            ></ListPanel>
            <Label
                text={'进阶属性'}
                style={{
                    textAlign:`center`,
                    backgroundColor:`#55ff11`,
                    fontSize:`35px`,
                    height:'40px',
                    width:`90%`,
                    horizontalAlign:'center'
                }}
            ></Label>
            <ListPanel
                id='percent_attribute_list'
                style={{
                    height:`500px`,
                    width:`90%`,
                    horizontalAlign:'center'
                }}
            ></ListPanel>
        </Panel>
        
    </Panel>)
}

export default PlayerAttriPanel