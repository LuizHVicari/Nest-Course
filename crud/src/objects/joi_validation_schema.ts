import * as Joi from '@hapi/joi'

export const JoiValidationSchema = {
    DB_TYPE: Joi.required(),
    DB_HOST: Joi.required(),
    DB_PORT: Joi.number().default(5432),
    DB_USERNAME: Joi.required(),
    DB_PASSWORD: Joi.required(),
    DB_NAME: Joi.required(),
    DB_AUTOLOAD_ENTITIES: Joi.boolean().default(false),
    DB_SYNCHRONIZE: Joi.boolean().default(false),
}