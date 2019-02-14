import * as categoriesModule from './categories'

describe('@state/modules/categories', () => {
  it('exports a valid Vuex module', () => {
    expect(categoriesModule).toBeAVuexModule()
  })
})
