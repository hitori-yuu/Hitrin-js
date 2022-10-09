async function hasPermissions(user, permissions) {
    return user.permissions.has(permissions);
}

module.exports = { hasPermissions };