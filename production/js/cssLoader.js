/**
 * Source: https://developers.google.com/speed/docs/insights/OptimizeCSSDelivery
 * This file will be used load the full style.css once the page has rendered.
 */
var cb = function() {
  var l = document.createElement('link'); l.rel = 'stylesheet';
  l.href = 'production/css/all.min.css';
  var h = document.getElementsByTagName('head')[0]; h.parentNode.insertBefore(l, h);
};
var raf = requestAnimationFrame || mozRequestAnimationFrame ||
    webkitRequestAnimationFrame || msRequestAnimationFrame;
if (raf) raf(cb);
else window.addEventListener('load', cb);