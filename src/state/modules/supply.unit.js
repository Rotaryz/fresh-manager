import * as supplyModule from './supply'

describe('@state/modules/supply', () => {
  it('exports a valid Vuex module', () => {
    expect(supplyModule).toBeAVuexModule()
  })
})
