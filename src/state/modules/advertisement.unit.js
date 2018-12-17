import * as advertisementModule from './advertisement'

describe('@state/modules/advertisement', () => {
  it('exports a valid Vuex module', () => {
    expect(advertisementModule).toBeAVuexModule()
  })
})
