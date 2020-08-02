/**
 * @module Message Filter
 * @category Telegram
 */
/**
 * Message Filter
 * @param {Object} client - Telegram client
 * @param {string} message - Raw Message
 */

async function messageFilter(client, message) {
  let rawContent = message.text.toLowerCase();
  let content = rawContent.replace( /\s\s+/g, ' ').split(' ');

  // If dm, dont require /mule prefix
  if (message.chat.type != 'group') {
    if (content.indexOf('/mule') != 0) {
      content.unshift('/mule');
    }
  }

  return content[1] ? content[1] : 'help';
}
module.exports = messageFilter;
