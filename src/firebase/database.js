import firebase from "firebase";

const database = firebase.database();

export const readData = async (node) => {
  const snapshot = await database.ref(node).get();

  if (snapshot.exists()) {
    return snapshot.val();
  }
};

export const listenData = (node, callback) => {
  database.ref(node).on("value", (snapshot) => {
    callback(snapshot.val());
  });
};

export const writeData = (node, obj) => {
  database.ref(node).set(obj);
};

export const pushData = (node, obj) => {
  database.ref(node).push(obj);
};
