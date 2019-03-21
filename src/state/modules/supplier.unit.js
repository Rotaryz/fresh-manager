import * as supplierModule from './supplier'

describe('@state/modules/supplier', () => {
  it('exports a valid Vuex module', () => {
    expect(supplierModule).toBeAVuexModule()
  })
})
