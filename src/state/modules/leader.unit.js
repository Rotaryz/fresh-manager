import * as leaderModule from './leader'

describe('@state/modules/leader', () => {
  it('exports a valid Vuex module', () => {
    expect(leaderModule).toBeAVuexModule()
  })
})
