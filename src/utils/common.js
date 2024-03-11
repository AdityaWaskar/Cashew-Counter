const dev = import.meta.env.VITE_MODE;

export const print = (msg) => {
  dev === "development" && console.log(msg);
};
 