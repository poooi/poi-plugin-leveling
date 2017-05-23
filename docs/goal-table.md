This document defines "GoalTable",
which is responsible for keeping track of all user's leveling goals
and configuration of each individual goal.

# Terms

- **Roster Id (rid for short)**: the number stored in
  `api_ship[?].api_id` field of in-game `api_port/port` response,
  this number uniquely identifies a kanmusu in your fleet.

- **Admiral Id (Player Id / Teitoku Id / TTK Id)**: a number
  parsed from `api_member_id` of many game APIs
  (by "parsed" I'm suggesting this could be a number **represented in string** from game API)
  this number uniquely identifies one player account.

# Directory Structure

- planned to occupy `~/.poi/config/leveling/` (the `~/.poi/config/` part varies depending on OS)
- a single file `goal-table-<admiral id>.json` for storing all goals for a particular player

# Data Structures

- Note that whoever constructs or stores the structure is responsible for making it correct
  (following everything described in this section)
  so that no verification is required when using it.

- We will try to design structures in a way that a `type` field should give you sufficient
  info so that no `typeof` check is needed.

## `GoalTable` structure

- an Array of `Goal`s

- each object is a `Goal` structure

- array is implicitly indexed by roster id - which means `Goal` is unique given a `rosterId`.
  with admiral id being one part of file name, this should eliminate any ambiguity.

## `Goal` structure

- an Object of the following shape:

    ```
    {
      rosterId: <number>,
      goalLevel: <number>,
      method: <Method>,
    }
    ```

## `Method` structure

- an Object that guaranteed to have a `type` field.

- when `type` is `sortie`

    ```
    {
      type: "sortie",
      flagship: <boolean>,
      rank: <see note above>,
      mvp: "yes" / "no" / "maybe",
      baseExp: <BaseExp>,
    }
    ```

    Note: field `rank` contains a non-empty array whose every element
    must be one of "S","A","B","C","D","E", without duplication.

- when `type` is `custom`

    ```
    {
      type: "custom",
      baseExp: <BaseExp>,
    }
    ```

## `BaseExp` structure

- an Object that guaranteed to have a `type` field.

- when `type` is `standard`

    ```
    {
      type: "standard",
      mapId: <map id>,
    }
    ```

- when `type` is `custom`

    ```
    {
      type: "custom",
      value: <ExpValue>,
    }
    ```

## `ExpValue` structure

- an Object that guaranteed to have a `type` field.

- when `type` is `single`

    ```
    {
      type: "single",
      value: <a number indicating exp>,
    }
    ```

- when `type` is `range`

    ```
    {
      type: "range",
      min: <a number indicating exp>,
      max: <a number indicating exp>,
    }
    ```
