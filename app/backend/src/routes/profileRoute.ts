import express from 'express';
import {
  createProfile,
  getAllProfiles,
  getProfileById,
  updateProfile,
  deleteProfile,
} from '../controllers/profileController';

const router = express.Router();

router.route('/')
  .post(createProfile)
  .get(getAllProfiles);

router.route('/:id')
  .get(getProfileById)
  .put(updateProfile)
  .delete(deleteProfile);

export default router;
