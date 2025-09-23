declare interface CustomGameEventDeclarations {
    /**
     * 在前后端之间（UI的ts代码和游戏逻辑的ts代码之间）传递的事件，需要在此处声明事件的参数类型
     *  events and it's parameters between ui and game mode typescript code should be declared here
     */
    c2s_test_event: { key: string };
    c2s_test_event_with_params: {
        foo: number;
        bar: string;
    };

    c2s_login_event :{
        event_key:string,
        event_data:any,
    }

    c2s_difficult_event :{
        event_key:string,
        event_data:any,
    }

    s2c_custom_event:{
        event_key:string,
        event_data:any,
    }
}
