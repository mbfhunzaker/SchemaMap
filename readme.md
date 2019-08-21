# SchemaMap



1. [Overview](#overview)
2. [Setup](#setup)
3. [Test](#test)
4. [Changing choices](#changing-choices)
5. [Adding to Qualtrics](#adding-to-qualtrics)

## Overview

SchemaMap randomized term survey tool.

## Setup

This project compiles JavaScript. In order to do this, run:

```
cp .env.example .env
npm install
npm start
```

This will boot up a tool called [Webpack](webpack.github.io),
compiling a distribution version of the code with in the `./dist`
folder. This folder is ignored on Github to help fight conflicts when
syncing the repository.

### Generate ID Table

Each phrase is assigned a unique identifier using a string hash code
algorithm (via https://github.com/darkskyapp/string-hash). To view
this table, run the following command:

```
npm run code-table
```

This will produce a table that looks roughly like:

```
id, phrase
467985004, Being Lazy
4236034084, Wasting Money
2172204599, Being Dishonest
2577011172, Becoming a Teen Parent
1579272624, Committing Crime
2461788559, Dropping out of School
3774480112, Being Chronically Unemployed
```

## Test

The core source is tested. You can verify that everything still works with:

```
npm test
```

## Changing Choices

Choices are defined in `./data/choices.yml`. You can prevent terms
from co-occurring by placing them on `./data/unique.yml`.

Both of these files follow the [YAML](http://yaml.org/spec/) data format.

## Adding to Qualtrics

After making a survey question in Qualtrics, take note of its question
ID. You'll need to build the code so that it knows this value. Set the
value as an environment variable by doing the following:

```bash
QUESTION_ID=14 npm run build
```

Just as a reminder, your question ID may not be 14. This should be the
numeric ID of the question in your survey.

This will rebuild the JavaScript portion of SchemaMap and place it in
the `./dist` directory. This directory is ignored on git, so you
won't see it on Github.

There are two pieces of this project that need to be included within
Qualtrics:

1. `dist/app.js`
2. `index.html`

`app.js` contains all of the logic for conducting the
survey. `index.html` provides the necessary HTML and style information
for it to work properly.

In the HTML View for the survey question in Qualtrics, **add the
contents of `index.html`, however exclude the `<script>` tag at the
bottom.** The script tag should not be placed in Qualtrics.

Instead, this code (`./dist/app.js`) needs to be included through the
"Add JavaScript" menu for the question. Open that menu, and be sure
that you **do not include `<script src="dist/app"></script>`!** Paste
the contents of `./dist/app.js` inside the `function` Qualtrics
already provides. It is important to place the code inside this
function so that it runs whenever Qualtrics is ready for it.

That _should_ do it.
