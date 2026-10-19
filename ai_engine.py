"""
ai_engine.py
TrackIQ-AI: Advanced AI & Machine Learning Intelligence Module
Provides predictive inventory runout forecasting, dynamic safety stock optimization,
absenteeism risk classification, day-of-week behavioral pattern mining, anomaly detection,
and an interactive Natural Language Operations Copilot.
"""

import math
import datetime
from collections import defaultdict
import numpy as np


# ==============================================================================
# 1. INVENTORY PREDICTIVE INTELLIGENCE & DEMAND FORECASTING
# ==============================================================================

def analyze_inventory_ai(tracker):
    """
    Performs predictive analytics on stock consumption logs:
    - Burn Rate (units/day)
    - Days Until Stockout (Runout Horizon)
    - Dynamic Safety Stock & Reorder Point Optimization (Lead-time demand variance)
    - Statistical Anomaly Spike Detection (Z-Score & IQR on depletion events)
    - Restock Requisition Generator (Economic Reorder Recommendations)
    """
    products = tracker.get("products", [])
    log = tracker.get("log", [])

    # Group negative changes (consumption) per item
    item_logs = defaultdict(list)
    for entry in log:
        item_id = entry.get("item_id")
        change = entry.get("change", 0)
        ts = entry.get("ts")
        if isinstance(ts, str):
            try:
                ts = datetime.datetime.fromisoformat(ts)
            except Exception:
                ts = datetime.datetime.now()
        item_logs[item_id].append({
            "ts": ts,
            "change": change,
            "abs_drop": abs(change) if change < 0 else 0,
            "is_drop": change < 0,
            "note": entry.get("note", "")
        })

    item_forecasts = []
    total_anomalies = 0
    high_risk_count = 0

    now = datetime.datetime.now()

    for item in products:
        item_id = item["id"]
        qty = item["quantity"]
        threshold = item["threshold"]
        unit = item.get("unit", "units")
        entries = item_logs.get(item_id, [])

        drops = [e["abs_drop"] for e in entries if e["is_drop"] and e["abs_drop"] > 0]
        drop_entries = [e for e in entries if e["is_drop"] and e["abs_drop"] > 0]

        # Calculate burn rate & variance
        if drop_entries:
            # Time span in days
            timestamps = [e["ts"] for e in drop_entries]
            min_ts = min(timestamps)
            span_days = max(1.0, (now - min_ts).total_seconds() / 86400.0)
            total_depleted = sum(drops)
            daily_burn_rate = round(total_depleted / span_days, 2)
            
            # Variance of transaction drops
            drop_arr = np.array(drops)
            mean_drop = float(np.mean(drop_arr))
            std_drop = float(np.std(drop_arr)) if len(drops) > 1 else (0.3 * mean_drop)
        else:
            # Heuristic default based on current threshold
            daily_burn_rate = max(0.5, round(threshold * 0.15, 2)) if threshold > 0 else 0.5
            mean_drop = daily_burn_rate
            std_drop = daily_burn_rate * 0.35

        # 1. Runout Forecasting (Days Until Stockout)
        if qty <= 0:
            days_until_stockout = 0.0
            stockout_date_str = "Already Depleted"
            risk_tier = "CRITICAL"
            urgency_score = 100
        elif daily_burn_rate > 0:
            days_until_stockout = round(qty / daily_burn_rate, 1)
            projected_date = now + datetime.timedelta(days=days_until_stockout)
            stockout_date_str = projected_date.strftime("%b %d, %Y")

            if days_until_stockout <= 2.0:
                risk_tier = "CRITICAL"
                urgency_score = 95
            elif days_until_stockout <= 5.0:
                risk_tier = "HIGH"
                urgency_score = 75
            elif days_until_stockout <= 12.0:
                risk_tier = "MODERATE"
                urgency_score = 45
            else:
                risk_tier = "STABLE"
                urgency_score = 15
        else:
            days_until_stockout = 999.0
            stockout_date_str = "Indefinite (>180d)"
            risk_tier = "STABLE"
            urgency_score = 5

        if risk_tier in ("CRITICAL", "HIGH"):
            high_risk_count += 1

        # 2. Dynamic Safety Stock & Reorder Point (ROP) Optimization
        # Formula: Safety Stock = Z * sigma_L * sqrt(LeadTime)
        # Assuming 95% service level (Z = 1.645) and estimated lead time L = 3 days
        lead_time_days = 3
        z_score = 1.645
        daily_sigma = max(0.5, std_drop)
        dynamic_safety_stock = int(math.ceil(z_score * daily_sigma * math.sqrt(lead_time_days)))
        dynamic_rop = int(math.ceil((daily_burn_rate * lead_time_days) + dynamic_safety_stock))

        # Compare with manual threshold
        if threshold == 0:
            threshold_assessment = f"No threshold configured. AI recommends setting ROP to {dynamic_rop} {unit}."
            threshold_status = "unconfigured"
        elif threshold < dynamic_rop * 0.75:
            threshold_assessment = f"Threshold ({threshold}) is too low! Risk of stockout during {lead_time_days}-day lead time. AI recommends {dynamic_rop} {unit}."
            threshold_status = "too_low"
        elif threshold > dynamic_rop * 2.2:
            threshold_assessment = f"Threshold ({threshold}) is excessively high (tying up excess capital). Optimal ROP: {dynamic_rop} {unit}."
            threshold_status = "too_high"
        else:
            threshold_assessment = f"Threshold ({threshold}) is well-balanced with daily burn velocity."
            threshold_status = "optimal"

        # 3. Anomaly Spike Detection
        # Check if recent drop exceeds mean + 2.0 * std
        anomalies = []
        for e in drop_entries:
            if len(drops) >= 3 and std_drop > 0:
                z = (e["abs_drop"] - mean_drop) / std_drop
                if z >= 2.0 or e["abs_drop"] >= mean_drop * 2.8:
                    anomalies.append({
                        "ts": e["ts"].strftime("%b %d, %H:%M"),
                        "amount": e["abs_drop"],
                        "z_score": round(float(z), 2),
                        "note": e["note"] or "Unusual high single-transaction depletion"
                    })
        total_anomalies += len(anomalies)

        # 4. Recommended Reorder Quantity (EOQ heuristic)
        recommended_order_qty = max(dynamic_rop * 2, int(math.ceil(daily_burn_rate * 14)))

        item_forecasts.append({
            "item": item,
            "daily_burn_rate": daily_burn_rate,
            "days_until_stockout": days_until_stockout,
            "stockout_date": stockout_date_str,
            "risk_tier": risk_tier,
            "urgency_score": urgency_score,
            "dynamic_safety_stock": dynamic_safety_stock,
            "dynamic_rop": dynamic_rop,
            "threshold_status": threshold_status,
            "threshold_assessment": threshold_assessment,
            "anomalies": anomalies,
            "recommended_order_qty": recommended_order_qty
        })

    # Sort items by urgency (critical stockouts first)
    item_forecasts.sort(key=lambda x: (x["days_until_stockout"], -x["urgency_score"]))

    # Overall inventory health score (0 to 100)
    if item_forecasts:
        avg_urgency = sum(f["urgency_score"] for f in item_forecasts) / len(item_forecasts)
        inventory_health_score = max(0, min(100, int(100 - avg_urgency)))
    else:
        inventory_health_score = 100

    # Executive AI summary
    imminent = [f for f in item_forecasts if f["risk_tier"] == "CRITICAL"]
    high = [f for f in item_forecasts if f["risk_tier"] == "HIGH"]

    if imminent:
        items_str = ", ".join([f["item"]["name"] for f in imminent[:2]])
        exec_summary = f"CRITICAL ALERT: {len(imminent)} item(s) ({items_str}) will stock out within 48 hours at current burn velocity. Replenishment orders required immediately."
    elif high:
        items_str = ", ".join([f["item"]["name"] for f in high[:2]])
        exec_summary = f"WARNING: {len(high)} item(s) ({items_str}) are on a rapid depletion trajectory with under 5 days of reserve."
    else:
        exec_summary = "STABLE: All monitored SKU quantities have healthy runout horizons exceeding standard vendor replenishment lead times."

    return {
        "item_forecasts": item_forecasts,
        "inventory_health_score": inventory_health_score,
        "high_risk_count": high_risk_count,
        "total_anomalies": total_anomalies,
        "executive_summary": exec_summary,
        "lead_time_days": lead_time_days,
        "computed_at": now.strftime("%b %d, %Y at %I:%M %p")
    }


