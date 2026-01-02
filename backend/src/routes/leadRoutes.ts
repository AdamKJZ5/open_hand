// Example of the route logic
router.post('/contact', async (req, res) => {
  try {
    const newLead = await Lead.create(req.body);
    res.status(201).json({ message: "Thank you! We will contact you shortly." });
  } catch (error) {
    res.status(400).json({ message: "Please fill out all fields correctly." });
  }
});
