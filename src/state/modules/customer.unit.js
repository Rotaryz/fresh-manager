import * as customerModule from './customer'

describe('@state/modules/customer', () => {
  it('exports a valid Vuex module', () => {
    expect(customerModule).toBeAVuexModule()
  })
})
