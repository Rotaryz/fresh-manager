import * as scmGoodsModule from './scm-goods'

describe('@state/modules/scm-goods', () => {
  it('exports a valid Vuex module', () => {
    expect(scmGoodsModule).toBeAVuexModule()
  })
})
