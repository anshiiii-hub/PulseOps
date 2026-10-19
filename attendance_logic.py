"""
attendance_logic.py
Tracks daily present/absent records per member, compares each member's
running attendance percentage against a configurable minimum threshold,
flags days with unusually high absenteeism, and builds a summary report.
"""
import datetime
from collections import OrderedDict


def member_stats(tracker):
    """Returns a list of {member, present, total, pct, status} per member."""
    records = tracker["records"]
    stats = []
    for m in tracker["members"]:
        present = 0
        total = 0
        for day, day_record in records.items():
            if m["id"] in day_record:
                total += 1
                if day_record[m["id"]]:
                    present += 1
        pct = round(present / total * 100) if total else None
        status = "no_data" if total == 0 else (
            "below" if pct < tracker["threshold_pct"] else "ok"
        )
        stats.append({
            "member": m, "present": present, "total": total,
            "pct": pct, "status": status,
        })
    stats.sort(key=lambda s: (s["pct"] is None, s["pct"] if s["pct"] is not None else 0))
    return stats


def daily_summary(tracker):
    """Returns a chronological list of {date, present, total, absent_pct}."""
    records = tracker["records"]
    out = []
    for day in sorted(records.keys()):
        day_record = records[day]
        total = len(day_record)
        present = sum(1 for v in day_record.values() if v)
        absent_pct = round((total - present) / total * 100) if total else 0
        out.append({"date": day, "present": present, "total": total, "absent_pct": absent_pct})
    return out


HIGH_ABSENTEEISM_THRESHOLD = 30  # % absent in a single day considered notable


def compute_alerts(tracker):
    alerts = []
    for s in member_stats(tracker):
        if s["status"] == "below":
            alerts.append({
                "severity": "warning", "member": s["member"], "stat": s,
                "message": f"{s['member']['name']}'s attendance is {s['pct']}% "
                           f"(below the {tracker['threshold_pct']}% minimum).",
            })

    days = daily_summary(tracker)
    for d in days[-5:]:  # only surface recent days
        if d["absent_pct"] >= HIGH_ABSENTEEISM_THRESHOLD:
            alerts.append({
                "severity": "critical" if d["absent_pct"] >= 50 else "warning",
                "date": d["date"], "stat": d,
                "message": f"High absenteeism on {d['date']}: {d['absent_pct']}% absent "
                           f"({d['total'] - d['present']} of {d['total']}).",
            })

    alerts.sort(key=lambda a: a["severity"] != "critical")
    return alerts


def compute_report(tracker):
    stats = member_stats(tracker)
    below = [s for s in stats if s["status"] == "below"]
    ok = [s for s in stats if s["status"] == "ok"]
    no_data = [s for s in stats if s["status"] == "no_data"]

    days = daily_summary(tracker)
    overall_pct = None
    total_marks = sum(d["total"] for d in days)
    total_present = sum(d["present"] for d in days)
    if total_marks:
        overall_pct = round(total_present / total_marks * 100)

    return {
        "stats": stats,
        "below": below,
        "ok": ok,
        "no_data": no_data,
        "days": days,
        "overall_pct": overall_pct,
        "alerts": compute_alerts(tracker),
        "generated": datetime.datetime.now().strftime("%B %d, %Y at %I:%M %p"),
    }


def today_str():
    return datetime.date.today().isoformat()
