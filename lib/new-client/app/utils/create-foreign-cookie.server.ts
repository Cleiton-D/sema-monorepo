import type { CookieParseOptions, CookieSerializeOptions } from "cookie";
import { parse, serialize } from "cookie";
import type { CreateCookieFunction } from "@remix-run/server-runtime";

export type { CookieParseOptions, CookieSerializeOptions };

/**
 * Creates a logical container for managing a browser cookie from the server.
 *
 * @see https://remix.run/api/remix#createcookie
 */
function createCookieFactory(): CreateCookieFunction {
  return (name, cookieOptions = {}) => {
    const { secrets, ...options } = {
      secrets: [],
      path: "/",
      ...cookieOptions,
    };

    return {
      get name() {
        return name;
      },
      get isSigned() {
        return secrets.length > 0;
      },
      get expires() {
        // Max-Age takes precedence over Expires
        return typeof options.maxAge !== "undefined"
          ? new Date(Date.now() + options.maxAge * 1000)
          : options.expires;
      },
      async parse(cookieHeader, parseOptions) {
        if (!cookieHeader) return null;
        let cookies = parse(cookieHeader, { ...options, ...parseOptions });
        return name in cookies ? (cookies[name] === "" ? "" : cookies[name]) : null;
      },
      async serialize(value, serializeOptions) {
        return serialize(name, value, {
          ...options,
          ...serializeOptions,
        });
      },
    };
  };
}

const createForeignCookie = createCookieFactory();

export default createForeignCookie;