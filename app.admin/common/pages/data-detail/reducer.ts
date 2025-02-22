import { DataDetailAction } from './type';

export const LOAD = 'data-detail.load';
export const LOAD_SUCCESS = 'data-detail.load.success';
export const LOAD_FAILURE = 'data-detail.load.failure';
export const UNLOAD = 'data-detail.unload';
export const ITEM_SEARCH = 'data-detail.item-search';
export const ITEM_SEARCH_SUCCESS = 'data-detail.item-search.success';
export const ITEM_SEARCH_FAILURE = 'data-detail.item-search.failure';
export const ITEM_SEARCH_CLEANUP = 'data-detail.item-search.cleanup';
export const SAVE = 'data-detail.save';
export const SAVE_SUCCESS = 'data-detail.save.success';
export const SAVE_FAILURE = 'data-detail.save.failure';
export const DELETE = 'data-detail.delete';
export const DELETE_SUCCESS = 'data-detail.delete.success';
export const DELETE_FAILURE = 'data-detail.delete.failure';

export const initialState = {
    loading: false,
    ready: false,
    data: null,
    error: null,
    formData: {},
    saveCounter: 0,
};

const reducer = (state = initialState, action: DataDetailAction) => {
    switch (action.type) {
        case LOAD:
            return { ...state, loading: true };
        case LOAD_SUCCESS:
            return {
                ...state,
                loading: false,
                ready: true,
                error: null,
                ...action.payload,
            };
        case LOAD_FAILURE:
            return {
                ...state,
                loading: false,
                ready: true,
                error: action.payload,
            };
        case UNLOAD:
            return { ...initialState };
        case ITEM_SEARCH_SUCCESS:
            return {
                ...state,
                formData: {
                    ...state.formData,
                    [action.payload.field]: {
                        result: action.payload.data,
                        error: [],
                    },
                },
            };
        case ITEM_SEARCH_FAILURE:
            return {
                ...state,
                formData: {
                    ...state.formData,
                    [action.payload.field]: {
                        result: {},
                        error: action.payload.error,
                    },
                },
            };
        case ITEM_SEARCH_CLEANUP:
            return {
                ...state,
                formData: {
                    ...state.formData,
                    [action.payload.field]: {
                        result: {},
                        error: [],
                    },
                },
            };
        case SAVE_SUCCESS:
            return {
                ...state,
                error: null,
                saveCounter: state.saveCounter + 1,
            };
        case SAVE_FAILURE:
            return {
                ...state,
                error: action.payload,
            };
        case DELETE_SUCCESS:
            return {
                ...state,
                error: null,
            };
        case DELETE_FAILURE:
            return {
                ...state,
                error: action.payload,
            };
        default:
            return state;
    }
};

export default reducer;
