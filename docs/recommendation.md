This document defines `RGoalLevel`, which means "Recommended Goal Level".

This structure is used for showing user possible leveling goals together with a reason.

# `RGoalLevel` structure

- an Object of the following shape:

    ```
    {
      goalLevel: <number>,
      reason: <Reason>,
    }
    ```

# `Reason` structure

- an Object that guaranteed to have a `type` field.

- when `type` is `remodel`

    ```
    {
      type: "remodel",
      name: <string>,
      typeName: <string>,
    }
    ```

    This means the goal level is recommended because upon reaching this level,
    it is possible to remodel current ship into `name` with ship type `typeName`.

- when `type` is `max-unmarried`

    ```
    {
      type: "max-unmarried",
    }
    ```

    This means the goal level is recommended because it's the maximum level
    one unmarried ship can reach, which is currently level 99.

- when `type` is `max-married`

    ```
    {
      type: "max-married",
    }
    ```

    This means the goal level is recommended because it's the maximum level
    one married ship can reach, which is currently level 175.
