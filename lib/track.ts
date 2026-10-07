/**
 * Client-side helpers for fire-and-forget interaction tracking.
 * Each function sends a POST to the corresponding API route.
 * Failures are silently swallowed — analytics should never block UX.
 */

// ---------- Website-level interactions ----------

export function trackResumeDownload() {
  fetch("/api/track/website", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "resume_downloaded" }),
  }).catch(() => {});
}

export function trackContactFormSubmit() {
  fetch("/api/track/website", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "contact_form_submit" }),
  }).catch(() => {});
}

export function trackContactInterested() {
  fetch("/api/track/website", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "contact_interested" }),
  }).catch(() => {});
}

export function trackScrolledPastHero() {
  fetch("/api/track/website", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ type: "scrolled_past_hero" }),
  }).catch(() => {});
}

// ---------- Project-level interactions ----------

export function trackProjectClicked(projectId: string) {
  fetch("/api/track/project", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ projectId, type: "project_clicked" }),
  }).catch(() => {});
}

export function trackProjectViewed(projectId: string) {
  fetch("/api/track/project", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ projectId, type: "project_viewed" }),
  }).catch(() => {});
}
