import * as outreachGroupModule from './outreach-group'

describe('@state/modules/outreach-group', () => {
  it('exports a valid Vuex module', () => {
    expect(outreachGroupModule).toBeAVuexModule()
  })
})
