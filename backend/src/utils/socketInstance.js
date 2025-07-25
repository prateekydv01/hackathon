let io = null;

export const setSocketInstance = (instance) => {
  io = instance;
};

export const getSocketInstance = () => {
  if (!io) throw new Error("Socket.io instance not initialized");
  return io;
};
