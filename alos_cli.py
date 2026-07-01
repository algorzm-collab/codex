from __future__ import annotations

import argparse

from alos.models import Mission
from alos.runtime import ALOSRuntime


def main() -> None:
    parser = argparse.ArgumentParser(description="ALOS mission compiler")
    parser.add_argument("title")
    parser.add_argument("objective")
    args = parser.parse_args()

    mission = Mission(title=args.title, objective=args.objective)
    runtime = ALOSRuntime()
    plan = runtime.prepare(mission)

    print(f"Mission: {mission.title}")
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
