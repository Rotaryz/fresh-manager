import * as refunsModule from './refuns'

describe('@state/modules/refuns', () => {
  it('exports a valid Vuex module', () => {
    expect(refunsModule).toBeAVuexModule()
  })
})
