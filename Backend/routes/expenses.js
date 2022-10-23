const express = require('express');

const expensesController = require('../controller/expenses');

const router = express.Router();

router.get('/', expensesController.showServer);

router.get('/expensesData', expensesController.getExpenses);

router.get('/expensesData/:id', expensesController.getExpense)

router.post('/expensesData', expensesController.addExpense);

router.delete('/expensesData/:id', expensesController.deleteExpense);

router.put('/expensesData/:id', expensesController.editExpense);

module.exports = router;