const router = require("express").Router();
const { Role, Employee, Department } = require("../../models");
const withAuth = require("../../utils/auth");

// GET all roles
router.get(
  "/",
  /*withAuth,*/ async (req, res) => {
    try {
      const roleData = await Role.findAll({
        include: [{ model: Department, attributes: ["name"] }],
      });
      res.status(200).json(roleData);
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

// GET a single role
router.get(
  "/:id",
  /*withAuth,*/ async (req, res) => {
    try {
      const roleData = await Role.findByPk(
        req.params.id
        // {
        //   include: [{ model: Employee, attributes: ['first_name', 'last_name'] }]
        // }
      );

      if (!roleData) {
        res.status(404).json({ message: "No role found with that id!" });
        return;
      }

      res.status(200).json(roleData);
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

// CREATE a role
router.post(
  "/",
  /*withAuth,*/ async (req, res) => {
    try {
      const roleData = await Role.create(req.body);
      res.status(200).json(roleData);
    } catch (err) {
      res.status(400).json(err);
    }
  }
);

// UPDATE a role
router.put(
  "/:id",
  /*withAuth,*/ async (req, res) => {
    try {
      const roleData = await Role.update(req.body, {
        where: {
          id: req.params.id,
        },
      });

      if (!roleData[0]) {
        res.status(404).json({ message: "No role found with this id!" });
        return;
      }

      res.status(200).json(roleData);
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

// DELETE a role
router.delete(
  "/:id",
  /*withAuth,*/ async (req, res) => {
    try {
      const roleData = await Role.destroy({
        where: {
          id: req.params.id,
        },
      });
      /* 
    if (!roleData) {
      res.status(404).json({ message: 'No role found with this id!' });
      return;
    } */

      res.status(200).json("success");
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

module.exports = router;
