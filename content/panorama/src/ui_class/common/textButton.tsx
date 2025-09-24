import { FC } from "react"
import { PanelAttributes } from "react-panorama-x"

interface TButtonProps {
    text?:string|number,
    fontStyle?:Partial<VCSSStyleDeclaration>,
}

const TButton:FC<TButtonProps & PanelAttributes> = (props) =>{
    const {
        text,
        fontStyle,
        ...otherProps
    } = props;

    //const { style, ...nprops } = otherProps;

    return(<Button 
        {...otherProps}
        className="NormalButton">
        <Label className="ButtonText" text={text} style={fontStyle}>
        </Label>
    </Button>)
}

export default TButton