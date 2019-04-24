import * as accountModule from './account'

describe('@state/modules/account', () => {
  it('exports a valid Vuex module', () => {
    expect(accountModule).toBeAVuexModule()
  })
})
