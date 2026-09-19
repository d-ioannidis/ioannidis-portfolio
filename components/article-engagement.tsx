"use client";

import { FormEvent, useEffect, useState } from "react";

type Comment = {
  id: number;
  name: string;
  body: string;
  createdAt: string;
};

type Summary = {
  likes: number;
  impressions: number;
  comments: Comment[];
  liked: boolean;
};

function getVisitorId() {
  const key = "portfolio-visitor-id";
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

export function ArticleEngagement({ slug }: { slug: string }) {
  const [summary, setSummary] = useState<Summary>({ likes: 0, impressions: 0, comments: [], liked: false });
  const [favorite, setFavorite] = useState(false);
  const [commentStatus, setCommentStatus] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [engagementStatus, setEngagementStatus] = useState("");
  const [liking, setLiking] = useState(false);

  useEffect(() => {
    const visitorId = getVisitorId();
    const favoriteKey = `favorite:${slug}`;
    setFavorite(localStorage.getItem(favoriteKey) === "1");

    const impressionKey = `impression:${slug}`;
    const shouldCount = sessionStorage.getItem(impressionKey) !== "1";
    if (shouldCount) sessionStorage.setItem(impressionKey, "1");

    fetch(`/api/articles/${encodeURIComponent(slug)}/engagement`, {
      method: shouldCount ? "POST" : "GET",
      headers: {
        "Content-Type": "application/json",
        "X-Visitor-Id": visitorId,
      },
      body: shouldCount ? JSON.stringify({ action: "impression" }) : undefined,
      cache: "no-store",
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("Engagement unavailable");
        const data: Summary = await response.json();
        setSummary(data);
        setEngagementStatus("");
      })
      .catch(() => {
        if (shouldCount) sessionStorage.removeItem(impressionKey);
        setEngagementStatus("Article stats are temporarily unavailable. Please try again later.");
      });
  }, [slug]);

  async function toggleLike() {
    if (liking) return;
    setLiking(true);
    setEngagementStatus("");
    try {
      const visitorId = getVisitorId();
      const response = await fetch(`/api/articles/${encodeURIComponent(slug)}/engagement`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-Visitor-Id": visitorId,
        },
        body: JSON.stringify({ action: "like" }),
      });
      if (!response.ok) throw new Error("Like could not be saved");
      setSummary(await response.json());
    } catch {
      setEngagementStatus("Your like could not be saved. Please try again.");
    } finally {
      setLiking(false);
    }
  }

  function toggleFavorite() {
    const next = !favorite;
    setFavorite(next);
    localStorage.setItem(`favorite:${slug}`, next ? "1" : "0");
  }

  async function submitComment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (submitting) return;
    // React clears currentTarget after the handler yields, so keep the form itself.
    const formElement = event.currentTarget;
    const form = new FormData(formElement);
    setSubmitting(true);
    setCommentStatus("");
    try {
      const response = await fetch(`/api/articles/${encodeURIComponent(slug)}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.get("name"),
          email: form.get("email"),
          body: form.get("body"),
          website: form.get("website"),
        }),
      });
      if (response.ok) {
        formElement.reset();
        setCommentStatus("Thanks — your comment is awaiting approval.");
      } else {
        const data: unknown = await response.json().catch(() => null);
        const error = data !== null && typeof data === "object" && "error" in data
          && typeof data.error === "string" ? data.error : null;
        setCommentStatus(error ?? "The comment could not be submitted. Please try again.");
      }
    } catch {
      setCommentStatus("The comment could not be submitted. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="article-engagement" aria-label="Article engagement">
      <div className="engagement-stats">
        <button type="button" className={summary.liked ? "engagement-button active" : "engagement-button"} onClick={toggleLike} disabled={liking} aria-pressed={summary.liked}>
          <span aria-hidden="true">♥</span> {summary.likes} {summary.likes === 1 ? "like" : "likes"}
        </button>
        <button type="button" className={favorite ? "engagement-button active" : "engagement-button"} onClick={toggleFavorite} aria-pressed={favorite}>
          <span aria-hidden="true">★</span> {favorite ? "Favorited" : "Favorite"}
        </button>
        <span className="engagement-impressions">{summary.impressions.toLocaleString()} impressions</span>
      </div>

      {engagementStatus ? <p className="comment-status" role="status">{engagementStatus}</p> : null}

      <div className="comments-section">
        <div>
          <p className="section-label">Discussion</p>
          <h2>Comments</h2>
          <p className="comments-note">Comments are reviewed before appearing publicly.</p>
        </div>

        <form className="comment-form" onSubmit={submitComment}>
          <div className="comment-form-row">
            <label>Name<input name="name" required maxLength={80} autoComplete="name" /></label>
            <label>Email<input name="email" type="email" required maxLength={160} autoComplete="email" /></label>
          </div>
          <label className="honeypot" aria-hidden="true">Website<input name="website" tabIndex={-1} autoComplete="off" /></label>
          <label>Comment<textarea name="body" required minLength={3} maxLength={2000} rows={5} /></label>
          <button className="button primary" type="submit" disabled={submitting}>{submitting ? "Submitting…" : "Add comment"}</button>
          {commentStatus ? <p className="comment-status" role="status">{commentStatus}</p> : null}
        </form>

        <div className="comment-list">
          {summary.comments.length ? summary.comments.map((comment) => (
            <article className="comment" key={comment.id}>
              <header><strong>{comment.name}</strong><time dateTime={comment.createdAt}>{new Date(comment.createdAt).toLocaleDateString("en", { day: "numeric", month: "short", year: "numeric" })}</time></header>
              <p>{comment.body}</p>
            </article>
          )) : <p className="comments-empty">No approved comments yet.</p>}
        </div>
      </div>
    </section>
  );
}
