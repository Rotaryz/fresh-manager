import * as warehouseModule from './warehouse'

describe('@state/modules/warehouse', () => {
  it('exports a valid Vuex module', () => {
    expect(warehouseModule).toBeAVuexModule()
  })
})
