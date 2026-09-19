---
title: "Anomaly Detection and Automated Fact-Checking for Crisis Social Media"
description: "How my Master's thesis combined anomaly detection, fact-checking, NLP, and Mastodon ingestion into a cascaded crisis-monitoring pipeline."
date: "2026-09-19"
topics:
  - Data Science
  - Machine Learning
  - NLP
  - Research
featured: true
published: true
---

Social media can be one of the fastest sources of situational information during a crisis. It can also be noisy, repetitive, incomplete, and full of claims that are difficult to verify quickly.

That tension became the focus of my Master's thesis in Data Science: **how can anomaly detection help an automated fact-checking workflow without treating unusual content as evidence that the content is false?**

The distinction matters. A post can be unusual because it reports a genuinely new event, uses uncommon wording, comes from a small community, or reflects an emerging pattern. Anomaly detection can tell us *what deserves attention*. It cannot, on its own, tell us *what is true*.

My thesis therefore treated anomaly detection as the first stage of a larger decision-support system rather than as a misinformation classifier.

## The core idea: filter first, verify second

The framework was designed as a modular pipeline:

```text
Static crisis data / Mastodon API
              ↓
        Data collection
              ↓
       Preprocessing
              ↓
 DTM / TF-IDF / BERT features
              ↓
     Anomaly detection
              ↓
   Prioritized suspect posts
          ↙         ↘
 Fact-checking       NLP
  verifier      sentiment/emotion
          ↘         ↙
       Dashboard + feedback
```

The first layer is about **prioritization**. K-Means, DBSCAN, an autoencoder-based detector, and a hybrid DT-SVMNB model produce signals that help narrow a large stream of posts into a smaller set worth reviewing.

The second layer is about **interpretation**. A fact-checking verifier assigns evidence-oriented categories, while transformer-based NLP components add sentiment and emotion context.

That separation became the most important design principle in the project: the system should not confuse *different from the norm* with *false*.

## Two experiments, two different jobs

I evaluated the framework in two complementary settings.

The first used the **Disaster Tweets dataset**, with 2,559 social-media records, as a controlled environment. This made it possible to compare models and feature representations under reproducible conditions.

The second used a **Mastodon API prototype**. Public Mastodon posts were collected using crisis-related searches, normalized into the same internal schema, and sent through the existing preprocessing and analysis pipeline.

The two experiments were not intended to be equivalent benchmarks. The static dataset was the main environment for model evaluation. The Mastodon experiment was primarily a test of **deployment feasibility**: could a live or semi-live federated data source be connected without redesigning the entire system?

That distinction turned out to be useful. A model can look convincing on a clean benchmark while the surrounding pipeline falls apart as soon as real API data arrives.

## Preparing text for very different models

The preprocessing stage normalized the posts by removing URLs and HTML, handling special characters, tokenizing, lemmatizing, and filtering stop words. It then produced three different text representations:

- **Document-Term Matrix (DTM)** for raw lexical counts.
- **TF-IDF** for frequency-weighted lexical features.
- **BERT embeddings** for dense contextual representations.

This was not just an implementation detail. One of the clearest lessons from the experiments was that there was no universally best representation.

In the detailed controlled-dataset results, BERT embeddings gave K-Means the strongest ROC-AUC of the three representations, while DTM produced the strongest result for the autoencoder. DBSCAN also behaved differently depending on whether the comparison was based on ROC-AUC or PR-AUC.

The point was less about declaring a single winner and more about recognizing that **feature representation is task- and model-dependent**. Sparse lexical features and dense semantic embeddings expose different kinds of structure.

For a production system, that is a much more useful conclusion than assuming the newest representation should be used everywhere.

## The anomaly layer was a prioritizer, not a judge

The anomaly-detection results on the controlled dataset were modest overall. That was important because it reinforced the architectural choice rather than weakening it.

K-Means, DBSCAN, the autoencoder, and the hybrid model could provide ranking or filtering signals, but none should be interpreted as a high-confidence misinformation detector on its own.

That is exactly why the pipeline sends suspicious posts forward instead of turning an anomaly score directly into a truth label.

For crisis monitoring, a useful first stage does not need to solve the entire problem. It needs to reduce the search space enough that more expensive analysis — and eventually human review — can focus on the cases that matter.

## Fact-checking worked better as a downstream task

The controlled fact-checking verifier classified posts into five evidence-support categories:

- Supported
- Partially Supported
- Unclear
- Partially Not Supported
- Not Supported

On the held-out controlled test set, the verifier achieved **86.6% overall accuracy**, with a **weighted F1-score of 0.859** and a **macro F1-score of 0.783**.

The gap between weighted and macro F1 was revealing. The system performed better on common classes than on minority or ambiguous ones. Recall was notably weaker for some unsupported and partially unsupported cases.

