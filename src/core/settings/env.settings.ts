import * as Joi from 'joi';

export interface EnvSettings {
  readonly NODE_ENV: Joi.StringSchema<string>;
  readonly PORT: Joi.NumberSchema<number>;
}

export const envSettings: EnvSettings = {
  PORT: Joi.number().required(),
  NODE_ENV: Joi.string().required(),
};
