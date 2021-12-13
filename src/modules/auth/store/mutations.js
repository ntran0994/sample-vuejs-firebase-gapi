import {
    AUTH_SUCCESS
} from './types';

export const mutations = {
    [AUTH_SUCCESS](state, resp) {
        state.accessToken = resp.accessToken;
    }
}