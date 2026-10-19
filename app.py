import csv
import io
import os
import uuid
import datetime

# pyrefly: ignore[missing-import]
from flask import (
    Flask, render_template, request, redirect, url_for,
    flash, abort, Response, jsonify, send_from_directory
)

import inventory_logic
import attendance_logic
import ai_engine

app = Flask(__name__)
app.secret_key = "pulseops-operational-intelligence-key"

DIST_DIR = os.path.join(app.root_path, "static", "dist")

INVENTORY = {}    # {id: {"id","name","created","products":[...], "log":[...]}}
ATTENDANCE = {}   # {id: {"id","name","created","threshold_pct","members":[...], "records": {date: {mid: bool}}}}
ALERTS_LOG = []
ACTIVITY_LOG = []


def _initials(name):
    parts = (name or "").split()
    if not parts:
        return "?"
    if len(parts) == 1:
        return parts[0][0].upper()
    return (parts[0][0] + parts[-1][0]).upper()


app.jinja_env.filters["initials"] = _initials


# --------------------------------------------------------------------------
# Realistic AI Demo Data Seeder (Emoji-free)
# --------------------------------------------------------------------------

def seed_demo_data(force=False):
    """Populates realistic multi-day time series data for inventory & attendance."""
    global INVENTORY, ATTENDANCE, ALERTS_LOG, ACTIVITY_LOG
    now = datetime.datetime.now()

    if force or not INVENTORY:
        inv_id = "demo_inv_lab"
        items = [
            {"id": "i1", "sku": "PWR-LIPO-4S", "name": "LiPo Battery 4S 5000mAh", "category": "Power Systems", "quantity": 11, "unit": "units", "threshold": 20},
            {"id": "i2", "sku": "CMP-JETSON-ORIN", "name": "NVIDIA Jetson Orin Nano", "category": "Compute Modules", "quantity": 18, "unit": "boards", "threshold": 5},
            {"id": "i3", "sku": "CBL-USB-TYPEC", "name": "Micro-USB to USB-C Cables", "category": "Cables & Accessories", "quantity": 35, "unit": "cables", "threshold": 15},
            {"id": "i4", "sku": "FAB-SOLDER-8MM", "name": "Precision Soldering Wire 0.8mm", "category": "Fabrication", "quantity": 0, "unit": "spools", "threshold": 4},
            {"id": "i5", "sku": "ACT-SERVO-MG996R", "name": "MG996R Metal Gear Servos", "category": "Actuators", "quantity": 28, "unit": "servos", "threshold": 10},
            {"id": "i6", "sku": "MED-GLOVES-NIT", "name": "Nitrile Surgical Gloves (M)", "category": "Medical & Safety", "quantity": 42, "unit": "boxes", "threshold": 50},
            {"id": "i7", "sku": "CLN-ALC-SAN-1L", "name": "Hand Sanitizer Gel 1000ml", "category": "Medical & Safety", "quantity": 120, "unit": "bottles", "threshold": 30},
        ]
        
        # 14 days of realistic logs
        log = []
        for day_offset in range(14, 0, -1):
            ts = now - datetime.timedelta(days=day_offset, hours=2 * (day_offset % 4) + 1)
            log.append({
                "ts": ts,
                "item_id": "i1",
                "item_name": "LiPo Battery 4S 5000mAh",
                "change": -4 if day_offset % 2 == 0 else -3,
                "new_quantity": 11 + (day_offset * 3),
                "note": "Robotics team prototype testing"
            })
            if day_offset % 3 == 0:
                log.append({
                    "ts": ts,
                    "item_id": "i2",
                    "item_name": "NVIDIA Jetson Orin Nano",
                    "change": -1,
                    "new_quantity": 18 + (day_offset // 3),
                    "note": "Dev kit checkout for computer vision track"
                })

        # Anomaly surge on cables 2 days ago
        anomaly_ts = now - datetime.timedelta(days=2, hours=3)
        log.append({
            "ts": anomaly_ts,
            "item_id": "i3",
            "item_name": "Micro-USB to USB-C Cables",
            "change": -24,
            "new_quantity": 35,
            "note": "Unscheduled emergency hackathon hardware distribution"
        })

        # Soldering wire depleted yesterday
        log.append({
            "ts": now - datetime.timedelta(days=1, hours=4),
            "item_id": "i4",
            "item_name": "Precision Soldering Wire 0.8mm",
            "change": -2,
            "new_quantity": 0,
            "note": "PCB soldering marathon finished the last spool"
        })

        INVENTORY[inv_id] = {
            "id": inv_id,
            "name": "Central Robotics & Hardware Lab",
            "products": items,
            "log": log,
            "created": now - datetime.timedelta(days=15),
        }

    if force or not ATTENDANCE:
        att_id = "demo_att_cohort"
        members = [
            {"id": "m1", "code": "EMP-4011", "name": "Aarav Sharma", "group": "AI & Robotics Cohort"},
            {"id": "m2", "code": "EMP-4012", "name": "Priya Patel", "group": "AI & Robotics Cohort"},
            {"id": "m3", "code": "EMP-4013", "name": "Rohan Mehta", "group": "Data Systems"},
            {"id": "m4", "code": "EMP-4014", "name": "Ananya Iyer", "group": "Data Systems"},
            {"id": "m5", "code": "EMP-4015", "name": "Vikram Singh", "group": "Robotics Engineering"},
            {"id": "m6", "code": "EMP-4016", "name": "Sneha Reddy", "group": "Robotics Engineering"},
            {"id": "m7", "code": "EMP-4017", "name": "Aditya Nair", "group": "ML Operations"},
            {"id": "m8", "code": "EMP-4018", "name": "Tanvi Joshi", "group": "ML Operations"},
        ]

        records = {}
        cal_date = (now - datetime.timedelta(days=22)).date()
        days_generated = 0
        while days_generated < 14:
            if cal_date.weekday() < 5:  # Monday to Friday
                d_str = cal_date.isoformat()
                is_monday = (cal_date.weekday() == 0)
                is_friday = (cal_date.weekday() == 4)

                day_rec = {}
                for m in members:
                    mid = m["id"]
                    if mid in ["m2", "m4", "m5", "m8"]:
                        present = False if (is_friday and days_generated == 13) else True
                    elif mid == "m1":
                        if is_monday or days_generated >= 11:
                            present = False
                        else:
                            present = True
                    elif mid == "m3":
                        if is_monday or is_friday or days_generated in [3, 7, 10, 12]:
                            present = False
                        else:
                            present = True
                    elif mid == "m6":
                        present = False if days_generated in [2, 8] else True
                    else:
                        present = False if (is_monday and days_generated % 2 == 0) else True

                    day_rec[mid] = present
                records[d_str] = day_rec
                days_generated += 1
            cal_date += datetime.timedelta(days=1)

        ATTENDANCE[att_id] = {
            "id": att_id,
            "name": "AI & Autonomous Systems Cohort 2026",
            "threshold_pct": 75,
            "members": members,
            "records": records,
            "created": now - datetime.timedelta(days=22),
        }


seed_demo_data(force=False)


# --------------------------------------------------------------------------
# Production SPA Routing (PulseOps)
# --------------------------------------------------------------------------

@app.route("/")
def index():
    """Serves the PulseOps React frontend if compiled, else redirects to classic."""
    if os.path.exists(os.path.join(DIST_DIR, "index.html")):
        return send_from_directory(DIST_DIR, "index.html")
    return redirect(url_for("home_classic"))


@app.route("/assets/<path:path>")
def static_assets(path):
    """Serves static Vite bundle assets (JS, CSS, fonts)."""
    return send_from_directory(os.path.join(DIST_DIR, "assets"), path)


# --------------------------------------------------------------------------
# RESTful API Endpoints for PulseOps Frontend
# --------------------------------------------------------------------------

@app.route("/api/overview")
def api_overview():
    tracker = INVENTORY.get("demo_inv_lab") or next(iter(INVENTORY.values()), None)
    att_tracker = ATTENDANCE.get("demo_att_cohort") or next(iter(ATTENDANCE.values()), None)

    inv_report = inventory_logic.compute_report(tracker) if tracker else {}
    att_report = attendance_logic.compute_report(att_tracker) if att_tracker else {}
    ai_inv = ai_engine.analyze_inventory_ai(tracker) if tracker else {}
    ai_att = ai_engine.analyze_attendance_ai(att_tracker) if att_tracker else {}

    total_items = inv_report.get("total_items", 0)
    low_count = len(inv_report.get("warning", []))
    out_count = len(inv_report.get("critical", []))
    adequate_pct = round(((total_items - low_count - out_count) / max(1, total_items)) * 100)

    present_today = sum(1 for v in att_tracker.get("records", {}).get(attendance_logic.today_str(), {}).values() if v) if att_tracker else 7
    expected_today = len(att_tracker.get("members", [])) if att_tracker else 8
    turnout_pct = round((present_today / max(1, expected_today)) * 100, 1)

    return jsonify({
        "inventory": {
            "totalItems": total_items,
            "totalUnits": inv_report.get("total_units", 0),
            "lowStockCount": low_count,
            "outOfStockCount": out_count,
            "adequateStockPercentage": adequate_pct,
        },
        "attendance": {
            "presentToday": present_today,
            "expectedToday": expected_today,
            "turnoutPercentage": turnout_pct,
            "deltaVsLastWeek": 2.4,
            "atRiskCount": ai_att.get("critical_members_count", 0),
        },
        "alerts": {
            "criticalCount": out_count + (1 if turnout_pct < 75 else 0),
            "warningCount": low_count + ai_inv.get("total_anomalies", 0),
            "resolvedToday": 1,
        },
        "operations": {
            "unresolvedCount": low_count + out_count,
            "oldestUnresolvedHours": 18,
            "primaryAction": "Approve LiPo Battery 4S replenishment order (3.2d runout horizon)",
        }
    })


@app.route("/api/inventory")
def api_inventory():
    tracker = INVENTORY.get("demo_inv_lab") or next(iter(INVENTORY.values()), None)
    if not tracker:
        return jsonify([])

    ai_inv = ai_engine.analyze_inventory_ai(tracker)
    fc_map = {f["item"]["id"]: f for f in ai_inv.get("item_forecasts", [])}

    items_out = []
    for item in tracker["products"]:
        fc = fc_map.get(item["id"], {})
        status = inventory_logic.item_status(item)
        items_out.append({
            "id": item["id"],
            "sku": item.get("sku", f"SKU-{item['id']}"),
            "name": item["name"],
            "category": item.get("category", "Uncategorized"),
            "quantity": item["quantity"],
            "threshold": item["threshold"],
            "unit": item.get("unit", "units"),
            "status": "out_of_stock" if status == "critical" else ("low" if status == "warning" else "healthy"),
            "dailyBurnRate": fc.get("daily_burn_rate", 1.0),
            "daysUntilStockout": fc.get("days_until_stockout", 999.0),
            "stockoutDate": fc.get("stockout_date", "Stable"),
            "dynamicRop": fc.get("dynamic_rop", item["threshold"]),
            "safetyStock": fc.get("dynamic_safety_stock", 5),
            "lastUpdated": "Verified today",
            "hasAnomaly": len(fc.get("anomalies", [])) > 0
        })
    return jsonify(items_out)


@app.route("/api/attendance")
def api_attendance():
    tracker = ATTENDANCE.get("demo_att_cohort") or next(iter(ATTENDANCE.values()), None)
    if not tracker:
        return jsonify([])

    stats = attendance_logic.member_stats(tracker)
    ai_att = ai_engine.analyze_attendance_ai(tracker)
    pred_map = {p["member"]["id"]: p for p in ai_att.get("member_predictions", [])}

    today = attendance_logic.today_str()
    today_rec = tracker.get("records", {}).get(today, {})

    records_out = []
    for s in stats:
        mid = s["member"]["id"]
        pred = pred_map.get(mid, {})
        is_pres = today_rec.get(mid, True)

        records_out.append({
            "memberId": mid,
            "code": s["member"].get("code", f"EMP-{mid}"),
            "name": s["member"]["name"],
            "department": s["member"].get("group", "General"),
            "status": "present" if is_pres else "absent",
            "checkInTime": "08:45 AM" if is_pres else None,
            "currentPercentage": s["pct"] or 0.0,
            "presentDays": s["present"],
            "totalDays": s["total"],
            "absenceStreak": pred.get("consecutive_absences", 0),
            "riskTier": pred.get("risk_tier", "low").lower(),
            "trend": "decaying" if pred.get("momentum", 0) < -10 else ("improving" if pred.get("momentum", 0) > 10 else "consistent"),
            "recommendation": pred.get("recommendation", "Standard monitoring.")
        })
    return jsonify(records_out)


@app.route("/api/export/<report_type>")
def api_export_csv(report_type):
    buf = io.StringIO()
    writer = csv.writer(buf)

    if report_type == "inventory":
        tracker = INVENTORY.get("demo_inv_lab") or next(iter(INVENTORY.values()), None)
        writer.writerow(["SKU", "Item Name", "Category", "Quantity", "Unit", "Threshold", "Status"])
        if tracker:
            for item in tracker["products"]:
                writer.writerow([
                    item.get("sku", item["id"]), item["name"], item["category"],
                    item["quantity"], item["unit"], item["threshold"],
                    inventory_logic.item_status(item)
                ])
        filename = "pulseops_inventory_audit.csv"

    elif report_type == "attendance":
        tracker = ATTENDANCE.get("demo_att_cohort") or next(iter(ATTENDANCE.values()), None)
        writer.writerow(["Member Code", "Name", "Department", "Days Present", "Total Days", "Attendance %", "Status"])
        if tracker:
            for s in attendance_logic.member_stats(tracker):
                writer.writerow([
                    s["member"].get("code", s["member"]["id"]), s["member"]["name"],
                    s["member"]["group"], s["present"], s["total"], s["pct"], s["status"]
                ])
        filename = "pulseops_attendance_register.csv"

    else:
        writer.writerow(["Alert ID", "Severity", "Description", "Timestamp"])
        writer.writerow(["ALT-1049", "CRITICAL", "Precision Soldering Wire zero stock", "1 day ago"])
        writer.writerow(["ALT-1048", "WARNING", "LiPo Battery 4S 3.2d depletion horizon", "4 hours ago"])
        filename = "pulseops_alerts_log.csv"

    return Response(
        buf.getvalue(),
        mimetype="text/csv",
        headers={"Content-Disposition": f"attachment; filename={filename}"}
    )


# --------------------------------------------------------------------------
# Classic Routes (Fallback & Backward Compatibility)
# --------------------------------------------------------------------------

@app.route("/classic")
def home_classic():
    return render_template(
        "home.html",
        inventory_count=len(INVENTORY),
        attendance_count=len(ATTENDANCE),
    )


@app.route("/inventory")
def inventory_dashboard():
    trackers = sorted(INVENTORY.values(), key=lambda t: t["created"], reverse=True)
    summaries = {t["id"]: inventory_logic.compute_report(t) for t in trackers}
    ai_summaries = {t["id"]: ai_engine.analyze_inventory_ai(t) for t in trackers}
    return render_template(
        "inventory_dashboard.html",
        trackers=trackers,
        summaries=summaries,
        ai_summaries=ai_summaries
    )


@app.route("/inventory/<tracker_id>")
def inventory_detail(tracker_id):
    tracker = INVENTORY.get(tracker_id)
    if not tracker:
        abort(404)
    report = inventory_logic.compute_report(tracker)
    ai_report = ai_engine.analyze_inventory_ai(tracker)
    ai_forecasts_map = {f["item"]["id"]: f for f in ai_report["item_forecasts"]}
    return render_template(
        "inventory_detail.html",
        tracker=tracker,
        report=report,
        ai_report=ai_report,
        ai_forecasts_map=ai_forecasts_map
    )


@app.route("/attendance")
def attendance_dashboard():
    trackers = sorted(ATTENDANCE.values(), key=lambda t: t["created"], reverse=True)
    summaries = {t["id"]: attendance_logic.compute_report(t) for t in trackers}
    ai_summaries = {t["id"]: ai_engine.analyze_attendance_ai(t) for t in trackers}
    return render_template(
        "attendance_dashboard.html",
        trackers=trackers,
        summaries=summaries,
        ai_summaries=ai_summaries
    )


@app.route("/attendance/<tracker_id>")
def attendance_detail(tracker_id):
    tracker = ATTENDANCE.get(tracker_id)
    if not tracker:
        abort(404)
    report = attendance_logic.compute_report(tracker)
    ai_report = ai_engine.analyze_attendance_ai(tracker)
    member_ai_map = {p["member"]["id"]: p for p in ai_report["member_predictions"]}
    today = attendance_logic.today_str()
    today_marked = tracker["records"].get(today, {})
    return render_template(
        "attendance_detail.html",
        tracker=tracker,
        report=report,
        ai_report=ai_report,
        member_ai_map=member_ai_map,
        today=today,
        today_marked=today_marked
    )


@app.route("/seed_demo")
def seed_demo_route():
    seed_demo_data(force=True)
    flash("Sample datasets populated.", "success")
    return redirect(url_for("index"))


@app.errorhandler(404)
def not_found(e):
    if os.path.exists(os.path.join(DIST_DIR, "index.html")):
        return send_from_directory(DIST_DIR, "index.html")
    return render_template("404.html"), 404


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5005))
    app.run(debug=False, host="0.0.0.0", port=port)
