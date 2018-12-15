import * as editgoodsModule from './editgoods'

describe('@state/modules/editgoods', () => {
  it('exports a valid Vuex module', () => {
    expect(editgoodsModule).toBeAVuexModule()
  })
})
