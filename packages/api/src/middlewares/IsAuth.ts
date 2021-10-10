import { Context, Middleware, Req, MiddlewareMethods } from "@tsed/common";
import { getSessionUser } from "../lib/auth";
import { prisma } from "../lib/prisma";

@Middleware()
export class IsAuth implements MiddlewareMethods {
  async use(@Req() req: Req, @Context() ctx: Context) {
    const user = await getSessionUser(req);

    const cad = await prisma.cad.findFirst({
      select: {
        name: true,
        areaOfPlay: true,
        maxPlateLength: true,
        towWhitelisted: true,
        whitelisted: true,
        // features: true,
      },
    });

    ctx.set("cad", cad);
    ctx.set("user", user);
  }
}
