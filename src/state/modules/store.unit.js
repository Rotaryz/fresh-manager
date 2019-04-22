import * as storeModule from './store'

describe('@state/modules/store', () => {
  it('exports a valid Vuex module', () => {
    expect(storeModule).toBeAVuexModule()
  })
})
