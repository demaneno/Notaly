const express = require('express');
const chalk = require('chalk');
const debug = require('debug')('app');
const morgan = require('morgan');
const path = require('path');
const sql = require('mssql');

const app = express();
const port = process.env.PORT || 3000;

app.use(morgan('tiny'));

app.get('/', (req, res) => {
  // app.set('pages', './src/app/pages');
  // app.set('page engine', 'pug');
  res.sendFile(path.join(__dirname, 'src/app/pages/notes/notes-list/notes-list.component.html'));
});

app.listen(port, () => {
  debug(`listening on port ${chalk.green('port')}`);
});
