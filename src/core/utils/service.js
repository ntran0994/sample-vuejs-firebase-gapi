import axios from 'axios';
import { firebaseDB, firebaseCollection, firebaseGetDocs, firebaseAddDoc, firebaseUpdateDoc, firebaseDoc, firebaseGetDoc } from "core/firebase";
import { AUTH_HEADER_KEY } from 'utils/constants';
import { getSystemDate } from "utils/date-time";
import { getCurrentUser } from "utils/auth";

export default class Service {
  static setAccessToken(token) {
    axios.defaults.headers.common[AUTH_HEADER_KEY] = `Bearer ${token}`;
  }

  static clearAccessToken() {
    axios.defaults.headers.common[AUTH_HEADER_KEY] = undefined;
  }

  constructor(namespace) {
    const baseURL = process.env.CLOUD_FUNCTIONS_END_POINT || '';
    this.namespace = namespace;
    this.axios = axios.create({
      baseURL: `${baseURL}/${namespace}/`,
      responseType: 'json'
    });
    this.axios.defaults.headers.post['Content-Type'] = 'application/json';
  }

  rest(action, params, options = { method: 'post', headers: {} }) {
    return new Promise((resolve, reject) => {
      this.axios
        .request(action, {
          method: options.method,
          data: params,
          headers: options.headers
        })
        .then(response => {
          if (response.data) {
            resolve(response.data);
          } else {
            reject(response);
          }
        })
        .catch(error => {
          if (error.response.status == 401) {
            // store.dispatch('global/setAuthorShow', true, { root: true });
          } else {
            reject(error.response.data.errors);
          }
        });
    });
  }

  get(action, params) {
    return this.rest(action, params, { method: 'get' });
  }

  async getList(){
    const collection = firebaseCollection(firebaseDB, this.namespace);
    const snapshot = await firebaseGetDocs(collection);
    return snapshot.docs.map(doc => doc.data());
  }

  async getRecord(documentId){
    const document = firebaseDoc(firebaseDB, this.namespace, documentId);
    const docSnap = await firebaseGetDoc(document);

    if (docSnap.exists()) {
      return docSnap.data();
    }

    return false;
  }

  async insertRecord(data){
    const collection = firebaseCollection(firebaseDB, this.namespace);
    const docRef = await firebaseAddDoc(collection, Object.assign({}, await this.getSystemFields(), data));
    return docRef.id;
  }

  async updateRecord(documentId, data){
    const document = firebaseDoc(firebaseDB, this.namespace, documentId);
    const objData = Object.assign({}, await this.getSystemFields(true), data);
    this.insertLogRecord(documentId, data, 'updateRecord');
    return await firebaseUpdateDoc(document, objData);
  }

  async deleteRecord(documentId){
    const document = firebaseDoc(firebaseDB, this.namespace, documentId);
    const objData = {active: false};
    this.insertLogRecord(documentId, objData, 'deleteRecord');
    return await firebaseUpdateDoc(document, Object.assign({}, await this.getSystemFields(true), objData));
  }

  async insertLogRecord(documentId, data, type){
    const oldData = await this.getRecord(documentId);
    const collection = firebaseCollection(firebaseDB, this.namespace + '-logs');
    const docRef = await firebaseAddDoc(collection, Object.assign({}, await this.getSystemFields(), {old: oldData || null, new: data, type}));
    return docRef.id;
  }

  async getSystemFields(isUpdate){
    const currentDate = getSystemDate();
    const currentUser = await getCurrentUser();

    if(isUpdate){
      return {
        updated_by: currentUser.email,
        updated: currentDate
      }
    }else{
      return {
        active: true,
        updated_by: currentUser.email,
        updated: currentDate,
        created_by: currentUser.email,
        created: currentDate
      }
    }
  }
}
