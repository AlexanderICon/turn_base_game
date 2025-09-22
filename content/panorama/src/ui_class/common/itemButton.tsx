import { FC, useEffect, useState } from "react";
import { PanelAttributes } from "react-panorama-x";
import { EquipTable } from "../../ui_table/equipTable";


interface ItemButtonProps {
    itemName?:string,
}

const ItemButton:FC<ItemButtonProps & PanelAttributes> = (props) =>{
    const {
        itemName,

        ...otherProps
    } = props;

    const [itemImg,setItemImg] = useState('')

    //const { style, ...nprops } = otherProps;
    useEffect(() =>{
        const name = itemName?itemName:''
        const curItemIcon = EquipTable.GetIcon(name)
        setItemImg(curItemIcon);
    },[itemName])

    return(<Button 
        {...otherProps}
        className="NormalButton"
        
        >
        {/* <Label className="ButtonText" >
        </Label> */}
        <Image
            src={'file://{images}/' + itemImg}
            style={{
                horizontalAlign:`center`,
                verticalAlign:`center`,
            }}
        ></Image>
    </Button>)
}

export default ItemButton