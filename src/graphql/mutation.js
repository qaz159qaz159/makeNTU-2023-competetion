import { gql } from "@apollo/client";

export const CREATE_MACHINE_MUTATION = gql`
  mutation createMachine($input: CreateMachineInfo!) {
    createMachine(info: $input) {
      name
      type
      duration
    }
  }
`;

export const CLEAR_MACHINE_MUTATION = gql`
  mutation clearMachine {
    clearMachine
  }
`;

export const DELETE_MACHINE_MUTATION = gql`
  mutation deleteMachine($input: DeleteMachineInfo!) {
    deleteMachine(info: $input)
  }
`;

export const USER_RESERVE_MACHINE_MUTATION = gql`
  mutation userReserveMachine($input: ReserveMachineInfo!) {
    userReserveMachine(info: $input) {
      teamId
      machineId
    }
  }
`;

export const USER_CANCEL_MACHINE_MUTATION = gql`
  mutation userCancelMachine($input: ID!) {
    userCancelMachine(teamId: $input) {
      teamId
      machineId
    }
  }
`;
