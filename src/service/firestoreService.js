import {
  addDoc,
  collection,
  doc,
  getDoc,
  query,
  where,
  updateDoc
} from "@firebase/firestore";
import { db } from "../lib/db";
import { COLLECTION } from "../constants/db";

export const getRooms = () => {
  return getDoc(collection(db, COLLECTION.ROOMS));
};

export const getRoomById = (id) => {
  return getDoc(doc(db, COLLECTION.ROOMS, id));
};

export const getTenantById = (id) => {
  return getDoc(doc(db, COLLECTION.TENANTS, id));
};

export const getPaymentByTenantId = (id) => {
  return getDoc(
    query(collection(db, COLLECTION.ROOMS), where("tenantId", "==", id))
  );
};

export const addNewPayment = (data) => {
  return addDoc(collection(db, COLLECTION.PAYMENTS), data);
};

export const createTenant = (data) => {
  return addDoc(collection(db, COLLECTION.TENANTS), data);
};

export const updateTenant = (id, tenantId) => {
  return updateDoc(doc(db, COLLECTION.TENANTS, id), { tenantId });
};
