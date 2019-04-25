import * as supplierModule from './supplier'

describe('@state/modules/sorting', () => {
  it('exports a valid Vuex module', () => {
    expect(supplierModule).toBeAVuexModule()
  })
})
