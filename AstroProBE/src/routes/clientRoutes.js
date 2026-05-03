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
  .post(createClient)      
  .get(getAllClients);     

// Specific Client Operations
router.route('/:id')
  .get(getClientById)       
  .put(updateClient)      
  .delete(deleteClient);    

export default router;