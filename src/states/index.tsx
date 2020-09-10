import { configureStore } from '@reduxjs/toolkit';
import {
    actions as EditorActions,
    reducer as EditorReducer,
} from './Editor';
import {
    actions as LayoutActions,
    reducer as LayoutReducer,
} from './Layout';
import {
    actions as ServiceActions,
    reducer as ServiceReducer,
} from './Service';

export const store = configureStore({
    reducer: {
        editor: EditorReducer,
        layout: LayoutReducer,
        service: ServiceReducer,
    },
    middleware: getDefaultMiddleware => getDefaultMiddleware({
        immutableCheck: { ignoredPaths: ['service'] },
        serializableCheck: { ignoredPaths: ['service'] },
    }),
});
export type IState = ReturnType<typeof store.getState>;

export {
    EditorActions,
    LayoutActions,
    ServiceActions,
}
