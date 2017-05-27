# poi-plugin-leveling

This is a [poi](https://github.com/poooi/poi) plugin that helps you keep track of
your ship girl leveling plans.

## Changelog

### 0.1.0

- Implemented sorting

    - Ships can be sorted by clicking on ship picker headers.
    - Current goal list can be sorted by clicking on top buttons.
    - Unlike ship picker, your goal list sorting method is remembered.

- Improved Ship filter

    - Added new level filter that shows only those under their final remodel levels.
    - Ship filter names are now more properly interpreted.

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
