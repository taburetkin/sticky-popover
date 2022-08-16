# sticky-popover
Its a set of some base APIs for showing and maintain popover content.
- `positioningApi`: Allows you to just "compute" the position of fixed popover
- `Popover`: allows you to place popover content and maintain it in the place
- `AbstractPopoverApi`: the abstract API for dynamically showing and removing popover content. It holds only logic and has no any popover engine inside.
- `PopoverApi` - mostly abstract API for dynamically showing and removing popover content but has `Popover` engine inside