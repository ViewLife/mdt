import { Middleware, MiddlewareMethods, Context, Req } from "@tsed/common";
import { UseBefore } from "@tsed/platform-middlewares";
import { StoreSet, useDecorators } from "@tsed/core";
import type { User } from "@prisma/client";
import { hasPermission, Permissions } from "@snailycad/permissions";
import { Forbidden } from "@tsed/exceptions";

interface RouteData {
  permissions: Permissions[];
  fallback: ((user: User) => boolean) | boolean;
}

@Middleware()
export class UsePermissionsMiddleware implements MiddlewareMethods {
  use(@Context() ctx: Context, @Req() req: Req) {
    const routeDataOrFunc = ctx.endpoint.get<RouteData | UsePermissionsFunc>(
      UsePermissionsMiddleware,
    );

    const user = ctx.get("user") as User;
    const routeData =
      typeof routeDataOrFunc === "function" ? routeDataOrFunc(req) : routeDataOrFunc;

    const fallback =
      typeof routeData.fallback === "function" ? routeData.fallback(user) : routeData.fallback;

    const hasPerm = hasPermission({
      userToCheck: user,
      permissionsToCheck: routeData.permissions,
      fallback,
    });

    if (!hasPerm) {
      throw new Forbidden("Invalid permissions (UsePermissions)");
    }
  }
}

type UsePermissionsFunc = (request: Req) => RouteData;
export function UsePermissions(data: UsePermissionsFunc | RouteData) {
  return useDecorators(
    StoreSet(UsePermissionsMiddleware, data),
    UseBefore(UsePermissionsMiddleware),
  );
}

export { Permissions };
