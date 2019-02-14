import * as auxiliaryModule from './auxiliary'

describe('@state/modules/auxiliary', () => {
  it('exports a valid Vuex module', () => {
    expect(auxiliaryModule).toBeAVuexModule()
  })
})
