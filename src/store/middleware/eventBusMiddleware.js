import { eventBus } from '../../utils/eventBus';

const eventBusMiddleware = (store) => (next) => (action) => {
  eventBus.emit(action.type, action);
  return next(action);
};

export default eventBusMiddleware;
