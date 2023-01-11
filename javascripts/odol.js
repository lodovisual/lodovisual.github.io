if ('addEventListener' in document) {
   document.addEventListener('DOMContentLoaded', function() {
      //your code here...
      window.od = window.mo = window.o = Odol
   }, false);
}


var Odol = Object.create(Math)
Odol.__proto__.sine = Odol.sin
Odol.__proto__.tin = (input) => { return input }
Odol.__proto__.rnArray = (x, y) => Array.apply(null, {
      length: x
   })
   .map(x => Math.random() * (y || 1));
Odol.__proto__.rnAsrc = () => [src(s0), src(s1), src(s2)].at(Math.random() * 3);
Odol.__proto__.rnAfft = (x, y) => (y || 1) * a.fft.at(x || (time % (a.fft.length +1)));
Odol.__proto__.rnAbin = (x, y) => (y || 1) * a.bins.at(x || (time % (a.bins.length +1)));
Odol.__proto__.rnAfftPulsed = (i, t, j, k, l, r) => {
   let z
   let x = Odol.rnAfft(i) * rnArray(1, j || 1000)[0] * (t || 1/60) * (k || 1000) * time 

   let o = (t || 1/60) * time
   let p = Math.log(Math.cos(o))
    let y = p * (r || 100)
//    Math.abs(y) > 1 ? z = x * (l||1000) : z = 0
    Math.abs(y) > 1 ? z = x * (100) : z = 0
//   console.log(z, x, o, p)
   return z
}
Odol.__proto__.rnAbinPulsed = (i, t, j, k, l, r) => {
   let z
   let x = Odol.rnAbin(i) * rnArray(1, j || 1000)[0] * (t || 1/60) * (k || 1000) * time 

   let o = (t || 1/60) * time
   let p = Math.log(Math.cos(o))
    let y = p * (r || 100)
//    Math.abs(y) > 1 ? z = x * (l||1000) : z = 0
    Math.abs(y) > 1 ? z = x * (100) : z = 0
//   console.log(z, x, o, p)
   return z
}
Odol.__proto__.sinecos = (a,b, a1, b1, a2, b2) => {
   return ((a1 || 1) / (Odol.sine(a) * (a2||1))) * ((b1 || 1) / (Odol.cos(b) *(b2||1)))
}

Odol.__proto__.sinecosp = (a,b, a1, b1, a2, b2) => {
   return ((a1 || 1) / (Odol.sine(a) * (a2||1))) + ((b1 || 1) / (Odol.cos(b) *(b2||1)))
}

Odol.__proto__.branch = (s, a, b, a1, b1) => {
   return s
   .add(
      a,
      a1,
   )
   .add(
      b,
      b1 || a1
   )
}

Odol.__proto__.brtime = (s, options) => {
   var options = options || {}


   let trlength = s.transforms.length
   // let trlms = trlength * 1000

   // let trlms = trlength / 1000
   let trlms = trlength * 10

   // options.a1 = (time % trlms) < options.ar1 ? 

   let timeslot = options.a1timeslot || (time % trlms)
   switch(options.a1mode) {
      case 'hp' :
         options.a1tfilter = timeslot > options.a1hp ? options.a1mixin : options.a1mixout
         break;
      case 'lp' :
         options.a1tfilter = timeslot < options.a1lp ? options.a1mixin : options.a1mixout
         break;
      case 'rg' :
         options.a1tfilter = timeslot > optionsa1r1 && timeslot < optionsa1r2 ? options.a1mixin : options.a1mixout
         break;
      default :
         let t1s = s.transforms.length ? s.transforms.length - 1 : 0
         let t1slotin = timeslot * ( t1s /1000)
         let t1slotup = timeslot * ((t1s + 1) / 1000)
         options.a1tfilter = timeslot > t1slotin && timeslot < t1slotup ? options.a1mixin : options.a1mixout
   }

   let trb

   if (options.a1tap) {
      trb = s.add(
         options.a,
         options.a1tfilter
      )
   } else if (options.a1off) {
      trb = s
   } else {
      trb = s.add(
         options.a,
         () => options.a1tfilter,
      )  
   }
    
   // options add.b
      // if (options.b) {
      //    trb.add(
      //       options.b,
      //       options.b1 || options.a1
      //    )
      // }

   return trb
}

Odol.__proto__.brtimed = (s, options) => {
   var options = options || {}


   let trlength = s.transforms.length
   // let trlms = trlength * 1000

   // let trlms = trlength / 1000
   let trlms = trlength * 10

   var op = options.op || 'add'

   let trb = Object.create(s)
   // options.a1 = (time % trlms) < options.ar1 ? 

   for( let seqIdx in options.seq) {
      let sequence = options.seq[seqIdx]
      op = sequence.op || op

      let timeslot = sequence.timeslot || (time % trlms)
      let tfilter
      switch(sequence.mode) {
         case 'hp' :
            tfilter = timeslot > sequence.hp ? sequence.mixin : sequence.mixout
            break;
         case 'lp' :
            tfilter = timeslot < sequence.lp ? sequence.mixin : sequence.mixout
            break;
         case 'rg' :
            tfilter = timeslot > sequence.rstart && timeslot < sequence.rend ? sequence.mixin : sequence.mixout
            break;
         default :
            let t1s = s.transforms.length ? s.transforms.length - 1 : 0
            let t1slotin = timeslot * ( t1s /1000)
            let t1slotup = timeslot * ((t1s + 1) / 1000)
            tfilter = timeslot > t1slotin && timeslot < t1slotup ? sequence.mixin : sequence.mixout
      }


      sequence.tfilter = tfilter

      var trnext
      if (typeof sequence.tap !== 'undefined')
        trnext = typeof sequence.off !== 'undefined' ? 'off' : 'tap'

      if (typeof sequence.off !== 'undefined')
        trnext = 'off'
        // trnext = typeof trnext == 'undefined' ? 'off' : 'off'

      switch(trnext) {
        case 'tap':
          if (sequence.tap instanceof Function ? sequence.tap() : sequence.tap) {
            trb = trb[op](sequence.src, tfilter)
          }
          break
        case 'off':
          if (sequence.off instanceof Function ? sequence.off() : sequence.off) {
            trb = trb
          }
          break
        // default:
        //   trb = trb[op](sequence.src, () => tfilter)
        //   break
      }

      // if (sequence.tap instanceof Function ? sequence.tap() : sequence.tap) {
      //    trb = trb[op](
      //       sequence.src,
      //       tfilter
      //    )
      // } 
      // if (sequence.off instanceof Function ? sequence.off() : sequence.off) {
      //    // trb = s
      //    trb = trb
      // } else {
      //    trb = trb[op](
      //       sequence.src,
      //       () => tfilter,
      //    )  
      // }
   
   } 
   // options add.b
      // if (options.b) {
      //    trb.add(
      //       options.b,
      //       options.b1 || options.a1
      //    )
      // }

   return trb
}


