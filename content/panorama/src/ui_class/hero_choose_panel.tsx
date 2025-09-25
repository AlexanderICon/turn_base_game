import { FC, useEffect, useMemo, useRef, useState } from 'react';
import { PanelAttributes, useGameEvent } from 'react-panorama-x';
import ListPanel from './common/listPanel';
import TButton from './common/textButton';

const LocalHeroList = {
    ['力量']: ['npc_dota_hero_axe', 'npc_dota_hero_dragon_knight'],
    ['敏捷']: ['npc_dota_hero_antimage', 'npc_dota_hero_juggernaut'],
    ['智力']: ['npc_dota_hero_crystal_maiden', 'npc_dota_hero_lina'],
};

interface CharacterCardProps {
    hero_name: string;
    //chooseCharacter:() =>{}
}

const CharacterCard: FC<CharacterCardProps & PanelAttributes> = props => {
    const { hero_name = props.hero_name ? props.hero_name : 'npc_dota_hero_antimage', onactivate, ...otherProps } = props;

    const scenePnl = useRef(null);

    function chooseCharacter(pnl: Panel) {
        if (onactivate != undefined) {
            onactivate(pnl);
        }
        GameEvents.SendCustomGameEventToServer('c2s_login_event', {
            event_key: '选择角色' + hero_name,
            event_data: {
                choose_hero: hero_name,
            },
        });
    }

    useEffect(() => {
        const scePnl = scenePnl.current;
        if (scePnl) {
            const pnl = scePnl as ScenePanel;
            pnl.SetUnit(hero_name, '', false);
        }
    }, [hero_name]);

    return (
        <Panel {...otherProps} className="CharacterCard" onactivate={chooseCharacter}>
            <Label className="CardName" text={hero_name}></Label>
            <DOTAScenePanel ref={scenePnl} className="CardShow" environment="full_body_right_side"></DOTAScenePanel>
            <Label className="CardLevel" text={'等级：99'}></Label>
        </Panel>
    );
};

const HeroChoosePanel: FC<PanelAttributes> = props => {
    const [heroList, setHeroList] = useState(new Array());
    const [visible, setVisible] = useState(true);

    // useGameEvent('s2c_custom_event',(event) => {
    //     if (event.event_key === 'login_event'){
    //         const newList = new Array()
    //         for(const[k,v] of Object.entries(event.event_data)){
    //             newList.push({name:v})
    //         }
    //         setHeroList(newList)
    //     }
    // })

    function testRefresh() {
        const newList = new Array();
        const strArray = LocalHeroList['力量'];
        newList.push({ name: strArray[Math.floor(Math.random() * strArray.length)] });
        const agiArray = LocalHeroList['敏捷'];
        newList.push({ name: agiArray[Math.floor(Math.random() * agiArray.length)] });
        const intArray = LocalHeroList['智力'];
        newList.push({ name: intArray[Math.floor(Math.random() * intArray.length)] });
        setHeroList(newList);
        console.log('测试刷新', newList);
    }

    useMemo(() => {
        testRefresh();
    }, []);

    if (!visible) return null;

    return (
        <Panel className="NormalPanel" id="CharacterChoosePanel" visible={visible} style={{ width: `100%`, height: `100%` }}>
            <Label
                text={'选择角色'}
                style={{
                    fontSize: '30px',
                    textAlign: `center`,
                    y: `5%`,
                    height: `10%`,
                    width: `30%`,
                    horizontalAlign: 'center',
                }}
            ></Label>
            <ListPanel
                id="CharacterList"
                listArray={heroList}
                renderFunction={(idx, dt) => {
                    return (
                        <CharacterCard
                            hero_name={dt.name}
                            onactivate={() => {
                                setVisible(false);
                                console.log('选择英雄');
                            }}
                        ></CharacterCard>
                    );
                }}
                style={{
                    y: `0%`,
                    width: `80%`,
                    height: `40%`,
                    horizontalAlign: `center`,
                    //verticalAlign:'center',
                }}
            ></ListPanel>
            <TButton
                text={'刷新'}
                className="NormalButton"
                style={{
                    y: '-20%',
                    width: '120px',
                    height: '45px',
                    horizontalAlign: 'center',
                    verticalAlign: 'bottom',
                }}
                fontStyle={{
                    fontSize: '32px',
                }}
                onactivate={testRefresh}
            ></TButton>
        </Panel>
    );
};

export default HeroChoosePanel;
