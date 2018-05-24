
import Firebase from 'firebase'

let _database = null
let _storage = null

const initFirebase = () => {
  var config = {
    apiKey: "AIzaSyCMRIDyzb0VRjWTjCu8CZtnzGkLMbjIMt8",
    authDomain: "barhuntv2.firebaseapp.com",
    databaseURL: "https://barhuntv2.firebaseio.com",
    projectId: "barhuntv2",
    storageBucket: "barhuntv2.appspot.com",
    messagingSenderId: "472107255951"
  }

  Firebase.database.enableLogging(true)
  Firebase.initializeApp(config)
}

export const getDatabase = () => {
  if (!_database) {
    initFirebase();
    _database = Firebase.database();
  }
  return _database
}



export const getStorage = () => {
  if (!_storage) {
    initFirebase();
    _storage = Firebase.storage();
  }
  return _storage
}