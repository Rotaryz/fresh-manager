import * as rushModule from './rush'

describe('@state/modules/rush', () => {
  it('exports a valid Vuex module', () => {
    expect(rushModule).toBeAVuexModule()
  })
})
