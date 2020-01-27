import Boom from "boom";

export const successAction = (
  data,
  message = "Success",
  total = undefined,
  meta = undefined
) => ({
  statusCode: 200,
  message,
  data: data || null,
  total,
  meta
});

export const failAction = errorMessage => {
  throw Boom.badRequest(errorMessage);
};
