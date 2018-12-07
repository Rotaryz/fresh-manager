import * as oauthModule from './oauth'

describe('@state/modules/oauth', () => {
  it('exports a valid Vuex module', () => {
    expect(oauthModule).toBeAVuexModule()
  })
})
