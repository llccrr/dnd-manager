import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { EventsTable } from "./EventsTable";
import ComboBox from "./Form/Combobox";
import { CurrentBoard } from "./CurrentBoard";
import { Players } from "./Players";
import { EventBuilder } from "./EventBuilder";
import { listenData, pushData, writeData } from "../firebase/database";
import { Button } from "@material-ui/core";
import { estimateAc, estimateHps } from "../utils/estimations";

export const GameSheets = () => {
  const [monsters, setMonsters] = useState({});
  const [currentBoard, setCurrentBoard] = useState({});
  const [players, setPlayers] = useState({});
  const [actor, setActor] = useState(null);
  const [target, setTarget] = useState({});

  useEffect(() => {
    listenData("players", (players) => {
      setPlayers(players);
    });
    listenData("monsters", (monsters) => {
      setMonsters(monsters);
    });
    listenData("currentBoard", (board) => {
      console.log("currentBoard", currentBoard);
      setCurrentBoard(board);
    });
  }, []);

  const instanceNewGame = () => {
    const game = { gameId: new Date().getTime(), monsters: [] };
    writeData("currentBoard/", game);
  };

  const saveAndEnd = () => {
    console.log("saving..");
    console.log("currBoard", currentBoard);
    pushData("games", currentBoard);
  };

  const addMonsterToGame = (id) => {
    writeData(`currentBoard/monsters/${currentBoard.monsters?.length || 0}`, {
      monsterId: id,
    });
  };

  const onEventValidated = (eventObj) => () => {
    // Add the event
    console.log("ici");
    const newTarget = target;
    Object.keys(target).forEach(
      (key) => newTarget[key] === undefined && delete newTarget[key]
    );
    console.log(newTarget);

    pushData(`currentBoard/events/`, {
      ...eventObj,
      target: newTarget,
      actor,
      creationDate: new Date().getTime(),
    });
    const targetKey = currentBoard.monsters.findIndex(
      (it) => it.gameId === target.gameId
    );

    console.log("currentBoard.monsters", currentBoard.monsters);
    console.log("target", target);

    if (targetKey === -1) {
      console.log("didnt find the minster");
      return;
    }
    // Update traget into database
    if (eventObj.type === "attack") {
      if (eventObj.touchScore) {
        const ac = estimateAc(target, eventObj.touchScore, eventObj.value);
        console.log("ac", ac);
        const [key, value] = Object.entries(ac)[0];
        // update CA
        writeData(`monsters/${target.monsterId}/${key}`, value);
      }
      if (eventObj.value) {
        console.log("target.gameId", target.gameId);
        console.log("currentBoard.monsters", currentBoard.monsters);

        const newDamageReceived =
          parseInt(target.damageReceived || 0) + parseInt(eventObj.value || 0);
        writeData(
          `currentBoard/monsters/${targetKey}/damageReceived`,
          newDamageReceived
        );
        const newHps = estimateHps(target, eventObj.hpState, newDamageReceived);

        writeData(
          `currentBoard/monsters/${targetKey}/hpState`,
          eventObj.hpState
        );
        console.log("newHps", newHps);

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
    writeData(`/monsters/${date}`, { monsterId: date, name, hpState: "green" });
  };

  const updateGameId = (index) => (e) => {
    e.preventDefault();
    writeData(`currentBoard/monsters/${index}/gameId`, e.target.value);
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
  const gameEvents = Object.values(currentBoard.events || {}).sort(
    (a, b) => b.creationDate - a.creationDate
  );

  return (
    <Container>
      <Button variant="default" onClick={instanceNewGame}>
        New game
      </Button>
      <Button onClick={saveAndEnd}>Save and end</Button>

      <ComboBox
        onCreate={() => {
          console.log("on create");
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
              }))
            : []
        }
      />
      <Players players={players} onPlayerClick={onPlayerClick} />
      <CurrentBoard
        board={populateBoard}
        updateGameId={updateGameId}
        onSelectedChange={onSelectedPlayerChange}
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
