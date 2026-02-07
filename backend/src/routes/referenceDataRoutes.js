const express = require('express');
const router = express.Router();
const {body, param} = require('express-validator');
const refDataController = require('../controllers/referenceDataController');
const {authenticateToken, isAdmin} = require('../middleware/auth');
const validate = require('../middleware/validate');
const {cache} = require('../middleware/cache');

/**
 * @swagger
 * tags:
 *   name: Reference Data
 *   description: Categories, Brands, Colors, Sizes, and Genders management
 */

/**
 * @swagger
 * /reference/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Reference Data]
 *     responses:
 *       200:
 *         description: List of categories
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
 *                     $ref: '#/components/schemas/Category'
 */
router.get('/categories', cache(1800), refDataController.getAllCategories);

/**
 * @swagger
 * /reference/categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Reference Data]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Sportswear
 *               description:
 *                 type: string
 *                 example: Athletic and sports clothing
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Category already exists
 */
router.post('/categories', authenticateToken, isAdmin, body('name').trim().notEmpty().withMessage('Category name is required'), validate, refDataController.createCategory);

/**
 * @swagger
 * /reference/categories/{id}:
 *   put:
 *     summary: Update a category
 *     tags: [Reference Data]
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
 *             $ref: '#/components/schemas/Category'
 *     responses:
 *       200:
 *         description: Category updated successfully
 */
router.put('/categories/:id', authenticateToken, isAdmin, param('id').isInt(), validate, refDataController.updateCategory);

/**
 * @swagger
 * /reference/categories/{id}:
 *   delete:
 *     summary: Delete a category
 *     tags: [Reference Data]
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
 *         description: Category deleted successfully
 */
router.delete('/categories/:id', authenticateToken, isAdmin, param('id').isInt(), validate, refDataController.deleteCategory);

/**
 * @swagger
 * /reference/brands:
 *   get:
 *     summary: Get all brands
 *     tags: [Reference Data]
 *     responses:
 *       200:
 *         description: List of brands
 */
router.get('/brands', cache(1800), refDataController.getAllBrands);

/**
 * @swagger
 * /reference/brands:
 *   post:
 *     summary: Create a new brand
 *     tags: [Reference Data]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Brand created successfully
 */
router.post('/brands', authenticateToken, isAdmin, body('name').trim().notEmpty().withMessage('Brand name is required'), validate, refDataController.createBrand);

/**
 * @swagger
 * /reference/brands/{id}:
 *   put:
 *     summary: Update a brand
 *     tags: [Reference Data]
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
 *         description: Brand updated successfully
 */
router.put('/brands/:id', authenticateToken, isAdmin, param('id').isInt(), validate, refDataController.updateBrand);

/**
 * @swagger
 * /reference/brands/{id}:
 *   delete:
 *     summary: Delete a brand
 *     tags: [Reference Data]
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
 *         description: Brand deleted successfully
 */
router.delete('/brands/:id', authenticateToken, isAdmin, param('id').isInt(), validate, refDataController.deleteBrand);

/**
 * @swagger
 * /reference/colors:
 *   get:
 *     summary: Get all colors
 *     tags: [Reference Data]
 *     responses:
 *       200:
 *         description: List of colors
 */
router.get('/colors', cache(1800), refDataController.getAllColors);

/**
 * @swagger
 * /reference/colors:
 *   post:
 *     summary: Create a new color
 *     tags: [Reference Data]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               hex_code:
 *                 type: string
 *                 example: "#FF5733"
 *     responses:
 *       201:
 *         description: Color created successfully
 */
router.post('/colors', authenticateToken, isAdmin, body('name').trim().notEmpty().withMessage('Color name is required'), validate, refDataController.createColor);

/**
 * @swagger
 * /reference/colors/{id}:
 *   put:
 *     summary: Update a color
 *     tags: [Reference Data]
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
 *         description: Color updated successfully
 */
router.put('/colors/:id', authenticateToken, isAdmin, param('id').isInt(), validate, refDataController.updateColor);

/**
 * @swagger
 * /reference/colors/{id}:
 *   delete:
 *     summary: Delete a color
 *     tags: [Reference Data]
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
 *         description: Color deleted successfully
 */
router.delete('/colors/:id', authenticateToken, isAdmin, param('id').isInt(), validate, refDataController.deleteColor);

/**
 * @swagger
 * /reference/sizes:
 *   get:
 *     summary: Get all sizes
 *     tags: [Reference Data]
 *     responses:
 *       200:
 *         description: List of sizes
 */
router.get('/sizes', cache(1800), refDataController.getAllSizes);

/**
 * @swagger
 * /reference/sizes:
 *   post:
 *     summary: Create a new size
 *     tags: [Reference Data]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: XL
 *               description:
 *                 type: string
 *               sort_order:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Size created successfully
 */
router.post('/sizes', authenticateToken, isAdmin, body('name').trim().notEmpty().withMessage('Size name is required'), validate, refDataController.createSize);

/**
 * @swagger
 * /reference/sizes/{id}:
 *   put:
 *     summary: Update a size
 *     tags: [Reference Data]
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
 *         description: Size updated successfully
 */
router.put('/sizes/:id', authenticateToken, isAdmin, param('id').isInt(), validate, refDataController.updateSize);

/**
 * @swagger
 * /reference/sizes/{id}:
 *   delete:
 *     summary: Delete a size
 *     tags: [Reference Data]
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
 *         description: Size deleted successfully
 */
router.delete('/sizes/:id', authenticateToken, isAdmin, param('id').isInt(), validate, refDataController.deleteSize);

/**
 * @swagger
 * /reference/genders:
 *   get:
 *     summary: Get all genders
 *     tags: [Reference Data]
 *     responses:
 *       200:
 *         description: List of genders
 */
router.get('/genders', cache(1800), refDataController.getAllGenders);

/**
 * @swagger
 * /reference/genders:
 *   post:
 *     summary: Create a new gender
 *     tags: [Reference Data]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Gender created successfully
 */
router.post('/genders', authenticateToken, isAdmin, body('name').trim().notEmpty().withMessage('Gender name is required'), validate, refDataController.createGender);

/**
 * @swagger
 * /reference/genders/{id}:
 *   put:
 *     summary: Update a gender
 *     tags: [Reference Data]
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
 *         description: Gender updated successfully
 */
router.put('/genders/:id', authenticateToken, isAdmin, param('id').isInt(), validate, refDataController.updateGender);

/**
 * @swagger
 * /reference/genders/{id}:
 *   delete:
 *     summary: Delete a gender
 *     tags: [Reference Data]
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
 *         description: Gender deleted successfully
 */
router.delete('/genders/:id', authenticateToken, isAdmin, param('id').isInt(), validate, refDataController.deleteGender);

module.exports = router;