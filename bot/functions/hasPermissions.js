async function hasPermissions(member, permissions) {
    return member.permissions.has(permissions);
}

module.exports = { hasPermissions };