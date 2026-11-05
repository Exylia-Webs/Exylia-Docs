import assert from "node:assert/strict";
import { test } from "node:test";
import { isSuperAdmin, parseAdminIds, safeAdminRedirect } from "./admin-rules";

test("only Discord ids in SUPER_ADMIN_DISCORD_IDS are super admins", () => {
  const raw = " 111111111111111111 , ,222222222222222222";
  assert.deepEqual([...parseAdminIds(raw)], ["111111111111111111", "222222222222222222"]);
  assert.equal(isSuperAdmin("111111111111111111", raw), true);
  assert.equal(isSuperAdmin("222222222222222222", raw), true);
  assert.equal(isSuperAdmin("333333333333333333", raw), false);
  // An empty or missing list lets nobody in, and neither does a blank id.
  assert.equal(isSuperAdmin("111111111111111111", ""), false);
  assert.equal(isSuperAdmin("111111111111111111", undefined), false);
  assert.equal(isSuperAdmin("", raw), false);
  assert.equal(isSuperAdmin(null, ","), false);
});

test("the login only ever sends back into /admin", () => {
  assert.equal(safeAdminRedirect("/admin/usage/?page=2"), "/admin/usage/?page=2");
  assert.equal(safeAdminRedirect("/admin/"), "/admin/");
  assert.equal(safeAdminRedirect("/admin"), "/admin");
  for (const bad of [null, "", "/", "//evil.com", "https://evil.com/admin", "/administrator", "/admin/../en/docs", "/admin\\@evil.com", "/admin/\t/evil.com", "/admin/login", "/admin/login/"]) {
    assert.equal(safeAdminRedirect(bad), "/admin/", String(bad));
  }
});