Odol.__proto__.iftime = (op, s, options) => {
   var options = options || {}
   var trb = Object.create(s)
   var trif = s

   if (options.on) {
      trif = trb[op].apply(s, options.do)
   }

   return trif
}


Odol.__proto__.iftimed = (op, options) => {
   var options = options || {}
   var trb = Object.create(options.from)
   var trif = options.from
   if (options.on) {
      trif = trb[op].apply(options.from, options.with)
   }

   return trif
}

Odol.__proto__.ksdef = (ks, val) => {
  Odol.kmap.ks = Odol.kmap.ks || {}
  var ksdef = Odol.kmap.ks
  var plen = ks.split('.')
  var ksval
  plen.forEach((p, ilen) => {
    // console.log('ksdef', ksdef)
    ksdef[p] = ksdef[p] || {}
    ksdef = ksdef[p]
    // console.log(ilen, 'p', p, plen.length)
    if (ilen == plen.length - 2) {
      ksdef[plen[ilen+1]] = ksdef[plen[ilen+1]] || val || 1
      ksval = ksdef[plen[ilen+1]]
      // ksdef[p] = ksdef[p] || val || 1
      // ksval = ksdef[p]
    }
  })
  return ksval
}

Odol.__proto__.ksput = (ks, pin, val) => {
  return Odol.ksdef(ks+'.ext.'+pin, val)
}

Odol.__proto__.setk = (idx, ktype) => {
  let cset =  'abcdefghijklmnopqrstuvwxyz'.split('')
  Odol.kmap.ks = Odol.kmap.ks || {}
  let ks = Odol.kmap.ks
  let klength = Object.keys(ks).length
  let kname = ''
  let setdefkmap = true
  if (typeof idx == 'string') {
    kname = idx
    setdefkmap = typeof Odol.kmap.ks[kname] == 'undefined' ? true : false
  } else {
    if (klength > idx) {
      klength = idx
      setdefkmap = false
    }

    // let kname = ''
    let kcycle = Math.round(klength / cset.length)
    if (kcycle  == 0) {
      kname = cset[klength]
    } else {
      for (var i = 0; i < (kcycle); i++) {
        kname += 'a'
      }
      kname += cset[klength % cset.length]
    }
  }

  if (setdefkmap) {
    Odol.kmap.ks[kname] = Object.assign({}, Odol.kmap.ks[kname])
    let defkmap
    switch(ktype) {
      default:
        defkmap = Object.assign({}, {
          label: kname,
          op: 'add',
          brtslot: time % 4,
          // mode: 'hp',
          mixin: 2/3,
          mixout: 7/10,
          brtap: true,
          broff: false,
          set: true,
          off: false,
          with: []
        })
    }

    Odol.kmap.ks[kname] = Object.assign({}, defkmap, Odol.kmap.ks[kname])
  }
  return kname
}

Odol.__proto__.brt = function(opt) {
  let self = this
  // self.immut ? self : self = Object.create(this)
  // console.log('immut', self.immut)
  if (!self.immut) {
    self = Object.create(this)
    self.immut = []
  }
  let currpos = self.immut.length
  self.immut.push({args: arguments, pos: currpos})
  // console.log('op', op, 'opt', opt, 'immut', self.immut)


  var trb
  var opt = opt || {}  
  let optof
  // var trb = Object.create(opt.of)
  if (opt.of) {
    optof = opt.of
    trb = Object.create(opt.of)
  } else {
    for (var i = currpos -1; i >= 0; i--) {
      if (self.immut[i].res) {
        optof = self.immut[i].res
        break;
      }
    }
    trb = Object.create(optof)
  }




  // let trlength = s.transforms.length
  let trlength = opt.trlength || trb.transforms.length
  // let trlms = trlength * 1000

  // let trlms = trlength / 1000
  let trlms = trlength * 10

  // var op = opt.op || 'add'

  // let trb = Object.create(s)

  Odol.kmap.ks = Odol.kmap.ks || {}
  let ks = Odol.kmap.ks
  let op
  for( let seqIdx in opt.seq) {
    let kbox
    // let kname = opt.k
    let kname = seqIdx
    let sequence = opt.seq[seqIdx]

    op = sequence.op || opt.op || 'add'

    if (kname && ks[kname]) {
      // kbox = Odol.kmap.ks[k]
      kbox = ks[kname]
      self.immut[currpos].kname = kname
    } else {
      if (!opt.k && self.immut.length) {
        // let optkname
        for (var i = currpos -1; i >= 0; i--) {
          if (self.immut[i].kname) {
            kname = self.immut[i].kname
            kbox = ks[kname]
            break;
          }

          if (self.immut[i].args && self.immut[i].args[1] && self.immut[i].args[1].k) {
            if (ks[self.immut[i].args[1].k]) {
              kname = self.immut[i].args[1].k
              kbox = ks[kname]
              break;
            }
          }
        }
      } 

      if (!kname || !kbox) {
        // let ksdfnamelength = self.immut.length == 1 ? 0 : Object.keys(ks).length
        let ksdfnamelength = seqIdx
        kname = Odol.setk(ksdfnamelength)
        if(Object.keys(ks).length && ksdfnamelength == 0) {
          console.warn('default reuse of kbox name', kname)
        }
        // kbox = Odol.kmap.ks[kname]
        kbox = ks[kname]
      }

      self.immut[currpos].kname = kname
    }

    if (sequence.kbox) {
      kbox = Object.assign({}, kbox, sequence.kbox)
      ks[kname]
    }




    // console.log(seqIdx, kbox)





    let timeslot = sequence.timeslot || (time % trlms)
    let tfilter

    let seqbox = Object.assign({}, kbox)
    let seqoverwrite = false
    let seqparams = ['mode', 'hp', 'lp', 'mixin', 'mixout', 'rstart', 'rend']
    seqparams.forEach(seqparam => {
      if (sequence[seqparam] && kbox[seqparam] != sequence[seqparam]) {
        seqbox[seqparam] = sequence[seqparam]
        seqoverwrite = true
      }
    })

    if (seqoverwrite)
      kbox = Object.assign({}, kbox, seqbox)

    switch(kbox.mode) {
       case 'hp' :
          tfilter = timeslot > kbox.hp ? kbox.mixin : kbox.mixout
          break;
       case 'lp' :
          tfilter = timeslot < kbox.lp ? kbox.mixin : kbox.mixout
          break;
       case 'rg' :
          tfilter = timeslot > kbox.rstart && timeslot < kbox.rend ? kbox.mixin : kbox.mixout
          break;
       default :
          // let t1s = s.transforms.length ? s.transforms.length - 1 : 0
          let t1s = trb.transforms.length ? trb.transforms.length - 1 : 0
          let t1slotin = timeslot * ( t1s /1000)
          let t1slotup = timeslot * ((t1s + 1) / 1000)
          tfilter = timeslot > t1slotin && timeslot < t1slotup ? kbox.mixin : kbox.mixout
    }


    // sequence.tfilter = tfilter
    kbox.tfilter = tfilter

    var trnext
    if (typeof kbox.set !== 'undefined' && (kbox.set instanceof Function ? kbox.set() : kbox.set))
      trnext = typeof kbox.off !== 'undefined' && (kbox.off instanceof Function ? kbox.off() : kbox.off)
       ? 'off' : 'set'

    if (typeof kbox.off !== 'undefined' && (kbox.off instanceof Function ? kbox.off() : kbox.off))
      trnext = 'off'
    // var trnext
    // if (typeof sequence.tap !== 'undefined')
    //   trnext = typeof sequence.off !== 'undefined' ? 'off' : 'tap'

    // if (typeof sequence.off !== 'undefined')
    //   trnext = 'off'
    //   // trnext = typeof trnext == 'undefined' ? 'off' : 'off'

    switch(trnext) {
      case 'set':
        if (kbox.set instanceof Function ? kbox.set() : kbox.set) {
          // trb = trb[op](sequence.src, tfilter)
          // self.immut[currpos].res = trb[op](sequence.src, tfilter)
          let seqsrc
          if (sequence.src.hasOwnProperty('immut') && sequence.src.immut instanceof Array) {
            seqsrc = sequence.src.immut[sequence.src.immut.length -1].res
            // seqsrc = sequence.src.immut.pop().res
          } else {
            // linemux.out(window['o'+lineidx])
            seqsrc = sequence.src
          }
          self.immut[currpos].res = trb[op](seqsrc, tfilter)
        }
        break
      case 'off':
        if (kbox.off instanceof Function ? kbox.off() : kbox.off) {
          // trb = trb
          self.immut[currpos].res = trb
        }
        break
      default:
        // trb = trb[op](sequence.src, () => tfilter)
        // self.immut[currpos].res = trb[op](sequence.src, tfilter)
        let seqsrc
        if (sequence.src.hasOwnProperty('immut') && sequence.src.immut instanceof Array) {
          seqsrc = sequence.src.immut[sequence.src.immut.length -1].res
          // seqsrc = sequence.src.immut.pop().res
        } else {
          // linemux.out(window['o'+lineidx])
          seqsrc = sequence.src
        }
        self.immut[currpos].res = trb[op](seqsrc, () => tfilter)
    }

    // console.warn(seqIdx, 'kbox', kbox, 'trnext', trnext, 'immut', self.immut)
  }

  return self

}






