"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
class Token {
    constructor(token) {
        this.token = token;
        if (this.token) {
            this.decoded = jsonwebtoken_1.decode(token);
        }
        else
            this.decoded = null;
    }
    get login() {
        return this.decoded && this.decoded.sub;
    }
    isValid() {
        return (this.decoded &&
            typeof this.decoded !== 'string' &&
            this.decoded.exp &&
            Number(this.decoded.exp) >= Date.now() / 1000);
    }
}
exports.Token = Token;
