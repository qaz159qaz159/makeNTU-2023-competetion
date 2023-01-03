import { gql } from "@apollo/client";

export const LEICHIE_QUERY = gql`
  query laserCutter {
    laserCutter {
      id
      status
      duration
      user
      completeTime
    }
  }
`;
