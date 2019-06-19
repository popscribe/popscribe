"use strict";

const http = require("http");
const path = require("path");
const { EventEmitter } = require("events");
const fse = require("fs-extra");
const Koa = require("koa");

class Popscribe extends EventEmitter {
  constructor({ dir, autoReload = flase } = {}) {
    super();

    const app = new Koa();

    app.use(async ctx => {
      ctx.body = "Hello World";
    });

    app.listen(3000);
  }
}

module.exports = options => {
  const popscribe = new Popscribe(options);
  global.popscribe = popscribe;

  return popscribe;
};
