This document defines `GoalTable`,
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

- occupies `${APPDATA_PATH}/leveling/` directory
- a single file `goal-table-<admiral id>.json` for storing all goals for a particular player

# Data Structures

- Note that whoever constructs or stores the structure is responsible for making it correct
  (following everything described in this section)
  so that no verification is required when using it.

- We will try to design structures in a way that a `type` field should give you sufficient
  info so that no `typeof` check is needed.

## `GoalTable` structure

- an Object whose keys are roster ids and values `Goal`s

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
      flagship: "yes" / "no" / "maybe",
      mvp: "yes" / "no" / "maybe",
      rank: <see note above>,
      baseExp: <BaseExp>,
    }
    ```

    Note: field `rank` contains a non-empty array whose every element
    must be one of "S","A","B","C","D","E", without duplication.

    Note 2: in first version `flagship` is simply a boolean value,
    but I think it makes sense to say flagship is undetermined - for examples
    when you are cruising 1-5 and rotate flagship for morale control.

- when `type` is `custom`

    ```
    {
      type: "custom",
      exp: <ExpValue>,
    }
    ```

## `BaseExp` structure

- an Object that guaranteed to have a `type` field.

- when `type` is `standard`

    ```
    {
      type: "standard",
      map: <see note above>,
    }
    ```

    Note: `map` refers to one key of `/assets/map_exp.json`,
    which is also a map naming convention among game players.

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
