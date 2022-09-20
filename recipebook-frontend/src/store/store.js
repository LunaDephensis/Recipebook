import {createStore} from 'vuex';

export default createStore({
    state() {
        return {
            isLoading: false
        }
    },
    mutations: {
        startLoading(state) {
            state.isLoading = true;
            document.documentElement.style.overflow = "hidden";
        },
        stopLoading(state) {
            state.isLoading = false;
            document.documentElement.style.overflow = "auto";
        }
    },
    getters: {
        isLoading(state) {
            return state.isLoading
        }
    }
});