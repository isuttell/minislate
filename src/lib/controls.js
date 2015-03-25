var controls = {
    Menu: require('./controls/Menu'),
    inline: {
      Bold: require('./controls/inline/Bold'),
      Italic: require('./controls/inline/Italic'),
      Underline: require('./controls/inline/Underline'),
      StrikeThrough: require('./controls/inline/StrikeThrough'),
      Link: require('./controls/inline/Link'),
    },
    block: {
      Blockquote : require('./controls/block/Blockquote'),
      Paragraph : require('./controls/block/Paragraph'),
      Preformated : require('./controls/block/Preformated'),
      OrderedList : require('./controls/block/OrderedList'),
      UnorderedList : require('./controls/block/UnorderedList')
    },
    media: {
      Image: require('./controls/media/Image'),
      Oembed: require('./controls/media/Oembed')
    }
};

// Add H1-H6 Titles
var titles = require('./controls/block/titles');
for(var i in titles) {
  if(titles.hasOwnProperty(i)) {
    controls.block[i] = titles[i];
  }
}

module.exports = controls;
