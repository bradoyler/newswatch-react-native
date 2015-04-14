
'use strict';

function getImageSource(video: Object, kind: ?string): {uri: ?string} {
  var defaultUrl = 'http://placehold.it/100x80&text=.....';
  var uri = video && video.thumbnails ? video.thumbnails[kind].url : defaultUrl;
  return { uri };
}

module.exports = getImageSource;
