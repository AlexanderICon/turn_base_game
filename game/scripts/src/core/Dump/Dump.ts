/** 
 * dump(obj) - 打印对象/表的完整结构
 * @param obj 需要打印的对象
 * @param indent 缩进（内部使用）
 */
function dump(obj: any, indent: number = 0): string {
    const prefix = " ".repeat(indent);
    let output = "";

    if (obj === null) {
        return "null";
    }

    if (type(obj) !== "table") {
        return tostring(obj);
    }

    for (const [key, value] of pairs(obj)) {
        if (type(value) === "table") {
            output += `${prefix}${tostring(key)}:\n${dump(value, indent + 2)}\n`;
        } else {
            output += `${prefix}${tostring(key)}: ${tostring(value)}\n`;
        }
    }
    return output;
}
