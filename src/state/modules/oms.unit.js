import * as omsModule from './oms'

describe('@state/modules/oms', () => {
  it('exports a valid Vuex module', () => {
    expect(omsModule).toBeAVuexModule()
  })
})
