import { UserDocument } from "~/server/models/User.model";
import { Validator } from "#nuxt-server-utils";
import CardSchema from "~/schemas/Card.schema";
import { Card } from "~/server/models/Card.model";

export default defineEventHandler(async (event) => {
  const cardId = getRouterParam(event, "cardId");
  const user = event.context.user as UserDocument;
  const body = await readBody(event);

  Validator.validateSchema(CardSchema.partial(), body);

  const card = await Card.findOneAndUpdate(
    {
      _id: cardId,
      owner: user._id,
    },
    {
      ...body,
    }
  );

  if (!card) {
    throw createError({
      statusCode: 404,
      message: "Card not found",
    });
  }

  return card;
});
