module.exports.meshers = {
  culled: require('./meshers/culled').mesher,
  greedy: require('./meshers/greedy').mesher,
  monotone: require('./meshers/monotone').mesher,
  stupid: require('./meshers/stupid').mesher
}

module.exports.geometry = {}
module.exports.generate = generate

// from https://github.com/mikolalysenko/mikolalysenko.github.com/blob/master/MinecraftMeshes2/js/testdata.js#L4
function generate(l, h, f) {
  var d = [ h[0]-l[0], h[1]-l[1], h[2]-l[2] ]
    , v = new Int32Array(d[0]*d[1]*d[2])
    , n = 0;
  for(var k=l[2]; k<h[2]; ++k)
  for(var j=l[1]; j<h[1]; ++j)
  for(var i=l[0]; i<h[0]; ++i, ++n) {
    v[n] = f(i,j,k);
  }
  return {voxels:v, dims:d};
}

var colorTab = [
  0xff0000,
  0x00ff00,
  0x0000ff,
  0xff00ff,
  0xffff00,
  0x00ffff,
  0x000001,
  0xffffff
];

for(var i=1,c=0; i<=16; i<<=1,++c) {
  module.exports.geometry[i + 'x' + i + 'x' + i] = generate([0,0,0], [i,i,i], function() { return colorTab[c]; });
}

module.exports.geometry['Sphere'] = generate([-16,-16,-16], [16,16,16], function(i,j,k) {
  return i*i+j*j+k*k <= 16*16 ? 0x113344 : 0;
});

module.exports.geometry['I-Shape'] = generate([0,-1,-1], [1,2,2], function(i,j,k) {
  if((j === -1 && k === 0) ||
     (j ===  1 && k === 0) ) {
    return 0;   
  }
  return 1;
});

module.exports.geometry['Tiny Button'] = generate([-1,-1,-1],[1,2,2], function(i,j,k) {
  if(i === 0) {
    return (j === 0 && k === 0) ? 0xff0000 : 0;
  }
  return 1;
});


module.exports.geometry['Noise'] = generate([0,0,0], [16,16,16], function(i,j,k) {
  return Math.random() < 0.1 ? Math.random() * 0xffffff : 0;
});

module.exports.geometry['Dense Noise'] = generate([0,0,0], [16,16,16], function(i,j,k) {
  return Math.round(Math.random() * 0xffffff);
});

module.exports.geometry['16 Color Noise'] = generate([0,0,0], [16,16,16], function(i,j,k) {
  return Math.random() < 0.1 ? colorTab[Math.floor(Math.random() * colorTab.length)] : 0;
});

module.exports.geometry['Hole'] = generate([0,0,0], [16,16,1], function(i,j,k) {
  return Math.abs(i-7) > 3 || Math.abs(j-7) > 3 ? 1 : 0;
});

module.exports.geometry['Boss'] = generate([0,0,0], [16,16,4], function(i,j,k) {
  if(k === 0) {
    return 0x0000ff;
  } else if(Math.abs(i-4) < 2 && Math.abs(j-5) < 2 && k< 2) {
    return 0x00ff00;
  } else if(10 <= i && i < 14 && 2 <= j && j < 15) {
    return 0xff0000;
  }
  return 0;
});

module.exports.geometry['T-Shape'] = generate([0,0,0], [16,16,3], function(i,j,k) {
  return (( 6 <= i && i < 10 && 2 <= j && j < 13) ||
    ( 2 <= i && i < 14 && 8 <= j && j < 13)) ? 0xcc00dd : 0;
});

module.exports.geometry['HollowCube'] = generate([0,0,0], [16,16,16], function(i,j,k) {
  if(i < 1) {
    return 0xff0000;
  } else if(i >= 15) {
    return 0x00ffff;
  } else if(j < 1) {
    return 0x00ff00;
  } else if(j >= 15) {
    return 0xff00ff;
  } else if(k < 1) {
    return 0x0000ff;
  } else if(k >= 15) {
    return 0xffff00;
  } else {
    return 0;
  }
});


module.exports.geometry['Clover'] = generate([0,0,0], [17,17,1], function(i,j,k) {
  if(i == 0 && Math.abs(j-8) <= 2) {
    return 0;
  } else if(i == 16 && Math.abs(j-8) <= 2) {
    return 0;
  } else if(j == 0 && Math.abs(i-8) <= 2) {
    return 0;
  } else if(j == 16 && Math.abs(i-8) <= 2) {
    return 0;
  } else {
    return 0x10de60;
  }
});

module.exports.geometry['Triangle'] = generate([0,0,0], [17,17,1], function(i,j,k) {
  return (i < j) ? 0xff00ff : 0;
});


module.exports.geometry['Saw'] = generate([0,0,0], [17,3,1], function(i,j,k) {
  if( j > 0 || !!(i & 1) ) {
    return 0x00ffff;
  }
  return 0;
});

module.exports.geometry['4Dots']  = generate([0,0,0], [7,7,1], function(i,j,k) {
  if( (i == 2 && j == 1) ||
      (i == 5 && j == 2) ||
      (i == 1 && j == 4) ||
      (i == 4 && j == 5) ) {
    return 0x00ff;    
  }
  return 0xeedd00;
});

module.exports.geometry['Checker'] = generate([0,0,0], [8,8,8], function(i,j,k) {
  return !!((i+j+k)&1) ? (((i^j^k)&2) ? 1 : 0xffffff) : 0;
});


module.exports.geometry["Matt's Example"]  = generate([0,0,0], [4,5,1], function(i,j,k) {
  if( (i == 1 && j == 1) ||
      (i == 2 && j == 3) ) {
    return 0xee5533;
  }
  return 0x128844;
});

module.exports.geometry['Hill'] = generate([-16, 0, -16], [16,16,16], function(i,j,k) {
  return j <= 16 * Math.exp(-(i*i + k*k) / 64) ? 0x118822 : 0;
});

module.exports.geometry['Valley'] = generate([0,0,0], [32,32,32], function(i,j,k) {
  return j <= (i*i + k*k) * 31 / (32*32*2) + 1 ? 0x118822 : 0;
});

module.exports.geometry['Hilly Terrain'] = generate([0, 0, 0], [32,32,32], function(i,j,k) {
  var h0 = 3.0 * Math.sin(Math.PI * i / 12.0 - Math.PI * k * 0.1) + 27;    
  if(j > h0+1) {
    return 0;
  }
  if(h0 <= j) {
    return 0x23dd31;
  }
  var h1 = 2.0 * Math.sin(Math.PI * i * 0.25 - Math.PI * k * 0.3) + 20;
  if(h1 <= j) {
    return 0x964B00;
  }
  if(2 < j) {
    return Math.random() < 0.1 ? 0x222222 : 0xaaaaaa;
  }
  return 0xff0000;
});

module.exports.geometry['Empty'] = { voxels : [], dims : [0,0,0] };