let URL = 'http://127.0.0.1:4000/assets/files/QueerLoveZine-Digital.pdf'

console.log('js reached')

var loadingTask = pdfjsLib.getDocument(URL);
loadingTask.promise.then(function(pdf) {
    console.log('Page loaded')
    var pageNumber = 1;
    pdf.getPage(pageNumber).then(function(page) {
    console.log('Page loaded');
    
    var scale = 1.5;
    var viewport = page.getViewport({scale: scale});

    // Prepare canvas using PDF page dimensions
    var canvas = document.getElementById('the-canvas');
    var context = canvas.getContext('2d');
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    // Render PDF page into canvas context
    var renderContext = {
      canvasContext: context,
      viewport: viewport
    };
    var renderTask = page.render(renderContext);
    renderTask.promise.then(function () {
      console.log('Page rendered');
    });
  });
}, function (reason) {
  // PDF loading error
  console.error(reason);
});