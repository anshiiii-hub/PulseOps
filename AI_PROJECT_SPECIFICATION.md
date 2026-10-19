# TrackIQ-AI: Predictive Inventory Demand Forecasting & Proactive Attendance Intelligence Platform

**Course/Domain:** Artificial Intelligence & Machine Learning (AIML 2026)  
**Project Classification:** Predictive Analytics, Time-Series Forecasting, Risk Classification, & Operations Intelligence  
**System Architecture:** Real-Time Stream Ingestion, Dynamic Statistical Optimization, Unsupervised Anomaly Detection, & Natural Language Decision Support (NLP)

---

## 1. Executive Abstract & Problem Formulation

### 1.1 The Classical Problem (Reactive Baseline)
Conventional inventory and human capital monitoring relies heavily on manual audits and rigid, static threshold rules (e.g., triggering a warning only *after* an item drops below 5 units, or *after* a student's attendance percentage falls below 75%). 

This reactive approach suffers from four critical institutional vulnerabilities:
1. **Late Stockout Identification:** Stockout alerts occur after reserves have already depleted, ignoring vendor replenishment lead times ($L$).
2. **Capital Inefficiency:** Fixed static thresholds either cause costly excess inventory holding or stockouts during sudden consumption surges.
3. **Delayed Absenteeism Intervention:** Interventions occur only after a member's cumulative grade or attendance is irrecoverably impaired, missing early disengagement patterns.
4. **Behavioral Blindspots:** Classical tools fail to detect multi-dimensional behavioral patterns, such as day-of-week slump syndromes (e.g., Monday absenteeism clusters) or abnormal bulk consumption anomalies (theft/leakage).

### 1.2 The Advanced AI Solution (TrackIQ-AI)
**TrackIQ-AI** converts reactive threshold alarming into an **autonomous predictive intelligence system**. By combining continuous consumption velocity tracking, dynamic lead-time safety stock optimization, unsupervised anomaly detection (Z-Score & IQR surge audits), multi-factor disengagement classification, and an integrated Natural Language Operations Copilot, TrackIQ-AI empowers managers to act *days ahead of operational failure*.

---

## 2. Mathematical Formulations & ML Algorithms

### 2.1 Predictive Inventory Demand & Runout Horizons
Rather than evaluating instantaneous stock $Q_t$, the AI engine models consumption velocity as a continuous time-series process:

1. **Daily Depletion Velocity ($\bar{v}$):**
   Given a set of historical depletion events $\Delta q_i < 0$ occurring at timestamp $t_i$:
   $$\bar{v} = \frac{\sum_{i=1}^{N} |\Delta q_i|}{\max(1.0, \Delta t_{\text{span}})}$$

2. **Stockout Horizon (Days Until Depletion, $T_{\text{runout}}$):**
   $$T_{\text{runout}} = \frac{Q_{\text{current}}}{\bar{v}}$$
   $$\text{Stockout Date} = t_{\text{now}} + T_{\text{runout}}$$

3. **Risk Tier Stratification:**
   - **Critical ($T_{\text{runout}} \le 2.0\text{ days}$):** Immediate procurement intervention required.
   - **High ($2.0 < T_{\text{runout}} \le 5.0\text{ days}$):** Reorder within standard supplier lead times.
   - **Moderate ($5.0 < T_{\text{runout}} \le 12.0\text{ days}$):** Approaching replenishment threshold.
   - **Stable ($T_{\text{runout}} > 12.0\text{ days}$):** Sufficient operational reserve.

---

### 2.2 Self-Tuning Dynamic Safety Stock & Reorder Points (ROP)
Classical systems require humans to guess arbitrary threshold values. TrackIQ-AI dynamically optimizes the Reorder Point based on lead-time demand variance:

1. **Safety Stock ($SS$):**
   $$SS = Z_{\alpha} \times \sigma_{\text{daily}} \times \sqrt{L}$$
   Where:
   - $Z_{\alpha} = 1.645$ (corresponding to a 95% cycle service level target).
   - $\sigma_{\text{daily}}$ is the standard deviation of individual transaction drops.
   - $L = 3\text{ days}$ is the supplier replenishment lead time.

2. **Dynamic Reorder Point ($ROP$):**
   $$ROP = (\bar{v} \times L) + SS$$

3. **Economic Order Quantity ($EOQ$) Approximation:**
   $$\text{Suggested Order Qty} = \max\left(2 \times ROP, \lceil \bar{v} \times 14 \rceil\right)$$

---

### 2.3 Unsupervised Anomaly Detection in Stock Depletion
To identify sudden unauthorized inventory leakage, bulk spoilage, or unrecorded transfers:
$$Z = \frac{|\Delta q_i| - \mu_{\text{drop}}}{\sigma_{\text{drop}}}$$
Any transaction satisfying $Z \ge 2.0$ or $|\Delta q_i| \ge 2.8 \times \mu_{\text{drop}}$ triggers a high-severity **Depletion Anomaly Flag**.

---

### 2.4 Multi-Factor Absenteeism Risk Classifier
Classical attendance calculation simply computes $\frac{\text{Present}}{\text{Total}}$. TrackIQ-AI models future disengagement using a multi-factor risk score ($R \in [0, 100]$):

$$R = \text{clamp}\left(\text{Base Risk} + \text{Streak Penalty} + \text{Momentum Decay}, 2, 99\right)$$

Where:
1. **Base Risk:**
   $$\text{Base Risk} = \begin{cases} 
      2.2 \times (T_{\text{target}} - P_{\text{current}}), & \text{if } P_{\text{current}} < T_{\text{target}} \\
      \max\left(0, 30 - (P_{\text{current}} - T_{\text{target}})\right), & \text{otherwise}
   \end{cases}$$

2. **Streak Penalty:**
   $$\text{Streak Penalty} = 14.0 \times S_{\text{absent}}$$
   Where $S_{\text{absent}}$ is the count of consecutive unexcused absences.

3. **Rolling Velocity / Momentum Decay ($\Delta P$):**
   $$\Delta P = P_{\text{recent 5 sessions}} - P_{\text{baseline historical}}$$
   $$\text{Momentum Penalty} = \begin{cases}
      0.8 \times |\Delta P|, & \text{if } \Delta P < 0 \text{ (deteriorating)} \\
      -\min\left(15, 0.5 \times \Delta P\right), & \text{if } \Delta P > 0 \text{ (recovering)}
   \end{cases}$$

---

### 2.5 Day-of-Week Behavioral Pattern Mining & Cohort Forecasting
1. **Weekday Pattern Mining:**
   Aggregates session records across weekdays $w \in \{\text{Mon, Tue, Wed, Thu, Fri}\}$:
   $$\text{Attendance}_w = \frac{\sum \text{Present}_w}{\sum \text{Total}_w}$$
   $$\text{Deviation}_w = \text{Attendance}_w - \bar{P}_{\text{cohort}}$$
   If $\text{Deviation}_w \le -10\%$, the system flags a **Behavioral Slump Syndrome** (e.g., Monday Fatigue Drop).

2. **Tomorrow's Forecast with Bayesian Prior Blend:**
   $$P_{\text{tomorrow}} = 0.6 \times \text{Attendance}_{w_{\text{tomorrow}}} + 0.4 \times P_{\text{recent 3 days}}$$
   $$\text{90\% Confidence Interval} = \left[P_{\text{tomorrow}} - 6.5\%, \min(100, P_{\text{tomorrow}} + 6.5\%)\right]$$

---

## 3. System Architecture

```
                          ┌─────────────────────────────────────┐
                          │     Real-Time Telemetry Stream      │
                          │   • Stock Movement Adjustments      │
                          │   • Daily Attendance Check-ins      │
                          └──────────────────┬──────────────────┘
                                             │
                       ┌─────────────────────┴─────────────────────┐
                       ▼                                           ▼
         ┌───────────────────────────┐               ┌───────────────────────────┐
         │    AI INVENTORY ENGINE    │               │   AI ATTENDANCE ENGINE    │
         ├───────────────────────────┤               ├───────────────────────────┤
         │ • Velocity (Burn Rate)    │               │ • Multi-Factor Risk Score │
         │ • Runout Forecast (Days)  │               │ • Streak & Momentum Decay │
         │ • Dynamic Safety Stock    │               │ • Day-of-Week Pattern Min.│
         │ • Z-Score Anomaly Audit   │               │ • Bayesian Turnout Forec. │
         └─────────────┬─────────────┘               └─────────────┬─────────────┘
                       │                                           │
                       └─────────────────────┬─────────────────────┘
                                             ▼
                          ┌─────────────────────────────────────┐
                          │   NATURAL LANGUAGE OPERATIONS AGENT │
                          │             (AI COPILOT)            │
                          ├─────────────────────────────────────┤
                          │ • "Which items will run out first?" │
                          │ • "Draft purchase order requisition"│
                          │ • "Who is at risk of dropout?"      │
                          │ • "Analyze Monday slump syndrome"   │
                          └──────────────────┬──────────────────┘
                                             │
                       ┌─────────────────────┴─────────────────────┐
                       ▼                                           ▼
         ┌───────────────────────────┐               ┌───────────────────────────┐
         │     INTERACTIVE UI        │               │   STRUCTURED CSV EXPORT   │
         │ • Mission Control Cards   │               │ • Burn Velocities         │
         │ • Stockout Horizon Badges │               │ • Dynamic Safety Stock    │
         │ • Weekday Slump Visualizer│               │ • Risk Classification     │
         │ • Real-Time Alert Polling │               │ • Prescriptive Actions    │
         └───────────────────────────┘               └───────────────────────────┘
```

---

## 4. Key Differences: Baseline vs. TrackIQ-AI

| Feature | Baseline Rule-Based System | TrackIQ-AI Platform |
| :--- | :--- | :--- |
| **Operational Stance** | **Reactive**: Triggers alert after violation. | **Proactive**: Predicts violation 2–14 days in advance. |
| **Inventory Thresholds** | Fixed manual constant (e.g. 10 units). | Dynamic Reorder Point ($ROP$) self-tuned to lead-time variance. |
| **Depletion Trajectory** | None (only knows current quantity). | Real-time burn velocity ($\bar{v}$) & estimated calendar stockout date. |
| **Consumption Anomaly** | Undetected. | Z-Score & statistical surge detection for leakage/theft. |
| **Absenteeism Analysis** | Simple historical percentage. | Multi-factor risk scoring ($R \in [0,100]$) with momentum decay. |
| **Behavioral Patterns** | Ignored. | Day-of-week pattern mining (e.g., Monday slump syndrome). |
| **Next-Day Forecasting** | None. | Probabilistic Bayesian forecast with 90% confidence interval. |
| **Manager Interface** | Static buttons & tables. | Interactive NLP Copilot for instant natural language queries. |

---

## 5. Software Stack & File Structure

- **Python 3.14+**
- **Flask 3.1+**: Microframework and RESTful streaming endpoints.
- **NumPy & Scikit-learn**: Time-series arrays, statistical variance, and regression modeling.
- **Vanilla CSS (Design Tokens)**: Modern, responsive glassmorphism mission-control styling.

### Repository Map
- `app.py`: Web application routes, JSON polling endpoints, and AI demo seeder.
- `ai_engine.py`: Core machine learning forecasting, risk classifier, and NLP Copilot.
- `inventory_logic.py`: Baseline threshold comparison and report generator.
- `attendance_logic.py`: Baseline attendance calculations.
- `templates/`:
  - `home.html`: AI overview and workspace selector.
  - `inventory_dashboard.html`: Inventory overview with AI health scores.
  - `inventory_detail.html`: Mission control panel, burn rate badges, dynamic ROP, and Copilot.
  - `attendance_dashboard.html`: Attendance overview with AI risk indicators.
  - `attendance_detail.html`: Weekday visualizer, risk matrix, and Copilot.
- `static/style.css`: Unified mission control design system with AI badges and copilot UI.
