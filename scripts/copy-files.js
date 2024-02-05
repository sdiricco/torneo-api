const copyfiles = require('copyfiles')
copyfiles(['src/**/*.yml', 'dist'], { up: 1 }, () =>
  console.log('Files copied successfully'),
)
