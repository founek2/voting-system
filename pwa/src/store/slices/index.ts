import { ActionFromReducersMapObject, combineReducers, Reducer, StateFromReducersMapObject } from '@reduxjs/toolkit';
import { api } from '../../endpoints/api';
import authorization from './authorizationSlice';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

const reducers = {
    [api.reducerPath]: api.reducer,
    authorization,
};

type ReducersMapObject = typeof reducers;

const rootReducer = combineReducers(reducers);

const persistConfig = {
    key: 'persist_key',
    storage,
    blacklist: [api.reducerPath],
};

// export default rootReducer
export default persistReducer(persistConfig, rootReducer) 