import axios from 'axios';
import qs from 'qs';
import to from 'await-to-js';
import { firebaseGoogleAuthProvider, firebaseAuth, firebaseSignInWithCredential, firebaseSignOut } from 'core/firebase';
import ClientError from 'response-object/error';
import ClientSuccess from 'response-object/success';
import ServiceAccessToken from 'utils/service';
import Service from 'utils/service';
import {
    ERR_TYPE_GET_AUTHORIZATION_CODE,
    ERR_TYPE_GOOGLE_OAUTH,
    ERR_TYPE_SIGN_IN,
    ERR_TYPE_FIREBASE_SIGN_IN
} from 'response-object/constants/types';
import {
    ERR_CODE_GET_AUTHORIZATION_CODE,
    ERR_CODE_GOOGLE_OAUTH,
    ERR_CODE_SIGN_IN,
    ERR_CODE_FIREBASE_LOGIN,
    SUCCESS_CODE_FIREBASE_SIGN_IN,
    SUCCESS_CODE_FIREBASE_SIGN_OUT
} from 'response-object/constants/codes';
import {
    ERR_MESSAGE_GET_AUTHORIZATION_CODE,
    ERR_MESSAGE_GOOGLE_OAUTH,
    ERR_MESSAGE_SIGN_IN,
    ERR_MESSAGE_FIREBASE_SIGN_IN,
    SUCCESS_MESSAGE_FIREBASE_SIGN_IN,
    SUCCESS_MESSAGE_FIREBASE_SIGN_OUT
} from 'response-object/constants/messages';
import {
    AUTH_SUCCESS
} from './types';

const service = new Service('auth');

export const signIn = ({ commit }) => {
    return new Promise(async (resolve, reject) => {
        // Get authorization code to generate access token and refresh token
        const [errGoogleAuthorizationCode, googleAuthorizationCode] = await to(getGoogleAuthorizationCode());

        if (errGoogleAuthorizationCode) {
            reject(errGoogleAuthorizationCode);
        }

        if (googleAuthorizationCode) {
            // Google login
            const [errGoogleOAuth, googleOAuthObj] = await to(googleOAuth(googleAuthorizationCode));

            if (errGoogleOAuth) {
                reject(errGoogleOAuth);
            }

            // Firebase login with Google
            const [errFirebaseLogin, firebaseLoginObj] = await to(firebaseLogin(googleOAuthObj.id_token));

            if (errFirebaseLogin) {
                reject(errFirebaseLogin);
            }

            commit(AUTH_SUCCESS, {
                accessToken: googleOAuthObj.access_token,
                refreshToken: googleOAuthObj.refresh_token
            });

            resolve(firebaseLoginObj);
        } else {
            reject(new ClientError(`${ERR_MESSAGE_SIGN_IN}`, ERR_CODE_SIGN_IN, ERR_TYPE_SIGN_IN));
        }
    });
};

export const signOut = () => {
    return new Promise(async (resolve, reject) => {
        firebaseSignOut(firebaseAuth).then(() => {
            window.localStorage.clear();
            ServiceAccessToken.clearAccessToken();
            resolve(new ClientSuccess(SUCCESS_MESSAGE_FIREBASE_SIGN_OUT, SUCCESS_CODE_FIREBASE_SIGN_OUT));
        }).catch((err) => {
            reject(new ClientError(`${ERR_MESSAGE_GOOGLE_OAUTH} - ${err.message}`, ERR_CODE_GOOGLE_OAUTH, ERR_TYPE_GOOGLE_OAUTH));
        });
    });
};

export const getList = () => {
    return service.getList();
};

/*eslint no-unused-vars: "off"*/
export const insertRecord = ({ commit }, obj) => {
    return service.insertRecord(obj.data);
};

/*eslint no-unused-vars: "off"*/
export const updateRecord = ({ commit }, obj) => {
    return service.updateRecord(obj.documentId, obj.data);
};

/*eslint no-unused-vars: "off"*/
export const deleteRecord = ({ commit }, obj) => {
    return service.deleteRecord(obj.documentId);
};

/*eslint no-unused-vars: "off"*/
export const getRecord = ({ commit }, documentId) => {
    return service.getRecord(documentId);
};

const getGoogleAuthorizationCode = () => {
    return new Promise((resolve, reject) => {
        window.gapi.auth2
            .getAuthInstance()
            .grantOfflineAccess()
            .then(resp => {
                resolve(resp.code);
            })
            .catch((err) => {
                reject(new ClientError(`${ERR_MESSAGE_GET_AUTHORIZATION_CODE} - ${err.message}`, ERR_CODE_GET_AUTHORIZATION_CODE, ERR_TYPE_GET_AUTHORIZATION_CODE));
            });
    });
}

const googleOAuth = (googleAuthorizationCode) => {
    return new Promise((resolve, reject) => {
        const config = {
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
        };
        const requestBody = {
            grant_type: 'authorization_code',
            client_id: process.env.GAPI_OAUTH_CLIENT_ID,
            client_secret: process.env.GAPI_OAUTH_SECRET_ID,
            redirect_uri: 'postmessage',
            code: googleAuthorizationCode
        }

        axios.post(process.env.GOOGLE_REQUEST_ACCESS_TOKEN, qs.stringify(requestBody), config)
            .then(resp => {
                resolve(resp.data);
            })
            .catch(err => {
                reject(new ClientError(`${ERR_MESSAGE_GOOGLE_OAUTH} - ${err.message}`, ERR_CODE_GOOGLE_OAUTH, ERR_TYPE_GOOGLE_OAUTH));
            });
    });
}

const firebaseLogin = (idToken) => {
    return new Promise(async (resolve, reject) => {
        try {
            const credential = firebaseGoogleAuthProvider.credential(idToken);
            await firebaseSignInWithCredential(firebaseAuth, credential).catch((err) => {
                reject(new ClientError(`${ERR_MESSAGE_FIREBASE_SIGN_IN} - ${err.message}`, err.code, ERR_TYPE_FIREBASE_SIGN_IN));
            });

            resolve(new ClientSuccess(SUCCESS_MESSAGE_FIREBASE_SIGN_IN, SUCCESS_CODE_FIREBASE_SIGN_IN));
        } catch (err) {
            reject(new ClientError(`${ERR_MESSAGE_FIREBASE_SIGN_IN} - ${err.message}`, ERR_CODE_FIREBASE_LOGIN, ERR_TYPE_FIREBASE_SIGN_IN));
        }

    });
}


