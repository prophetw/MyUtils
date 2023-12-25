const { execSync } = require('child_process')

// 获取当前最新的Git tag
const gitTag = execSync('git describe --tags --abbrev=0').toString().trim()
console.log(`Current Git tag: ${gitTag}`)

// 获取当前的Git commit hash
const gitCommit = execSync('git rev-parse HEAD').toString().trim()
console.log(`Current Git commit: ${gitCommit}`)

/**
 *
 * @param {string} tag  maybe 'v1.0.0'  'v1.0.0-hotfix.1' 'v1.0.0-beta.1' 'v1.0.0-rc.1' 'v1.0.0-alpha.1'
 */
const decodeTag = (tag) => {
  let majorVersion = 0
  let minorVersion = 0
  let patchVersion = 0
  let prename = '' // alpha beta rc hotfix
  let preVersion = 0

  const tagArr = tag.split('-')
  const version = tagArr[0].replace('v', '').replace('V', '')
  const versionArr = version.split('.')
  majorVersion = versionArr[0]
  minorVersion = versionArr[1]
  patchVersion = versionArr[2]
  if (tagArr[1]) {
    const preAry = tagArr[1].split('.')
    prename = preAry[0]
    preVersion = preAry[1]
  }
  return {
    majorVersion,
    minorVersion,
    patchVersion,
    prename,
    preVersion,
  }
}

/**
 * type: 'major' | 'minor' | 'patch' | 'hotfix'
 * {string} curTag  tag maybe like  V4.0.0-alpha V4.0.0-beta V1.0.0-rc V4.0.0-beta.1 V4.0.0-beta.2 V1.0.0-rc.1
 * {Boolean} forceUseCurTag force use tag that user input
 */
const gNewTag = (type, curTag, forceUseCurTag) => {
  if (forceUseCurTag) return curTag
  if (!type) return curTag
  const currentTag = curTag ? curTag : gitTag
  // curTag = 'v1.0.0'  'v1.0.0-hotfix.1'
  const verName = currentTag[0] // v or V
  const { majorVersion, minorVersion, patchVersion, prename, preVersion } =
    decodeTag(currentTag)
  let newMajor = majorVersion
  let newMinor = minorVersion
  let newPatch = patchVersion
  let newPrename = prename
  let newPreVersion = preVersion || 0
  switch (type) {
    case 'major':
      newMajor = parseInt(majorVersion) + 1
      newMinor = 0
      newPatch = 0
      newPreVersion = undefined
      break
    case 'minor':
      newMinor = parseInt(minorVersion) + 1
      newPatch = 0
      newPreVersion = undefined
      break
    case 'patch':
      newPatch = parseInt(patchVersion) + 1
      newPreVersion = undefined
      break
    case 'pre': // other prename like alpha beta rc hotfix
      newPreVersion = parseInt(newPreVersion) + 1
      break
  }
  let newTag = currentTag
  if (newPreVersion && newPrename) {
    newTag = `${verName}${newMajor}.${newMinor}.${newPatch}-${prename}.${newPreVersion}`
  } else {
    newTag = `${verName}${newMajor}.${newMinor}.${newPatch}`
  }
  return newTag
}

// test below
const a = gNewTag('pre', 'V1.4.3-cool.0')
console.log(' newTag is : ', a)

const addTag = (tag) => {
  execSync(`git tag ${tag}`)
}

const addAndPushTag = (tag) => {
  console.log('=====> start add tag and push tag')
  execSync(`git tag ${tag}`)
  execSync(`git push origin ${tag}`)
  console.log('=====> finish add tag and push tag')
}

module.exports = {
  gitTag,
  gitCommit,
  gNewTag,
  addTag,
  addAndPushTag,
}
