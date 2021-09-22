import React, { useCallback } from "react";
import { useAppStateContainer } from "../consumer/AppState";

export const Comp: React.FC = () => {
  const { state, dispatch } = useAppStateContainer();

  const onClick1 = useCallback(
    () =>
      dispatch({
        type: "UpdatePage1",
        payload: {
          value: "Page 1 updated - " + Math.random(),
        },
      }),
    []
  );

  const onClick2 = useCallback(
    () =>
      dispatch({
        type: "UpdatePage2",
        payload: {
          value: "Page 2 updated - " + Math.random(),
        },
      }),
    []
  );

  return (
    <>
      <ul>
        <li>
          Page 1:
          <pre>
            <code>{state.page1.value}</code>
          </pre>
        </li>
        <li>
          Page 2:
          <pre>
            <code>{state.page2.value}</code>
          </pre>
        </li>
      </ul>

      <button onClick={onClick1}>Change Page 1</button>
      <button onClick={onClick2}>Change Page 2</button>
    </>
  );
};
