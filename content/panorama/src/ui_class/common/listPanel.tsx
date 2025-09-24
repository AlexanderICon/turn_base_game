import classNames from "classnames";
import { FC, ReactNode, useMemo, useState } from "react";
import { PanelAttributes } from "react-panorama-x";

interface ListPanelProps {
    id:string,
    listArray?:Array<any>,
    childWidth?:string,
    childHeight?:string,
    rowCount?:number,
    lineCount?:number,
    //scrollDirection?: 'vertical'|'horizontal',
    renderFunction?:(idx:number,data:any) =>ReactNode,
}

const ListPanel:FC<ListPanelProps & PanelAttributes> = (props) =>{
    const {
        id,
        childWidth,
        childHeight,
        listArray = props.listArray ? props.listArray : new Array<any>,
        renderFunction,
        //scrollDirection = props.scrollDirection ? 'vertical' : props.scrollDirection,
        ...otherProps
    } = props;
    const {  className, ...nprops } = otherProps;

    return(<Panel 
        {...nprops}
        className={classNames("ListPanel",className)}
        children = {
            listArray.map((value,idx,array) => {
                let node:ReactNode
                if(renderFunction){
                    node = renderFunction(idx,value)
                }else{
                    node = <Image 
                        //key={id+'_lc_'+idx}
                        src='file://{images}/custom_game/ulti_achieved.png'
                    ></Image>
                }
        
                return <Panel
                    key={id+'_lc_'+idx}
                    style={{
                        width:childWidth,
                        height:childHeight,
                    }}
                >
                    {node}
                </Panel>
            })
        }

        >
        
    </Panel>)
}

export default ListPanel