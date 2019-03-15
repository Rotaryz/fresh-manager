import * as proTaskModule from './proTask'

describe('@state/modules/proTask', () => {
  it('exports a valid Vuex module', () => {
    expect(proTaskModule).toBeAVuexModule()
  })
})
