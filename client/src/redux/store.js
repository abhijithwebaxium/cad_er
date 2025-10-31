import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';

import loadingReducer from './loadingSlice';
import alertReducer from './alertSlice';

const persistConfig = {
  key: 'root',
  storage,
  //   whitelist: ['user'],
  blacklist: ['loading', 'alert'],
};

const reducer = combineReducers({
  loading: loadingReducer,
  alert: alertReducer,
});

const persistedReducer = persistReducer(persistConfig, reducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'], // ✅ Ignore redux-persist actions
      },
    }),
});

export const persistor = persistStore(store);