Odol.__proto__.ift = function(op, opt) {
  var self = this
  // self.immut ? self : self = Object.create(this)
  // console.log('immut', self.immut)
  if (!self.immut) {
    self = Object.create(this)
    self.immut = []
  }
  let currpos = self.immut.length
  self.immut.push({args: arguments, pos: currpos})
  // console.log('op', op, 'opt', opt, 'immut', self.immut)


  Odol.kmap.ks = Odol.kmap.ks || {}
  let ks = Odol.kmap.ks

  var trb
  var opt = opt || {}  
  let optof
  // var trb = Object.create(opt.of)
  if (opt.of) {
    optof = opt.of
    trb = Object.create(opt.of)
  } else {
    for (var i = currpos -1; i >= 0; i--) {
      if (self.immut[i].res) {
        optof = self.immut[i].res
        break;
      }
    }
    trb = Object.create(optof)
  }

  let kbox
  let kname = opt.k
  if (kname && ks[kname]) {
    // kbox = Odol.kmap.ks[k]
    kbox = ks[kname]
  } else {
    if (!opt.k && self.immut.length) {
      // let optkname
      for (var i = currpos -1; i >= 0; i--) {
        if (self.immut[i].kname) {
          kname = self.immut[i].kname
          kbox = ks[kname]
          break;
        }

        if (self.immut[i].args && self.immut[i].args[1] && self.immut[i].args[1].k) {
          if (ks[self.immut[i].args[1].k]) {
            kname = self.immut[i].args[1].k
            kbox = ks[kname]
            break;
          }
        }
      }
    } 

    if (!kname || !kbox) {
      let ksdfnamelength = opt.k ? opt.k : self.immut.length == 1 ? 0 : Object.keys(ks).length
      kname = Odol.setk(ksdfnamelength)
      if(Object.keys(ks).length && ksdfnamelength == 0) {
        console.warn('default reuse of kbox name', kname)
      }
      // kbox = Odol.kmap.ks[kname]
      kbox = ks[kname]
    }

    self.immut[currpos].kname = kname
  }

  if (opt.kbox) {
    kbox = Object.assign({}, kbox, opt.kbox)
    ks[kname]
  }

 


  // var trif = opt.of
  // if (opt.on) {
  //   trif = trb[op].apply(opt.of, opt.with)
  // }

  // return trif


  
  // self.immut[currpos].res = `op${op}:${opt}`
  // self.immut[currpos].res = trb[op].apply(opt.of, opt.with)


  kbox.pos = kbox.pos || {}
  kbox.pos[currpos] = kbox.pos[currpos] || {pos: currpos, op: op, set: true, off: false, with: [1], upwith: 0}
  // kbox.pos[currpos].op = op
  if (kbox.pos[currpos].op != op) {
    kbox.pos[currpos].upwith = 0
    kbox.pos[currpos].op = op
  }

  if (opt.upwith && kbox.pos[currpos].upwith < opt.upwith && opt.with) {
    kbox.pos[currpos].with = opt.with
    kbox.pos[currpos].upwith = opt.upwith
  }

  if (opt.with && opt.with != kbox.pos[currpos].with && !kbox.pos[currpos].upsert) {
    kbox.pos[currpos].with = opt.with
    kbox.pos[currpos].upsert = true
  }

  // let onoff = kbox.pos[currpos].set ? kbox.pos[currpos].off ?  : false

  let onoff
  if (typeof kbox.pos[currpos].set != 'undefined')
    onoff = (kbox.pos[currpos].set instanceof Function ? kbox.pos[currpos].set() : kbox.pos[currpos].set)

  if (typeof kbox.pos[currpos].off != 'undefined')
    onoff = (kbox.pos[currpos].off instanceof Function ? kbox.pos[currpos].off() : kbox.off) ? false 
  : (kbox.pos[currpos].set instanceof Function ? kbox.pos[currpos].set() : kbox.pos[currpos].set)

  if (onoff) {
    // self.immut[currpos].res = trb[op].apply(opt.of, kbox.pos && kbox.pos[currpos] ? kbox.pos[currpos] : kbox.with)
    // self.immut[currpos].res = trb[op].apply(optof, kbox.pos && kbox.pos[currpos] ? kbox.pos[currpos] : kbox.with)
    // ['blend', 'modulate', '']
    // if (op == 'blend') {
      // self.immut[currpos].res = trb[op]([kbox.pos[currpos].with])
      // self.immut[currpos].res = trb.blend(src(o0), 1/2)
      let trbwith = [kbox.pos[currpos].with]
      if (typeof kbox.pos[currpos].with == 'string') {
        // self.immut[currpos].res = trb[op].apply(trb, )
        trbwith = eval(kbox.pos[currpos].with)
      }

      let isSrcModulated = ['blend', 'modulate'].indexOf(op) >= 0
      // if (kbox.pos[currpos].with instanceof Array && kbox.pos[currpos].with.length > 1) {
      if(isSrcModulated && (trbwith.flat().length < 2 || typeof kbox.pos[currpos].with != 'string')) {
      //   // self.immut[currpos].res = trb[op].apply(trb, ...[kbox.pos[currpos].with])  
      //   // self.immut[currpos].res = trb[op].apply(optof, ...trbwith)  
        // self.immut[currpos].res = trb[op].apply(optof, ...trbwith) 
         self.immut[currpos].res = trb[op].apply(optof, []) 
      } else {
        // self.immut[currpos].res = trb[op].apply(trb, [kbox.pos[currpos].with])
        self.immut[currpos].res = trb[op].apply(optof, trbwith)  
      }
      
    // } else {
    //   self.immut[currpos].res = trb[op].apply(optof, [kbox.pos[currpos].with])
    // }
    // self.immut[currpos].res = trb[op].apply(trb, [kbox.pos[currpos].with])
    // self.immut[currpos].res = trb[op].call(trb, [kbox.pos[currpos].with])
  } else {
    self.immut[currpos].res = trb
  }

  // self.immut.push({args: arguments, pos: currpos})
  // console.log('op', op, 'opt', opt, 'immut', self.immut)
  return self
}


