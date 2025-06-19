"use strict";
// import Joi from 'joi';
// const password = Joi.string().min(8).max(32).required();
//   .messages({
//     'string.min': 'Password must be at least 8 characters',
//     'string.max': 'Password must be at most 32 characters',
//     'string.empty': 'Password cannot be empty',
//   });
// const register = Joi.object({
//   name: Joi.string().required(),
//   email: Joi.string().email().required(),
//   password,
// });
// const login = Joi.object({
//   email: Joi.string().email().required(),
//   password: Joi.string().required(),
// });
// const updatePassword = Joi.object({
//   currentPassword: Joi.string().required(),
//   newPassword: password.not(Joi.ref('currentPassword')).messages({
//     'any.invalid': 'New password must be different from current password',
//   }),
// });
// const forgotPassword = Joi.object({
//   email: Joi.string().email().required(),
// });
// const resetPassword = Joi.object({
//   token: Joi.string().required(),
//   newPassword: password,
// });
// export {
//   register,
//   login,
//   updatePassword,
//   forgotPassword,
//   resetPassword,
// };
