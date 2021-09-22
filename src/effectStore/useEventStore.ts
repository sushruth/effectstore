import { useCallback, useMemo, useRef, useState } from "react";
import {
  Action,
  EventStoreParams,
  MaybePromise,
  OnBeforeAction,
  OnAfterAction,
  ExtendAction,
} from "./useEventStore.types";

export function useEventStore<A extends Action, T>({
  initialState,
  initialReducers,
}: EventStoreParams<ExtendAction<A>, T>) {
  const [state, setState] = useState<T>(initialState);
  const stateRef = useRef<T>(initialState);
  const getState = useRef(() => stateRef.current);
  const target = useRef(new EventTarget());
  const isInitReducersSet = useRef(false);

  const generateRandomString = function () {
    return Math.random().toString(6).substr(2, 6);
  };

  const middlewareActionTypeMap = useMemo(
    () => ({
      [OnBeforeAction]: "on-before-middleware-" + generateRandomString(),
      [OnAfterAction]: "on-after-middleware-" + generateRandomString(),
    }),
    []
  );

  type Dispatch = <DispatchAction extends A = A>(
    action: DispatchAction
  ) => void;

  const dispatch = useCallback(
    <DispatchAction extends A = A>(action: DispatchAction) => {
      target.current.dispatchEvent(
        new CustomEvent(`pre${action.type}`, { detail: action })
      );

      target.current.dispatchEvent(
        new CustomEvent(middlewareActionTypeMap[OnAfterAction], {
          detail: action,
        })
      );

      target.current.dispatchEvent(
        new CustomEvent(action.type, { detail: action })
      );
    },
    []
  );

  const addReducer = useCallback(
    <ActionForListener extends A = A>(
      type:
        | ActionForListener["type"]
        | typeof OnBeforeAction
        | typeof OnAfterAction,
      reducer: (
        getState: () => T,
        action: ActionForListener,
        dispatch: Dispatch
      ) => MaybePromise<T>
    ) => {
      if (type === OnBeforeAction || type === OnAfterAction) {
        type = middlewareActionTypeMap[type];
      }

      async function run(event: CustomEvent<ActionForListener>) {
        const result = await reducer(getState.current, event.detail, dispatch);

        if (result) {
          stateRef.current = result;
          setState(result);

          if (!/^pre/.test(event.type)) {
            // Do not run on-after for pre actions
            target.current.dispatchEvent(
              new CustomEvent(middlewareActionTypeMap[OnBeforeAction], {
                detail: event.detail,
              })
            );

            target.current.dispatchEvent(
              new CustomEvent(`post${event.detail.type}`, {
                detail: event.detail,
              })
            );
          }
        }
      }

      function listener(event: CustomEvent<ActionForListener>) {
        run(event);
      }

      target.current.addEventListener(type, listener as EventListener);

      return listener;
    },
    [dispatch]
  );

  // const removeReducer = useCallback(
  //   <RemoveListenerAction extends A = A>(
  //     type: RemoveListenerAction["type"],
  //     listener: EventListener
  //   ) => {
  //     target.current.removeEventListener(type, listener);
  //   },
  //   []
  // );

  if (!isInitReducersSet.current && initialReducers) {
    const reducersObject = Object.assign({}, initialReducers);

    if (reducersObject[OnBeforeAction]) {
      Object.assign(reducersObject, {
        [middlewareActionTypeMap[OnBeforeAction]]:
          reducersObject[OnBeforeAction],
      });
    }

    if (reducersObject[OnAfterAction]) {
      Object.assign(reducersObject, {
        [middlewareActionTypeMap[OnAfterAction]]: reducersObject[OnAfterAction],
      });
    }

    for (const [actionType, reducers] of Object.entries(reducersObject)) {
      const reducerList = reducers as ReadonlyArray<
        (
          getState: () => T,
          action: A,
          dispatch: <DispatchAction extends A = A>(
            action: DispatchAction
          ) => void
        ) => MaybePromise<T>
      >;

      for (const reducer of reducerList) {
        addReducer(actionType, reducer);
      }
    }

    isInitReducersSet.current = true;
  }

  return {
    state,
    dispatch,
    // addReducer,
    // removeReducer,
  };
}
