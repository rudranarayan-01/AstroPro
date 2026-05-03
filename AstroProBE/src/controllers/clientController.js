import ClientModel from "../models/clientModel.js";

// @desc    Create a new client
// @route   POST /api/clients
export const createClient = async (req, res) => {
  try {
    const astrologerId = req.user.id;
    const client = await ClientModel.create(req.body, astrologerId);

    res.status(201).json({
      success: true,
      data: client,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all clients for the logged-in astrologer
// @route   GET /api/clients
export const getAllClients = async (req, res) => {
  try {
    const astrologerId = req.user.id;
    const clients = await ClientModel.findAllByAstrologer(astrologerId);

    res.status(200).json({ success: true, data: clients });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get a single client by ID (verified by astrologer ownership)
// @route   GET /api/clients/:id
export const getClientById = async (req, res) => {
  try {
    const astrologerId = req.user.id;
    const { id } = req.params;

    const client = await ClientModel.findById(id, astrologerId);

    if (!client) {
      return res.status(404).json({ success: false, message: "Client not found" });
    }

    res.status(200).json({ success: true, data: client });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update client details
// @route   PUT /api/clients/:id
export const updateClient = async (req, res) => {
  try {
    const astrologerId = req.user.id;
    const { id } = req.params;

    const updatedClient = await ClientModel.update(id, req.body, astrologerId);

    res.status(200).json({
      success: true,
      data: updatedClient,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a client
// @route   DELETE /api/clients/:id
export const deleteClient = async (req, res) => {
  try {
    const astrologerId = req.user.id;
    const { id } = req.params;

    await ClientModel.delete(id, astrologerId);

    res.status(200).json({
      success: true,
      message: "Client record terminated successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};