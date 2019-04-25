import * as oGContentModule from './o-g-content'

describe('@state/modules/merchant-order', () => {
  it('exports a valid Vuex module', () => {
    expect(oGContentModule).toBeAVuexModule()
  })
})
