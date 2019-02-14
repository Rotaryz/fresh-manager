import * as tradeModule from './trade'

describe('@state/modules/trade', () => {
  it('exports a valid Vuex module', () => {
    expect(tradeModule).toBeAVuexModule()
  })
})