Odol.__proto__.tsh = s=>{for(var i=0,h=9;i<s.length;)h=Math.imul(h^s.charCodeAt(i++),9**9);return h^h>>>9}

Odol.__proto__.ksh = () => { return Odol.tsh(JSON.stringify(Odol.kmap)) }

Odol.__proto__.kmap = {
  brAllOff: (onoff) => {
    Object.keys(Odol.kmap).forEach(k => {
      let c = Odol.kmap[k]
      if (typeof c.broff != 'undefined') {
        c.broff = typeof onoff != 'undefined' ? onoff : !c.broff
        // console.log('k', k, 'c', c)
      }
    })
  },

  brSet: (ks, opt) => {
    for (let k in ks) {
      let c = o.kmap[k] 
      if (typeof c != 'undefined') {
        for (let p in opt) {
          c[p] = opt[t]
        }
      }
    }
  },
  brAllSet: (opt) => {
    Object.keys(o.kmap).forEach(k => {
      let c = o.kmap[k]
      if (typeof c != 'undefined') {
        // c.broff = !c.broff
        // c.broff = true
        // c.mode = ''
        // c.mixin = 1
        // c.mixout = 1
        for (let p in opt) {
          c[p] = opt[p]
        }
        console.log('k', k, 'c', c)
      }
    })
  },

  pAll: (amt) => {
    Object.keys(Odol.kmap.p).forEach(k => {
      Odol.kmap.p[k] = amt
    })
  }
}


Odol.__proto__.kcalc = () => {
   let ksh = Odol.ksh()
   // prevhash = Odol.prevhash == undefined ? null : ksh
   let prevhash = Odol.prevhash
   // if (Odol.prevhash == undefined)

   let nkeys = true
   if (prevhash == ksh ) {
      nkeys = false
   } else {
      Odol.prevhash = ksh
   }

   return nkeys
}

Odol.__proto__.lset = (num, source) => {
    console.log('lset', num, typeof source(), source())
   Odol.lines[num] = () => { return source() }
}

Odol.__proto__.line = {}
Odol.__proto__.lines = {}

Odol.__proto__.linemux = {}
Odol.__proto__.itlines = {} 

Odol.__proto__.render = (mainline, ms) => {
   // var renderline = mainline || window['o0']
   let intervalms = ms || this.intervalms || 500
   let intervalts = this.intervalttlms || 10
   

   let renderloop = (intervalms) => {
      return setInterval(() => {
         let renderlines = false
         // var renderline = mainline || Odol.kmap.renderline == undefined ? || window['o0'] 
         let renderline
         if (mainline) {
            renderline = mainline
         } else {
            if (Odol.kmap.renderline != undefined) {
               renderline = Odol.kmap.renderline
            } else {
               renderline = Odol.kmap.renderline == undefined ? undefined : window['o0']
            }
         }

         let rlines = false
         for( let lineidx in Odol.lines) {
            let line = Odol.lines[lineidx]
            // line.out()
            if (rlines || Odol.kcalc()) {
               renderlines = true
               rlines = true
               Odol.linemux[lineidx] = line
               // Odol.linemux[lineidx]().out(window['o'+lineidx])
               let linemux = Odol.linemux[lineidx]()
               if (linemux.hasOwnProperty('immut') && linemux.immut instanceof Array) {
                linemux.immut[linemux.immut.length -1].res.out(window['o'+lineidx])
                // linemux.immut.pop().res.out(window['o'+lineidx])
               } else {
                linemux.out(window['o'+lineidx])
               }
            }
         }

         if (renderlines) {
          if (livecast 
            && livecast.livestreamMeta
            && livecast.livestreamMeta.signal == 'livecast') {

            console.log('odol render livestream', this)
            livecast.livecast({kmap: o.kmap})
          }

          if (mainline) {
             render(mainline)   
          } else if (renderline) {
             // render(renderline)
             render(window[renderline])
          } else {
             render()
          }
         }
      }, intervalms)
   }

   Odol.itlines = {
     intervalId: renderloop(intervalms),
     intervalms: intervalms 
   } 

   let rendercalc = () => {
      return setInterval(() => {
         let intervalms = Odol.intervalms
         if (intervalms != Odol.itlines.intervalms) {
            clearInterval(Odol.itlines.intervalId)
            Odol.itlines = {
               intervalId: renderloop(intervalms),
               intervalms: intervalms
            }
         }
      }, intervalts)
   }

   Odol.renderIntervalId = rendercalc()

   Odol.kmap.started = true
   Odol.kmap.status = 'started'
   Odol.kmap.startedAt = Date.now()
   if (mainline) {
      render(mainline)   
   } else {
      render()
   }
}


