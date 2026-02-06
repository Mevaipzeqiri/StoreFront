const express = require('express');
const router = express.Router();
const { body, param } = require('express-validator');
const discountController = require('../controllers/discountController');
const { authenticateToken, isAdmin } = require('../middleware/auth');
const validate = require('../middleware/validate');

const applyDiscountValidation = [
    body('product_id').isInt().withMessage('Invalid product ID'),
    body('discount_percentage').optional().isFloat({ min: 0, max: 100 }).withMessage('Discount percentage must be 0-100'),
    body('discount_amount').optional().isFloat({ min: 0 }).withMessage('Discount amount must be positive'),
    body('start_date').isISO8601().withMessage('Invalid start date'),
    body('end_date').isISO8601().withMessage('Invalid end date')
];

/**
 * @swagger
 * tags:
 *   name: Discounts
 *   description: Product discount management
 */

/**
 * @swagger
 * /discounts:
 *   get:
 *     summary: Get all discounts
 *     tags: [Discounts]
 *     parameters:
 *       - in: query
 *         name: is_active
 *         schema:
 *           type: boolean
 *         description: Filter by active status
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: List of discounts
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Discount'
 *                 pagination:
 *                   $ref: '#/components/schemas/Pagination'
 */
router.get('/', discountController.getAllDiscounts);

/**
 * @swagger
 * /discounts/{id}:
 *   get:
 *     summary: Get discount by ID
 *     tags: [Discounts]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Discount details
 *       404:
 *         description: Discount not found
 */
router.get('/:id', param('id').isInt(), validate, discountController.getDiscountById);

/**
 * @swagger
 * /discounts/product/{productId}:
 *   get:
 *     summary: Get discounts for a specific product
 *     tags: [Discounts]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: integer
 *       - in: query
 *         name: is_active
 *         schema:
 *           type: boolean
 *     responses:
 *       200:
 *         description: Product discounts
 */
router.get('/product/:productId', param('productId').isInt(), validate, discountController.getProductDiscounts);

/**
 * @swagger
 * /discounts:
 *   post:
 *     summary: Apply a discount to a product
 *     tags: [Discounts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product_id
 *               - start_date
 *               - end_date
 *             properties:
 *               product_id:
 *                 type: integer
 *                 example: 1
 *               discount_percentage:
 *                 type: number
 *                 minimum: 0
 *                 maximum: 100
 *                 example: 15
 *               discount_amount:
 *                 type: number
 *                 minimum: 0
 *                 example: 10.00
 *               start_date:
 *                 type: string
 *                 format: date-time
 *                 example: 2024-01-01T00:00:00Z
 *               end_date:
 *                 type: string
 *                 format: date-time
 *                 example: 2024-12-31T23:59:59Z
 *     responses:
 *       201:
 *         description: Discount applied successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - Admin only
 */
router.post('/', authenticateToken, isAdmin, applyDiscountValidation, validate, discountController.applyDiscount);

/**
 * @swagger
 * /discounts/{id}:
 *   put:
 *     summary: Update a discount
 *     tags: [Discounts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               discount_percentage:
 *                 type: number
 *               discount_amount:
 *                 type: number
 *               start_date:
 *                 type: string
 *                 format: date-time
 *               end_date:
 *                 type: string
 *                 format: date-time
 *               is_active:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Discount updated successfully
 *       404:
 *         description: Discount not found
 */
router.put('/:id', authenticateToken, isAdmin, param('id').isInt(), validate, discountController.updateDiscount);

/**
 * @swagger
 * /discounts/{id}/deactivate:
 *   patch:
 *     summary: Deactivate a discount
 *     tags: [Discounts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Discount deactivated successfully
 *       404:
 *         description: Discount not found
 */
router.patch('/:id/deactivate', authenticateToken, isAdmin, param('id').isInt(), validate, discountController.deactivateDiscount);

/**
 * @swagger
 * /discounts/{id}:
 *   delete:
 *     summary: Delete a discount
 *     tags: [Discounts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Discount deleted successfully
 *       404:
 *         description: Discount not found
 */
router.delete('/:id', authenticateToken, isAdmin, param('id').isInt(), validate, discountController.deleteDiscount);

module.exports = router;