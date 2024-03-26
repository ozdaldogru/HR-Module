const router = require("express").Router();
const { Manager, Role, Employee } = require("../../models");
const withAuth = require("../../utils/auth");

// GET all managers
router.get("/", withAuth, async (req, res) => {
  try {
    const managerData = await Manager.findAll(
      {
        include: [
          {
            model: Role, attributes: ["title"]
          }
        ]
      }
    );
    res.status(200).json(managerData);
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET a single manager
router.get("/:id", withAuth, async (req, res) => {
  try {
    const managerData = await Manager.findByPk(req.params.id, {
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

    if (!managerData) {
      res.status(404).json({ message: "No manager found with that id!" });
      return;
    }

    res.status(200).json(managerData);
  } catch (err) {
    res.status(500).json(err);
  }
}
);

// CREATE a manager
router.post("/", withAuth, async (req, res) => {
  try {
    const managerData = await Manager.create(req.body);
    res.status(200).json(managerData);
  } catch (err) {
    res.status(400).json(err);
  }
}
);

// UPDATE a manager
router.put("/:id", withAuth, async (req, res) => {
    try {
      const managerData = await Manager.update(req.body, {
        where: {
          id: req.params.id,
        },
      });

      if (!managerData[0]) {
        res.status(404).json({ message: "No manager found with this id!" });
        return;
      }

      res.status(200).json(managerData);
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

// DELETE a manager
router.delete( "/:id", withAuth, async (req, res) => {
    try {
      const managerData = await Manager.destroy({
        where: {
          id: req.params.id,
        },
      });

      if (!managerData) {
        res.status(404).json({ message: "No manager found with this id!" });
        return;
      }

      res.status(200).json(managerData);
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

module.exports = router;
