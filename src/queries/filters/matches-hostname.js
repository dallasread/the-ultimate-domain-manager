const MATCH_HOSTNAME = /[\w-]+\.\w+$/gi

export default (str) => {
  return str.match(MATCH_HOSTNAME)[0]
}
