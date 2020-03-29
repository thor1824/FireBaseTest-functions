import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import {User} from './user/model/user';
import {DependencyFactory} from './dependency-factory';

const express = require('express');
const cors = require('cors');
const app = express();
const serviceAccount = require('../secret.json');
const difa = new DependencyFactory();


app.use(cors());
admin.initializeApp({credential: admin.credential.cert(serviceAccount)});

exports.deleteUser = functions.https.onRequest(async (req: any) => {
  const id = req.query.id;
  const doesUserExist = await admin.firestore().collection('users').doc(id).get()
    .then(doc => {
      return doc.exists
    }).catch((re) => {
      console.log(re);
    }) as boolean;

  if (doesUserExist) {
    admin.firestore().collection('users').doc(id).delete().then().catch((re) => {
      console.log(re);
    });
  }
});

exports.blockUser = functions.https.onRequest(async (req: any) => {
  const id = req.query.id;
  const user = await admin.firestore().collection('users').doc(id).get()
    .then(doc => {
      if (doc.exists) {
        return doc.data();
      } else {
        console.log('There is no document!');
        return null;
      }
    }).catch((re) => {
      console.log(re);
    }) as User;

  if (user !== null) {
    admin.firestore().collection('blacklist').doc(user.uid).set(user).then().catch((re) => {
      console.log(re);
    });
  }
});


exports.productAdded = functions.firestore
  .document('products/{prodId}')
  .onWrite((snap: any, context: any) => {
    difa.getStockController().createStockEntry(snap, context).then().catch((re) => {
      console.log(re);
    });
  });

exports.pluckProduct = functions.firestore.document('orders/{orderId}').onCreate((snap: any, context: any) => {
  difa.getStockController().pluckProducts(snap, context).then().catch((re) => {
    console.log(re);
  });
});

exports.productUpdated = functions.firestore
  .document('products/{prodId}')
  .onUpdate((snap: any, context: any) => {
    difa.getOrderController().updateProductInfo(snap, context).then().catch((re) => {
      console.log(re);
    });;
    difa.getStockController().updateProductInfo(snap, context).catch((re) => {
      console.log(re);
    });;
  });

