# cff_route_watch

Watches the train connections between **Lancy-Pont-Rouge** and **Aigle** using the
[Swiss public transport API](https://transport.opendata.ch/) and tells you when your train is
**very late or cancelled**.

Everything is in one file, `cff_dashboard.html`: no install, no Python, no server.

**Open it online: https://nicomeynet.github.io/cff-route-watch/**

## Getting started

Open **https://nicomeynet.github.io/cff-route-watch/** in your browser, on a computer or a phone.
It loads live SBB/CFF data and refreshes every 60 seconds. Keep the tab open: the page only checks
your trains while it is open. To use another route, add it to the address, for example
`https://nicomeynet.github.io/cff-route-watch/?from=Genève&to=Lausanne`, or pick the stations
in Settings and copy the link (see [Settings in the link](#settings-in-the-link)).

You can also download `cff_dashboard.html` and double-click it. Opened as a local file, the
browser may block desktop pop-up notifications: you still get a beep, the on-page alerts and a
⚠️ in the tab title. The online version doesn't have this limit.

The online page is published with GitHub Pages from the `main` branch of this repository: any
change pushed to `main` is online within a minute or two.

## What it shows

- **Direction chosen automatically:** before 12:00 Aigle → Lancy-Pont-Rouge, from 12:00
  Lancy-Pont-Rouge → Aigle. Two buttons at the top let you override it until the next
  automatic switch (noon or midnight).
- **Top card:** your train, or the next one, with a big colour-coded status: green on time,
  amber late (≥ 5 min), red very late (≥ 15 min) or cancelled. It shows live times next to the
  crossed-out scheduled ones, platform changes and a countdown.
- **Pin your train:** click a connection to make it *your train*. Alerts then focus on it, and it
  stays monitored **after departure until it reaches the destination**. It unpins itself on
  arrival.
- **Time left:** once your pinned train has left, the top card shows a big **⏱ Time left**
  (e.g. 47 min, or 1h16), the live arrival time, the next stop and a progress bar of the trip.
  Delays are included, and it updates every 20 seconds.
- **Stops and position:** the top card of your pinned train lists its next stops and the last
  2 it passed (greyed out), with times, live delays, platforms and the station where you change
  trains. "⋯ show earlier stops" unfolds the rest. It also shows **where the train is now**: not
  departed yet, at a station, or between two stations with a progress bar. The position is
  *estimated* from the timetable and live delays (the API has no GPS data) and moves every
  20 seconds.
- **Already on the way:** other trains that have left but not arrived are folded at the top of
  the list. The folded header turns amber or red when one of them has a problem.
- **Direct only** (on by default): hides trains with a change. When the last direct train of
  the day has left, a note says so, with a button to show trains with a change.
- **Long trips:** trips longer than 1:45 (live delays included) get a small amber ⏳ warning,
  and trips longer than 2:30 a red one.
- **Occupancy:** 1st/2nd class bars (green low, amber medium, red high), shown only when the
  API provides the data. At the moment it usually doesn't.
- **Languages:** English, French and German (EN · FR · DE switch). On first opening, the page
  uses your browser's language.

## Delays and cancellations

- **Delays:** departure, arrival and each leg of a trip with a change.
- **Change at risk / change missed:** on trips with a change, it compares the first train's delay
  with the time left to change (2 min by default). This alerts even when the delay is below the
  threshold.
- **Cancellations:** the API has no "cancelled" flag, so the page combines three checks:
  1. it notices a train that **disappears** from the results;
  2. it **remembers the trains that usually run** at each time (weekdays, Saturdays and
     Sundays separately) and flags one that is missing today, even if you open the page after
     the cancellation. This needs at least two earlier days of use;
  3. it checks the **departure board** at your station to tell a **cancelled** train from a
     **connection that no longer works** (the first train runs, but a later one doesn't).
- **During the trip:** if your pinned train disappears while on the way, it shows **Disrupted**.
- **Best alternative:** when your train is cancelled, misses its change or is very late, the
  page suggests the train that gets you there soonest, with a **Switch to this train** button.

## Alerts and notifications

Click **🔔 Alerts** to turn on the beep and desktop notifications. You're notified again only
when the situation gets worse (for example every extra 5 minutes of delay). Notifications
include the suggested alternative. With a train pinned, only that train triggers alerts.
Otherwise, any train leaving in the next 2 hours does.

The page refreshes again as soon as you come back to the tab, the computer wakes up or the
network returns, and warns you when the data is more than about 2 minutes old.

## Settings

**Station A** and **Station B** are search fields: type 2 letters or more and pick a station from
the suggestions (train stations first, then tram and bus stops), with the mouse or the arrow keys
and Enter. Escape keeps the current station.

| Setting | Default | In the link |
|---|---|---|
| Station A / Station B | Lancy-Pont-Rouge / Aigle | `from=` / `to=` |
| Mornings B → A, switch to A → B at | 12:00 | `switch=12:00` |
| Alert if late ≥ (min) | 5 (red from 15) | `delay=5` |
| Min. time to change trains (min) | 2 | `change=2` |
| Max changes | 0 (Direct only) | `changes=0` (or `any`, `1`, `2`) |
| Warn if trip longer than (h:mm) | 1:45 (amber) | `long=1:45` |
| Red warning if longer than (h:mm) | 2:30 | `vlong=2:30` |
| Refresh every (s) | 60 (minimum 30) | `refresh=60` |
| Language | browser language | `lang=en` / `fr` / `de` |

## Settings in the link

The settings are saved **in the page address**. Each time you change one, the address updates,
and Settings shows the matching link with a **🔗 Copy link** button. So:

- **saving** your settings = bookmarking the page, or copying the link;
- **sharing** them = sending the link: whoever opens it gets exactly those settings (any setting
  missing from the link uses its default). For example:
  `cff_dashboard.html?from=Genève&to=Zürich+HB&delay=8&lang=fr`;
- only the settings that differ from the defaults appear in the link. With the defaults, the
  link is just the page address. Unknown or invalid values are ignored.

For other people to open a shared link, the page must be **online** (for example GitHub Pages
or SharePoint). A link to a file on your computer only works on your computer. Some browsers
don't let a page opened as a local file change its own address: the address bar then stays as it
is, but the link in Settings is still up to date.

The browser also remembers your last settings, so opening the page without parameters brings
them back. The pinned train, alerts on/off and the usual-trains memory stay in this browser
only: they are not part of the link.

## API usage

The page sends two requests per refresh (one every 60 s), plus a departure-board check only when
a train disappears. The API has no fixed limit per client, but asks apps not to repeat the same
query every few seconds. Each open copy of the page sends its own requests.
