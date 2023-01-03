import { gql } from "@apollo/client";

export const CREATE_LEICHIE_MUTATION = gql`
  mutation createLaserCutter($info: CreateLaserInfo!) {
    createLaserCutter(info: $info) {
      id
      status
      duration
      user
      completeTime
    }
  }
`;

export const UPDATE_LEICHIE_MUTATION = gql`
  mutation updateLaserCutter($info: UpdateLaserInfo!) {
    updateLaserCutter(info: $info) {
      id
      status
      duration
      user
      completeTime
    }
  }
`;

export const DEL_LEICHIE_MUTATION = gql`
  mutation deleteLaserCutter($id: ID!)
`;

export const CREATE_LEICHIE_RESERVE = gql`
  mutation createLaserReserve($info: ReserveLaserCutter!) {
    createLaserReserve(info: $info)
      teamId
      material
      thickness
      reserveStatus
      updated_at
  }
`;

export const CANCEL_LEICHIE_RESERVE = gql`
  mutation cancelLaserReserve($teamId: ID!) {
    cancelLaserReserve(teamId: $teamId)
      teamId
      material
      thickness
      reserveStatus
      updated_at
  }
`;