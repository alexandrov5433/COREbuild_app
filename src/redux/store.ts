import { configureStore } from '@reduxjs/toolkit'
import userReducer from './userSlice';
import popupMessageReducer from './popupMessageSlice';
import cartReducer from './cartSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    popupMessage: popupMessageReducer,
    cart: cartReducer
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch