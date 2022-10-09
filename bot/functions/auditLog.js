async function auditLog(guild) {
    const AuditLogs = await guild.fetchAuditLogs({ limit: 1 });
    const log = AuditLogs.entries.first();

    return log;
}

module.exports = { auditLog };