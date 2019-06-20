import * as allocationModule from './allocation'

describe('@state/modules/allocation', () => {
  it('exports a valid Vuex module', () => {
    expect(allocationModule).toBeAVuexModule()
  })
})
