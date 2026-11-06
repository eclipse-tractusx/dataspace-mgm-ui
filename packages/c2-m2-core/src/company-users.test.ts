/********************************************************************************
 * Copyright (c) 2026 Contributors to the Eclipse Foundation
 * AI Disclosure: This file was entirely AI-generated. The AI-generated portions
 * are made available under CC0-1.0. The human contributor has reviewed it.
 * SPDX-License-Identifier: Apache-2.0 AND CC0-1.0
 * Assisted-By: OpenAI GPT-6.1 Terra
 ********************************************************************************/

import { describe, expect, it } from "vitest";
import { CoreHttpException } from "@dataspace-mgm/core-http";
import {
  GetCompanyUserUseCase,
  ListCompanyUsersUseCase,
  RemoveCompanyUserUseCase,
  SetCompanyUserPortalRolesUseCase,
} from "./index";
import { COMPANY_USERS, InMemoryCompanyUserRepository } from "./testing";

const companyId = COMPANY_USERS[0].companyId;
const userId = COMPANY_USERS[0].userId;

describe("company user use cases", () => {
  it("lists sorted users with filtering and pagination and supports empty companies", async () => {
    const repo = new InMemoryCompanyUserRepository(COMPANY_USERS, null, [
      companyId,
      "empty",
    ]);
    const list = new ListCompanyUsersUseCase(repo);
    expect(await list.execute(companyId, { page: 1, size: 1 })).toMatchObject({
      status: "success",
      data: { total: 2, items: [{ givenName: "Max" }] },
    });
    expect(
      await list.execute(companyId, { status: ["REMOVED"] }),
    ).toMatchObject({ status: "success", data: { total: 0 } });
    expect(await list.execute("empty")).toMatchObject({
      status: "success",
      data: { items: [] },
    });
    expect(await list.execute("missing")).toEqual({ status: "not-found" });
  });

  it("reads, replaces roles, removes idempotently and hides removed details", async () => {
    const repo = new InMemoryCompanyUserRepository(COMPANY_USERS);
    const get = new GetCompanyUserUseCase(repo);
    const set = new SetCompanyUserPortalRolesUseCase(repo);
    const remove = new RemoveCompanyUserUseCase(repo);
    expect(await get.execute(companyId, userId)).toMatchObject({
      status: "success",
      data: { appRoles: [] },
    });
    const memberId = COMPANY_USERS[1].userId;
    expect(await set.execute(companyId, memberId, ["Member"])).toMatchObject({
      status: "success",
      data: { portalRoles: ["Member"] },
    });
    expect(await remove.execute(companyId, memberId)).toEqual({
      status: "success",
      data: true,
    });
    expect(await remove.execute(companyId, memberId)).toEqual({
      status: "success",
      data: true,
    });
    expect(await get.execute(companyId, memberId)).toEqual({
      status: "not-found",
    });
    expect(await set.execute(companyId, memberId, ["Member"])).toEqual({
      status: "not-found",
    });
    expect(await remove.execute(companyId, "missing")).toEqual({
      status: "not-found",
    });
    expect(
      await new ListCompanyUsersUseCase(repo).execute(companyId, {
        status: ["REMOVED"],
      }),
    ).toMatchObject({
      data: { items: [{ givenName: null, portalRoles: [] }] },
    });
  });

  it("protects the last active company admin on removal and role replacement", async () => {
    const repo = new InMemoryCompanyUserRepository(COMPANY_USERS);
    const set = new SetCompanyUserPortalRolesUseCase(repo);
    const remove = new RemoveCompanyUserUseCase(repo);
    const conflict = { status: "conflict", error: { problemType: "urn:c2-m2:problem:last-company-admin" } };
    expect(await set.execute(companyId, userId, ["Member"])).toMatchObject(conflict);
    expect(await remove.execute(companyId, userId)).toMatchObject(conflict);
    expect(await new GetCompanyUserUseCase(repo).execute(companyId, userId)).toMatchObject({ data: { portalRoles: ["Company Admin"] } });
    await set.execute(companyId, COMPANY_USERS[1].userId, ["Company Admin"]);
    expect(await set.execute(companyId, userId, ["Member"])).toMatchObject({ status: "success" });
    expect(await remove.execute(companyId, userId)).toMatchObject({ status: "success" });
    expect(await remove.execute(companyId, COMPANY_USERS[1].userId)).toMatchObject(conflict);
  });

  it("does not count disabled or other-company admins and allows removal when another active admin exists", async () => {
    const second = { ...COMPANY_USERS[1], portalRoles: ["Company Admin"], status: "DISABLED" as const };
    const foreign = { ...COMPANY_USERS[0], companyId: "other" };
    const repo = new InMemoryCompanyUserRepository([COMPANY_USERS[0], second, foreign]);
    expect(await new RemoveCompanyUserUseCase(repo).execute(companyId, userId)).toMatchObject({ status: "conflict" });
    const active = new InMemoryCompanyUserRepository([COMPANY_USERS[0], { ...second, status: "ACTIVE" }]);
    expect(await new RemoveCompanyUserUseCase(active).execute(companyId, userId)).toMatchObject({ status: "success" });
  });

  it.each([
    [403, "forbidden"],
    [404, "not-found"],
    [409, "conflict"],
    [502, "failed"],
  ] as const)(
    "maps %i failures for every operation",
    async (status, expected) => {
      const repo = new InMemoryCompanyUserRepository(
        COMPANY_USERS,
        new CoreHttpException(
          status,
          "urn:c2-m2:problem:last-company-admin",
          "failure",
        ),
      );
      const results = await Promise.all([
        new ListCompanyUsersUseCase(repo).execute(companyId),
        new GetCompanyUserUseCase(repo).execute(companyId, userId),
        new SetCompanyUserPortalRolesUseCase(repo).execute(companyId, userId, [
          "Member",
        ]),
        new RemoveCompanyUserUseCase(repo).execute(companyId, userId),
      ]);
      expect(results.map((value) => value.status)).toEqual([
        expected,
        expected,
        expected,
        expected,
      ]);
      if (status === 409) {
        expect(results[0]).toMatchObject({
          error: { problemType: "urn:c2-m2:problem:last-company-admin" },
        });
      }
    },
  );
});
