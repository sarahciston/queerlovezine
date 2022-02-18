let url = 'https://sarahciston.github.io/queerlovezine/assets/files/QueerLoveZine-Digital.pdf'

console.log('js reached')

// let preview = document.getElementsByTagName("h3")[1]

let pdfjs = window['pdfjs-dist/build/pdf'];

pdfjs.GlobalWorkerOptions.workerSrc = 'http://mozilla.github.io/pdf.js/build/pdf.worker.js';


var pdfDoc = null,
    pageNum = 1,
    pageRendering = false,
    pageNumPending = null,
    scale = 1.5, //0.8
    // canvas = document.createElement("canvas"),
    canvas = document.getElementById("the-canvas"),
    ctx = canvas.getContext('2d');

// canvas.id = "the-canvas"
// preview.appendChild(canvas)

/**
 * Get page info from document, resize canvas accordingly, and render page.
 * @param num Page number.
 */
function renderPage(num) {
  pageRendering = true;
  // Using promise to fetch the page
  pdfDoc.getPage(num).then(function(page) {
    var viewport = page.getViewport({scale: scale});
    canvas.height = viewport.height;
    canvas.width = viewport.width;

    // Render PDF page into canvas context
    var renderContext = {
      canvasContext: ctx,
      viewport: viewport
    };
    var renderTask = page.render(renderContext);

    // Wait for rendering to finish
    renderTask.promise.then(function() {
      pageRendering = false;
      if (pageNumPending !== null) {
        // New page rendering is pending
        renderPage(pageNumPending);
        pageNumPending = null;
      }
    });
  });

  // Update page counters
  document.getElementById('page_num').textContent = num;
}

/**
 * If another page rendering in progress, waits until the rendering is
 * finised. Otherwise, executes rendering immediately.
 */
function queueRenderPage(num) {
  if (pageRendering) {
    pageNumPending = num;
  } else {
    renderPage(num);
  }
}

/**
 * Displays previous page.
 */
function onPrevPage() {
  if (pageNum <= 1) {
    return;
  }
  pageNum--;
  queueRenderPage(pageNum);
}
document.getElementById('prev').addEventListener('click', onPrevPage);

/**
 * Displays next page.
 */
function onNextPage() {
  if (pageNum >= pdfDoc.numPages) {
    return;
  }
  pageNum++;
  queueRenderPage(pageNum);
}
document.getElementById('next').addEventListener('click', onNextPage);

/**
 * Asynchronously downloads PDF.
 */
pdfjsLib.getDocument(url).promise.then(function(pdfDoc_) {
  pdfDoc = pdfDoc_;
  document.getElementById('page_count').textContent = pdfDoc.numPages;

  // Initial/first page rendering
  renderPage(pageNum);
});


// if (!pdfjs.GlobalWorkerOptions.workerSrc) {
//     const WORKER_URL = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.12.313/pdf.worker.entry.min.js`;
//     pdfjs.GlobalWorkerOptions.workerSrc = WORKER_URL;
// }




// var loadingTask = pdfjsLib.getDocument(url);
// loadingTask.promise.then(function(pdf) {

    

//     var pageNumber = 1;
//     pdf.getPage(pageNumber).then(function(page) {
//     console.log('Page loaded');
    
//     var scale = 1.5;
//     var viewport = page.getViewport({scale: scale});

//     // Prepare canvas using PDF page dimensions
//     // var canvas = document.getElementById("the-canvas");
//     let canvas = document.createElement("canvas")
//     canvas.id = "the-canvas"
//     var context = canvas.getContext('2d');
//     canvas.height = viewport.height;
//     canvas.width = viewport.width;

//     // Render PDF page into canvas context
//     var renderContext = {
//       canvasContext: context,
//       viewport: viewport
//     };
//     var renderTask = page.render(renderContext);
//     renderTask.promise.then(function () {
//       console.log('Page rendered');
//     });
//     preview.appendChild(canvas)
//   });
// }, function (reason) {
//   // PDF loading error
//   console.error(reason);
// });