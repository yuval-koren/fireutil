import firebase from 'firebase';
import database from 'firebase';
import dbconfig from './dbconfig';
import store from '../reducers/store'

firebase.initializeApp(dbconfig);

const firebase_db = firebase.database();

export default firebase_db;