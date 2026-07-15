// Reusable event-based toast utility. Enables calling toast.success("Msg") globally.
export const toastEvents = {
  listeners: new Set(),
  subscribe(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  },
  emit(type, message) {
    this.listeners.forEach((listener) => listener(type, message));
  },
};

export const toast = {
  success: (msg) => toastEvents.emit('success', msg),
  error: (msg) => toastEvents.emit('error', msg),
  info: (msg) => toastEvents.emit('info', msg),
  warning: (msg) => toastEvents.emit('warning', msg),
};
export default toast;
