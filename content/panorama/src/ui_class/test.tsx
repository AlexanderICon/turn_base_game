// const url = `https://github.com/XavierCHN/x-template`;
    // const go = React.useCallback(() => {
    //     // 点击只有弹出一个提示框，然后打开链接，这是一个简单的例子，用来展示如何使用sequential-actions
    //     const wait = new WaitAction(0.5);
    //     const showTextTooltip = new DispatchEventAction(`DOTAShowTextTooltip`, $(`#QRCode`), `正在打开链接`);
    //     const hideTextTooltip = new DispatchEventAction(`DOTAHideTextTooltip`, $(`#QRCode`));
    //     const playSound = new FunctionAction(() => PlayUISoundScript('DotaSOS.TestBeep'));
    //     const gotoUrl = new DispatchEventAction(`ExternalBrowserGoToURL`, url);
    //     RunSequentialActions([showTextTooltip, wait, hideTextTooltip, wait, playSound, gotoUrl]);
    // }, [url]);

    // // 当按下D时，会使二维码放大1.5倍，在这里作为一个在react中使用按键hook的示例
    // const dPressed = useKeyPressed(`D`);

     // 显示一个二维码作为范例
                // <PanoramaQRCode
                //     style={{ preTransformScale2d: dPressed ? `1.5` : `1` }}
                //     id="QRCode"
                //     onactivate={go}
                //     value={url}
                //     size={128}
                //     excavate={8}
                //     className={`QRCode`}
                // >
                //     <Image
                //         src="file://{images}/logos/dota_logo_bright.psd"
                //         style={{ width: `32px`, height: `32px`, horizontalAlign: `center`, verticalAlign: `center` }}
                //     />
                // </PanoramaQRCode>
