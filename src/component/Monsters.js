import React, { useEffect, useState } from "react";
import { listenData } from "../firebase/database";

export const Monsters = () => {
  const [monsters, setMonsters] = useState({});
  //
  useEffect(() => {
    // readData();
    listenData("monsters", (monsters) => {
      setMonsters(monsters);
    });
  }, []);

  return <div></div>;
};
