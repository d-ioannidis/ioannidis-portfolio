---
title: "Designing an Order Management System with SQL Server and C#"
description: "A retrospective on a university database project that moved from an ER model to SQL Server tables, a C# desktop interface, order calculations, inventory views, and database-side automation."
date: "2026-09-16"
topics:
  - Databases
  - C#
  - SQL Server
  - Software Engineering
featured: false
published: true
---

In 2021, an Advanced Database Topics assignment gave me a practical database problem: design a small order-management data model in SQL Server and then connect it to a C# application.

The result combined relational modelling, SQL, a Visual Studio desktop interface, editable datasets, order-history calculations, inventory tracking, image handling, and a database trigger.

It was one of the projects that made databases feel less like isolated SQL exercises and more like part of an application architecture.

## Starting with the relational model

The project began with an entity-relationship design and was implemented with four connected tables:

| Table | Role |
| --- | --- |
| Customers | Customer identity and profile data |
| Orders | Order date, customer reference, payment and delivery information |
| Inventory | Product category, stock, sale price, VAT, and product image |
| Order Products | Connects orders to inventory items and records quantity |

The relationship between orders and products was represented through an associative table. Its order and product identifiers formed a **composite primary key**, while also acting as foreign keys back to their respective tables.

![Simplified relational architecture of the SQL Server order-management project, showing customers, orders, inventory, order products, and the C# application layer.](/blog/sqlserver-order-system-architecture.svg)

That design gave the application a clean way to express a many-to-many relationship: an order can contain several products, and a product can appear in several orders.

## Creating the schema in SQL Server

Rather than creating the database only through the graphical designer, I wrote SQL statements for table creation and relationship definition.

The implementation used:

- primary keys with identity values,
- foreign-key constraints,
- a composite key for order-product rows,
- appropriate numeric, date, string, and monetary fields,
- and later a trigger for derived customer information.

Working through both the ER model and the SQL definition was useful because it exposed the difference between **conceptual modelling** and the actual constraints that preserve integrity in a database.

## Connecting SQL Server to C#

The application itself was built in Visual Studio and connected to SQL Server through the .NET SQL client.

The desktop UI exposed separate tabs for the main parts of the data model, including customers, inventory, orders, and order products.

The application used adapters, datasets, binding sources, data-grid views, and binding navigators to move SQL Server data into an interface where records could be viewed and edited.

At a high level:

```text
C# / WinForms interface
          ↓
SqlConnection + data adapters
          ↓
       DataSets
          ↓
      SQL Server
          ↓
Customers · Orders · Inventory · Order Products
```

This was the part of the project that connected database theory to application behaviour. The schema was no longer something inspected only in SQL Server Management Studio; it became the state behind an interactive program.

## Editing customers and inventory

The customer and inventory tabs supported record editing through the data grids.

The application also associated images with customer and inventory records. If no image had been configured, the interface displayed a fallback image; a user could then select an image from disk and associate it with the current record.

Changes made through the interface could be written back to the corresponding SQL Server table.

This involved coordinating UI state, binding sources, dataset changes, and database updates — exactly the kind of integration detail that simple standalone SQL queries do not expose.

## Calculating order history

Another part of the application provided an **order-history** view.

A user could select a customer and see the corresponding order and product information, including values used to calculate the final order amount.

The calculation combined:

- sale price,
- VAT,
- ordered quantity,
- and the orders associated with the selected customer.

This turned several related tables into a useful application-level result instead of merely displaying rows independently.

## Tracking product movement

The project also included a product-movement history.

Selecting a product displayed its associated order activity and calculated the aggregate amount connected with that product.

This is a small example of an important database idea: the same relational data can support multiple views of the system.

One view answers:

> What has this customer ordered?

Another answers:

> How has this product moved through orders?

The underlying data is shared, but the query and presentation are shaped around a different question.

## Using a trigger for customer age

The database included a trigger that updated customer age from the stored date of birth.

If the age field was manually changed, the database recalculated it using the birth date and current date rather than accepting the arbitrary value.

That demonstrated database-side automation and the idea that some rules can be enforced closer to the data rather than relying entirely on the client application.

It also gives me a good retrospective design question.

## What I would change today

If I rebuilt this project now, I would keep the relational core but change several implementation choices.

**Treat age as derived data.** Since age changes over time and can always be calculated from date of birth, I would normally avoid storing it as an independently editable value at all. The trigger solved consistency inside the assignment, but deriving age when needed would reduce duplicated state.

**Parameterize all database operations.** Application input should flow through parameters rather than SQL strings assembled from values.

**Create a clearer data-access layer.** Instead of coupling UI controls closely to data adapters and datasets, I would isolate database access behind repository/service functions or an ORM where appropriate.

**Add explicit validation and transactions.** Multi-step order changes should fail or succeed as a unit, and business rules should be validated consistently.

**Use a modern interface only if it serves the problem.** A web UI would make the project easier to deploy and demonstrate today, but the important design decision is not “desktop vs web”; it is keeping presentation, business rules, and persistence cleanly separated.

## What the project taught me

The most useful part of the assignment was moving through the complete sequence:

```text
ER model
   ↓
relational schema
   ↓
constraints and SQL
   ↓
application connection
   ↓
editable interface
   ↓
queries and business results
```

That sequence made relational design concrete. A foreign key was no longer just syntax, because a broken relationship would affect the application. A composite key was not just an exam concept, because it represented real order-product uniqueness. And a query was not simply expected output, because it powered something a user could actually interact with.
