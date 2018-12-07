---
inject: true
to: src/router/routes.js
after: "export default"
---
  // <%= note %>
  {
    path: '/<%= name %>',
    name: '<%= name %>',
    component: () => lazyLoadView(import('@pages/<%= name %>/<%= name %>'))
  },