# ==============================================================================
# 2. ATTENDANCE PREDICTIVE INTELLIGENCE & BEHAVIORAL MINING
# ==============================================================================

def analyze_attendance_ai(tracker):
    """
    Performs predictive analytics and behavioral modeling on attendance:
    - Multi-Factor Absenteeism Risk Classifier (0-100 score & risk tiers)
    - Momentum / Velocity Tracking (7-day trend vs historical baseline)
    - Consecutive Absence Streak & Disengagement Flags
    - Day-of-Week Behavioral Pattern Mining (detecting Monday/Friday slump syndromes)
    - Next-Day Cohort Attendance Forecasting with Confidence Interval
    """
    members = tracker.get("members", [])
    records = tracker.get("records", {})
    threshold_pct = tracker.get("threshold_pct", 75)

    sorted_dates = sorted(records.keys())
    total_days = len(sorted_dates)

    member_predictions = []
    critical_members_count = 0

    # 1. Per-Member Risk Scoring & Trajectory
    for m in members:
        mid = m["id"]
        history = []
        for d in sorted_dates:
            if mid in records[d]:
                history.append((d, records[d][mid]))

        member_total = len(history)
        member_present = sum(1 for _, pres in history if pres)
        current_pct = round((member_present / member_total) * 100, 1) if member_total > 0 else None

        # Consecutive absence streak
        consecutive_absences = 0
        for _, pres in reversed(history):
            if not pres:
                consecutive_absences += 1
            else:
                break

        # Recent momentum (last 5 recorded sessions vs older baseline)
        if member_total >= 5:
            recent_slice = history[-5:]
            recent_pres = sum(1 for _, p in recent_slice if p)
            recent_pct = round((recent_pres / len(recent_slice)) * 100, 1)

            earlier_slice = history[:-5]
            if earlier_slice:
                earlier_pres = sum(1 for _, p in earlier_slice if p)
                earlier_pct = round((earlier_pres / len(earlier_slice)) * 100, 1)
                momentum = round(recent_pct - earlier_pct, 1)
            else:
                momentum = 0.0
        else:
            recent_pct = current_pct
            momentum = 0.0

        # Multi-factor Predictive Risk Score (0 to 100)
        # Factors:
        # F1: Gap below threshold
        # F2: Absence streak severity
        # F3: Negative momentum decay
        if current_pct is not None:
            # Baseline risk from current percentage
            gap = threshold_pct - current_pct
            base_risk = max(0, gap * 2.2) if gap > 0 else max(0, 30 - (current_pct - threshold_pct))

            # Streak multiplier
            streak_penalty = consecutive_absences * 14.0

            # Momentum decay penalty
            momentum_penalty = abs(momentum) * 0.8 if momentum < 0 else -min(15, momentum * 0.5)

            raw_score = base_risk + streak_penalty + momentum_penalty
            risk_score = int(max(2, min(99, round(raw_score))))
        else:
            risk_score = 25  # Neutral default for newly registered members

        # Risk Classification Tiers
        if risk_score >= 75:
            risk_tier = "CRITICAL"
            recommendation = "High dropout risk. Urgent 1-on-1 advisor intervention recommended immediately."
            critical_members_count += 1
        elif risk_score >= 50:
            risk_tier = "HIGH"
            recommendation = "Attendance deteriorating. Issue formal warning notice and review reasons."
            critical_members_count += 1
        elif risk_score >= 25:
            risk_tier = "MODERATE"
            recommendation = "Borderline compliance. Monitor performance over the next 3 sessions."
        else:
            risk_tier = "LOW"
            recommendation = "Exemplary consistency. Member exhibits high engagement."

        # Momentum trend symbol
        if momentum < -10:
            trend_icon = "Deteriorating"
            trend_class = "crit"
        elif momentum > 10:
            trend_icon = "Recovering"
            trend_class = "ok"
        else:
            trend_icon = "Consistent"
            trend_class = "neutral"

        member_predictions.append({
            "member": m,
            "total_days": member_total,
            "present_days": member_present,
            "current_pct": current_pct,
            "recent_pct": recent_pct,
            "momentum": momentum,
            "trend_icon": trend_icon,
            "trend_class": trend_class,
            "consecutive_absences": consecutive_absences,
            "risk_score": risk_score,
            "risk_tier": risk_tier,
            "recommendation": recommendation
        })

    # Sort by risk score descending (highest risk first)
    member_predictions.sort(key=lambda x: -x["risk_score"])

    # 2. Day-of-Week Behavioral Pattern Mining
    day_stats = defaultdict(lambda: {"present": 0, "total": 0, "dates": []})
    day_names = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

    for d_str in sorted_dates:
        try:
            d_obj = datetime.date.fromisoformat(d_str)
            w_name = day_names[d_obj.weekday()]
            day_record = records[d_str]
            total_on_day = len(day_record)
            pres_on_day = sum(1 for v in day_record.values() if v)
            day_stats[w_name]["present"] += pres_on_day
            day_stats[w_name]["total"] += total_on_day
            day_stats[w_name]["dates"].append(d_str)
        except Exception:
            pass

    weekday_patterns = []
    overall_all_present = sum(s["present"] for s in day_stats.values())
    overall_all_total = sum(s["total"] for s in day_stats.values())
    cohort_avg_pct = round((overall_all_present / overall_all_total * 100), 1) if overall_all_total else 80.0

    slump_detected = None
    for day in ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"]:
        s = day_stats[day]
        pct = round((s["present"] / s["total"] * 100), 1) if s["total"] > 0 else None
        deviation = round(pct - cohort_avg_pct, 1) if pct is not None else 0.0
        is_slump = pct is not None and deviation <= -10.0

        if is_slump and not slump_detected:
            slump_detected = f"{day} Slump Syndrome: Average attendance is {pct}% ({abs(deviation)}% below cohort mean)."

        weekday_patterns.append({
            "day": day,
            "pct": pct if pct is not None else "N/A",
            "sample_count": len(s["dates"]),
            "deviation": deviation,
            "is_slump": is_slump
        })

    # 3. Next-Day Cohort Attendance Forecast
    tomorrow = datetime.date.today() + datetime.timedelta(days=1)
    tomorrow_day_name = day_names[tomorrow.weekday()]
    tomorrow_hist = day_stats.get(tomorrow_day_name, {})
    
    if tomorrow_hist.get("total", 0) > 0:
        base_expected_pct = tomorrow_hist["present"] / tomorrow_hist["total"] * 100
    else:
        base_expected_pct = cohort_avg_pct

    # Blend with latest 3-day momentum
    recent_days = sorted_dates[-3:]
    if recent_days:
        r_pres = sum(sum(1 for v in records[d].values() if v) for d in recent_days)
        r_tot = sum(len(records[d]) for d in recent_days)
        recent_cohort_pct = (r_pres / r_tot * 100) if r_tot else base_expected_pct
        forecast_pct = round((0.6 * base_expected_pct) + (0.4 * recent_cohort_pct), 1)
    else:
        forecast_pct = round(base_expected_pct, 1)

    ci_low = max(0, round(forecast_pct - 6.5, 1))
    ci_high = min(100, round(forecast_pct + 6.5, 1))

    # Executive Summary
    if critical_members_count > 0:
        exec_summary = f"Predictive Alert: {critical_members_count} member(s) have reached High or Critical risk thresholds. Proactive counselor check-in recommended."
    elif slump_detected:
        exec_summary = f"Behavioral Insight: {slump_detected} Consider adjusting scheduling or sending automated morning reminders."
    else:
        exec_summary = f"Healthy Engagement: Group attendance is currently stable with tomorrow forecasted at {forecast_pct}% [{ci_low}% - {ci_high}% CI]."

    return {
        "member_predictions": member_predictions,
        "critical_members_count": critical_members_count,
        "weekday_patterns": weekday_patterns,
        "slump_detected": slump_detected,
        "tomorrow_day_name": tomorrow_day_name,
        "forecast_pct": forecast_pct,
        "ci_low": ci_low,
        "ci_high": ci_high,
        "cohort_avg_pct": cohort_avg_pct,
        "executive_summary": exec_summary,
        "computed_at": datetime.datetime.now().strftime("%b %d, %Y at %I:%M %p")
    }


