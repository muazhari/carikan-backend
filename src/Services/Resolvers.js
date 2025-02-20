const resolveFunctions = {
  RootQuery: {
    president(_, { name }, ctx) {
      const president = new ctx.constructor.President()
      return president.findPresident(name)
    },
  },
}

export default resolveFunctions
