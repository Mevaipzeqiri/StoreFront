const clientService = require("../services/clientService");
const {addHATEOAS, clientLinks, paginationLinks} = require("../utils/hateoas");

exports.getAllClients = async (req, res) => {
    try {
        const {page = 1, limit = 10} = req.query;
        const result = await clientService.getAllClients(page, limit);

        const clientsWithLinks = result.data.map(client =>
            addHATEOAS(client, clientLinks(req, client.id))
        );

        res.json({
            success: true,
            data: clientsWithLinks,
            pagination: result.pagination,
            _links: paginationLinks(req, page, limit, result.pagination.total)
        });
    } catch (error) {
        console.error("Get all clients error:", error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || "Server error retrieving clients",
            error: error.message,
        });
    }
};

exports.searchClients = async (req, res) => {
    try {
        const {query, page = 1, limit = 10} = req.query;
        const result = await clientService.searchClients(query, page, limit);

        const clientsWithLinks = result.data.map(client =>
            addHATEOAS(client, clientLinks(req, client.id))
        );

        res.json({
            success: true,
            data: clientsWithLinks,
            pagination: result.pagination,
            _links: paginationLinks(req, page, limit, result.pagination.total)
        });
    } catch (error) {
        console.error("Search clients error:", error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || "Server error searching clients",
            error: error.message,
        });
    }
};

exports.getClientById = async (req, res) => {
    try {
        const {id} = req.params;
        const data = await clientService.getClientById(id);

        res.json({
            success: true,
            data: addHATEOAS(data, clientLinks(req, id))
        });
    } catch (error) {
        console.error("Get client by ID error:", error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || "Server error retrieving client",
            error: error.message,
        });
    }
};

exports.createClient = async (req, res) => {
    try {
        const data = await clientService.createClient(req.body);

        res.status(201).json({
            success: true,
            message: "Client created successfully",
            data: addHATEOAS(data, clientLinks(req, data.id))
        });
    } catch (error) {
        console.error("Create client error:", error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || "Server error creating client",
            error: error.message,
        });
    }
};

exports.updateClient = async (req, res) => {
    try {
        const {id} = req.params;
        const data = await clientService.updateClient(id, req.body);

        res.json({
            success: true,
            message: "Client updated successfully",
            data: addHATEOAS(data, clientLinks(req, id))
        });
    } catch (error) {
        console.error("Update client error:", error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || "Server error updating client",
            error: error.message,
        });
    }
};

exports.deleteClient = async (req, res) => {
    try {
        const {id} = req.params;
        await clientService.deleteClient(id);

        res.json({
            success: true,
            message: "Client deleted successfully",
        });
    } catch (error) {
        console.error("Delete client error:", error);
        res.status(error.status || 500).json({
            success: false,
            message: error.message || "Server error deleting client",
            error: error.message,
        });
    }
};