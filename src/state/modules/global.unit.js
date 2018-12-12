import * as globalModule from './global'

describe('@state/modules/global', () => {
  it('exports a valid Vuex module', () => {
    expect(globalModule).toBeAVuexModule()
  })
})
