import * as React from "react";
import { StyledFirebaseAuth } from "react-firebaseui";

import * as fs from "../services/firebaseService";

export default () => (
  <StyledFirebaseAuth uiConfig={fs.uiConfig} firebaseAuth={fs.auth()} />
);
