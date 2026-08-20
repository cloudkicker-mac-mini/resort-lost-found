# Connected Demo Specification

## Objective
Demonstrate one lost item moving from a guest report through resort investigation, verified matching, return selection, and completion.

## Acceptance criteria
1. Landing-page CTAs launch either the guest or management side of the demo.
2. Users can switch perspectives without losing the shared case state.
3. Guest view supports a believable report flow and private status tracking.
4. Management view shows the inquiry, possible inventory match, custody history, ownership verification, and return actions.
5. Management actions immediately change the status shown to the guest.
6. Demo can be reset and works on desktop and mobile.

## Non-goals
No real authentication, persistence, messaging, carrier purchase, payment, or customer data collection.

## Technical approach
Use a shared in-memory React case model inside the existing static prototype. Keep the demo deterministic, seeded, and explicitly labeled as sample data.
