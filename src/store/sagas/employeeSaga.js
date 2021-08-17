import { takeLatest, put, call } from '@redux-saga/core/effects';
import { Types } from '../reducers/employee';
import api from '../../services/api';

function* loadEmployees(action) {
  yield 'teste';
}

function* saveSector(action) {
  try {
    const response = yield call(() =>
      api.post(
        'api/sectors',
        JSON.stringify({
          name: action.name
        }),
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
    );

    yield put({
      type: Types.SUCCESS_SAVE_SECTOR
    });
    yield put({
      type: Types.LOAD_SECTORS
    });
  } catch (error) {
    yield put({
      type: Types.FAILURE_SAVE_SECTOR,
      message: error.response.data
    });
  }
}

function* loadSectors(action) {
  try {
    const response = yield call(() => api.get('api/sectors'));
    yield put({
      type: Types.SUCCESS_LOAD_SECTORS,
      sectors: response.data
    });
  } catch (error) {
    yield put({
      type: Types.FAILURE_REQUEST,
      message: error.response.data
    });
  }
}

export const employeeSaga = [
  takeLatest(Types.LOAD_EMPLOYEES, loadEmployees),
  takeLatest(Types.LOAD_SECTORS, loadSectors),
  takeLatest(Types.SAVE_SECTOR, saveSector)
];
