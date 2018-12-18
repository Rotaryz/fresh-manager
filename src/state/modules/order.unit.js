import * as orderModule from './order'

describe('@state/modules/order', () => {
  it('exports a valid Vuex module', () => {
    expect(orderModule).toBeAVuexModule()
  })
})
