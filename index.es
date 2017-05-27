const { config } = window

const windowURL = `file://${__dirname}/index.html`

const bounds = config.get('plugin.Leveling.bounds') || {
  x: config.get("poi.window.x", 0),
  y: config.get("poi.window.y", 0),
  width: 800,
  height: 600,
}

const windowOptions = {
  ...bounds,
}

const useEnv = true

export const realClose = true

export {
  windowOptions,
  windowURL,
  useEnv,
}
