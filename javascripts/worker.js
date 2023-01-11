importScripts('./image.js')

<!--WebWorkers file called worker.js-->
self.addEventListener('message', function(e) {
  self.postMessage(e.data);


  let res = Object.assign({}, e.data)
  delete res.data

  res.status = '200'
  let rimg
  if (e.data) {

    rimg = new IJS.Image({
      width: e.data.width, 
      height: e.data.height, 
      data: e.data.data
    })

    switch(e.data.cmdtype) {
      case 'default' :
        switch (e.data.cmd) {
          case 'cannyEdge':
          case 'sobelFilter':
          case 'scharrFilter':
            let gimg = rimg.grey()
            res.tcimg = gimg[e.data.cmd].apply(gimg, e.data.options).toDataURL()
            break

          default:
            res.tcimg = rimg[e.data.cmd].apply(rimg, e.data.options).toDataURL()
            break
        }

        break


    }


    self.postMessage(res)
  }
}, false);
