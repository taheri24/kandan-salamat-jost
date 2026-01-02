# Step 03 — Implement BoardStateContext

## Goal
Centralize all board, list, card, and comment logic using React.Context with OOP principles. This step focuses on the core-logic of the application.

## Tasks
1. Create `/contexts/BoardContext.tsx`.

2. Implement a Board class with:
   - Properties for board state (lists, cards, etc.).
   - Methods for operations: updateBoardTitle(), addList(), updateListTitle(), deleteList(), reorderLists(), addCard(), updateCardTitle(), deleteCard(), moveCard(), addComment().
   - Persistence logic integrated (e.g., save to localStorage on changes).
   - Add code comments indicating this is core-logic (e.g., // Core-logic: Board state management).

3. Implement a BoardProvider component that:
   - Instantiates the Board class.
   - Uses useLocalStorageState for initial load and persistence.
   - Provides the Board instance via context.

4. Create a custom hook `useBoardState` that consumes the context and returns the Board instance.

5. Write unit tests using Vitest:
   - Functional tests for Board class methods on class instances.
   - React unit tests for BoardProvider component.
   - Integration tests for useBoardState hook and components consuming the context.

## Output
A React Context managing board data via an OOP Board class, with persistence, unit tests, and accessible via a custom hook.