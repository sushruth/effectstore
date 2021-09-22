export type Action = {
  type: string;
  payload?: unknown;
};

export type InitialReducers<A extends Action, T> = {
  [K in A["type"]]?: ReadonlyArray<
    (
      getState: () => T,
      action: ActionOfType<A, K>,
      dispatch: <DispatchAction extends A = A>(action: DispatchAction) => void
    ) => MaybePromise<T>
  >;
} & {
  [K in typeof PreMiddleWare]?: ReadonlyArray<
    (
      getState: () => T,
      action: Action,
      dispatch: <DispatchAction extends A = A>(action: DispatchAction) => void
    ) => MaybePromise<T>
  >;
} & {
  [K in typeof PostMiddleWare]?: ReadonlyArray<
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

export type ActionOfType<A extends Action, K> = A extends { type: K }
  ? A
  : never;

export const PostMiddleWare = Symbol("post-middleware");
export const PreMiddleWare = Symbol("pre-middleware");
