export type AppState = {
  page1: Page1State;
  page2: Page2State;
};

type Page1State = {
  value: string;
};

type Page2State = {
  value: string;
};

export type Actions =
  | {
      type: "UpdatePage1";
      payload: {
        value: string;
      };
    }
  | {
      type: "UpdatePage2";
      payload: {
        value: string;
      };
    }
  | {
      type: "preUpdatePage1";
    };
