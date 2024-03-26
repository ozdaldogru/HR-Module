const router = require('express').Router(); // Import the Router class from Express.js
const { Employee, Role, Department } = require('../../models'); // Import the Employee model
const withAuth = require('../../utils/auth'); // Import the withAuth middleware

// GET all employees
router.get('/', withAuth, async (req, res) => {
  try {
    const employeeData = await Employee.findAll(
      {
        include: [
          {
            model: Role, attributes: ['title'], 
            include: [
              { 
                model: Department, attributes: ['name'] 
              }
            ]
          }
        ]
      }
    );
    res.status(200).json(employeeData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET a single employee
router.get('/:id', withAuth, async (req, res) => {
  try {
    const employeeData = await Employee.findByPk(req.params.id, {
      include: [
        {
          model: Role, attributes: ['title'], 
          include: [
            { 
              model: Department, attributes: ['name'] 
            }
          ]
        }
      ]
    });

    if (!employeeData) {
      res.status(404).json({ message: 'No employee found with that id!' });
      return;
    }

    res.status(200).json(employeeData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// CREATE an employee
router.post('/', withAuth, async (req, res) => {
  try {
    const employeeData = await Employee.create(req.body);
    res.status(200).json(employeeData);
  } catch (err) {
    res.status(400).json(err);
  }
});

// UPDATE an employee
router.put('/:id', withAuth, async (req, res) => {
  try {
    const employeeData = await Employee.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    if (!employeeData[0]) {
      res.status(404).json({ message: 'No employee found with this id!' });
      return;
    }

    res.status(200).json(employeeData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// DELETE an employee
router.delete('/:id', withAuth, async (req, res) => {
  try {
    const employeeData = await Employee.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!employeeData) {
      res.status(404).json({ message: 'No employee found with this id!' });
      return;
    }

    res.status(200).json(employeeData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// Export the router object
module.exports = router;