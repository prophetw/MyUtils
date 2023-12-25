# MyUtils

### calcNewGitTag

```js
node calcNewGitTag.js

const a = gNewTag('pre', 'V1.4.3-hotfix') // V1.4.3-hotfix.1
const a = gNewTag('pre', 'V1.4.3-rc.1') // V1.4.3-rc.2
const a = gNewTag('pre', 'V1.4.3-cool.0') // V1.4.3-cool.1
const a = gNewTag('major', 'V1.4.3-cool.0') // V2.0.0
const a = gNewTag('minor', 'V1.4.3-cool.0') // V1.5.0
const a = gNewTag('patch', 'V1.4.3-cool.0') // V1.4.4
```