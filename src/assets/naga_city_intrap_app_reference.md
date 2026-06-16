# Naga City INTRAP — Tricycle Commuter App Reference
**Intra-City Trimobile Transport Rationalization Plan**
*Compiled from official Naga City ordinances and the 2019 Naga City Transport Study (Ateneo de Naga University)*

---

## Table of Contents
1. [System Overview](#1-system-overview)
2. [Vehicle Types](#2-vehicle-types)
3. [Color-Coded Zone System](#3-color-coded-zone-system)
   - 3.1 [Urban INTRAP Zones](#31-urban-intrap-zones)
   - 3.2 [Special Franchise Zones — Upper Barangays](#32-special-franchise-zones--upper-barangays)
   - 3.3 [Zone Summary Table](#33-zone-summary-table)
4. [Free Zones](#4-free-zones)
5. [Barangay-to-Zone Mapping](#5-barangay-to-zone-mapping)
6. [CBD Trimobile Stations](#6-cbd-trimobile-stations)
7. [Loading & Unloading Rules](#7-loading--unloading-rules)
8. [Fares & Discounts](#8-fares--discounts)
9. [Driver & Franchise Rules](#9-driver--franchise-rules)
10. [Real-World Demand Data (2019 Study)](#10-real-world-demand-data-2019-study)
    - 10.1 [Fleet Size](#101-fleet-size)
    - 10.2 [Commuter Patterns](#102-commuter-patterns)
    - 10.3 [High-Demand Origins & Destinations](#103-high-demand-origins--destinations)
    - 10.4 [Peak Hours](#104-peak-hours)
    - 10.5 [Service Quality Pain Points](#105-service-quality-pain-points)
    - 10.6 [User Preferences for App Design](#106-user-preferences-for-app-design)
11. [Penalties & Enforcement](#11-penalties--enforcement)
12. [Key Ordinance Changelog](#12-key-ordinance-changelog)
13. [App Development Notes & Recommendations](#13-app-development-notes--recommendations)

---

## 1. System Overview

**INTRAP** (Intra-City Trimobile Transport Rationalization Plan) is the governing framework for all for-hire tricycles (trimobiles) in Naga City, Camarines Sur, Philippines.

- **Founding ordinance:** City Ordinance No. 93-026, enacted April 12, 1994
- **Approved by:** Mayor Jesse M. Robredo
- **Author:** Hon. Socorro Felix
- **Scope:** All Naga City-based motorized tricycles (trimobiles) classified as for-hire, operating within the city's territorial jurisdiction
- **Camaligan trimobiles** are governed by separate rules and are out of scope
- **Latest fare ordinance:** Ord. 2024-002 (January 16, 2024) — minimum fare raised to ₱15.00

**Important operational reality (as of 2019):** The 2019 Ateneo de Naga University transport study found that the INTRAP color-zone restrictions are *largely unenforced in practice*. The system operates de facto as a non-fixed-route system. Ordinance 2016-050 mandated an INTRAP revision study to address this. App design should account for both the formal ordinance structure and the real-world behavior.

---

## 2. Vehicle Types

All three types are covered under the broader term "tricycle" in current ordinances and the 2019 study:

| Vehicle Type | Local Name | Description | Franchise Ref. |
|---|---|---|---|
| Traditional tricycle/trimobile | Trimobile | 3-wheeled motorized vehicle with sidecar or backcar, max 4 passengers | Ord. 93-026 |
| Electric tricycle | E-trike | 100 units franchised (2011), 36 units active as of 2016 | Ord. 2011-065 |
| Taxicle | Taxicle | Enclosed tricycle variant, higher capacity (up to 6 passengers preferred) | Ord. 2014-057 (10 units) |
| Manual pedicab | Padyak | Human-powered 3-wheeled bicycle; separate rules, not covered by INTRAP | Ord. 93-049 Art. XXVIII |

> **Note for app:** The 2019 study recommends maintaining the number of traditional tricycles and taxicles while *increasing* e-trike units. Users prefer up to 4 passengers in traditional tricycles and up to 6 in taxicles and e-trikes.

---

## 3. Color-Coded Zone System

### 3.1 Urban INTRAP Zones

The urban district is divided into four zones, each assigned a color code. Trimobiles are painted with their assigned zone color for identification.

---

#### 🔵 Blue Zone — Zone 1

| Attribute | Value |
|---|---|
| Color code | Blue |
| Original unit count | 579 units |
| Governing ordinance | Ord. 93-026 (1994) |
| Amendments | Ord. 2009-063, Ord. 2016-020 |

**Core barangays:**
- Sta. Cruz
- Bagumbayan Sur
- Bagumbayan Norte
- Calauag
- Liboton
- San Felipe
- Peñafrancia
- San Francisco

**Outer barangays originally assigned to Blue** (before special zones were created):
- Pacol *(later given Tangerine)*
- Carolina *(later given Violet)*
- Panicuason *(later given Gray)*

**Route extensions (amendments):**
- Ord. 2009-063 — Blue Zone extended to Zone 2 of Barangay Del Rosario (Villa Corazon, Urban Poor, Boundary, Drupay)
- Ord. 2016-020 — Sitio Langon in Del Rosario added to Blue Zone route (Del Rosario–Cararayan–Ateneo de Naga High School/Pacol route)
- Ord. 2020-052 — 10 special franchise units for Salunguigui (Palmera Village) → Centro–Cararayan route

---

#### 🔴 Red Zone — Zone 2

| Attribute | Value |
|---|---|
| Color code | Red |
| Original unit count | 179 units |
| Governing ordinance | Ord. 93-026 (1994) |

**Core barangays:**
- Abella
- Igualdad
- Sabang

---

#### 🟢 Green Zone — Zone 3

| Attribute | Value |
|---|---|
| Color code | Green |
| Original unit count | 288 units |
| Governing ordinance | Ord. 93-026 (1994) |

**Core barangays:**
- Tinago
- Lerma
- Concepcion Pequeña
- Balatas
- Dayangdang
- Naga City Subdivision (Triangulo area)

**Outer barangay assigned to Green:**
- Dinaga

---

#### 🟡 Yellow Zone — Zone 4

| Attribute | Value |
|---|---|
| Color code | Yellow |
| Original unit count | 454 units |
| Governing ordinance | Ord. 93-026 (1994) |

**Outer barangays assigned to Yellow:**
- Concepcion Grande
- Del Rosario
- Cararayan
- San Isidro

---

### 3.2 Special Franchise Zones — Upper Barangays

These zones were created for barangays outside the original urban INTRAP coverage area. Governed primarily by Ord. 98-107 and subsequent amendments.

---

#### ⬜ White Zone — Balatas–Cararayan Special Route

| Attribute | Value |
|---|---|
| Color code | White |
| Governing ordinance | Ord. 98-107 (1998), as amended |
| Key amendments | Ords. 1999-046, 2000-009, 2001-088, 2009-073, 2016-029, 2018-079, 2019-061, 2020-052, 2022-046 |

**Route:** Balatas ↔ Cararayan (and sub-routes)

**Sub-routes and expansions:**
- Main Balatas–Cararayan route (bidirectional)
- Sitio Salunguigui (Palmera Village) → Centro–Cararayan (10 new special franchises, Ord. 2020-052)
- Deca Vistansa, Barangay Pacol → Cararayan proper via Sitio Salunguigui (10 special franchises, Ord. 2022-046)

**Note:** The Orange Zone was **abolished** by Ord. 2009-073 and its coverage merged into the White Zone.

---

#### 🟠 Tangerine Zone — Barangay Pacol

| Attribute | Value |
|---|---|
| Color code | Tangerine (orange-yellow) |
| Original units | 10 units |
| Additional units | +11 units (Ord. 2009-070) |
| Total authorized | ~21+ units |
| Governing ordinance | Ord. 98-107 (1998) |
| Key amendments | Ords. 99-046, 2000-009, 2004-066, 2009-070 |

**Routes:**
- Barangay Pacol → Barangay San Isidro (via Pacol-Nursery Road)
- Barangay Pacol Centro → Barangay Carolina Junction
- Within Barangay Pacol (all points)
- Vicente Heights Homeowners Association (added by Ord. 2009-070)

---

#### 🟤 Brown Zone — Barangay San Isidro

| Attribute | Value |
|---|---|
| Color code | Brown |
| Authorized units | 10 units |
| Governing ordinance | Ord. 98-107 (1998) |

**Routes:**
- San Isidro Centro → Carolina Junction
- San Isidro Centro → Barangay Pacol Centro (via Pacol-Nursery Road)
- All points within Barangay San Isidro

---

#### 🟣 Violet Zone — Barangay Carolina

| Attribute | Value |
|---|---|
| Color code | Violet |
| Authorized units | 20 units |
| Governing ordinance | Ord. 98-107 (1998) |

**Routes:**
- Carolina Junction → Panicuason Centro
- Carolina Junction → Pacol Centro
- Carolina Junction → San Isidro Centro
- All points within Barangay Carolina

---

#### ⬛ Gray Zone — Barangay Panicuason

| Attribute | Value |
|---|---|
| Color code | Gray |
| Authorized units | 5 units |
| Governing ordinance | Ord. 98-107 (1998) |
| Key amendments | Ord. 2004-008 (+5 units) |

**Routes:**
- Panicuason → Carolina Junction
- All points within Barangay Panicuason

---

#### ~~🟧 Orange Zone — ABOLISHED~~

> **Status:** Abolished by Ordinance No. 2009-073 (September 15, 2009). Coverage merged into the White Zone (Balatas–Cararayan route). Do not display or use in app.

---

### 3.3 Zone Summary Table

| Color | Zone | Barangays / Route | Original Units | Status |
|---|---|---|---|---|
| 🔵 Blue | Urban Zone 1 | Sta. Cruz, Bagumbayan Sur/Norte, Calauag, Liboton, San Felipe, Peñafrancia, San Francisco | 579 | Active |
| 🔴 Red | Urban Zone 2 | Abella, Igualdad, Sabang | 179 | Active |
| 🟢 Green | Urban Zone 3 | Tinago, Lerma, Concepcion Pequeña, Balatas, Dayangdang, Naga City Subdivision; Dinaga (outer) | 288 | Active |
| 🟡 Yellow | Urban Zone 4 | Concepcion Grande, Del Rosario, Cararayan, San Isidro (outer assignments) | 454 | Active |
| ⬜ White | Special – Balatas/Cararayan | Balatas ↔ Cararayan + sub-routes | Expanded | Active |
| 🟠 Tangerine | Special – Pacol | Barangay Pacol routes | 10 + 11 | Active |
| 🟤 Brown | Special – San Isidro | Barangay San Isidro routes | 10 | Active |
| 🟣 Violet | Special – Carolina | Barangay Carolina routes | 20 | Active |
| ⬛ Gray | Special – Panicuason | Barangay Panicuason routes | 5 + 5 | Active |
| ~~🟧 Orange~~ | ~~Special~~ | ~~Abolished~~ | — | **ABOLISHED** |

**Total formally franchised traditional tricycles (2019):** ~1,500 units citywide

---

## 4. Free Zones

Free zones are designated streets where **any tricycle color may operate freely** — picking up and dropping off passengers regardless of their zone assignment.

### Original Free Zones (Ord. 93-026, 1994)

| # | Location | Notes |
|---|---|---|
| 1 | Elias Angeles Street | Up to Colegio de Sta. Isabel |
| 2 | Bagumbayan Street (portion) | From Colegio de Sta. Isabel turning left to Ateneo Avenue |
| 3 | Peñafrancia Avenue | Full length |
| 4 | Ateneo Avenue | Full length |
| 5 | Blumentritt Street | From Panganiban Drive to Colgante Street |
| 6 | Panganiban Drive | Up to corner Diversion (Pres. Roxas Avenue) |
| 7 | Biak-na-bato Street | Up to corner Melgarejo Street |
| 8 | Central Business District (CBD) | Entire CBD area |

> **U-turn rule:** Tricycles may make U-turns at appropriate portions some distance from the end of Peñafrancia Ave., Ateneo Ave., Blumentritt St., Panganiban Drive, and Biak-na-bato St.

### Additional Free Zones Added by Ord. 2005-057 (July 25, 2005)

| # | Location | Landmarks / Boundaries |
|---|---|---|
| 9 | J. Hernandez Avenue | From corner Abella St. (Princeton Trading) to Zamora St. (in front of Romero Bakery) |
| 10 | UNC to Master Square corridor | From UNC (Blue Station) to Master Square |
| 11 | Caceres Street | From Venancio Hardware to Atlantic Bakery |
| 12 | Kinastillohan Street | Plaza Quezon side facing Philippine National Bank (PNB) |
| 13 | Padian Street Extension (underpass) | Naga City Public Market area |

---

## 5. Barangay-to-Zone Mapping

Use this as the primary lookup table for route assignment in the app. Sorted by zone color.

### Urban Zones

| Barangay | Zone Color | Notes |
|---|---|---|
| Sta. Cruz | 🔵 Blue | Core |
| Bagumbayan Sur | 🔵 Blue | Core; includes North-Bound Terminal, Queborac, P. Santos, Ateneo, NPS, USI |
| Bagumbayan Norte | 🔵 Blue | Core |
| Calauag | 🔵 Blue | Core; includes Jacob, Naga Central School, Molave, Capilihan |
| Liboton | 🔵 Blue | Core; includes MT Villanueva Ave. |
| San Felipe | 🔵 Blue | Core; includes Lomeda, Karangahan, Maramba |
| Peñafrancia | 🔵 Blue | Core; includes PhilAm, Cam High, Bora Hut |
| San Francisco | 🔵 Blue | Core |
| Abella | 🔴 Red | Core; includes LCC |
| Igualdad | 🔴 Red | Core |
| Sabang | 🔴 Red | Core; includes LCC |
| Tinago | 🟢 Green | Core |
| Lerma | 🟢 Green | Core; includes Petron |
| Concepcion Pequeña | 🟢 Green | Core; includes Greenland, SSS, Landbank Rotonda, Naga City Hall, BMC, St. Therese |
| Balatas | 🟢 Green | Core; includes Balatas Road, Magsaysay Ave., Shell Station, Basilica |
| Dayangdang | 🟢 Green | Core; includes Isarog, Mayon, Taal streets |
| Naga City Subdivision (Triangulo) | 🟢 Green | Includes PNR, Naga Subdivision, Diversion, NICC, Mother Seton |
| Dinaga | 🟢 Green | Outer barangay |
| Concepcion Grande | 🟡 Yellow | Outer barangay |
| Del Rosario | 🟡 Yellow | Outer; includes Villa Corazon, Urban Poor, Boundary, Drupay, GSIS |
| Cararayan | 🟡 Yellow | Outer; includes San Rafael, Cararayan Centro, Obiedo, Deca Langon |
| San Isidro | 🟡 Yellow | Outer (note: also has Brown Zone special franchise for intra-barangay trips) |
| Mabolo | 🟡 Yellow | Outer |
| Tabuco | 🟡 Yellow | Includes Tabuco 101 |

### Special Franchise Zones (Upper Barangays)

| Barangay | Zone Color | Route(s) |
|---|---|---|
| Pacol | 🟠 Tangerine | Pacol ↔ San Isidro (via Nursery Rd); Pacol ↔ Carolina Junction; Vicente Heights; Deca Vistansa |
| San Isidro | 🟤 Brown | San Isidro Centro ↔ Carolina Junction; ↔ Pacol Centro |
| Carolina | 🟣 Violet | Carolina Junction ↔ Panicuason / Pacol / San Isidro |
| Panicuason | ⬛ Gray | Panicuason ↔ Carolina Junction |
| Balatas | ⬜ White | Balatas ↔ Cararayan (also has Green Zone coverage as urban barangay) |
| Cararayan | ⬜ White | Cararayan ↔ Balatas; Deca Langon; Salunguigui (also Yellow Zone outer barangay) |

> **Dual-zone note:** Balatas and Cararayan appear in both an urban zone and the White special franchise zone. Green/Yellow units serve these barangays from the urban side; White units serve the Balatas–Cararayan corridor specifically.

---

## 6. CBD Trimobile Stations

Designated loading/unloading stops within the Central Business District. Tricycles **must** load and unload only at their assigned station within the CBD.

The CBD is bounded by: Arana Street on the North (from J. Hernandez Ave. to Peñafrancia Ave.), Naga River on the West.

Stations are color-assigned. The following are from the original INTRAP ordinance (Ord. 93-026). Ord. 2005-057 revised Sec. 8 to designate **13 trimobile stations** in the CBD, adding/replacing some locations. The combined list:

| # | Location | Colors Assigned |
|---|---|---|
| 1 | Short Street — between Naga City Public Market and Tabuco Bridge (market side, direction North) | Green, Red |
| 2 | Short Street — between Tabuco Bridge approach and Chinese Commercial Building (bridge side, direction East) | Yellow, Blue |
| 3 | J. Hernandez Ave. — between Victor Drug House and Fortuna Department Store (right side, direction South) | Blue, Green |
| 4 | J. Hernandez Ave. — near corner Igualdad Interior Alley (right side, direction South) | Red, Yellow |
| 5 | J. Hernandez Ave. — ~10m from corner Abella St. (right side, direction South) | Green |
| 6 | J. Hernandez Ave. — fronting Master's Square (right side, direction South) | Green |
| 7 | J. Hernandez Ave. — ~6m from UNC gate (right side, direction South) | Green, Red |
| 8 | Padian Street underpass — some meters from General Luna St. (right side, direction West) | Blue, Yellow |
| 9 | P. Burgos Street — near corner Barlin Street (right side, direction West) | Yellow |
| 10 | J. Hernandez Ave. — opposite Rodson Hotel (direction South) | Blue |
| 11 | Prieto Street — 6m from corners of Gen. Luna and Hernandez Ave. (left side, direction East) | Blue, Yellow |
| 12 | General Luna Street — fronting Sampaguita Supermart (right side, direction North) | Green, Blue |
| 13 | General Luna St. — fronting Stedman Tailoring (right side, direction North) | Red, Yellow |
| 14 | General Luna St. — fronting Farmacia Uy (right side, direction North) | Green |
| 15 | General Luna St. — fronting Robertson–Plaza Rizal (direction North) | Yellow, Blue |
| 16 | General Luna St. Extension — fronting Filipiniana (right side, direction North) | Blue |
| 17 | P. Burgos St. — right side behind Plaza Quezon Stage (direction East) | Red, Green |
| 18 | Elias Angeles St. — between Padian St. and Prieto St., ~6m from both corners (right side, direction South) | Green, Red |
| 19 | Elias Angeles St. — fronting Naga Glass and Aluminum Supply, before Prieto St. (right side, direction South) | Yellow, Blue |
| 20 | Elias Angeles St. — 6m from Evangelista St. (right side, direction South) | Green, Yellow |
| 21 | Elias Angeles St. — between Evangelista St. and Panganiban Drive (right side, direction South) | Red, Blue |
| 22 | Elias Angeles St. — fronting Blacer Food House, before corner P. Burgos St. (right side, direction South) | Yellow, Blue |
| 23 | Arana St. — fronting GSIS, ~6m from corner Gen. Luna Extension (right side, direction West) | Red, Green |
| 24 | Peñafrancia Ave. — ~6m from corner Panganiban Drive, Alex Theater side (direction South) | Green, Red |
| 25 | Peñafrancia Ave. — between BIR and McIntosh Tailoring (right side, direction North) | Blue, Yellow |
| 26 | Peñafrancia Ave. — fronting San Francisco Church (right side, direction North) | Green |
| 27 | Panganiban Drive — fronting Naga Auto Supply (right side, direction East) | Yellow |

**From Ord. 2005-057 (added/revised):**
| # | Location | Colors |
|---|---|---|
| A | Evangelista Street — 6m from both Elias Angeles St. and Gen. Luna St. corners (left side, direction West); no banking institutions | Green, Yellow (5 units max) |
| B | Kinastillohan Street — left side going to PNB | Green, Yellow |
| C | Prieto Street — Garmas side (Red & Yellow); Shopper's Mall side (Blue) — left and right sides | Red, Yellow, Blue |
| D | Riverside — Naga City Public Market | Green |
| E | Abella Extension corners J. Hernandez Ave. and Gen. Luna St. (right side going to Abella) | Red |

> **Prohibition:** No private vehicles may park at designated trimobile stations. The waiting area along General Luna Street was abolished by Ord. 2005-057.

---

## 7. Loading & Unloading Rules

| Situation | Rule |
|---|---|
| Within CBD | Load/unload only at designated trimobile stations of assigned color |
| Within free zones | May unload anywhere; must stop as close to sidewalk as possible |
| Outside CBD | Load/unload anywhere consistent with Traffic Code (Ord. 93-049) |
| Bulk cargo within CBD | May be picked up along the way if too heavy to bring to a station |
| Passenger limit | Maximum 4 passengers per traditional tricycle |
| Passenger limit (taxicle/e-trike) | Up to 6 passengers (user preference per 2019 study) |
| CBD hours enforcement | Originally 6:00 AM to 7:00 PM (Phase I) |
| Zone-crossing in CBD | Tricycle must only ferry passengers going to its assigned color zone from its CBD station |

---

## 8. Fares & Discounts

### Current Fare Structure (as of January 2024)

| Item | Amount | Ordinance |
|---|---|---|
| Minimum fare (≤ 1 km) | ₱15.00 | Ord. 2024-002 |
| Previous minimum fare | ₱13.00 | Ord. 2022-071 |
| Fare before 2022 | ₱8.00 (approx.) | Ord. 2015-010 |

### Mandatory Discounts

The following passengers are entitled to a **20% discount** and must present valid ID:

| Eligible Group | ID Required |
|---|---|
| Senior Citizens | Senior Citizen ID |
| Students | School ID |
| Persons with Disability (PWD) | PWD ID |
| Solo Parents | Solo Parent ID (added by Ord. 2021-005) |

### Fare Matrix

As per Ord. 2024-002, the Public Safety Office (PSO) is mandated to produce and publish an **official fare matrix** — a schedule of correct fares from common origins to common destinations. This should be integrated directly into the app.

### User-Suggested Fares (2019 study baseline)

| Trip Type | Suggested Fare |
|---|---|
| Short trip (≤ 1 km) | ₱8.41 mean (₱8.00 median) — *now superseded by ₱15.00 minimum* |
| Special/long trip (> 1 km) | ₱9–₱300 range; ₱40–₱50 median |

> **App recommendation:** Implement a fare calculator using the PSO fare matrix when published. Display the 20% discounted rate automatically when applicable. Per the 2019 study, Nagueños strongly support (87% agreement) a minimum fare for short trips and moderately support (51%) special trip pricing beyond 1 km.

---

## 9. Driver & Franchise Rules

### Driver Accreditation Requirements

All trimobile drivers must be accredited by the City Government through the **Trimobile Task Force** before operating. Requirements:

1. Valid professional driver's license with at least **LTO Restriction Code No. 1**
2. Certificate of attendance from a one-day seminar on Traffic Regulations and Right Conduct of Trimobile Drivers (held by City Government / PNP)
3. First aid / Basic Life Support training (mandated by Ord. 2018-025, refreshed every 2 years)

**Driver identification:** A City Trimobile ID Card with the current year's accreditation sticker must be displayed inside the trimobile at all times while operating. The app may reference this ID for driver verification.

### Franchise Requirements

- Valid franchise granted by the Sangguniang Panlungsod (Ord. 2017-041 — SP Resolution is the *sole* official proof of franchise)
- Valid Mayor's Permit to Operate
- Tricycle must be registered with LTO and the City Trimobile Task Force
- Zone assignment must be clearly indicated in all franchise/registration documents
- Trimobile body must be painted with its assigned zone color (visible color identification)

### Franchise Transfer Rules

- Transfer of tricycle franchise between private individuals is strictly regulated
- Illegal transfers are penalized (Ord. 1999-049, Ord. 2019-093)
- Several amnesty ordinances have been issued for pandemic-era and other illegal transfers (Ords. 2004-050, 2013-030, 2014-077, 2021-109)
- Transfer fee applies for authorized transfers (Ord. 2007-024, Ord. 2014-023)

### Trimobile Task Force

The **Trimobile Task Force** (under the Public Safety Office / PSO) is responsible for:
- Driver accreditation and ID issuance
- Violation monitoring and reporting
- Monthly reporting of violations to the SP (mandated by Ord. 2024-002)
- Recommending franchise suspension (3+ monthly violations) or cancellation (6+ annual violations)

---

## 10. Real-World Demand Data (2019 Study)

*Source: 2019 Naga City Transport Study, Ateneo de Naga University (Tejada & Nubla). Survey of n=810, 95% CI, ±3% margin of error. Conducted February 2–24, 2019.*

### 10.1 Fleet Size

| Metric | Value |
|---|---|
| Traditional tricycle franchises | ~1,500 units citywide |
| E-trikes (active as of 2016) | 36 units |
| Taxicles | 10 units |

### 10.2 Commuter Patterns

| Metric | Value |
|---|---|
| Households with at least one commuter | 91% |
| City residents who are commuters | ~49% |
| Commuters using tricycle daily | 35% of all city residents |
| Weekly tricycle riders (1–2x/week) | 30% of all city residents |
| Weekday commuters who ride all 5 days | 66% |
| Weekday mode share — tricycle | 72% |
| Weekend mode share — tricycle | 63% |
| Mean daily weekday transport cost | ₱30.37 |
| Mean daily weekend transport cost | ₱29.23 |
| Total daily commute time (weekday, 20 days) | ~15 hours/month |

### 10.3 High-Demand Origins & Destinations

#### Easiest locations to find a tricycle

| Rank | Origin | % Households | Rank | Destination | % Households |
|---|---|---|---|---|---|
| 1 | CBD 1 | 55.2% | 1 | CBD 1 | 38.2% |
| 2 | CBD 2 | 10.2% | 2 | CBD 2 | 29.9% |
| 3 | Del Rosario | 6.5% | 3 | Balatas | 5.1% |
| 4 | Calauag | 4.2% | 4 | Calauag | 4.9% |
| 5 | Bagumbayan Sur | 3.7% | 5 | Peñafrancia | 4.2% |

**CBD 1 includes:** Plaza Rizal, Quinse Martires, NCPM, Master Square, E-Mall, Dinaga, San Francisco, General Luna, UNC, Advent, Igualdad
**CBD 2 includes:** SM City Naga, Central Bus Station, Panganiban Drive

#### Hardest locations to find a tricycle (supply-demand mismatch — app priority areas)

| Rank | Origin | % Households | Rank | Destination | % Households |
|---|---|---|---|---|---|
| 1 | CBD 1 (rush hour) | 43.8% | 1 | CBD 1 | 29.6% |
| 2 | Triangulo | 7.3% | 2 | Concepcion Pequeña | 9.6% |
| 3 | CBD 2 | 6.3% | 3 | Calauag | 8.2% |
| 4 | Peñafrancia | 4.9% | 4 | CBD 2 | 7.8% |
| 5 | Balatas | 4.8% | 5 | Dayangdang | 5.8% |

**Triangulo includes:** PNR Station, Naga City Subdivision, Diversion, NICC, Mother Seton
**Concepcion Pequeña includes:** Greenland, SSS, Landbank Rotonda, Naga City Hall, BMC

> **Key finding:** CBD 1 is simultaneously the easiest and hardest location — easy during off-peak (ample drivers waiting for passengers), hard during afternoon rush (high commuter competition; drivers avoid the one-way loop through Elias Angeles → Caceres → General Luna).

#### Top weekday origin-destination pairs

| Origin | Destination | Volume |
|---|---|---|
| CBD 1 | CBD 1 (transfer hub) | ~60% of all weekday trips |
| CBD 1 | Concepcion Pequeña | 15.6% |
| CBD 1 | Balatas | 13.5% |
| CBD 1 | Calauag | 12.4% |
| CBD 1 | Cararayan | 12.2% |
| CBD 1 | Del Rosario | 12.1% |
| CBD 1 | San Felipe | 12.1% |
| Balatas | CBD 1 | 23.3% origin |
| Concepcion Pequeña | CBD 1 | 16.7% origin |
| San Felipe | CBD 1 | 13.2% origin |

#### Top weekend origin-destination pairs

| Origin | % | Destination | % |
|---|---|---|---|
| CBD 1 | 65.0% | CBD 1 | 67.7% |
| Concepcion Pequeña | 16.7% | Balatas | 16.7% |
| Balatas | 16.4% | Concepcion Pequeña | 16.5% |
| San Felipe | 12.8% | San Felipe | 12.8% |
| Del Rosario | 11.9% | Del Rosario | 11.8% |
| Peñafrancia | 10.8% | Peñafrancia | 11.2% |

### 10.4 Peak Hours

| Period | Details |
|---|---|
| Weekday morning peak | 6:00 AM – 8:00 AM (up to 30% of commuters depart) |
| Weekday afternoon peak | 4:00 PM – 5:00 PM (up to 20.6% of commuters depart) |
| Weekend morning peak | 7:00 AM (early churchgoers; ~20% of households) |
| Weekend afternoon peak | 4:00 PM – 6:00 PM (25% of households) |
| Earliest departures | Before 4:00 AM (both weekday and weekend) |

> **Worst congestion window:** CBD 1 afternoon rush (4–5 PM) — drivers avoid the one-way traffic loop, drastically reducing supply at the most in-demand point. This is the single highest-priority problem for the app to solve.

### 10.5 Service Quality Pain Points

Based on survey results — all relevant to app features:

| Issue | Prevalence | Detail |
|---|---|---|
| Difficulty finding tricycle during rush | Common at CBD 1, Triangulo | Supply-demand mismatch |
| Waiting time | Mean 13.6 min (preferred: 5 min) | Neutral satisfaction rating |
| Travel time | Mean 20.3 min (preferred: 11.7 min) | Acceptable but longer than ideal |
| Driver refuses/is picky with passengers | 77% of those who encountered issues | Top complaint |
| Fare overcharging | 41% of those who encountered issues | Second top complaint |
| Road safety violations | 49.5% of households observed | Unsafe lane changes (47%), speeding (34%), illegal pickup (31%) |
| Driver returns lost items | Low confidence: 35.8% disagree | Trust deficit |
| Politeness/courtesy | "Neutral" rating (neither agreed nor disagreed) | |
| Driver ID display | 55.6% agree drivers display IDs | Should be enforced/surfaced in app |

### 10.6 User Preferences for App Design

| Preference | Survey Result | Implication |
|---|---|---|
| Continue traditional tricycles | 58.4% net agreement (extremely strong) | Core transport stays |
| Do not add more traditional tricycles | -10.5% net (moderately weak) | Fleet is at capacity |
| Add more e-trikes | +27.8% net (moderately strong) | E-trike integration is desired |
| Current non-fixed route system | +9.9% (moderately acceptable) | Users are ambivalent; flexible routing preferred |
| Minimum fare for short trips (≤ 1 km) | +77.2% net (extremely strong) | Fare transparency matters |
| Special/per-km pricing beyond 1 km | +14.9% net (moderately strong) | Distance-based pricing acceptable |
| Preferred max waiting time | 5 minutes | Use as target SLA in app |
| Preferred max travel time | 11.7 minutes | Benchmark for route optimization |
| Preferred max passengers (traditional) | 4 (median) | Match to ordinance limit |
| Preferred max passengers (e-trike/taxicle) | 6 (median) | Display in app per vehicle type |
| Top complaint resolution request | Strict penalties + immediate action (60%) | Reporting feature must show follow-through |

---

## 11. Penalties & Enforcement

### Driver Violations (Ord. 93-026, as amended by Ord. 93-048)

| Violation | 1st Offense | 2nd Offense | 3rd Offense | 4th Offense |
|---|---|---|---|---|
| Picking up passengers in CBD outside designated stop | ₱200 | ₱500 | ₱1,000 + 1 month suspension | Cancellation of accreditation |
| Picking up passenger not bound for assigned color zone | ₱200 | ₱500 | ₱1,000 + 1 month suspension | Cancellation of accreditation |
| Entering road restricted to assigned color | ₱200 | ₱500 | ₱1,000 + 1 month suspension | Cancellation of accreditation |
| Other ordinance violations | ₱100–₱500 (court discretion) | | | |

### Special Franchise Violations (Ord. 98-107)

| Offense | Fine |
|---|---|
| 1st offense | ₱200 (or 25% administrative fine) |
| 2nd offense | ₱300 (or 50% administrative fine) |
| 3rd offense | ₱500 (or 75% administrative fine) |
| 4th offense | Revocation of Mayor's Permit and/or impounding |

### Franchise-Level Violations (Ord. 2024-002)

| Threshold | Consequence |
|---|---|
| 3+ violations in a single month | Franchise suspension recommended |
| 6+ violations in a year | Franchise recall/cancellation recommended |

### Reporting Channel

- **Public Safety Office (PSO) Desk** — primary complaint channel for unruly drivers
- 65% of households are aware of the PSO desk
- Only 2.7% of affected households actually file complaints (huge gap — app can help close this)
- Complaint resolution time is rated "neutral" to "poor" by those who filed

---

## 12. Key Ordinance Changelog

Chronological list of all major ordinances affecting INTRAP/tricycle operations:

| Ordinance | Date | Key Change |
|---|---|---|
| 93-026 | 1994-04-12 | Original INTRAP — zones, colors, CBD stations, accreditation |
| 93-048 | 1993 | Amended penalties under INTRAP |
| 93-049 | 1993 | Transport and Traffic Code — umbrella code for all vehicles |
| 94-055 | 1994-01-26 | Required uniforms for trimobile drivers |
| 98-107 | 1998-10-21 | Special franchises for upper barangays (Gray, Violet, Brown, Tangerine) |
| 99-046 | 1999-06-23 | Added Balatas, Cararayan, Del Rosario to upper barangay coverage |
| 99-049 | 1999-07-14 | Prohibited private transfer of tricycle franchise |
| 2001-088 | 2001-11-28 | Redistribution of White Zone units for Balatas/Cararayan |
| 2004-050 | 2004-04-06 | Amnesty for illegally transferred franchises |
| 2005-053 | 2005 | Amended INTRAP Sections 5, 8, 9 (basis for 2005-057) |
| 2005-057 | 2005-07-25 | Expanded free zones; revised CBD trimobile stations to 13 |
| 2006-015 | 2006-03-27 | Regulated trimobile operation along national roads |
| 2007-024 | 2007-08-28 | Transfer fee mechanism for tricycle franchise |
| 2009-070 | 2009-09-01 | +11 Tangerine units for Vicente Heights, Barangay Pacol |
| 2009-073 | 2009-09-15 | **Abolished Orange Zone**; +4 White Zone units (Balatas/Cararayan) |
| 2009-087 | 2009-11-24 | Annual registration scheme for tricycles for hire and not-for-hire |
| 2014-057 | 2014-10-07 | Franchised 10 taxicle units |
| 2014-077 | 2014-12-09 | Amnesty for illegal franchise transfers |
| 2016-020 | 2016-04-26 | Sitio Langon added to Blue Zone route |
| 2016-029 | 2016-06-21 | +14 trimobile units for Balatas–Cararayan (White Zone) |
| 2016-050 | 2016-09-27 | Mandated INTRAP revision and upgrading study |
| 2017-041 | 2017-06-20 | SP Resolution declared sole official proof of franchise |
| 2018-025 | 2018 | Mandated first aid/BLS training for all trimobile drivers |
| 2018-079 | 2018-10-23 | Increased White Zone from 14 to 18 units (Balatas–Cararayan) |
| 2019-093 | 2019-11-19 | Maximum penalties for illegal franchise sales |
| 2020-052 | 2020-06-09 | 10 new special franchise units — Salunguigui/Palmera Village to Cararayan |
| 2020-063 | 2020-07-21 | Regulated trimobile not-for-hire; new plate issuance |
| 2021-109 | 2021-12-22 | COVID amnesty for franchise transfers during pandemic |
| 2022-046 | 2022-06-20 | 10 special units for Deca Vistansa (Barangay Pacol) to Cararayan via Salunguigui |
| 2022-071 | 2022-09-06 | Fare reduction/revision — set minimum at ₱13.00 |
| 2024-002 | 2024-01-16 | **Minimum fare raised to ₱15.00**; monthly violation monitoring mandated |

---

## 13. App Development Notes & Recommendations

This section consolidates actionable insights from the ordinances and the 2019 study specifically for app feature design.

### Core Data Requirements

```
Zones: 9 active color zones (Blue, Red, Green, Yellow, White, Tangerine, Brown, Violet, Gray)
Barangays: 27 barangays with zone assignments
Free zones: 13 designated streets/areas
CBD stations: 27 station locations with color assignments
Vehicle types: Traditional tricycle, e-trike, taxicle
```

### Suggested App Features (Priority Order)

#### P1 — Critical (address top pain points)

| Feature | Rationale |
|---|---|
| Real-time tricycle availability map | Primary pain point: hard to find tricycles, especially during rush; mean wait = 13.6 min vs preferred 5 min |
| Peak-hour alerts for CBD 1 | CBD 1 afternoon rush (4–5 PM) is the single worst supply crunch; warn users and suggest alternatives |
| Fare calculator with discount toggle | Users strongly support (77%) transparent minimum fare; 20% discount for eligible groups must be surfaced |
| Route finder with color-zone display | Show which color(s) serve a given origin→destination pair |
| Driver complaint/reporting tool | Only 2.7% of aggrieved users currently file complaints; app can dramatically close this gap |

#### P2 — Important

| Feature | Rationale |
|---|---|
| CBD station navigator | Show nearest station by color for within-CBD trips |
| Free zone map overlay | Riders often don't know where any color can stop |
| Tricycle type filter (traditional / e-trike / taxicle) | Users prefer e-trikes (younger demographic especially) |
| Driver ID verification / display | 23.6% of users disagree drivers display IDs; app can surface accreditation status |
| Estimated wait & travel time | Benchmark against 5 min wait / 11.7 min travel preferences |

#### P3 — Desirable

| Feature | Rationale |
|---|---|
| Trip history and cost tracker | Mean daily cost ₱30.37; useful for commuter budgeting |
| Weekend trip planner | Top weekend purpose: church (52%), market (24%), leisure/mall (29%) — Sunday peak at 7 AM |
| PSO/complaint status tracker | Rated "neutral to poor" for follow-through; transparency builds trust |
| Driver rating system | Politeness and courtesy rated only "neutral"; accountability mechanism needed |
| Violation reporting (safety) | 49.5% of users observed traffic violations; app can crowdsource enforcement data |

### Zone Logic for Route Planning

```
If origin_barangay and destination_barangay are both in CBD free zones:
  → any color tricycle can serve
  
If both are in the same color zone:
  → direct service by that zone's color

If zones differ:
  → user must transfer at CBD (most common pattern: ~60% of all trips pass through CBD 1)
  → show: Zone A tricycle → CBD station → Zone B tricycle

Special franchise zones (White, Tangerine, Brown, Violet, Gray):
  → operate primarily within their designated route corridor
  → cannot freely enter urban CBD zone stations
```

### Geographic Landmark Reference (for geo-coding)

| Landmark / Cluster | What it covers | Zone |
|---|---|---|
| CBD 1 | Plaza Rizal, Quinse Martires, NCPM, Master Square, E-Mall, Dinaga, Garmas, San Francisco, Gen. Luna, UNC, Advent, Igualdad | Multiple (free zone) |
| CBD 2 | SM City Naga, Central Bus Station, Panganiban Drive | Multiple (free zone) |
| Triangulo | PNR Station, Naga City Subdivision, Diversion, NICC, Mother Seton | 🟢 Green |
| Bagumbayan Sur cluster | North-Bound Terminal, Queborac, P. Santos, Ateneo, NPS, USI | 🔵 Blue |
| Balatas cluster | Balatas Road, Magsaysay Ave., Shell Station, Basilica | 🟢 Green / ⬜ White |
| Cararayan cluster | San Rafael, Cararayan Centro, Obiedo, Deca Langon | 🟡 Yellow / ⬜ White |
| Concepcion Pequeña cluster | Greenland, SSS, Landbank Rotonda, City Hall, BMC, St. Therese | 🟢 Green |
| Del Rosario cluster | Villa Corazon, Urban Poor, Boundary, Drupay, GSIS | 🟡 Yellow |
| Dayangdang cluster | Isarog, Mayon, Taal streets | 🟢 Green |
| Calauag cluster | Jacob, Naga Central School, Molave, Capilihan | 🔵 Blue |
| Peñafrancia cluster | PhilAm, Cam High, Bora Hut | 🔵 Blue |
| San Felipe cluster | Lomeda, Karangahan, Maramba | 🔵 Blue |
| Sta. Cruz cluster | Barlin, Old GSIS | 🔵 Blue |
| Lerma cluster | Petron area | 🟢 Green |
| Abella/Sabang cluster | LCC area | 🔴 Red |

### Key Ordinance Contacts / Enforcement Bodies

| Body | Role |
|---|---|
| Sangguniang Panlungsod (SP) | Legislative authority; grants franchises; passes ordinances |
| Trimobile Task Force | Accreditation, ID issuance, violation monitoring |
| Public Safety Office (PSO) | Complaint desk; compliance monitoring; fare matrix publication |
| PNP Traffic Enforcement Unit (TEU) | Road violations; reports monthly to Trimobile Task Force |
| City Planning and Development Office | Zone assignments; INTRAP revision studies |

### Compliance Triggers (for app alerts or driver-side features)

Per Ord. 2024-002, the PSO reports violations monthly. The franchise suspension/cancellation thresholds are:
- **3+ violations in 1 month** → franchise suspension recommended
- **6+ violations in 1 year** → franchise cancellation recommended

A driver-facing app could track and display this in real time.

---

*Document compiled June 2026. Sources: Naga City official ordinances (www2.naga.gov.ph), 2019 Naga City Transport Study (Tejada & Nubla, Ateneo de Naga University), Ordinance No. 93-026 and all amendments through Ord. 2024-002.*
