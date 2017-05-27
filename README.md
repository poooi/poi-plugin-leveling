# poi-plugin-leveling

This is a [poi](https://github.com/poooi/poi) plugin that helps you keep track of
your ship girl leveling plans.

## Changelog

### Current

- Implemented ship sorting in ship picker

- Ship filter is now more properly interpreted.

- Ship filter: new level filter that shows only those under their final remodel levels

- Added few common leveling goals on editing panel

- Newly added goal will take ship's next remodel level into account.

- Allow uncertain value on flagship setting.

    Because of this, old plugin data needs to be updated, which
    has been taken care of automatically. But for performance
    and data migration concerns
    the code for updating the structure would be removed in future
    when the data structure is proved stable enough.

### 0.0.1

- Initial version
