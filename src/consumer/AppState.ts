import { createContainer } from "unstated-next";
import { useEventStore } from "../effectStore/useEventStore";
import { InitialReducers, PostMiddleWare, PreMiddleWare } from "../effectStore/useEventStore.types";
import { Actions, AppState } from "./AppState.types";

const initialState: AppState = {
  page1: {
    value: "Page 1",
  },
  page2: {
    value: "Page 2",
  },
};

const initialReducers: InitialReducers<Actions, AppState> = {
  UpdatePage1: [
    async (getState, action) => {
      await new Promise((resolve) => setTimeout(resolve, 5000));
      return {
        ...getState(),
        page1: action.payload,
      };
    },
  ],
  UpdatePage2: [
    async (getState, action) => {
      await new Promise((resolve) => setTimeout(resolve, 200));
      return {
        ...getState(),
        page2: action.payload,
      };
    },
  ],
  preUpdatePage1: [
    async (getState) => {
      return {
        ...getState(),
        page1: {
          value: "Loading Page 1 ..."
        }
      }
    }
  ],
  [PreMiddleWare] :[
    async (getState) => {
      console.log("pre middleware - ", getState());
    }
  ],
  [PostMiddleWare] :[
    async (getState) => {
      console.log("post middleware - ", getState());
    }
  ]
};

const { Provider: AppStateProvider, useContainer: useAppStateContainer } =
  createContainer(() =>
    useEventStore<Actions, AppState>({ initialState, initialReducers })
  );

export { AppStateProvider, useAppStateContainer };
