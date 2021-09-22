export type Action = {
  type: string;
  payload?: unknown;
};

export type ActionOfType<A extends Action, K> = A extends { type: K }
  ? A
  : never;
export type PayloadOfType<A extends Action, K> = ActionOfType<A, K>['payload']

export type InitialReducers<A extends Action, T> = {
  [K in A["type"]]?: ReadonlyArray<
    (
      getState: () => T,
      action: ActionOfType<A, K>,
      dispatch: <DispatchAction extends A = A>(action: DispatchAction) => void
    ) => MaybePromise<T>
  >;
} & {
  [K in typeof OnAfterAction]?: ReadonlyArray<
    (
      getState: () => T,
      action: Action,
      dispatch: <DispatchAction extends A = A>(action: DispatchAction) => void
    ) => MaybePromise<T>
  >;
} & {
  [K in typeof OnBeforeAction]?: ReadonlyArray<
    (
      getState: () => T,
      action: Action,
      dispatch: <DispatchAction extends A = A>(action: DispatchAction) => void
    ) => MaybePromise<T>
  >;
};

export type EventStoreParams<A extends Action, T> = {
  initialState: T;
  initialReducers?: InitialReducers<A, T>;
};

export type Maybe<T> = T | undefined | void;

export type MaybePromise<T> = Maybe<T> | Promise<Maybe<T>>;

export const OnBeforeAction = Symbol("post-middleware");
export const OnAfterAction = Symbol("pre-middleware");

export type ExtendAction<A extends Action> = {
  [K in A["type"]]: {
    type: K;
    payload: PayloadOfType<A, K>
  } | {
    type: `pre${K}`;
    payload: PayloadOfType<A, K>
  } | {
    type: `post${K}`;
    payload: PayloadOfType<A, K>
  };
}[A['type']];
