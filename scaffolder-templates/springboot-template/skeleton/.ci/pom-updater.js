/*

Used by standard-version to bump the versions in pom.xml
Source: https://github.com/conventional-changelog/standard-version/blob/bf35c9c0a93353b2f086cafc84efc6db6cd0afaa/lib/updaters/types/pom.js

*/

const { DOMParser, XMLSerializer } = require('xmldom')
function getDocAndVersionNode (contents) {
  const doc = new DOMParser().parseFromString(contents)
  const nodes = doc.documentElement.childNodes
  for (let i = 0; i < nodes.length; ++i) {
    const node = nodes[i]
    if (node.nodeName === 'version') return { doc, node }
  }
  return { doc }
}
module.exports.readVersion = function (contents) {
  const { node } = getDocAndVersionNode(contents)
  if (!node) {
    throw new Error('Failed to read the <version> tag in your pom file - is it present?')
  }
  const version = node.childNodes[0].data
  if (node.childNodes.length !== 1 || !version) {
    throw new Error('Expected <version> to contain a single string version')
  }
  return version
}
module.exports.writeVersion = function (contents, version) {
  const { doc, node } = getDocAndVersionNode(contents)
  node.childNodes[0].data = version
  return new XMLSerializer().serializeToString(doc)
}