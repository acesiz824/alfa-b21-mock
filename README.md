# ALFA Build 21 clickable mock

Standalone, fictional, not production. This folder is completely separate from any ALFA application repository.

Three interactive ideas on an iPhone-sized screen (390×844), framed as a phone on desktop and full-screen on mobile:

1. **Confirm** — preview an email or a table booking before anything is sent or reserved. Confirm, Edit, and Cancel each have a visible state.
2. **Share** — mock Safari and Photos share sheets with an ALFA destination. A shared link or screenshot becomes an editable question, then a calm answer.
3. **Morning** — “Your overnight work is done,” with **How this was checked** expanding to show which labs agreed or disagreed.

Open `index.html` locally, or visit the deployed public URL. Query flags for screenshots:

- `/?s=confirm`
- `/?s=confirm&state=edit`
- `/?s=confirm&state=done`
- `/?s=confirm&state=cancelled`
- `/?s=confirm&kind=booking`
- `/?s=share`
- `/?s=share&phase=sheet`
- `/?s=share&source=photos&phase=sheet`
- `/?s=share&phase=compose`
- `/?s=share&phase=thinking`
- `/?s=share&phase=answer`
- `/?s=morning`
- `/?s=morning&checked=1`
