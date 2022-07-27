import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import { firebaseConfigObject } from './firebaseConfigObject'

// init firebase
firebase.initializeApp(firebaseConfigObject)

// init services
const projectFirestore = firebase.firestore()
const projectAuth = firebase.auth()

// timestamp
const  timestamp = firebase.firestore.Timestamp

export { projectFirestore, projectAuth, timestamp }