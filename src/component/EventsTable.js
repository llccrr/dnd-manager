import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

const useStyles = makeStyles({
  table: {
    minWidth: 650,
  },
});

export const EventsTable = ({ events = [], ...props }) => {
  const classes = useStyles();
  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Actor</TableCell>
            <TableCell align="right">Type</TableCell>
            <TableCell align="right">Target</TableCell>
            <TableCell align="right">Touch score</TableCell>
            <TableCell align="right">Value</TableCell>
            <TableCell align="right">New state</TableCell>
            <TableCell align="right">Comments</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.creationDate}>
              <TableCell component="th" scope="row">
                {event.actor.name}
              </TableCell>
              <TableCell align="right">{event.type}</TableCell>
              <TableCell align="right">
                {event.target.name + " " + event.target.gameId}
              </TableCell>
              <TableCell align="right">{event.touchScore}</TableCell>
              <TableCell align="right">{event.value}</TableCell>
              <TableCell align="right">{event.hpState}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

// const TableContainer = styled.div`
//   display: flex;
//   flex-direction: column;
//   margin: auto;
//   height: 200px;
//   overflow: scroll;
//
//   width: 80%;
// `;
// const Row = styled.div`
//   display: flex;
//   flex-direction: row;
//   width: 100%;
//   height: 60px;
// `;
