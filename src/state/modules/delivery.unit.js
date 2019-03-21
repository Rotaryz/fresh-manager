import * as deliveryModule from './delivery'

describe('@state/modules/delivery', () => {
  it('exports a valid Vuex module', () => {
    expect(deliveryModule).toBeAVuexModule()
  })
})
