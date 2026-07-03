from __future__ import annotations

import argparse
import sys

from alos.github_evidence import GitHubEvidenceDashboard
from alos.models import Mission
from alos.pipeline import ALOSPipeline
from alos.runtime import ALOSRuntime
from alos.work_window import WorkWindowPlanner


def main() -> None:
    if len(sys.argv) > 1 and sys.argv[1] == "dashboard-from-issues":
        dashboard_parser = argparse.ArgumentParser(description="write site data from saved GitHub issue JSON")
        dashboard_parser.add_argument("command")
        dashboard_parser.add_argument("issues_json")
        dashboard_parser.add_argument("--out", default="site/data.json")
        dashboard_args = dashboard_parser.parse_args()
        target = GitHubEvidenceDashboard().write_site_data_from_issues(
            dashboard_args.issues_json,
            dashboard_args.out,
        )
        print(f"Wrote dashboard data: {target}")
        return

    parser = argparse.ArgumentParser(description="ALOS mission compiler")
    parser.add_argument("title", nargs="?", default="")
    parser.add_argument("objective", nargs="?", default="")
    parser.add_argument("--level", type=int, default=0)
    parser.add_argument("--show-prompts", action="store_true")
    parser.add_argument("--repo", default="algorzm-collab/codex")
    parser.add_argument("--issue", type=int)
    args = parser.parse_args()

    if args.issue:
        pipeline = ALOSPipeline(repo=args.repo)
        plan = pipeline.from_issue(args.issue)
        mission = plan["mission"]
    else:
        mission = Mission(title=args.title, objective=args.objective)
        runtime = ALOSRuntime()
        plan = runtime.prepare(mission)

    window = WorkWindowPlanner().choose(args.level)
    brief = plan["brief"]

    print(f"Mission: {mission.title}")
    print(f"Window: {window.name} {window.max_minutes}m")
    print(f"Progress: {brief.progress}%")
    print(f"Next: {brief.next_action}")

    print("\nContext required:")
    for item in plan["context_plan"].required_files:  # type: ignore[attr-defined]
        print(f"- {item}")

    print("\nMicro tasks:")
    for task in plan["tasks"]:  # type: ignore[index]
        print(f"- {task.title} -> {task.owner}")

    print("\nRoutes:")
    for route in plan["routes"]:  # type: ignore[index]
        print(f"- {route.task.title}: {route.agent} ({route.reason})")

    if args.show_prompts:
        print("\nPrompts:")
        for idx, prompt in enumerate(plan["prompts"], start=1):  # type: ignore[index]
            print(f"\n--- Prompt {idx} ---")
            print(prompt)


if __name__ == "__main__":
    main()
