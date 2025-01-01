"use client";
import { createContext, useContext, useReducer } from "react";

const queryResultsContext = createContext({});
const queryResultsDispatchContext = createContext(null);
export function useQueryResults() {
    return useContext(queryResultsContext);
}
export function useQueryResultsDispatch() {
    return useContext(queryResultsDispatchContext);
}

function reducer(state, action) {
    switch (action.type) {
        case "newQueryResults": {
            if (action.data?.length > 0) {
                state.queryResults = [...action.data];
            } else {
                state.queryResults = [];
            }
            return { ...state };
        }
        case "newHistoryPrices": {
            if (action.data?.length > 0) {
                state.historyResults = [...action.data];
            } else {
                state.historyResults = [];
            }
            return { ...state };
        }
    }
}

export function QueryResultProvider({ children }) {
    const [state, dispatch] = useReducer(reducer, {
        queryResults: [],
        historyResults: [],
    });

    return (
        <queryResultsContext.Provider value={state}>
            <queryResultsDispatchContext.Provider value={dispatch}>
                {children}
            </queryResultsDispatchContext.Provider>
        </queryResultsContext.Provider>
    );
}
