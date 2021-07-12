import Vue from 'vue';
import Vuex from 'vuex';
import axios from 'axios';
import createPersistedState from 'vuex-persistedstate';
import GlobalVarConfig from '../config/globalVariable';

Vue.use(Vuex);

const getDefaultState = () => {
    return {
        token: '',
        user: {},
        menu: []
    };
};

export default new Vuex.Store({
    strict: true,
    plugins: [createPersistedState()],
    state: getDefaultState(),
    getters: {
        isLoggedIn: state => {
            return state.token;
        },
        getUser: state => {
            return state.user;
        },
        getMenu: state => {
            return state.menu;
        }
    },
    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token;
        },
        SET_USER: (state, user) => {
            state.user = user;
        },
        RESET: state => {
            Object.assign(state, getDefaultState());
        },
        SET_MENU: (state, menu) => {
            state.menu = menu;
        }
    },
    actions: {
        login: ({
            commit,
            dispatch
        }, {
            token,
            user
        }) => {
            commit('SET_TOKEN', token);
            commit('SET_USER', user);

            // axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        },
        logout: ({
            commit
        }) => {
            commit('RESET', '');
        },
        async setMenu({
            commit
        }) {
            await axios
                .get(`${GlobalVarConfig.API_URL}/menu-recursive`)
                .then((response) => {
                    commit('SET_MENU', response.data)
                })
                .catch((error) => {
                    commit('SET_MENU', [])
                });
        },
    },

});