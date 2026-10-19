"""
inventory_logic.py
Compares current stock levels against each item's reorder threshold and
generates alerts + a summary report. Recomputed fresh on every request,
so any quantity change is reflected immediately — no batch/manual refresh
step, which is what makes this "real-time" in a request/response system.
"""
import datetime


def item_status(item):
    """Returns 'critical' (out of stock), 'warning' (at/below threshold), or 'healthy'."""
    if item["quantity"] <= 0:
        return "critical"
    if item["quantity"] <= item["threshold"]:
        return "warning"
    return "healthy"


def compute_alerts(tracker):
    alerts = []
    for item in tracker["products"]:
        status = item_status(item)
        if status == "critical":
            alerts.append({
                "severity": "critical", "item": item,
                "message": f"{item['name']} is OUT OF STOCK (0 {item['unit']}).",
            })
        elif status == "warning":
            alerts.append({
                "severity": "warning", "item": item,
                "message": f"{item['name']} is low: {item['quantity']} {item['unit']} left "
                           f"(reorder threshold is {item['threshold']}).",
            })
    alerts.sort(key=lambda a: (a["severity"] != "critical", a["item"]["quantity"]))
    return alerts


def compute_report(tracker):
    items = tracker["products"]
    statuses = {item["id"]: item_status(item) for item in items}
    critical = [i for i in items if statuses[i["id"]] == "critical"]
    warning = [i for i in items if statuses[i["id"]] == "warning"]
    healthy = [i for i in items if statuses[i["id"]] == "healthy"]

    total_units = sum(i["quantity"] for i in items)
    recent_log = sorted(tracker["log"], key=lambda l: l["ts"], reverse=True)[:12]

    by_category = {}
    for i in items:
        cat = i.get("category") or "Uncategorized"
        by_category.setdefault(cat, {"count": 0, "units": 0})
        by_category[cat]["count"] += 1
        by_category[cat]["units"] += i["quantity"]

    return {
        "total_items": len(items),
        "total_units": total_units,
        "critical": critical,
        "warning": warning,
        "healthy": healthy,
        "alerts": compute_alerts(tracker),
        "recent_log": recent_log,
        "by_category": by_category,
        "generated": datetime.datetime.now().strftime("%B %d, %Y at %I:%M %p"),
    }
