// import prisma from "../prisma/client";

// interface ProfileData {
//   name: string;
//   email: string;
//   password: string;
// }

// export const createProfile = async (data: ProfileData) => {
//   return prisma.profile.create({ data });
// };

// export const getProfileById = async (id: number) => {
//   return prisma.profile.findUnique({ where: { id } });
// };

// export const getProfileByEmail = async (email: string) => {
//   return prisma.profile.findUnique({ where: { email } });
// };

// export const getAllProfiles = async () => {
//   return prisma.profile.findMany();
// };

// export const updateProfile = async (id: number, data: Partial<ProfileData>) => {
//   return prisma.profile.update({
//     where: { id },
//     data,
//   });
// };

// export const deleteProfile = async (id: number) => {
//   return prisma.profile.delete({ where: { id } });
// };
