import React from "react";
import styled from "styled-components";
import { Avatar } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import { deepOrange, deepPurple } from "@material-ui/core/colors";

const useStyles = makeStyles((theme) => ({
  orange: {
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepPurple[500],
    width: theme.spacing(7),
    height: theme.spacing(7),
  },
  purple: {
    color: theme.palette.getContrastText(deepPurple[500]),
    backgroundColor: deepPurple[500],
  },
}));

export const Players = ({ players, onPlayerClick }) => {
  const classes = useStyles();

  const renderPlayers = () => {
    return Object.values(players).map((player) => (
      // <PlayerSpan key={player.name} onClick={onPlayerClick(player)}>
      //   {player.name}
      // </PlayerSpan>
      <PlayerSpan
        key={player.name}
        className={classes.orange}
        onClick={onPlayerClick(player)}
      >
        {player.name.slice(0, 3)}
      </PlayerSpan>
    ));
  };
  return <PlayersRow>{renderPlayers()}</PlayersRow>;
};

const PlayerSpan = styled(Avatar)`
  margin: 0 10px;
  cursor: pointer;
`;

const PlayersRow = styled.div`
  flex-direction: row;
  display: flex;
  margin: 10px 10px;
`;
