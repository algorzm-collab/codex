from __future__ import annotations

import argparse

from alos.models import Mission
from alos.runtime import ALOSRuntime
from alos.work_window import WorkWindowPlanner


def main() -> None:
    parser = argparse.ArgumentParser(description="ALOS mission compiler")
    parser.add_argument("title")
    parser.add_argument("objective")
    parser.add_argument("--level", type=int, default=0)
    args = parser.parse_args()

    mission = Mission(title=args.title, objective=args.objective)
    runtime = ALOSRuntime()
    plan = runtime.prepare(mission)
    window = WorkWindowPlanner().choose(args.level)

    print(f"Mission: {mission.title}")
    print(f"Window: {window.name} {window.max_minutes}m")

    print("\nContext required:")
    for item in plan["context_plan"].required_files:  # type: ignore[attr-defined]
        print(f"- {item}")

    print("\nMicro tasks:")
    for task in plan["tasks"]:  # type: ignore[index]
        print(f"- {task.title} -> {task.owner}")

    print("\nRoutes:")
    for route in plan["routes"]:  # type: ignore[index]
        print(f"- {route.task.title}: {route.agent} ({route.reason})")


if __name__ == "__main__":
    main()
