async function reactionAdd(message, reaction) {
    message.react(reaction);
};
async function reactionRemove(message, reaction, user) {
    message.reactions.cache.get(reaction).users.remove(user);
};

module.exports = { reactionAdd, reactionRemove };