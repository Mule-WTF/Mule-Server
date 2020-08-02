/**
 * @module Message Filter
 * @category Discord
 */
/**
 * Message Filter
 * @param {Object} client - Discord client
 * @param {string} message - Raw Message
 */
async function messageFilter(client, message) {
  let rawContent = message.content.toLowerCase();
  let content = rawContent.replace( /\s\s+/g, ' ').split(' ');

  // Ignore self
  if (message.author.id == client.user.id) { return false }
  // If dm, dont require !mule prefix
  if (message.channel.type == 'dm') {
    if (content.indexOf('!mule') != 0 && !message.isMemberMentioned(client.user)) {
      content.unshift('!mule');
    }
  }

  // If mentioned instead of '!mule'
  if (message.isMemberMentioned(client.user)) {
    content.shift();
    content.unshift('!mule')
  }

  // Message is not for mule
  if (content[0] != '!mule') {
    return false;
  }
  return content[1] ? content[1] : 'help';
}
module.exports = messageFilter;
