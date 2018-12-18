import * as purchaseModule from './purchase'

describe('@state/modules/purchase', () => {
  it('exports a valid Vuex module', () => {
    expect(purchaseModule).toBeAVuexModule()
  })
})
