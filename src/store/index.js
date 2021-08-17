import { createStore, combineReducers, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import { all } from 'redux-saga/effects';

// Reducers
import employee from './reducers/employee';

// Sagas
import { employeeSaga } from './sagas/employeeSaga';

const sagaMiddleware = createSagaMiddleware();

const store = createStore(
  combineReducers({
    employee
  }),
  applyMiddleware(sagaMiddleware)
);

function* rootSaga() {
  yield all([...employeeSaga]);
}

sagaMiddleware.run(rootSaga);

export default store;
