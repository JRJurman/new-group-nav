# new-tab-group-notes

This is a chrome-extension that replaces your new tab with a tab-group organizer!
You can quickly navigate to those tabs, and leave notes for yourself about the tabs on this page!

## Development instructions

1. In the root directory, run `npm ci` to install all the project dependencies
2. Run `npm start` to start the dev server
3. Load the dist folder as an unpacked extension in chrome browser
4. Open a new tab

## Development commands

Below are a list of commands used for development. The logic for all the commands is in the local `package.json`

- `npm start` - builds the project into the dist folder and starts a watch loop for changes
- `npm run build` - builds a final distributable using [Parcel](https://parceljs.org/)
- `npm test` - runs tests in [Jest](https://jestjs.io/) watch loop
