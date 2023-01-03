import { gql } from "@apollo/client";

export const MACHINE_QUERY = gql`
  query machine {
    machine {
      id
      name
      type
      status
      duration
      user
      completeTime
    }
  }
`;

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