import * as resetModuleModule from './reset-module'

describe('@state/modules/reset-module', () => {
  it('exports a valid Vuex module', () => {
    expect(resetModuleModule).toBeAVuexModule()
  })
})
