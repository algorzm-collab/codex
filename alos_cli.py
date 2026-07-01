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
    parser.add_argument("--show-prompts", action="store_true")
    args = parser.parse_args()

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
