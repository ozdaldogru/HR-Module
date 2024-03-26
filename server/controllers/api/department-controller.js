const router = require("express").Router();
const { Department, Role, Employee } = require("../../models");
const withAuth = require("../../utils/auth");

// GET all department data
router.get("/", withAuth, async (req, res) => {
  try {
    const departmentData = await Department.findAll({
      include: [
        {
          model: Role, attributes: ["title"],
          include: [
            {
              model: Employee, attributes: ["first_name", "last_name"]
            }
          ]
        }
      ]
    });

    res.status(200).json(departmentData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET a single department
router.get("/:id", withAuth, async (req, res) => {
  try {
    const departmentData = await Department.findByPk(req.params.id, {
      include: [
        {
          model: Role, attributes: ["title"],
          include: [
            {
              model: Employee, attributes: ["first_name", "last_name"]
            }
          ]
        }
      ]
    });

    if (!departmentData) {
      res.status(404).json({ message: "No department found with that id!" });
      return;
    }

    res.status(200).json(departmentData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// CREATE a department
router.post("/", withAuth, async (req, res) => {
  try {
    const departmentData = await Department.create(req.body);
    res.status(200).json(departmentData);
  } catch (err) {
    res.status(400).json(err);
  }
}
);

// UPDATE a department
router.put("/:id", withAuth, async (req, res) => {
  try {
    const departmentData = await Department.update(req.body, {
      where: {
        id: req.params.id,
      },
    });

    if (!departmentData[0]) {
      res.status(404).json({ message: "No department found with this id!" });
      return;
    }

    res.status(200).json(departmentData);
  } catch (err) {
    res.status(500).json(err);
  }
}
);

// DELETE a department
router.delete("/:id", withAuth, async (req, res) => {
  try {
    const departmentData = await Department.destroy({
      where: {
        id: req.params.id,
      },
    });

    if (!departmentData) {
      res.status(404).json({ message: "No department found with this id!" });
      return;
    }

    res.status(200).json(departmentData);
  } catch (err) {
    res.status(500).json(err);
  }
}
);

// Export the router object
module.exports = router;
