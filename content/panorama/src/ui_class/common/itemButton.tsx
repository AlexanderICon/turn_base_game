import { FC, useEffect, useState } from "react";
import { PanelAttributes } from "react-panorama-x";
import { EquipTable } from "../../ui_table/equipTable";


interface ItemButtonProps {
    itemName?:string,
    imgType?:'Dota_Ability' | 'Dota_Item' | 'Dota_Hero' | 'Custom',
}

const ItemButton:FC<ItemButtonProps & PanelAttributes> = (props) =>{
    const {
        itemName,
        imgType,
        ...otherProps
    } = props;

    const [itemImg,setItemImg] = useState('')

    const [visible_1,setVisible1] = useState(false)
    const [visible_2,setVisible2] = useState(false)
    const [visible_3,setVisible3] = useState(false)
    const [visible_4,setVisible4] = useState(false)
    //const { style, ...nprops } = otherProps;
    const visibleArray = [setVisible1,setVisible2,setVisible3,setVisible4]
    function changeVisible(tp:number){
        for(let i=0;i<visibleArray.length;i++){
            if(tp === i){
                visibleArray[i](true)
            }else{
                visibleArray[i](false)
            }
        }
    }

    useEffect(() =>{
        const name = (itemName!=undefined)?itemName:''
        const type = (imgType!=undefined)?imgType:'Custom'
        switch(type){
            case 'Dota_Ability':{
                changeVisible(0)
                break
            }
            case 'Dota_Item':{
                changeVisible(1)
                break
            }
            case 'Dota_Hero':{
                changeVisible(2)
                break
            }
            default:{
                changeVisible(3)
                const curItemIcon = EquipTable.GetIcon(name)
                setItemImg(curItemIcon);
                break
            }
        }

       
    },[itemName])

    return(<Button 
        {...otherProps}
        className="NormalButton"
        >
        {/* <Label className="ButtonText" >
        </Label> */}
        <DOTAAbilityImage
            visible={visible_1}
            abilityname={itemName}
            style={{
                horizontalAlign:`center`,
                verticalAlign:`center`,
            }}
        ></DOTAAbilityImage>
        <DOTAItemImage
            visible={visible_2}
            itemname={itemName}
            style={{
                horizontalAlign:`center`,
                verticalAlign:`center`,
            }}
        ></DOTAItemImage>
        <DOTAHeroImage
            visible={visible_3}
            heroname={itemName}
            style={{
                horizontalAlign:`center`,
                verticalAlign:`center`,
            }}
        ></DOTAHeroImage>
        <Image
            visible={visible_4}
            src={'file://{images}/' + itemImg}
            style={{
                horizontalAlign:`center`,
                verticalAlign:`center`,
            }}
        ></Image>
    </Button>)
}

export default ItemButton