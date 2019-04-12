import * as financeModule from './finance'

describe('@state/modules/finance', () => {
  it('exports a valid Vuex module', () => {
    expect(financeModule).toBeAVuexModule()
  })
})
