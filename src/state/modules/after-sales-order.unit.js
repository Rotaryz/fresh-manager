import * as authModule from './auth'

describe('@state/modules/after-sales-order', () => {
  it('exports a valid Vuex module', () => {
    expect(authModule).toBeAVuexModule()
  })
})
