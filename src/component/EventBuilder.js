import React, { useState } from "react";
import styled from "styled-components";
import { Button } from "@material-ui/core";

export const EventBuilder = ({
  onValidate,
  actor,
  target,
  setActor,
  setTarget,
}) => {
  const [mainAction, setMainAction] = useState({});
  const [hpState, setHpState] = useState("green");
  const [touchDice, setToucheDice] = useState({
    touchScore: "",
    value: "",
  });
  // const [damage, setDamage] = useState();

  const onTouchChange = (key) => (event) => {
    setToucheDice((touchDice) => ({
      ...touchDice,
      [key]: event.target.value,
    }));
  };

  const onHpStateChange = (event) => {
    setHpState(event.target.value);
  };
  const resetEvent = () => {
    setMainAction({});
    setToucheDice({
      touchScore: "",
      value: "",
    });
    setTarget({});
    setActor(null);
  };

  const buildString = () => {
    let string = "";
    if (mainAction.type === "attack") {
      string += `${mainAction.type} ${mainAction.subType}`;
    }
    if (touchDice.touchScore) {
      string += ` try to touch with ${touchDice.touchScore}`;
    }
    if (touchDice.value) {
      string += ` And hit with ${touchDice.value}, hp state: ${hpState}`;
    } else if (!touchDice.value && touchDice.touchScore) {
      string += ` And it misses`;
    }
    return string;
  };

  React.useEffect(() => {
    setHpState(target.hpState);
  }, [target?.gameId]);
  const renderTargets = () => `${target.name || ""} ${target.gameId || ""}`;
  return (
    <div>
      <Row>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setMainAction({ type: "attack", subType: "melee" });
          }}
        >
          Melee Attack
        </Button>
        <Button
          variant="contained"
          color="primary"
          style={{ margin: "0 10px" }}
          onClick={() => {
            setMainAction({ type: "attack", subType: "range" });
          }}
        >
          Range Attack
        </Button>
        <Button variant="contained" color="primary">
          Move
        </Button>
        {mainAction.type === "attack" && actor && target && (
          <>
            <TextInput
              value={touchDice.touchScore}
              type="number"
              onChange={onTouchChange("touchScore")}
              placeholder="touch result"
            />
            <TextInput
              value={touchDice.value}
              type="number"
              onChange={onTouchChange("value")}
              placeholder="damage"
            />
            <HpSelect
              value={hpState}
              onChange={onHpStateChange}
              placeholder="Hp state change"
            >
              <option value="green">green</option>
              <option value="orange">orange</option>
              <option value="red">red</option>
              <option value="dead">dead</option>
            </HpSelect>
          </>
        )}
      </Row>

      <CurrentEventRow>
        Actor : {actor?.name} {buildString()}
      </CurrentEventRow>
      <CurrentEventRow>Target : {renderTargets()}</CurrentEventRow>
      <CurrentEventRow>
        <Button variant="contained" color="secondary" onClick={resetEvent}>
          RESET EVENT
        </Button>
        <Button
          variant="contained"
          color="default"
          style={{ margin: "0 10px" }}
          onClick={() => {
            console.log("ok");
            if (!target?.name || !actor?.name) {
              console.log("ah");
              return;
            }
            onValidate({ ...mainAction, ...touchDice, hpState })();
            resetEvent();
          }}
        >
          Validate
        </Button>
      </CurrentEventRow>
    </div>
  );
};

// const Button = styled(Button)`
//   margin: 0 10px;
//   border: 1px red solid;
//   padding: 0 10px;
//   cursor: pointer;
// `;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  margin: 15px 0;
`;

const CurrentEventRow = styled(Row)`
  margin: 10px 0;
`;

const TextInput = styled.input`
  margin: 0 5px;
`;

const HpSelect = styled.select`
  width: 150px;
  cursor: pointer;
`;