That is a practical reminder that an accuracy number can hide the cases that matter most. In a crisis setting, uncertain or high-impact claims should be escalated rather than treated as automatically resolved.

The verifier therefore belongs in a **decision-support workflow**, not in an autonomous truth machine.

## Sentiment was easier than emotion

The NLP engine showed a similar pattern.

Sentiment classification reached **83.86% accuracy** in the controlled experiment. The predicted sentiment distribution tracked the reference distribution relatively closely, making it a useful signal for a monitoring dashboard.

Fine-grained emotion classification was much harder, reaching **49.71% accuracy**. The model tended to overpredict common crisis-related emotions such as fear while missing less frequent categories such as joy or surprise.

This is a useful distinction for system design. Broad sentiment can be reasonably helpful for summarizing the tone of a crisis stream. Fine-grained emotion labels need much more caution because emotional categories overlap and class imbalance can dominate the result.

## Moving the pipeline to Mastodon

The Mastodon prototype was one of the most useful engineering parts of the project because it forced the framework to deal with a data source that did not look like the benchmark.

Mastodon is federated. Different instances expose different public content, moderation rules, and visibility patterns. Its metadata also does not map perfectly to Twitter-style fields.

The collector therefore acted as an adaptation layer. Mastodon display names, account identifiers, timestamps, post content, reblogs, favourites, replies, URLs, and hashtags were mapped into the common schema used by the rest of the pipeline. Missing fields were handled explicitly instead of changing every downstream component.

Once that mapping was in place, the same preprocessing and model stages could be reused.

That was the architectural result I cared about: **the analysis pipeline was no longer coupled to one CSV file or one social platform**.

## What happened on the API sample

The deployment-oriented Mastodon experiment processed a much smaller sample than the controlled dataset, so I treated its results cautiously.

The hybrid DT-SVMNB model reached a **PR-AUC of 0.68** with both TF-IDF and DTM on the Mastodon sample, while its ROC-AUC was 0.58. That difference is a good example of why precision-recall metrics matter in anomaly detection: when suspicious cases are sparse, the ability to concentrate useful candidates near the top of a ranking can be more operationally relevant than global separation.

The Mastodon fact-checking stage reported **81.2% accuracy** on 85 processed posts. However, this result has an important limitation: manually verified labels were not available for the API sample, so simulated verification labels were used to validate the evaluation workflow.

The same caveat applies to the API-based sentiment and emotion evaluation, where synthetic reference labels were used.

Those numbers therefore demonstrate that the pipeline can execute end to end. They do **not** establish real-world fact-checking accuracy on Mastodon.

That distinction is essential whenever a prototype moves from controlled data to live sources.

## Human review is part of the architecture

One of the biggest mistakes an automated fact-checking system can make is hiding uncertainty.

The framework deliberately includes a feedback mechanism and dashboard layer so that automated outputs can be reviewed, overridden, and used to improve later iterations.

A high anomaly score should mean:

> "This deserves a closer look."

It should not mean:

> "This is misinformation."

Likewise, an automated verifier should provide structured evidence-support signals, not an unquestionable final verdict.

That matters technically, but it also matters ethically. Crisis-related posts can include personal experiences, location information, fear, grief, and urgent requests. False positives are not just a metric problem when real people are behind the data.

## What I would build next

The thesis left several clear directions for a stronger version of the system.

**A larger real-time evaluation.** A historical crisis replay or controlled exercise would make it possible to measure latency, throughput, model drift, duplicate handling, and threshold stability over time.

**A stronger human-in-the-loop workflow.** High-impact posts, low-confidence fact-checking results, and ambiguous cases should be routed to trained reviewers, with their decisions fed back into the system.

**Multi-instance Mastodon collection.** Because federation affects visibility, collecting from a single instance cannot represent the wider network. A broader deployment should compare multiple relevant instances and document the coverage limits.

**Multilingual analysis.** Crisis communication does not happen in one language. Cross-lingual models such as XLM-R could extend the architecture, but performance would need to be reported separately across languages rather than assumed to transfer evenly.

**Graph and multimodal signals.** Text is only one part of social media. Interaction graphs, coordinated sharing patterns, images, and video could provide additional evidence that text-only models miss.

## The engineering lesson

The most valuable outcome of the thesis was not a single model score. It was a system-design lesson.

Complex AI workflows become easier to reason about when each component has a narrow responsibility:

- anomaly detection finds unusual content,
- fact-checking evaluates evidence support,
- NLP adds semantic and emotional context,
- the dashboard exposes outputs and uncertainty,
- and human reviewers remain responsible for ambiguous or consequential decisions.

That is the architecture I would carry into a real production system: **use automation to narrow attention, not to pretend uncertainty has disappeared.**

The implementation for this project is available on [GitHub](https://github.com/d-ioannidis/Anomaly-Detection-in-Social-Media).
