class APIHandler {
    constructor () {
      this.app = axios.create({
        baseURL: 'https://minions-api.herokuapp.com'
      })
    }
}