// import * as XLSX from "xlsx";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  query,
  where,
  updateDoc,
  getDocs,
  deleteDoc
} from "@firebase/firestore";
import { db } from "../libs/db";
import { COLLECTION } from "../constants/db";

export const getRooms = () => {
  return getDocs(collection(db, COLLECTION.ROOMS));
};

export const getRoomById = (id) => {
  return getDoc(doc(db, COLLECTION.ROOMS, id));
};
export const getRoomByShopId = (id) => {
  const room = doc(db, COLLECTION.SHOPS, id);
  return getDocs(               //made changes
    query(collection(db, COLLECTION.ROOMS), where("shopId", "==", room))
  );
};

export const getTenantById = (id) => {
  return getDoc(doc(db, COLLECTION.TENANTS, id));
};

export const getPaymentByTenantId = (id) => {
  const tenant = doc(db, COLLECTION.TENANTS, id);
  return getDocs(
    query(collection(db, COLLECTION.PAYMENTS), where("tenantId", "==", tenant))
  );
};
export const getPaymentByShopId = (id) => {
  const room = doc(db, COLLECTION.SHOPS, id);
  return getDocs(               //made changes
    query(collection(db, COLLECTION.PAYMENTS), where("shopId", "==", room))
  );
};

export const addNewPayment = (data) => {
  const shopRef = doc(db, COLLECTION.SHOPS, data.shopId);
  return addDoc(collection(db, COLLECTION.PAYMENTS), {
    ...data,
    shopId: shopRef
  });
};

export const createTenant = (data) => {
  return addDoc(collection(db, COLLECTION.TENANTS), data);
};

export const createRoom = (data) => {
  return addDoc(collection(db, COLLECTION.ROOMS), data);
};
export const updateRoom = (id, data) => {
  return updateDoc(doc(db, COLLECTION.ROOMS, id), data);
};
export const updateTenant = (id, data) => {
  return updateDoc(doc(db, COLLECTION.TENANTS, id), data);
};

export const getShops = () => {
  return getDocs(collection(db, COLLECTION.SHOPS));
};

export const getShopById = (id) => {
  return getDoc(doc(db, COLLECTION.SHOPS, id));
};

export const createShop = (data) => {
  return addDoc(collection(db, COLLECTION.SHOPS), data);
};

export const updateShop = (id, data) => {
  return updateDoc(doc(db, COLLECTION.SHOPS, id), data);
};


export const getPayments = () => {
  return getDocs(collection(db, COLLECTION.PAYMENTS));
};

export const deletePayment = (paymentId) => {
  // Reference to the specific payment document in the PAYMENTS collection
  const paymentRef = doc(db, COLLECTION.PAYMENTS, paymentId);

  // Delete the document
  return deleteDoc(paymentRef);
};








