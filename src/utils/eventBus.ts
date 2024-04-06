import { inject } from "vue";
export interface EventBus {
  $on(event: string, callback: (...args: any[]) => void): void;
  $emit(event: string, ...args: any[]): void;
}

const createEventBus = () => {
  const events: Record<string, Function[]> = {};

  const $on = (event: string, callback: (...args: any[]) => void) => {
    if (!events[event]) {
      events[event] = [];
    }
    events[event].push(callback);
  };

  const $emit = (event: string, ...args: any[]) => {
    if (events[event]) {
      events[event].forEach((callback) => callback(...args));
    }
  };

  return { $on, $emit };
};

export function provideEventBus(app: any) {
  const eventBus:EventBus = createEventBus();
  app.provide("eventBus", eventBus);
}

export function useEventBusInject() {
  return inject<EventBus>("eventBus");
}
