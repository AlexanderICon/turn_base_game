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
    client_select_difficulty_event: { difficulty: number }; // todo : 客户端选择难度

    server_to_client_player_hero_list: { ids: number[] }; // 向客户端发送随机英雄列表
    server_to_client_player_free_fresh_list: { count: number }; // 向客户端发送免费刷新次数
    client_player_select_hero_by_id: { id: number }; // 客户端选择英雄
    client_fresh_player_select_hero_list: {}; // 客户端刷新事件

    client_market_level_up: { tag: 'market' | 'ability' };
    client_market_fresh: { tag: 'market' | 'ability' };

    client_investment_event: { id: number };

    c2s_login_event: {
        event_key: string;
        event_data: any;
    };

    c2s_difficult_event: {
        event_key: string;
        event_data: any;
    };

    s2c_custom_event: {
        event_key: string;
        event_data: any;
    };
}
