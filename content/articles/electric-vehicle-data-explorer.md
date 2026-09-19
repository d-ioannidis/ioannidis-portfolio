---
title: "Building an Electric Vehicle Data Explorer on the LAMP Stack"
description: "A retrospective on a 2022 university web project that combined Linux, Apache, MySQL, PHP, MailHog, authentication flows, and a searchable electric-car dataset."
date: "2026-09-17"
topics:
  - Web Development
  - PHP
  - MySQL
  - Linux
featured: false
published: true
---

In 2022, one of my university web-programming assignments was to build a web application for presenting and exploring statistics about **electric vehicles**.

The project became a useful full-stack exercise because it did not stop at the page layer. I configured the local web-server environment, designed the database, connected PHP to MySQL, implemented account and contact flows, and built a searchable vehicle catalogue.

This article is a retrospective on that project: what I built then, what the architecture taught me, and what I would redesign today.

## The project stack

The application used a traditional **LAMP** environment:

| Layer | Technology | Role |
| --- | --- | --- |
| Operating system | Linux Mint | Development host |
| Web server | Apache | Served the PHP application |
| Database | MySQL + phpMyAdmin | Stored users, vehicle data, and contact messages |
| Server-side application | PHP | Form handling, authentication logic, queries, and rendering |
| Email testing | MailHog + Postfix | Captured contact-form mail during development |
| Front end | HTML / CSS / Bootstrap | Application interface |

That stack made the project a useful introduction to the boundaries between a browser, web server, application code, database, and supporting infrastructure.

![Architecture of the electric vehicle data explorer, showing the browser, Apache/PHP application, MySQL database, and MailHog email-testing flow.](/blog/electric-cars-lamp-architecture.svg)

## Configuring the web environment

The first stage was infrastructure rather than application code.

I installed Apache, MySQL, PHP, phpMyAdmin, and the PHP modules required by the application. I then configured an Apache virtual host for a local `electric-cars.local` site rather than relying only on Apache's default page.

The setup also included firewall configuration for HTTP traffic and an entry in the local hosts file so that the project could be reached through its development hostname.

This part of the assignment was valuable because it made the request path tangible:

```text
Browser
   ↓
Apache virtual host
   ↓
PHP application
   ↓
MySQL
```

When something failed, there were several possible boundaries to inspect: DNS/host resolution, Apache configuration, PHP, database connectivity, or application logic.

## Designing the database

The MySQL database was named `electric_cars` and contained three main tables.

| Table | Purpose | Notable fields |
| --- | --- | --- |
| `user` | Application accounts | name, username, password, email, role |
| `models` | Electric-car catalogue | brand, model, acceleration, speed, range, efficiency, charging, price, image |
| `contact` | Contact-form submissions | name, email, subject, message |

The vehicle table was the largest part of the data model. It contained **16 fields** and **103 vehicle records**, imported from a CSV file.

That gave the application enough data to behave like an actual catalogue rather than a form connected to a handful of test rows.

The vehicle attributes included acceleration, top speed, range, efficiency, fast charging, rapid-charging support, powertrain, plug type, body style, segment, seats, price, and an image.

## Searching for a vehicle

The catalogue's main interactive feature allowed a visitor to enter a model name and retrieve the corresponding vehicle.

The PHP processing logic queried the `models` table and then rendered the returned fields into a vehicle-detail section.

Conceptually:

```text
Model entered by visitor
          ↓
      PHP request
          ↓
   SELECT from MySQL
          ↓
 vehicle row + image
          ↓
 rendered detail page
```

A separate PHP endpoint retrieved the image stored for the selected model, allowing the vehicle data and image to be displayed together.

This was a relatively simple feature, but it connected several ideas at once: form submission, server-side processing, database lookup, binary data retrieval, and dynamic HTML output.

## Account-management flows

The project also included several common account operations.

**Registration** collected a first name, last name, email, username, password, and confirmation password. The implementation checked email formatting, duplicate usernames or email addresses, password requirements, and matching password fields before inserting the user.

**Login** checked the supplied credentials and created a login cookie when authentication succeeded.

**Password changes** verified the supplied user information and password rules before updating the stored password.

**Account deletion** checked the submitted credentials before deleting the corresponding user record.

These flows were useful exercises in state, validation, SQL operations, and redirect behaviour.

They are also the part of the project I would change most substantially today.

## Testing email without sending real email

The contact form used another small infrastructure component: **MailHog**.

MailHog acted as a development SMTP inbox. The application could execute its mail flow without delivering messages to a real external mailbox.

The contact process did two things:

1. stored the submitted name, email, subject, and message in MySQL;
2. attempted to send the message through the local mail-testing setup.

That separation is still a useful development pattern: exercise the complete application behaviour while keeping test traffic away from real users and external systems.

## What I would redesign today

This was a university project, not a production authentication system. Looking back at it now is useful precisely because several implementation choices make the next engineering steps very clear.

**Parameterized queries.** The original PHP constructs SQL from submitted values directly. Today I would use prepared statements everywhere rather than interpolating request data into SQL.

**Password hashing.** The assignment stores and compares passwords directly. A current implementation should store a strong password hash and verify it using a dedicated password-hashing API.

**Session-based authentication.** I would replace the simple login-cookie approach with properly managed server-side sessions or a mature authentication library, together with secure, HTTP-only, same-site cookies.

**Configuration outside source code.** Database credentials and environment-specific configuration should live in secrets or environment variables rather than application files.

**CSRF and stronger request validation.** Mutating account actions should include CSRF protection and consistent server-side validation.

**Separation of concerns.** I would split data access, authentication, validation, and presentation into clearer layers rather than allowing page-processing scripts to carry all responsibilities at once.

Those changes do not make the original assignment less useful. They are part of the value of revisiting early work: the project shows where I started, while the retrospective shows how I would approach the same problem now.

## What I took from the project

The most useful lesson was that a web application is more than its visible pages.

This project required me to think about:

- web-server configuration,
- database design,
- server-side application logic,
- account state,
- validation,
- email infrastructure,
- data retrieval,
- and how all of those pieces fail or succeed together.

That systems view later became useful in larger projects where application code was only one part of the overall solution.
