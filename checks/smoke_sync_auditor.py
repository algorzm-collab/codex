from alos.sync_auditor import SyncAuditor


result = SyncAuditor().audit()

assert result.score == 100, SyncAuditor().report()
assert result.passed
assert len(result.checks) == 6

