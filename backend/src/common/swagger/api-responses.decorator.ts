import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

const withExample = (example: unknown, isArray = false) =>
  example === undefined ? {} : { example: isArray ? [example] : example };

export const ApiOkAuthResponse = <TModel extends Type<unknown>>(
  model?: TModel,
  isArray = false,
  example?: unknown,
) =>
  applyDecorators(
    model
      ? ApiOkResponse({ type: model, isArray, ...withExample(example, isArray) })
      : ApiOkResponse(),
    ApiUnauthorizedResponse(),
  );

export const ApiAuthResponses = ApiOkAuthResponse;

export const ApiCreatedAuthResponse = <TModel extends Type<unknown>>(
  model?: TModel,
  example?: unknown,
) =>
  applyDecorators(
    model ? ApiCreatedResponse({ type: model, ...withExample(example) }) : ApiCreatedResponse(),
    ApiBearerAuth(),
    ApiBadRequestResponse(),
    ApiUnauthorizedResponse(),
  );

export const ApiUpdatedAuthResponse = <TModel extends Type<unknown>>(
  model?: TModel,
  example?: unknown,
) =>
  applyDecorators(
    model ? ApiOkResponse({ type: model, ...withExample(example) }) : ApiOkResponse(),
    ApiBearerAuth(),
    ApiBadRequestResponse(),
    ApiNotFoundResponse(),
    ApiUnauthorizedResponse(),
  );

export const ApiDeleteAuthResponse = (example = { deleted: true }) =>
  applyDecorators(
    ApiOkResponse({ schema: { example } }),
    ApiBearerAuth(),
    ApiNotFoundResponse(),
    ApiUnauthorizedResponse(),
  );
