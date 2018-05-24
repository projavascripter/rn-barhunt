import {getDatabase} from './db';
import {AsyncStorage} from "react-native";

// get user info from firebase
function getUserInfo(userId) {
  return new Promise((resolve, reject) => {

    // connect to firebase and get data
    this.dbRef = getDatabase().ref(`users/${userId}`);
    this.dbRef.on("value", (snapshot) => {
      let userInfo = snapshot.val();
      if (!userInfo) {
        console.log(`Warning: cannot get userInfo from firebase. Maybe the user does not exist.`);
        resolve({});
        return;
      }
      resolve(userInfo);
    })
  })
}

function getHuntObjWithIds(huntIds) {
  return new Promise(async (resolve, reject) => {
    let myHuntObjs = [];

    for (let i = 0; i < huntIds.length; i++) {
      let myHuntId = huntIds[i];
      let huntObj = await getDataAtPath("barhunt/barhunts/" + myHuntId);
      myHuntObjs.push(huntObj);
    }

    resolve(myHuntObjs);
  })
}

function getDataAtPath(path) {
  return new Promise((resolve, reject) => {

    // connect to firebase and get data
    this.dbRef = getDatabase().ref(path);
    this.dbRef.once("value", (snapshot) => {
      let data = snapshot.val();
      resolve(data);
    })

  })
}

async function setDataAtPath(path, data) {
    // connect to firebase and get data
    await getDatabase().ref(path).set(data);
}


export default {getUserInfo, getDataAtPath, setDataAtPath, getHuntObjWithIds}