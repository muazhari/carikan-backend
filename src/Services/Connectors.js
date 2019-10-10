import Models from '../Models'

class President {
  constructor() {
    this.findPresident = name => {
      const person = Models.President.findOne({ name }, (error, data) => {
        return data
      })
      return person
    }
  }
}

export default { President }
