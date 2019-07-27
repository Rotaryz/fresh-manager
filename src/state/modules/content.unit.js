import * as contentModule from './content'

describe('@state/modules/content', () => {
  it('exports a valid Vuex module', () => {
    expect(contentModule).toBeAVuexModule()
  })
})
