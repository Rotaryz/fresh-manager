import * as distributionModule from './distribution'

describe('@state/modules/distribution', () => {
  it('exports a valid Vuex module', () => {
    expect(distributionModule).toBeAVuexModule()
  })
})