let processor = {
  isReady: false,
  stats: {},
  timerCallback: function() {
    // if (this.video.paused || this.video.ended) {
    //   return;
    // }
    // this.computeFrame();
    let self = this;
    // self.videoTimerCallback = setTimeout(function () {
    //   self.timerCallback();
    // }, 0);
    // let frameInterval = 12 * 1 * 6 
    // let frameInterval = 12
    let frameInterval = self.frameInterval || 6
    clearTimeout(self.videoTimerCallback)
    console.log(frameInterval, 'timerCallback', self.video, self.video.src)
    self.videoTimerCallback = setInterval(function () {
      self.computeFrame();
    }, frameInterval);



  },

  doLoad: function() {
    let self = this;
    // this.video = document.getElementById("vid");
    // this.video = this.media
    if (typeof self.c1 == 'undefined') {
      self.c1 = document.createElement('canvas')
      // self.c1.id = 'c1'
      self.ctx1 = self.c1.getContext('2d')
    }

    // this.c1 = document.getElementById("c1");
    // this.ctx1 = this.c1.getContext("2d");
    
    if (typeof self.c2 == 'undefined') {
      self.c2 = document.createElement('canvas')
      self.ctx2 = self.c2.getContext('2d')
    }

    // this.c2 = document.getElementById("c2");
    // this.ctx2 = this.c2.getContext("2d");
    self.c1.width = self.width
    self.c1.height = self.height


    // self.c1.width = self.video.videoWidth * 2;
    // self.c1.height = self.video.videoHeight * 2;


    self.c2.width = self.c1.width
    self.c2.height = self.c1.height

    // this.ctx2.src = grey.toDataURL()
    self.cimg = new Image()

    if (self.mtype == 'video') {
      self.videoEventBinder = self.videoEventListener
      .bind(Object.assign({}, {
        processorObject: self
      }))

      self.video.addEventListener("play", self.videoEventBinder)
    }

    if (self.mtype == 'image') {
      self.processFrame()
    }
  },

  setCanvas(options) {
    let self = this
    var options = options || {}
    self.c1.width = options.width || self.width
    self.c1.height = options.height || self.height


    // self.c1.width = self.video.videoWidth * 2;
    // self.c1.height = self.video.videoHeight * 2;


    self.c2.width = self.c1.width
    self.c2.height = self.c1.height

    // self.width = self.video.videoWidth / 2;
    // self.height = self.video.videoHeight / 2;

    // self.c1.width = self.video.videoWidth;
    // self.c1.height = self.video.videoHeight;


    // // self.c1.width = self.video.videoWidth * 2;
    // // self.c1.height = self.video.videoHeight * 2;


    // self.c2.width = self.c1.width
    // self.c2.height = self.c1.height
  },

  videoEventListener: function() {
    let self = this.processorObject
    self.c1.width = self.width
    self.c1.height = self.height


    // self.c1.width = self.video.videoWidth * 2;
    // self.c1.height = self.video.videoHeight * 2;


    self.c2.width = self.c1.width
    self.c2.height = self.c1.height

    // self.width = self.video.videoWidth / 2;
    // self.height = self.video.videoHeight / 2;

    // self.c1.width = self.video.videoWidth;
    // self.c1.height = self.video.videoHeight;


    // // self.c1.width = self.video.videoWidth * 2;
    // // self.c1.height = self.video.videoHeight * 2;


    // self.c2.width = self.c1.width
    // self.c2.height = self.c1.height
    if (self.videoTimerCallback == undefined)
      self.timerCallback();
    // }, false);
  },

  processFrame: function() {
    let self = this;
    self.ctx1.drawImage(self.media, 0, 0, self.width, self.height);
    // let frame = this.ctx1.getImageData(0, 0, this.width, this.height);
    //     let l = frame.data.length / 4;

    // for (let i = 0; i < l; i++) {
    //   let r = frame.data[i * 4 + 0];
    //   let g = frame.data[i * 4 + 1];
    //   let b = frame.data[i * 4 + 2];
    //   if (g > 100 && r > 100 && b < 43)
    //     frame.data[i * 4 + 3] = 0;
    // }
    // this.ctx2.putImageData(frame, 0, 0);

    if (self.signal.vmode != self.sigsend) {
      // self.signal.vmode = self.sigsend == 'raw' ? 'raw' : 'process'
      self.signal.src = self.sigsend == 'raw' ? self.c1 : self.signal.src
    }

    if (self.sigsend == 'raw')
      return

    // let image = IJS.Image.fromCanvas(this.c1)
    try {
      // var grey = image.grey();
      let cimg = IJS.Image.fromCanvas(this.c1)
      // let gimg = cimg.grey()
      // nimg.src = IJS.Image.fromCanvas(this.c1).grey().sobelFilter().toDataURL()
      // nimg.src = IJS.Image.fromCanvas(this.c1).grey().cannyEdge().toDataURL()
      // nimg.src = IJS.Image.fromCanvas(this.c1).grey().toDataURL()

      var options = options || {}
      // var trb = Object.create(gimg)
      // var trif = options.from

      let wmsg = {
        cmdtype: 'default', 
        cmd:'', 
        data: cimg.data, 
        width: cimg.width,
        height: cimg.height, 
        timeframe: self.syncer.timeframe
      }

      if (self.imgCalc && self.imgCalc instanceof Function) {
        // self.cimg.src = self.imgCalc(gimg)
        wmsg.cmd = 'function'
        wmsg.func = self.imgCalc.toString()
      } if (self.filtermode) {
        // self.cimg.src = gimg[self.filtermode]().toDataURL()
        // trbc = trb[self.filtermode].apply(trb, self.filterwith)
        // self.cimg.src = trbc.toDataURL()
        wmsg.cmd =  self.filtermode
        wmsg.options = self.filterwith
        // wmsg.data = cimg.data
      } else {
        // self.cimg.src = gimg.toDataURL()
        // self.cimg.src
        wmsg.cmd = 'grey'
        // wmsg.data = cimg.data
      }


      self.syncer.postSent = true
      self.syncer.postWait = true
      self.worker.postMessage(wmsg)

      // if (self.filtermode) {
      //   self.cimg.src = gimg[self.filtermode]().toDataURL()
      // } else {
      //   self.cimg.src = gimg.toDataURL()
      // }

      // this.ctx2.drawImage(self.cimg, 0, 0)
    } catch(err) {
      console.log('err', err)
    }

    if (self.signal.vmode != self.sigsend) {
      self.signal.vmode = self.sigsend == 'raw' ? 'raw' : 'process'
      // self.signal.src = self.sigsend == 'raw' ? self.c1 : self.c2  

      let sigswapTick =  self.stats ? (self.stats.drift || 1/100) * 1000 : 1/100
      setTimeout(() => {
        self.signal.src = self.sigsend == 'raw' ? self.c1 : self.c2  
      }, sigswapTick)          
    }
  },

  computeFrame: function() {

    let self = this
    self.syncer = self.syncer || {}
    // self.stats = self.stats || {}


    if (self.skipframe || self.cframeskip) {
      if (self.skipframe instanceof Function) {
        if (self.skipframe())
          return null
      }
      if (self.skipframe || self.cframeskip)
        return null
    }

    // if (Math.abs(self.syncer.drift) < 2.5 || !self.syncer.drift) {
    if (self.video.paused)
      return null

    if (Math.abs(self.syncer.drift) < 0.25 || !self.syncer.drift) {
      // if (!self.syncer.postSent && !self.syncer.postWait) {
      if (!self.syncer.postWait) {
        self.syncer.timeframe = self.video.currentTime * 1000
        self.syncer.timesent = Date.now()


        if (self.currentCueIdx)
          self.cproc(self.cues[self.currentCueIdx])

        self.ctx1.drawImage(self.video, 0, 0, self.width, self.height);
        // let frame = this.ctx1.getImageData(0, 0, this.width, this.height);
        //     let l = frame.data.length / 4;

        // for (let i = 0; i < l; i++) {
        //   let r = frame.data[i * 4 + 0];
        //   let g = frame.data[i * 4 + 1];
        //   let b = frame.data[i * 4 + 2];
        //   if (g > 100 && r > 100 && b < 43)
        //     frame.data[i * 4 + 3] = 0;
        // }
        // this.ctx2.putImageData(frame, 0, 0);

        if (self.signal.vmode != self.sigsend) {
          // self.signal.vmode = self.sigsend == 'raw' ? 'raw' : 'process'
          self.signal.src = self.sigsend == 'raw' ? self.c1 : self.signal.src


          if (window[self.signal.label] && window[self.signal.label].src != self.signal.src)
            window[self.signal.label].src = self.signal.src
        }

        if (self.isReady && self.signal && !self.signal.isReady) {
          self.signal.isReady = true
          self.signal.src = self.sigsend == 'raw' ? self.c1 : self.c2
          self.status = 'sig:in:s'

          if (self.sigsend == 'raw')
            self.signal.vmode = 'raw'

          if (window[self.signal.label] && !window[self.signal.label].src)
            window[self.signal.label].init({src: self.signal.src})
        }


        if (self.sigsend == 'raw') {
          self.signal.vmode = self.sigsend
          return null
        }


        // let image = IJS.Image.fromCanvas(this.c1)
        try {
          // var grey = image.grey();
          let cimg = IJS.Image.fromCanvas(this.c1)
          // let gimg = cimg.grey()
          // nimg.src = IJS.Image.fromCanvas(this.c1).grey().sobelFilter().toDataURL()
          // nimg.src = IJS.Image.fromCanvas(this.c1).grey().cannyEdge().toDataURL()
          // nimg.src = IJS.Image.fromCanvas(this.c1).grey().toDataURL()

          var options = options || {}
          // var trb = Object.create(gimg)
          // var trif = options.from

          let wmsg = {
            cmdtype: 'default', 
            cmd:'', 
            data: cimg.data, 
            width: cimg.width,
            height: cimg.height, 
            timeframe: self.syncer.timeframe
          }

          if (self.imgCalc && self.imgCalc instanceof Function) {
            // self.cimg.src = self.imgCalc(gimg)
            wmsg.cmd = 'function'
            wmsg.func = self.imgCalc.toString()
          } if (self.filtermode) {
            // self.cimg.src = gimg[self.filtermode]().toDataURL()
            // trbc = trb[self.filtermode].apply(trb, self.filterwith)
            // self.cimg.src = trbc.toDataURL()
            wmsg.cmd =  self.filtermode
            wmsg.options = self.filterwith
            // wmsg.data = cimg.data
          } else {
            // self.cimg.src = gimg.toDataURL()
            // self.cimg.src
            wmsg.cmd = 'grey'
            // wmsg.data = cimg.data
          }


          self.syncer.postSent = true
          self.syncer.postWait = true
          self.worker.postMessage(wmsg)

          // if (self.filtermode) {
          //   self.cimg.src = gimg[self.filtermode]().toDataURL()
          // } else {
          //   self.cimg.src = gimg.toDataURL()
          // }

          // this.ctx2.drawImage(self.cimg, 0, 0)
        } catch(err) {
          console.log('err', err)
        }

        if (self.signal.vmode != self.sigsend) {
          self.signal.vmode = self.sigsend == 'raw' ? 'raw' : 'process'
          // self.signal.src = self.sigsend == 'raw' ? self.c1 : self.c2  

          let sigswapTick =  self.stats ? (self.stats.drift || 1/100) * 1000 : 1/100
          setTimeout(() => {
            self.signal.src = self.sigsend == 'raw' ? self.c1 : self.c2  
            if (window[self.signal.label] && window[self.signal.label].src != self.signal.src)
              window[self.signal.label].src = self.signal.src
          }, sigswapTick)          
        }
      }
    } else {
      // self.syncer.drift = undefined

      if (Date.now() - self.syncer.timesent > 0.5 ) {
        self.syncer.drift = undefined 
        self.video.currentTime = self.syncer.timeframe / 1000
      }
    }
  
    return;
  },

  
  process(url) {
    // let image = await IJS.Image.load(url); 
    let image  
    let grey = image.grey();
    let result = grey.toDataURL();
    return result;
  },



  initVideo (url = '', options) {
    var options = options || {}
    // const self = this
    const vid = document.createElement('video')
    // let vid = document.getElementById('vid')
    vid.crossOrigin = 'anonymous'
    vid.autoplay = true
    vid.loop = true
    vid.muted = true // mute in order to load without user interaction
    
    let self = this;
    const onload = vid.addEventListener('loadeddata', () => {
      self.mtype = 'video'
      self.isReady = true
      console.warn('video charged', self.isReady)
      this.media = vid
      // this.src = vid
      vid.play()
      // this.tex = this.regl.texture({ data: this.src, ...params})
      // this.dynamic = true

      // self.width = self.video.videoWidth / 2;
      // self.height = self.video.videoHeight / 2;

      self.width = options.width || self.video.videoWidth;
      self.height = options.height || self.video.videoHeight;

      self.setCanvas({width: self.width, height: self.height})

      self.timerCallback();
    }, false);
    // })
    if (self.video) {
      self.video.pause()
      clearTimeout(self.videoTimerCallback)
      self.video.removeEventListener('play', self.videoEventBinder, false)
      self.isCharged = false
      delete self.video
    }
    delete self.video
    self.video = vid

    self.initWorker()
    self.doLoad()
    vid.src = url


    let hasfilter = options && options instanceof Object
    // self.filtermode = options.filtermode || hasfilter ? options.mode : ''
    if (typeof options == 'string') {
      self.filtermode = options 
    }

    if (hasfilter) {
      self.filtermode = options.filtermode ?  options.filtermode : options.mode || ''
      self.filterwith = options.filterwith || undefined
      self.filterwith = options.with || undefined
      self.skipframe = options.skipframe || undefined

      self.imgCalc = options.calc && options.calc instanceof Function ? options.calc : undefined 
      if (options.filter instanceof Function)
        self.imgCalc = options.filter
    }
  },


  initWorker() {
    let self = this
    const worker = new Worker('./javascripts/worker.js');

    worker.addEventListener('message', function(e) {
      // console.log('Worker said: ', e.data);


      if (e.data && e.data.status == 200) {

        self.syncer = self.syncer || {}
        self.syncer.drift = (Date.now() - self.syncer.timesent) / 1000

        let stats = {
          cmd: e.data.cmd, 
          fps: Math.ceil(1000/(Date.now() - self.syncer.timesent)),
          timeframe: self.syncer.timeframe,
          ctimeframe: self.video.currentTime,
          mtimeframe: self.syncer.timeframe, 
          drift: self.syncer.drift, 
          timesent: self.syncer.timesent, 
          timenow: Date.now()
        }
        // console.log(stats) 

        self.stats = stats

        setInterval(() => {
          if (self.tstats)
            console.log(self.stats)
        }, 1000)

        self.syncer.postSent = false
        self.syncer.postWait = false


        self.cimg.src = e.data.tcimg 
        self.ctx2.drawImage(self.cimg, 0, 0)
      }

    }, false);

    // worker.postMessage('Hello World'); 
    // Send data to our worker.
    self.worker = worker;
  },

  rmWorker() {
    if (self.worker)
      self.worker.terminate()
  },

  rstWorker() {
    self.rmWorker()
    self.initWorker()
  },

  sigset(options) {
    let self = this
    var options = options || {}
    if (typeof options.sig == 'undefined') {
      self.sigcfg(options)
    } else {
      switch(options.sig.constructor.name) {
        case 'String':
          self.sigcfg(options)
          break;
        case 'Object':
          for(let signame in options.sig) {
            let sigopts = Object.assign({}, options, {sig: signame, send: options.sig[signame]})
            self.sigcfg(sigopts)
          }
          break
        case 'Array':
          for(let sigidx in options.sig) {
            let sigmeta = options.sig[sigidx]
            let sigopts = Object.assign({}, options, {
              sig: Object.keys(sigmeta)[0], send: Object.values(sigmeta)[0]
            })

            self.sigcfg(sigopts)
          }
          break
      }
    }
  },

  sigcfg(options) {
    let self = this
    var options = options || {}


    self.sigsend = 'process'
    let view = 'process'
    if (options.send) {
      view = options.send == 'raw' ? self.c1 : self.c2
      // self.sigsend = options.send == 'raw' ? 'raw' : 'process'
      self.sigsend = options.send
    }


    let mo
    if (options.sig) {
      mo = typeof options.sig == 'string' 
      ? options.sig[0] == 's' ? window[options.sig] : self.ml[options.sig]
      : options.sig

      if (typeof self.ml[mo.label] != 'undefined') {
        console.warn('todo: ml object overwrite')
      }
      self.ml[mo.label] = mo

      // /reset sig
      // mo.clear()
    } else {
      mo = self.signew(options)
    }

    mo.dynamic = true
    mo.init({src: view})
    mo.vmode = self.sigsend
  
  },

  signew(options) {
    let self = this
    var options = options || {}

    let sigSource = options.sigSource || s0
    let sigDefault = {
      regl: sigSource.regl,
      pb: sigSource.pb,
      width: sigSource.width,
      height: sigSource.height,
    }


    var params = Object.assign({}, sigDefault, options)
    params.label = `m${Object.values(self.ml).length + 1}`
    

    let mo = new s0.constructor(params)
    self.ml[mo.label] = mo

    return mo
  },

  ml: {},
  mlinfos: {},

  lset(signal, options) {
    let self = this
    var options = options || {}
    self.initVideo(options.url, options)
    self.signal = typeof signal == 'string' ? window[signal] : signal


    // self.signal.clear()
    self.sigsend = 'process'

    let view = self.c2
    if (options.send) {
      view = options.send == 'raw' ? self.c1 : self.c2
      self.sigsend = options.send == 'raw' ? 'raw' : 'process'
    }

    if (self.isReady) {
      self.signal.init({src: view})
      self.signal.vmode = self.sigsend
    } else {
      self.status = 'sig:in:w'
    }
  },


  cset(options) {
    let self = this
    self.cues = self.cues || {}
    // var options = options || {}
    var cueDefaultOptions = {
      intervalms: 500,
      looped: 0,
      back: 5,
      forth: 5,
      backOptions: {
        beat: 3,
        ebeat: 1,
      },
      forthOptions: {
        beat: 3,
        ebeat: 0
      }
    }

    var options = Object.assign({}, cueDefaultOptions, options)
    if (!options.index) {
      options.index = Object.values(self.cues).length + 1
    } 

    if (Object.values(self.cues).length) {
      // if(options.overdub) {
      if (options.index && self.cues[options.index]) {
        clearInterval(self.cues[options.index].intervalId)
      }
    }




    self.cues[options.index] = options
    // self.clooped = options.cloop || 0 
    // self.clooplimit = options.clooplimit || 10
    // if (self.cueLoopInterval) {
    //   if (!options.overdub) {
    //     self.cue
    //   } else {
    //     clearInterval(self.cueLoopInterval)
    //   }
    // }
    // let cue = self.cues[options.index]

  },

  cplay(options) {
    let self = this
    var options = options || {}
    
    let cue
    if (options.index) {
      cue = self.cues[options.index]
    } else if (Object.values(self.cues).length) {
      cue = self.cues[1];
    } else {
      self.video.play()
      return
    }

    self.currentCueIdx = self.currentCueIdx || cue.index

    clearInterval(self.cues[self.currentCueIdx].intervalId)

    // cue.intervalId = setInterval(() => {
    //    self.cproc(cue)
    // }, cue.intervalms)

    self.currentCueIdx = cue.index
  },

  cproc(cue) {
    let self = this
    // console.log('k rl', kt)
    if (cue.looplimit && cue.looped > cue.looplimit) {
    // clearInterval(kl)
      clearInterval(cue.intervalId)
    } else {
      //if (processor.video.currentTime > ks) {
      // let vnt
      // let vct =  processor.video.currentTime 
      // switch((kt %3)) {
      //        case 0: vnt = vct; break
      //        case 1: vnt = vct - 6; break
      //        case 2: vnt = vct + 10; break
      // }
      // processor.video.currentTime = vnt
      
      if (cue.method && cue.method instanceof Function) {
        cue.method({
          processor: self,
          cue: cue,
          videoCallTime: self.video.currentTime 
        })
      } else if (cue.skipStart && cue.skipEnd) {
        if (self.video.currentTime > cue.skipStart)
          self.video.currentTime = cue.skipEnd
      } else if (cue.startAt || cue.endAt) {
        if (cue.startAt && self.video.currentTime < cue.startAt) {
          self.video.currentTime = cue.startAt
        }

        if (self.endAt && self.video.currentTime > cue.endAt) {
          self.video.currentTime = cue.startAt ? cue.startAt : 0
        }
      } else {
        self.video.currentTime += (cue.looped % cue.backOptions.beat) 
        == cue.backOptions.ebeat ? cue.back : 0
        self.video.currentTime -= (cue.looped % cue.forthOptions.beat)
        == cue.forthOptions.ebeat ? cue.forth : 0
      }

      cue.looped += 1
    }
  },

  csend(options) {
    let self = this;
    if (!self.mtype == 'video' || options && !options.ctype)
      return

    let csendDefaults = {
      forth: 5,
      back: 5
    }

    switch(options.ctype) {
      case 'play':
        self.video.play()
        break
      case 'stop':
        self.video.pause()
        break
      case 'pause':
        self.video.pause()
        break
      case 'resume':
        self.video.play()
        break
      case 'pp':
      case 'resumepause':
        self.video.paused ? self.video.play() : self.video.pause()
        break
      case 'forward':
        self.video.currentTime += options.forth ? options.forth : csendDefaults.forth
        break
      case 'back':
        self.video.currentTime -= options.back ? options.back : csendDefaults.back
        break
      case 'cframeskip':
        self.cframeskip = true
        break
      case 'cframeunskip':
        self.cframeskip = false
        break
    }
  },

  iset(options) {
    this.mset(Object.assign({mtype: 'image'}, options))
  },

  vset(options) {
    this.mset(Object.assign({mtype: 'video'}, options))
  },

  mset(options) {
    let self = this;
    var options = options || {}
    // const self = this
    switch(options.mtype) {
      case 'video':
        self.initvid(options)
        break

      case 'img':
        self.initimg(options)
        break
    }


    let hasfilter = options && options instanceof Object
    // self.filtermode = options.filtermode || hasfilter ? options.mode : ''
    if (typeof options == 'string') {
      self.filtermode = options 
    }

    if (hasfilter) {
      self.filtermode = options.filtermode ?  options.filtermode : options.mode || ''
      self.filterwith = options.filterwith || undefined
      self.filterwith = options.with || undefined
      self.skipframe = options.skipframe || undefined

      self.imgCalc = options.calc && options.calc instanceof Function ? options.calc : undefined 
      if (options.filter instanceof Function)
        self.imgCalc = options.filter
    }
  },

  initimg(options) {
    const img = document.createElement('img')
    img.crossOrigin = 'anonymous'
    img.src = url
    img.onload = () => {
      self.isReady = true
      // this.src = img
      this.dynamic = false

      self.media = img

      // self.width = options.width || self.video.videoWidth;
      // self.height = options.height || self.video.videoHeight;

      self.setCanvas({width: self.width, height: self.height})

    }

    self.initWorker()
    self.doLoad()
  },


  initvid(options) {
    let self = this
    const vid = document.createElement('video')
    // let vid = document.getElementById('vid')
    vid.crossOrigin = 'anonymous'
    vid.autoplay = true
    vid.loop = true
    vid.muted = true // mute in order to load without user interaction
    
    const onload = vid.addEventListener('loadeddata', () => {
      self.mtype = 'video'
      self.isReady = true
      console.warn('video charged', self.isReady)

      this.media = vid
      // this.src = vid
      vid.play()
      // this.tex = this.regl.texture({ data: this.src, ...params})
      // this.dynamic = true

      // self.width = self.video.videoWidth / 2;
      // self.height = self.video.videoHeight / 2;

      self.width = options.width || self.video.videoWidth;
      self.height = options.height || self.video.videoHeight;

      self.setCanvas({width: self.width, height: self.height})
      self.timerCallback();
    }, false);
    // })
    if (self.video) {
      self.video.pause()
      clearTimeout(self.videoTimerCallback)
      self.video.removeEventListener('play', self.videoEventBinder, false)
      self.isReady = false
      delete self.video
    }
    delete self.video
    this.video = vid

    self.initWorker()
    self.doLoad()
    vid.src = options.url
  }


};

// processor.initVideo('https://vod-progressive.akamaized.net/exp=1659576169~acl=%2Fvimeo-prod-skyfire-std-us%2F01%2F1496%2F15%2F382483821%2F1605408423.mp4~hmac=dfb4aaf3e65acdeb34ed2d38140cd047c69423288c13397d387fa4edb8ad58a6/vimeo-prod-skyfire-std-us/01/1496/15/382483821/1605408423.mp4') 

