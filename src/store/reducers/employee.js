import { NotificationManager } from 'react-notifications';

export const Types = {
  FAILURE_REQUEST: 'EMPLOYEE/FAILURE_REQUEST',
  // Employees
  LOAD_EMPLOYEES: 'EMPLOYEE/LOAD_EMPLOYEE',

  // Sectors
  SAVE_SECTOR: 'EMPLOYEE/SAVE_SECTOR',
  SUCCESS_SAVE_SECTOR: 'EMPLOYEE/SUCCESS_SAVE_SECTOR',
  FAILURE_SAVE_SECTOR: 'EMPLOYEE/FAILURE_SAVE_SECTOR',
  LOAD_SECTORS: 'EMPLOYEE/LOAD_SECTORS',
  SUCCESS_LOAD_SECTORS: 'EMPLOYEE/SUCCESS_LOAD_SECTORS'
};

const INITIAL_STATE = {
  // General
  loading: false,
  // Employee
  employee: {},
  // Sector
  sectors: []
};

export default function employeeReducer(state = INITIAL_STATE, action) {
  switch (action.type) {
    case Types.LOAD_EMPLOYEES:
      return {
        ...state
      };
    case Types.SAVE_SECTOR:
      return {
        ...state,
        loading: true
      };
    case Types.SUCCESS_SAVE_SECTOR:
      return {
        ...state,
        loading: false
      };
    case Types.FAILURE_SAVE_SECTOR:
      NotificationManager.error(action.message, 'Erro', 6000);
      return {
        ...state,
        loading: false
      };
    case Types.FAILURE_REQUEST:
      NotificationManager.error(action.message, 'Erro', 6000);
      return {
        ...state,
        loading: false
      };
    case Types.LOAD_SECTORS:
      return {
        ...state,
        loading: true
      };
    case Types.SUCCESS_LOAD_SECTORS:
      return {
        ...state,
        loading: false
      };
    default:
      return state;
  }
}
