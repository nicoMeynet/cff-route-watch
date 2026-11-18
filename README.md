# cff_route_watch

Watches the train connections between **Lancy-Pont-Rouge** and **Aigle** using the
[Swiss public transport API](https://transport.opendata.ch/) and tells you when your train is
**very late or cancelled**.

Everything is in one file, `cff_dashboard.html`: no install, no Python, no server. A few small
files next to it make it an installable app: `manifest.webmanifest`, `sw.js` and `icons/`.

**Open it online: https://nicomeynet.github.io/cff-route-watch/**

## Getting started

Open **https://nicomeynet.github.io/cff-route-watch/** in your browser, on a computer or a phone.
It loads live SBB/CFF data and refreshes every 60 seconds. Keep the tab open: the page only checks
your trains while it is open. To use another route, add it to the address, for example
`https://nicomeynet.github.io/cff-route-watch/?from=Genève&to=Lausanne`, or pick the stations
in Settings and copy the link (see [Settings in the link](#settings-in-the-link)).

You can also download `cff_dashboard.html` and double-click it. Opened as a local file, the
browser may block desktop pop-up notifications: you still get the on-page alerts and a
⚠️ in the tab title. The online version doesn't have this limit.

### Install it as an app (Windows, Mac, phone)

The online page can be installed as an app: its own window without the address bar, a 🚆 icon in
the Start menu and the taskbar, and Windows notifications.

- **Edge:** click **📲 Install the app** at the top of the page, or menu **⋯ → Apps → Install
  this site as an app**. To have it start with Windows, open `edge://apps`, right-click
  **CFF Route Watch** and choose **Start app when you sign in to your device**.
- **Chrome:** the install icon at the right of the address bar, or menu **⋮ → Cast, save and
  share → Install page as app**.
- **iPhone (Safari):** Share → **Add to Home Screen**. **Android (Chrome):** menu → **Install
  app**.

The app is the same page as the website: it keeps your settings and your SBB key, and each update
pushed online is used the next time it opens. Like the browser tab, it only checks your trains
while it is open (it can stay minimised). If the network is down, it still opens with the last
saved copy of the page. Clicking a notification brings the app back to the front.

**Badge on the app icon:** when the app is installed, its icon in the taskbar shows **how many
trains need your attention** in the current direction: your pinned train, or, without one, every
train leaving in the next 2 hours. Only the problems ticked under **Alerts** count (by default the
critical ones: cancelled or skipping your stop, change missed, very late). For example **2** = two
trains are cancelled or very late. No badge when there is nothing to worry about, or when alerts
are off.

The online page is published with GitHub Pages from the `main` branch of this repository: any
change pushed to `main` is online within a minute or two.

## What it shows

- **Direction chosen automatically:** before 12:00 Aigle → Lancy-Pont-Rouge, from 12:00
  Lancy-Pont-Rouge → Aigle. The bar at the top shows the current direction once, with
  ☀️ Morning or 🌇 Afternoon. **⇄ Swap** shows the other direction until the next automatic
  switch (noon or midnight); the bar then says ✋ Manual. Swapping back returns to automatic.
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
- **Trip line:** on the top card (larger) and under each time in the list, the trip is drawn as a line, spaced by the
  timetable, with a dot where you get on, **one dot per change of train** and one where you get
  off. Each train is one coloured part of the line. Green: fine. Amber: late or tight change.
  Red: a problem there (train cancelled, stop not served, change missed, very late). Grey: no
  longer reachable. Between two trains, a thin grey part with **⏱ 4′** is the wait at the
  station (amber when it is longer than 20 min, set in Settings), and a dotted part with **🚶 5′** a walk to another station (amber above 10 min), with the minutes left to
  change (live). For a train on the way, the part already travelled is in full colour, the rest is
  paler, and a glowing dot shows where the train is now. The top card has a small legend.
  Hover a dot or a ⏱/🚶 label for the station, the time and the details.
  In the list, each long wait or walk is also written in amber next to the trip details,
  for example "⏱ 25 min Bern".
- **Already on the way:** other trains that have left but not arrived are folded at the top of
  the list. The folded header turns amber or red when one of them has a problem.
- **Direct only** (on by default, in Settings → Route → **Changes** = Direct only): hides trains with a
  change. The status line under the direction bar says "Direct only" while it is on. When the last direct train of
  the day has left, a note says so, with a button to show trains with a change.
- **Long trips:** trips longer than 1:45 (live delays included) get a small amber ⏳ warning,
  and trips longer than 2:30 a red one.
- **Occupancy:** 1st/2nd class bars (green low, amber medium, red high), shown only when the
  API provides the data. At the moment it usually doesn't.
- **Quantum info (ⓘ):** next to each status, an ⓘ button shows a light-hearted "quantum" line
  that matches it, for example "Arrival time is currently in superposition." for a big delay, or
  "Schrödinger's train" for a train disrupted on the way. The status itself and the
  notifications stay serious.
- **Languages:** English, French, German, Italian and Spanish (EN · FR · DE · IT · ES, in Settings). On first opening, the page
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
- **Which train is the problem:** on a trip with changes (for example 3 trains one after the
  other), the page says **which train** is cancelled or skips your stop, and **at which station** a
  change is missed. The top card lists **Your trains** one by one (✅ fine, ⚠️ late, ⛔ cancelled,
  skips the stop or change missed) with the time left at each change. The trains after the problem
  are crossed out as **Not reachable**, and the text says where you would be stuck (for example
  "you would be stuck at Genève"). In the list, each line badge is coloured the same way.
  When a trip disappears, the departure board of each of its trains is checked in turn to find the
  cancelled one.
- **During the trip:** if your pinned train disappears while on the way, it shows **Disrupted**.
  The trains of the trip that have not left yet are still checked, so a cancelled next train is
  named.
- **Best alternative:** when your train is cancelled, misses its change or is very late, the
  page suggests the train that gets you there soonest, with a **Switch to this train** button.

## Official SBB data (optional)

The data source above (transport.opendata.ch) has no cancellation flag, and often no live data at
all for regional trains such as the RE33. With your own **free key** for the official SBB API
(OJP 2.0 on [opentransportdata.swiss](https://opentransportdata.swiss/)), the page also shows:

- **live delays at every stop**, taken from SBB;
- **Cancelled**: SBB flags the train as cancelled;
- **Skips Lancy-Pont-Rouge** (or another station where you get on, change or get off): the train
  will not stop there, for example when it terminates early;
- **No live data**: a train that left a few minutes ago has no live data at all in SBB's feed,
  while the trains around it do. It may be disrupted;
- **SBB messages** for each train (ℹ️), for example "very high occupancy, boarding not
  guaranteed" or an alternative train to take. They are shown in your language when SBB provides
  it, otherwise in German with "(DE)".

To set it up:

1. Create a free account on the [API Manager](https://api-manager.opentransportdata.swiss/),
   subscribe to **OJP 2.0** and create an API key.
2. In Settings, paste it in **SBB key (OJP 2.0, optional)** and click **Test the key**.

The key is **kept in this browser only**: it is never put in the settings link, never written in
the page and only sent to opentransportdata.swiss. Everyone who uses the page enters their own
key. Without a key, the page works as before. The status line shows "SBB data ✓" when the SBB
data was received.

Trains are matched between the two sources by line, boarding station and scheduled departure
time, not by train number: transport.opendata.ch doesn't always give the same train number as
its own departure board or as SBB.

## Alerts and notifications

Alerts are **on by default**. You can turn them off in Settings (**Alerts**). The browser asks
once whether the page may show desktop notifications: it asks after your first click on the page,
because browsers don't allow it before. There is no sound. You're notified again only
when the situation gets worse (for example every extra 5 minutes of delay). Notifications
include the suggested alternative. With a train pinned, only that train triggers alerts.
Otherwise, any train leaving in the next 2 hours does.

**Which alerts:** under **Alerts** in Settings, tick the problems you want to be alerted about.
The **critical** ones are on by default:

| Alert | Default |
|---|---|
| Train cancelled or skipping my stop | on (critical) |
| Change missed | on (critical) |
| Very late (≥ 15 min, or 3× the alert delay) | on (critical) |
| Late (≥ the alert delay) | off |
| Change at risk | off |
| No live data | off |

The choice applies to desktop notifications and to the badge on the app icon. The page itself
still shows every problem (colours, status and the ⚠️ in the tab title).

The page refreshes again as soon as you come back to the tab, the computer wakes up or the
network returns, and warns you when the data is more than about 2 minutes old.

## Settings

Click **⚙️** at the top right to open Settings. On a computer it opens as a panel on the right,
with the page still visible behind; on a phone it opens full screen. Close it with **✕**, the
**Escape** key, a click beside it, or the phone's **back** button. Changes apply immediately: there
is no Save button. The settings are grouped in sections: **General** (language, refresh) at the top, then **Route**,
**Alerts**, **Display**, **SBB data** (your key) and **Share** (the link).

**Home** (where you leave from in the morning) and **Work** (where you leave from in the
afternoon) are search fields, shown in that order: type 2 letters or more and pick a station from
the suggestions (train stations first, then tram and bus stops), with the mouse or the arrow keys
and Enter. Escape keeps the current station.

| Setting | Default | In the link |
|---|---|---|
| Home / Work | Aigle / Lancy-Pont-Rouge | `to=` / `from=` |
| Direction switch (home → work before, work → home after) | 12:00 | `switch=12:00` |
| Alert if late ≥ (min) | 5 (red from 15) | `delay=5` |
| Alerts (desktop notifications) | on, critical problems only | not in the link (kept in this browser) |
| Min. time to change trains (min) | 2 | `change=2` |
| Wait at a station in orange above (min) | 20 | `wait=20` |
| Walk between stations in orange above (min) | 10 | `walk=10` |
| Changes (right under the stations) | Direct only (or up to 1 change, up to 2 changes, any number) | `changes=0` (or `1`, `2`, `any`) |
| Warn if trip longer than (h:mm) | 1:45 (amber) | `long=1:45` |
| Red warning if longer than (h:mm) | 2:30 | `vlong=2:30` |
| Refresh every (s) | 60 (minimum 30) | `refresh=60` |
| Language | browser language | `lang=en` / `fr` / `de` / `it` / `es` |

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

The page sends two requests per refresh (one every 60 s), plus departure-board checks only when
a train disappears (one per train of that trip, at most). The API has no fixed limit per client, but asks apps not to repeat the same
query every few seconds. Each open copy of the page sends its own requests.

With an SBB key, it also sends **one OJP request per refresh** (about 60 per hour; the free plan
allows about 50 per minute). SBB messages are large because they list every affected stop, so
their texts are only downloaded every 10 minutes, or as soon as a new message appears. In
between, a request weighs about 20 KB.