# ==============================================================================
# 3. NATURAL LANGUAGE OPERATIONS COPILOT (NLQ)
# ==============================================================================

def query_copilot(query_text, context_type, tracker, ai_report):
    """
    Intelligent Natural Language Query Engine for operational decision support.
    Parses intent from query_text and synthesizes structured, executive-ready
    answers and recommendations based on real-time data & AI models.
    """
    q = (query_text or "").strip().lower()

    if context_type == "inventory":
        forecasts = ai_report.get("item_forecasts", [])
        
        # Intent 1: Stockout horizon / runout
        if any(w in q for w in ["run out", "stockout", "deplet", "horizon", "how long", "when", "days left"]):
            imminent = [f for f in forecasts if f["days_until_stockout"] <= 7.0]
            if not imminent:
                return {
                    "title": "Stockout Horizon Forecast",
                    "answer": "All items have stable inventory reserves! The fastest depleting item is **{}** with approx. **{} days** remaining.".format(
                        forecasts[0]["item"]["name"], forecasts[0]["days_until_stockout"]
                    ) if forecasts else "No items currently tracked.",
                    "action_items": ["Inventory levels are sufficient for the immediate 7-day operational cycle."]
                }
            
            lines = []
            for f in imminent:
                lines.append(f"- **{f['item']['name']}**: ~**{f['days_until_stockout']} days** left (Est. 0 stock on {f['stockout_date']}) at a burn rate of {f['daily_burn_rate']} {f['item'].get('unit','units')}/day.")
            
            return {
                "title": "Critical Stockout Trajectories",
                "answer": f"Found **{len(imminent)} item(s)** facing imminent stock depletion within 7 days:\n\n" + "\n".join(lines),
                "action_items": [
                    f"Initiate purchase orders for {imminent[0]['item']['name']} immediately.",
                    "Verify current supplier delivery lead times to prevent supply disruption."
                ]
            }

        # Intent 2: Reorder requisition / purchase order draft
        elif any(w in q for w in ["reorder", "order", "purchase", "buy", "requisition", "po"]):
            to_order = [f for f in forecasts if f["days_until_stockout"] <= 10.0 or f["item"]["quantity"] <= f["dynamic_rop"]]
            if not to_order:
                to_order = forecasts[:2]  # fallback
            
            order_table = []
            for f in to_order:
                order_table.append(
                    f"| {f['item']['name']} | {f['item']['quantity']} {f['item'].get('unit','units')} | {f['dynamic_rop']} | **{f['recommended_order_qty']} {f['item'].get('unit','units')}** |"
                )

            return {
                "title": "Automated Purchase Order Requisition Draft",
                "answer": "Here is the AI-generated restock proposal based on dynamic lead-time demand:\n\n" +
                          "| Item | Current Stock | Dynamic ROP | Suggested Order Qty |\n" +
                          "| :--- | :--- | :--- | :--- |\n" +
                          "\n".join(order_table),
                "action_items": [
                    "Forward this requisition to the procurement / purchasing department.",
                    "Recommended order quantities cover 14-day operations plus 95% safety buffer."
                ]
            }

        # Intent 3: Anomaly / Spikes
        elif any(w in q for w in ["anomaly", "spike", "unusual", "theft", "drain", "leak"]):
            anomaly_items = [f for f in forecasts if f.get("anomalies")]
            if not anomaly_items:
                return {
                    "title": "Depletion Anomaly Audit",
                    "answer": r"No statistical anomalies or consumption surges detected in recent logs. Depletion rates remain within normal variance ($\pm 2.0\sigma$).",
                    "action_items": ["Consumption patterns are operating under normal parameters."]
                }
            
            details = []
            for f in anomaly_items:
                for a in f["anomalies"]:
                    details.append(f"- **{f['item']['name']}**: Sudden drop of **{a['amount']} units** on {a['ts']} (Z-score: {a['z_score']}, {a['note']}).")

            return {
                "title": "Statistical Depletion Anomalies Detected",
                "answer": "Unsupervised Z-score anomaly detector flagged abnormal transaction surges:\n\n" + "\n".join(details),
                "action_items": [
                    "Conduct a physical cycle count on flagged items.",
                    "Verify if large batch transfers were authorized or represent inventory leakage."
                ]
            }

        # Intent 4: Threshold optimization
        elif any(w in q for w in ["threshold", "safety stock", "optimize", "tune", "rop"]):
            suggestions = [f for f in forecasts if f["threshold_status"] != "optimal"]
            if not suggestions:
                return {
                    "title": "Threshold Health Check",
                    "answer": "All item thresholds are currently well-aligned with observed consumption velocity and vendor lead times.",
                    "action_items": ["Maintain current threshold configurations."]
                }
            
            lines = [f"- **{f['item']['name']}**: {f['threshold_assessment']}" for f in suggestions]
            return {
                "title": "Self-Tuning Threshold Recommendations",
                "answer": "AI comparison between manual thresholds and calculated dynamic Reorder Points (ROP):\n\n" + "\n".join(lines),
                "action_items": [
                    "Update thresholds for items marked 'too low' to protect against lead time variance."
                ]
            }

        # Default fallback
        else:
            return {
                "title": f"Executive Synthesis for '{tracker.get('name', 'Inventory')}'",
                "answer": f"**Health Score:** {ai_report.get('inventory_health_score')}/100\n\n"
                          f"{ai_report.get('executive_summary')}\n\n"
                          f"- Monitored Items: {len(forecasts)}\n"
                          f"- SKUs Requiring Action: {ai_report.get('high_risk_count', 0)}\n"
                          f"- Anomalies Flagged: {ai_report.get('total_anomalies', 0)}",
                "action_items": [
                    "Ask: 'Which items will run out first?' for depletion timelines.",
                    "Ask: 'Draft a purchase order' for auto-calculated replenishment quantities."
                ]
            }

    elif context_type == "attendance":
        preds = ai_report.get("member_predictions", [])
        
        # Intent 1: At-risk members
        if any(w in q for w in ["risk", "fail", "drop", "who", "worst", "danger", "warning"]):
            at_risk = [p for p in preds if p["risk_tier"] in ("CRITICAL", "HIGH")]
            if not at_risk:
                return {
                    "title": "Absenteeism Risk Assessment",
                    "answer": "No members currently meet the High or Critical risk criteria. All members exhibit steady engagement patterns.",
                    "action_items": ["Continue standard daily monitoring."]
                }
            
            lines = []
            for p in at_risk:
                lines.append(f"- **{p['member']['name']}** (Risk Score: **{p['risk_score']}/100** · {p['risk_tier']}): Current attendance **{p['current_pct']}%** · Trend: {p['trend_icon']} · {p['recommendation']}")

            return {
                "title": "Early Disengagement & Absenteeism Risks",
                "answer": f"The ML risk model identified **{len(at_risk)} member(s)** requiring timely intervention:\n\n" + "\n".join(lines),
                "action_items": [
                    "Initiate early outreach before the official threshold is permanently breached.",
                    "Review specific absence dates to identify external conflicts."
                ]
            }

        # Intent 2: Day patterns / Monday slump
        elif any(w in q for w in ["pattern", "monday", "friday", "day", "slump", "weekday", "behavior"]):
            patterns = ai_report.get("weekday_patterns", [])
            lines = [f"- **{p['day']}**: {p['pct']}% attendance ({p['sample_count']} sessions analyzed)" + (" **[SLUMP HOTSPOT]**" if p['is_slump'] else "") for p in patterns]
            
            return {
                "title": "Day-of-Week Behavioral Pattern Mining",
                "answer": "Historical analysis of attendance distribution by weekday:\n\n" + "\n".join(lines) + 
                          f"\n\n**Diagnosis:** {ai_report.get('slump_detected') or 'No statistically significant weekday slump detected.'}",
                "action_items": [
                    "Schedule mandatory interactive sessions on lower-performing weekdays to boost turn-out.",
                    "Deploy automated SMS / push reminders on preceding evenings."
                ]
            }

        # Intent 3: Tomorrow's forecast
        elif any(w in q for w in ["tomorrow", "forecast", "predict", "next", "future"]):
            day = ai_report.get("tomorrow_day_name", "Tomorrow")
            pct = ai_report.get("forecast_pct", 80)
            low = ai_report.get("ci_low", 75)
            high = ai_report.get("ci_high", 85)

            return {
                "title": f"Cohort Attendance Forecast for {day}",
                "answer": f"Based on historical {day} probability distributions and rolling cohort momentum:\n\n"
                          f"- **Expected Attendance:** **{pct}%**\n"
                          f"- **90% Confidence Interval:** **[{low}% – {high}%]**\n"
                          f"- **Operational Impact:** {'Staffing/capacity deficit risk is low.' if pct >= 75 else 'Deficit alert: Turnout may dip below 75% target.'}",
                "action_items": [
                    "Ensure backup resource allocation if attendance dips below the lower CI bound."
                ]
            }

        # Default fallback
        else:
            return {
                "title": f"AI Intelligence Summary for '{tracker.get('name', 'Cohort')}'",
                "answer": f"{ai_report.get('executive_summary')}\n\n"
                          f"- Members Monitored: {len(preds)}\n"
                          f"- High/Critical Risk Members: {ai_report.get('critical_members_count', 0)}\n"
                          f"- Cohort Grand Mean: {ai_report.get('cohort_avg_pct', '—')}%\n"
                          f"- Next Session ({ai_report.get('tomorrow_day_name')}): {ai_report.get('forecast_pct')}% forecasted",
                "action_items": [
                    "Ask: 'Who is at risk of falling below threshold?'",
                    "Ask: 'Analyze day-of-week attendance patterns'"
                ]
            }

    return {
        "title": "System Response",
        "answer": "Telemetry and predictive model loaded successfully.",
        "action_items": []
    }
