import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import uuid from 'react-uuid';
import { Button } from '@material-ui/core';
import { EventsTable } from './EventsTable';
import ComboBox from './Form/Combobox';
import { CurrentBoard } from './CurrentBoard';
import { Players } from './Players';
import { EventBuilder } from './EventBuilder';
import { listenData, pushData, writeData } from '../firebase/database';
import { estimateAc, estimateHps } from '../utils/estimations';

export const GameSheets = () => {
    const [monsters, setMonsters] = useState({});
    const [currentBoard, setCurrentBoard] = useState({});
    const [players, setPlayers] = useState({});
    const [actor, setActor] = useState(null);
    const [target, setTarget] = useState({});

    useEffect(() => {
        listenData('players', (players) => {
            setPlayers(players);
        });
        listenData('monsters', (monsters) => {
            setMonsters(monsters);
        });
        listenData('currentBoard', (board) => {
            setCurrentBoard(board);
        });
    }, []);

    const instanceNewGame = () => {
        const game = { gameId: new Date().getTime(), monsters: [] };
        writeData('currentBoard/', game);
    };

    const saveAndEnd = () => {
        pushData('games', currentBoard);
    };

    const addMonsterToGame = (id) => {
        const uid = uuid();
        writeData(`currentBoard/monsters/${currentBoard.monsters?.length || 0}`, {
            monsterId: id,
            id: uid,
            gameId: uid,
            damageReceived: 0,
        });
    };

    const onEventValidated = (eventObj) => () => {
        // Add the event
        const newTarget = target;
        Object.keys(target).forEach((key) => newTarget[key] === undefined && delete newTarget[key]);
        pushData(`currentBoard/events/`, {
            ...eventObj,
            target: newTarget,
            actor,
            creationDate: new Date().getTime(),
        });
        const targetKey = currentBoard.monsters.findIndex((it) => it.gameId === target.gameId);

        if (targetKey === -1) {
            console.log('didnt find the minster');
            return;
        }
        // Update traget into database
        if (eventObj.type === 'attack') {
            if (eventObj.touchScore) {
                const ac = estimateAc(target, eventObj.touchScore, eventObj.value);
                const [key, value] = Object.entries(ac)[0];
                // update CA
                writeData(`monsters/${target.monsterId}/${key}`, value);
            }
            if (eventObj.value) {
                const newDamageReceived = parseInt(target.damageReceived || 0) + parseInt(eventObj.value || 0);
                writeData(`currentBoard/monsters/${targetKey}/damageReceived`, newDamageReceived);
                const newHps = estimateHps(target, eventObj.hpState, newDamageReceived);

                writeData(`currentBoard/monsters/${targetKey}/hpState`, eventObj.hpState);

                if (newHps.hpMax) {
                    writeData(`monsters/${target.monsterId}/hpMax`, newHps.hpMax);
                }
                if (newHps.hpMin) {
                    writeData(`monsters/${target.monsterId}/hpMin`, newHps.hpMin);
                }
            }

            // update Hp
        }
    };
    const handleComboboxChange = (e, r) => {
        const { inputValue, title, id } = r;
        if (inputValue) {
            // create monster
            createNewMonster(inputValue);
            return;
        }
        addMonsterToGame(id);
    };

    const createNewMonster = (name) => {
        const date = new Date().getTime();
        writeData(`/monsters/${date}`, { monsterId: date, name, hpState: 'green' });
    };

    const updateMonsterInitiative = (index) => (e) => {
        e.preventDefault();
        writeData(`currentBoard/monsters/${index}/monsterInitiative`, e.target.value);
    };

    const onMonsterAvatarChange = (monsterId) => (e) => {
        e.preventDefault();
        writeData(`monsters/${monsterId}/avatarUrl`, e.target.value);
    };

    const setActorOrTargets = (entity) => {
        if (!actor) {
            setActor(entity);
        } else {
            // setTargets((targets) => [...targets, entity]);
            setTarget(entity);
        }
    };

    const onSelectedPlayerChange = (monster) => () => {
        setActorOrTargets(monster);
    };

    const onPlayerClick = (player) => () => {
        setActorOrTargets(player);
    };
    const populateBoard = {
        ...currentBoard,
        monsters: currentBoard?.monsters?.map((boardMonster) => ({
            ...monsters[boardMonster.monsterId],
            ...boardMonster,
        })),
    };
    const gameEvents = Object.values(currentBoard.events || {}).sort((a, b) => b.creationDate - a.creationDate);

    return (
        <Container>
            <Button variant="default" onClick={instanceNewGame}>
                New game
            </Button>
            <Button onClick={saveAndEnd}>Save and end</Button>

            <ComboBox
                onCreate={() => {
                    console.log('on create');
                }}
                onChange={handleComboboxChange}
                onInputChange={() => {
                    // console.log("on input change");
                }}
                list={
                    monsters
                        ? Object.values(monsters).map((monster) => ({
                              title: monster.name,
                              id: monster.monsterId,
                              avatarUrl: monster.avatarUrl,
                          }))
                        : []
                }
            />
            <Players players={players} onPlayerClick={onPlayerClick} />
            <CurrentBoard
                board={populateBoard}
                updateMonsterInitiative={updateMonsterInitiative}
                onSelectedChange={onSelectedPlayerChange}
                onMonsterAvatarChange={onMonsterAvatarChange}
            />
            <EventBuilder
                actor={actor}
                target={target}
                setActor={setActor}
                setTarget={setTarget}
                onValidate={onEventValidated}
            />
            <EventsTable events={gameEvents} />
        </Container>
    );
};

// const NewGameButton = styled.button`
//   margin: 10px 0;
// `;

const Container = styled.div`
    margin: 0 15px;
`;
