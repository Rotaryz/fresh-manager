import * as tradeModule from './trade'

describe('@state/modules/beginner', () => {
  it('exports a valid Vuex module', () => {
    expect(tradeModule).toBeAVuexModule()
  })
})
