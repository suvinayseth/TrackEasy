# TrackEasy
This repository is for a project named TrackEasy. TrackEasy is a very custom web-app platform for collaborating web-tracking and subsequent audit and alerts.
The technologies used in this project are:
  Front-end : HTML, CSS (bootstrap), JS (jQuery, moment)
  Framework : Django
  Back-end : MongoDB

**Trackeasy Web-App Documentation**

**Contents**

* What is it?

* Why Trackeasy?

* Trackeasy Tech details

* Whom all does it help? What do they get out it? What all can they do on it?

* Managing it, taking it further, improvements.

**What is it?**

Trackeasy, an analytics product, is a platform for *managing* all the tracking that we do on our products across services and devices. *It includes features like* :

* service and device wise *tracking-events log*, as in the list of all the current tracking events and ones in backlog

    * For each event it maintains all its constituting keys, log, comments and an uploadable screen-shot. 

    * It reads all these events and its constituting keys from *dsl.tracking.config* Github repository. 

* an *Auditing* capability for this tracking-events log

    * For each event it maintains whether there exists at least a single match, in tracking-database, in recent 2-3 days.

    * This is supposed to act as a first level of validation check for each tracking event.

* an *Alert* capability for this tracking-events log.

    * For each event it maintains a day-wise unique and total count.

    * It allows users to compare counts for each event for two time ranges and look for upward or downward spike in counts. 

    * This is supposed to act as second level of validation check for each tracking event.

**Why Trackeasy?**

At present, there is **_no system_** in place for :

* managing tracking

* keep a tab on health of each tracking-event

* tracking related collaboration and task-management, between product-analysts (who fix what to track) and frontend developers (who implement the tracking)

→ Trackeasy has been built to fill this void.

**Trackeasy Tech details**

→ *Trackeasy’s tech-stack* :

* *Front-end* : HTML, CSS (Bootstrap), JS(Bootstrap, jQuery, moment)

* *Framework* : Django

* *Database* : MongoDB

Trackeasy reads the tracking events from *dsl.tracking.configs *Github repository, and maintains a copy in local MongoDB, with some other data (log, uploadable screen-shot, match/mismatch, day-wise unique and total count) for each event.

Trackeasy, as of now, syncs periodically with *dsl.tracking.configs *and also provides on-demand syncing. It can be made to sync real time by using Github web hooks.

**Whom all does it help? What do they get out it? What all can they do on it?**

* Trackeasy predominantly helps collaboration between *product-analysts* (who fix what to track) and *front-end developers* (who implement tracking).

* Trackeasy for *product-analysts*

    * Product-analysts can see active and backlog tracking-events based on their service and device of interest.

    * For each of these events they can upload and and see associated screenshots, see log info like front-end implementation datetime, etc.

    * For each of the backlog events, they can check if it has been marked implemented by front-end devs and then approve it to move the event into active list.

    * They can then audit tracking events, i.e. check if events are getting at least a single match in tracking database in recent 2-3 days.

    * They can check for upward or downward spikes in counts of tracking events.

* Trackeasy for *front-end developers*

    * Front-end devs can see active and backlog tracking-events based on their service and device of interest.

    * For each of these events they can see associated screenshots, see log info like event entry datetime, etc.

    * For every backlog event that they then implement, they can mark it implemented for product-analyst to check and then approve.

**Managing it, taking it further, improvements.**


