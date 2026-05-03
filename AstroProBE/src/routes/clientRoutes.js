import express from 'express';
import {
  createClient,
  getAllClients,
  getClientById,
  updateClient,
  deleteClient
} from '../controllers/clientController.js';
import { protect } from '../middlewares/auth.js'; 

const router = express.Router();
router.use(protect);

// Primary Client Management
router.route('/')
  .post(createClient)       // Create & Save Client
  .get(getAllClients);      // List all clients for the logged-in astrologer

// Specific Client Operations
router.route('/:id')
  .get(getClientById)       // Get single client + analysis history
  .put(updateClient)       // Edit client details
  .delete(deleteClient);    // Terminate client record

export default router;