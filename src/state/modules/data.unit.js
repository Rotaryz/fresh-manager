import * as dataModule from './data'

describe('@state/modules/data', () => {
  it('exports a valid Vuex module', () => {
    expect(dataModule).toBeAVuexModule()
  })
})
