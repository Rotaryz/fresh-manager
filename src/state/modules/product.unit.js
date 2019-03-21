import * as productModule from './product'

describe('@state/modules/product', () => {
  it('exports a valid Vuex module', () => {
    expect(productModule).toBeAVuexModule()
  })
})
