import React, { useEffect } from 'react';
import { useRive, useStateMachineInput } from 'rive-react';
import { eventBus } from '../utils/eventBus';

const stateMachine = 'Start';
const themeChangeEvents = ['Moon to Sun', 'Sun to Moon'];

const BackgroundAnimation = () => {
  const { RiveComponent, rive } = useRive({
    src: '/animations/nature.riv',
    stateMachines: stateMachine,
    autoplay: true,
    onStateChange: (stateMachine) => {
      const isThemeChangeEvent = themeChangeEvents.some((event) =>
        stateMachine.data.includes(event),
      );

      if (isThemeChangeEvent) {
        const isDark = stateMachine.data.includes('Sun to Moon');
        eventBus.emit('riveThemeToggle', isDark);
      }
    },
    onRiveReady: (rive) => {
      const savedTheme = localStorage.getItem('theme');
      const _themeInput = rive
        .stateMachineInputs(stateMachine)
        .find((input) => input.name === 'on/off');

      const isDark = savedTheme === 'dark';
      if (_themeInput.value !== isDark) {
        _themeInput.value = isDark;
      }
    },
  });

  const themeInput = useStateMachineInput(rive, stateMachine, 'on/off');

  useEffect(() => {
    if (!themeInput) return;

    const handleThemeChange = (isDark) => {
      if (themeInput) {
        themeInput.value = isDark;
      }
    };

    eventBus.on('themeChanged', handleThemeChange);

    return () => {
      eventBus.off('themeChanged', handleThemeChange);
    };
  }, [themeInput, rive]);

  return (
    <div className="background-animation">
      <RiveComponent />
    </div>
  );
};

export default BackgroundAnimation;
