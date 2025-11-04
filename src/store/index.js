import { createStore, applyMiddleware } from 'redux';
import createSagaMiddleware from 'redux-saga';
import rootReducer from './reducers';
import rootSaga from './sagas';
import eventBusMiddleware from './middleware/eventBusMiddleware';

const sagaMiddleware = createSagaMiddleware();

const store = createStore(rootReducer, applyMiddleware(eventBusMiddleware, sagaMiddleware));

sagaMiddleware.run(rootSaga);

export default store;
