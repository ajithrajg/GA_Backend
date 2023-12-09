const generateGUID = async (req) => {
  // Generate a random part
  var randomPart = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0,
        v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });

  // Add timestamp randomness
  var timestampPart = Math.floor(performance.now()).toString(16);

  // Concatenate random and timestamp parts
  console.log(randomPart + timestampPart + req.get('from-ga'));
  return randomPart + timestampPart + req.get('from-ga');
}

module.exports = { generateGUID };