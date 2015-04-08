
'use strict';

function getImageSource(video: Object, kind: ?string): {uri: ?string} {
  var uri = video && video.thumbnails ? video.thumbnails[kind].url : null;
  return { uri };
}

module.exports = getImageSource;
