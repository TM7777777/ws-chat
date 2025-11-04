import { useEffect } from 'react';
import { eventBus } from '../utils/eventBus';

const useReduxEventBusAction = (actionType, callback) => {
  useEffect(() => {
    const handleAction = (action) => {
      if (action.type === actionType) {
        callback(action);
      }
    };

    eventBus.on(actionType, handleAction);

    return () => {
      eventBus.off(actionType, handleAction);
    };
  }, [actionType, callback]);
};

export default useReduxEventBusAction;
