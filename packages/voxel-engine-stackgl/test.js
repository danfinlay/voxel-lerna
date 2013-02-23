var test = require('tape')
var createEngine = require('./')
var gameOptions = { generate: function(x, y, z) { if (y === 1) return 1; return 0; } }

// # helper fucntions

function gameTest(fn) {
  test(fn.name, function (t) {
    t.plan(1)
    var game = createEngine(gameOptions)
    fn(game, t)
    game.destroy()
  })
}

function dummyItem(THREE) {
  var geometry = new THREE.SphereGeometry( 5, 10, 10 )
  var material = new THREE.MeshPhongMaterial( { color: 0xffffff, shading: THREE.FlatShading } )
  var mesh = new THREE.Mesh( geometry, material )
  return mesh
}

// # Tests

test('create, destroy', function (t) {
  t.plan(1)
  var game = createEngine(gameOptions)
  t.equal(!!game, true)
  game.destroy()
})

gameTest(function addItem(game, t) {
  var item = { tick: function(){} }
  game.addItem(item)
  t.equal(game.items.length, 1)
})

gameTest(function removeItem(game, t) {
  var item = { tick: function(){} }
  game.addItem(item)
  game.removeItem(item)
  t.equal(game.items.length, 0)
})

gameTest(function getBlock(game, t) {
  t.equal(game.getBlock({ x: 50, y: 50, z: 50}), 0)
})

gameTest(function setBlock(game, t) {
  game.setBlock({ x: 50, y: 50, z: 50}, 1)
  t.equal(game.getBlock({ x: 50, y: 50, z: 50}), 1)
})

gameTest(function createBlock(game, t) {
  var pos = new game.THREE.Vector3(50, 50, 50)
  var inTheWay = { mesh: dummyItem(game.THREE), size: 5, blocksCreation: true }
  inTheWay.mesh.position.copy(pos)
  game.addItem(inTheWay)
  t.equal(!!game.createBlock(pos), false)
})

gameTest(function blocksCreation(game, t) {
  var pos = new game.THREE.Vector3(50, 50, 50)
  var inTheWay = { mesh: dummyItem(game.THREE), size: 5, blocksCreation: false }
  inTheWay.mesh.position.copy(pos)
  game.addItem(inTheWay)
  t.equal(game.createBlock(pos), true)
})

gameTest(function raycastVoxels(game, t) {
  var pos = new game.THREE.Vector3(50, 50, 50)
  game.setBlock(pos, 1)
  var start = new game.THREE.Vector3(50.5, 50.5, 50.5)
  var direction = new game.THREE.Vector3(0, -1, 0)
  var hit = game.raycast(start, direction, 10)
  t.equal(!!hit, true)
})

gameTest(function raycastVoxelsMiss(game, t) {
  var pos = new game.THREE.Vector3(50, 50, 50)
  game.setBlock(pos, 0)
  var start = new game.THREE.Vector3(50.5, 50.5, 50.5)
  var direction = new game.THREE.Vector3(0, -1, 0)
  var hit = game.raycast(start, direction, 10)
  t.equal(!!hit, false)
})

test('gravity', function gravity(t) {
  t.plan(2)
  var game = createEngine(gameOptions)
  var item = dummyItem(game.THREE)
  var physical = game.makePhysical(item)
  physical.subjectTo(game.gravity)
  item.position.set(0, 2.5, 0)
  physical.mesh = item
  game.addItem(physical)
  setTimeout(function() {
    // should have fallen due to gravity
    t.notEqual(item.position.y, 2.5)
  }, 150)
  setTimeout(function() {
    // show now be resting on top of the voxel at position 1
    t.equal(item.position.y, 2)
    game.destroy()
  }, 300)
})
