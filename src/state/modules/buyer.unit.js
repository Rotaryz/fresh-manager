import * as buyerModule from './buyer'

describe('@state/modules/buyer', () => {
  it('exports a valid Vuex module', () => {
    expect(buyerModule).toBeAVuexModule()
  })
})
